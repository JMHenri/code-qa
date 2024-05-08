import { ChatOpenAI } from "@langchain/openai";
import corePlannerPrompt from "./prompts/core-planner.js";
import { filePickerTool } from "./tools/file-picker.js";
import { fileReaderTool } from "./tools/file-reader.js";
import { summaryTool } from "./tools/summary.js";

const llm = new ChatOpenAI({
  model: "gpt-4-turbo",
  temperature: 0
});


const llmWithTools = llm.bindTools([filePickerTool, fileReaderTool, summaryTool]);

async function corePlanner(userQuestion) {
  let filePickerResponses = [];
  let fileReaderResponses = [];
  let summarizedResponse;

  // If this runs more than 5 times, it is very confused and should be debugged.
  for (let i = 0; i < 5; i++) {
    const prompt = corePlannerPrompt({
      userQuestion,
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
      const userQuestion = response.tool_calls[0].args.userQuestion;
      const filePickerResponse = await filePickerTool.func({ userQuestion });
      filePickerResponses.push(filePickerResponse);
    } else if (toolCall === 'fileReader') {
      const fileReaderResponse = await fileReaderTool.func({ userQuestion, fileNames: filePickerResponses });
      fileReaderResponses.push(fileReaderResponse);
    } else if (toolCall === 'summarize') {
      const summary = await summaryTool.func();
      endResponse = await endTool.func(fileReaderResponse);
    } else {
      console.log('Unknown function requested by the core planner.');
      break;
    }
  }

  return endResponse
}

export { corePlanner };