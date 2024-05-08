import { ChatOpenAI } from "@langchain/openai";
import corePlannerPrompt from "./prompts/core-planner.js";
import { filePickerTool } from "./tools/file-picker.js";
import { fileReaderTool } from "./tools/file-reader.js";
import OpenAI from "openai";

const llm = new ChatOpenAI({
  model: "gpt-4-turbo",
  temperature: 0
});


const llmWithTools = llm.bindTools([filePickerTool]);

async function corePlanner(userInput) {
  let filePickerResponses = [];
  let fileReaderResponses = [];
  let endResponse;

  // If this runs more than 5 times, it is very confused and should be debugged.
  for (let i = 0; i < 5; i++) {
    const prompt = corePlannerPrompt({
      userInput,
      filePickerResponses: filePickerResponses.length > 0 ? filePickerResponses : null,
      fileReaderResponses: fileReaderResponses.length > 0 ? fileReaderResponses : null,
    });
    const response = await llmWithTools.invoke(prompt);

    let toolCall;
    if (response.tool_calls && response.tool_calls.length !== 0) {
      toolCall = response.tool_calls[0].name;
    } else {
      console.log('No tool calls found in the response.');
      break;
    }

    if (toolCall === 'filePicker') {
      const filePickerResponse = await filePickerTool.func({ userInput });
      filePickerResponses.push(filePickerResponse);
    } else if (toolCall === 'fileReader') {
      if (filePickerResponses.length === 0) {
        console.log('No file picker responses available for file reader.');
        break;
      }
      const fileReaderResponse = await fileReaderTool.func(filePickerResponses[filePickerResponses.length - 1]);
      fileReaderResponses.push(fileReaderResponse);
    } else if (toolCall === 'end') {
      if (filePickerResponses.length === 0) {
        console.log('No file picker responses available for end tool.');
        break;
      }
      const fileReaderResponse = await fileReaderTool.func(filePickerResponses[filePickerResponses.length - 1]);
      endResponse = await endTool.func(fileReaderResponse);
    } else {
      console.log('Unknown function requested by the core planner.');
      break;
    }
  }

  return endResponse
}

export { corePlanner };