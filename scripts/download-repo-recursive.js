require("dotenv").config();
const { Octokit } = require("octokit");
const fs = require("fs");
const path = require("path");

const accessToken = process.env.GITHUB_ACCESS_TOKEN;
const octokit = new Octokit();

// Repository details
const owner = process.env.REPO_OWNER;
const repo = process.env.REPO_NAME;
const branch = process.env.REPO_BRANCH;

// Local directory to store the downloaded repository
const localDir = path.join(__dirname, "../downloaded-repo");

async function downloadDirectory(dirPath) {
  try {
    // Get the contents of the directory
    const { data } = await octokit.rest.repos.getContent({
      owner,
      repo,
      ref: branch,
      path: dirPath,
    });

    // Create the local directory if it doesn't exist
    const localDirPath = path.join(localDir, dirPath);
    if (!fs.existsSync(localDirPath)) {
      fs.mkdirSync(localDirPath, { recursive: true });
    }

    // Download each item in the directory
    for (const item of data) {
      if (item.type === "file") {
        const filePath = path.join(localDirPath, item.name);
        const fileContent = await octokit.rest.repos.getContent({
          owner,
          repo,
          path: item.path,
          ref: branch,
        });
        fs.writeFileSync(filePath, Buffer.from(fileContent.data.content, "base64"));
        console.log(`Downloaded: ${item.path}`);
      } else if (item.type === "dir") {
        // Recursively download subdirectories
        await downloadDirectory(item.path);
      }
    }
  } catch (error) {
    console.error(`Error downloading directory '${dirPath}':`, error);
  }
}

async function downloadRepository() {
  try {
    // Create the local directory if it doesn't exist
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }

    // Start downloading from the root directory
    await downloadDirectory("");

    console.log("Repository downloaded successfully!");
  } catch (error) {
    console.error("Error downloading repository:", error);
  }
}

downloadRepository();