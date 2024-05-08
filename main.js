require("dotenv").config();
import { corePlanner } from "./llm/core-planner.js";
const readline = require('readline');

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const userInput = await new Promise((resolve) => {
    rl.question('Please enter your input: ', (input) => {
      resolve(input);
      rl.close();
    });
  });

  console.log('You entered:', userInput);

  const answer = await corePlanner(userInput);
  console.log('Answer:', answer);
}

main();