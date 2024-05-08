import 'dotenv/config';
import { corePlanner } from "./llm/core-planner.js";
import readline from 'readline';

async function main() {
  const userInput = 'what is the Grok class?';
  console.log('You entered:', userInput);
  const answer = await corePlanner(userInput);
  console.log('Answer:', answer);
}

main();