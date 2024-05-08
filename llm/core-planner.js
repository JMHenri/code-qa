import { ChatOpenAI } from "@langchain/openai";
import { filePickerTool } from "./tools/file-picker.js";
import OpenAI from "openai";
import corePlannerPrompt from "./prompts/core-planner.js";

const llm = new ChatOpenAI({
  model: "gpt-4-turbo",
  temperature: 0
});


const llmWithTools = llm.bindTools([filePickerTool]);

async function corePlanner(userInput, filePickerResponses, fileReaderResponses) {
  const prompt = corePlannerPrompt({ userInput, filePickerResponses, fileReaderResponses });
  const response = await llmWithTools.invoke(prompt);

  // Process the response and determine which function to call
  if (response.includes('file-picker')) {
    // Call the file-picker function with the user input
    filePickerTool(userInput);
  } else {
    // Handle other cases or provide a default response
    console.log('Unknown function requested by the core planner.');
  }
}
export { corePlanner };