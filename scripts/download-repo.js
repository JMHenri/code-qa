require("dotenv").config();
const degit = require('degit');
const path = require("path");

// Repository details
const owner = process.env.REPO_OWNER;
const repo = process.env.REPO_NAME;
const branch = process.env.REPO_BRANCH;

// Local directory to store the cloned repository
const localDir = path.join(__dirname, "../downloaded-repo");

async function cloneRepository() {
  try {
    // Construct the repository URL
    const repoUrl = `${owner}/${repo}`;

    // Create a degit emitter
    const emitter = degit(repoUrl, {
      cache: false,
      force: true,
      verbose: true,
    });

    // Clone the repository
    await emitter.clone(localDir);

    console.log("Repository cloned successfully!");
  } catch (error) {
    console.error("Error cloning repository:", error);
  }
}

cloneRepository();