require("dotenv").config();
const simpleGit = require('simple-git');
const fs = require("fs");
const path = require("path");

const accessToken = process.env.GITHUB_ACCESS_TOKEN;

// Repository details
const owner = process.env.REPO_OWNER;
const repo = process.env.REPO_NAME;
const branch = process.env.REPO_BRANCH;

// Local directory to store the cloned repository
const localDir = path.join(__dirname, "../downloaded-repo");

async function cloneRepository() {
  try {
    // Initialize a new SimpleGit instance
    const git = simpleGit();

    // Construct the repository URL with authentication
    const repoUrl = `https://github.com/stitionai/devika`;
    // const repoUrl = `https://${accessToken}@github.com/${owner}/${repo}.git`;

    // Clone the repository
    await git.clone(repoUrl, localDir, ['--branch', branch, '--single-branch']);

    console.log("Repository cloned successfully!");
  } catch (error) {
    console.error("Error cloning repository:", error);
  }
}

cloneRepository();