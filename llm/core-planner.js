import { ChatOpenAI } from "@langchain/openai";
import { filePickerTool } from "./tools/file-picker.js";
import OpenAI from "openai";
import { PromptTemplate } from "@langchain/core/prompts";
import corePlannerPrompt from "./prompts/core-planner.js";

const model = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const llm = new ChatOpenAI({
  model: "gpt-4-turbo",
  temperature: 0
});

const corePlannerTools = {
  "tool_calls": [
    {
      "id": "id_value",
      "function": {
        "arguments": "{\"prompt\": \"arg_value\"}",
        "name": "filePicker",
      },
      "type": "function"
    }
  ]
}

const llmWithTools = llm.bindTools([corePlannerTools]);

async function corePlanner(userInput, filePickerResponses, fileReaderResponses) {
  const prompt = new PromptTemplate({
    template: corePlannerPrompt,
    inputVariables: ['userInput'],
  });

  const formattedPrompt = await prompt.format({ userInput });

  const response = await model.call(formattedPrompt);

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