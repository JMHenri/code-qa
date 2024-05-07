require("dotenv").config({ path: "../.env" });
const { Octokit } = require("@octokit/rest");
const fs = require("fs");
const path = require("path");

const accessToken = process.env.GITHUB_ACCESS_TOKEN;

const octokit = new Octokit({
  auth: accessToken,
});

// Repository details
const owner = process.env.REPO_OWNER;
const repo = process.env.REPO_NAME;
const branch = process.env.REPO_BRANCH;

// Local directory to store the downloaded repository
const localDir = path.join(__dirname, "downloaded-repo");

async function downloadRepository() {
  try {
    // Get the repository contents
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      ref: branch,
    });

    // Create the local directory if it doesn't exist
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }

    // Download each file in the repository
    for (const item of data) {
      if (item.type === "file") {
        const filePath = path.join(localDir, item.path);
        const fileContent = await octokit.repos.getContent({
          owner,
          repo,
          path: item.path,
          ref: branch,
        });
        fs.writeFileSync(filePath, Buffer.from(fileContent.data.content, "base64"));
        console.log(`Downloaded: ${item.path}`);
      }
    }

    console.log("Repository downloaded successfully!");
  } catch (error) {
    console.error("Error downloading repository:", error);
  }
}

downloadRepository();