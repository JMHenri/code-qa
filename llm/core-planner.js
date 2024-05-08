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
  let userResponse;
  // Process the response and determine which function to call
  let toolCall;
  if (response.tool_calls && response.tool_calls.length !== 0) {
    toolCall = response.tool_calls[0].name;
  } else {
    console.log('No tool calls found in the response.');
    return null;
  }
  if (toolCall === 'filePicker') {
    // Call the file-picker function with the user input
    filePickerTool.func({ userInput });
  } 
  if (toolCall === 'fileReader') {
    // Call the file-reader function with the user input
    fileReaderTool(userInput);
  }
  // Handle other cases or provide a default response
  console.log('Unknown function requested by the core planner.');

  return userResponse;
}
export { corePlanner };