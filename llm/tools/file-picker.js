import { z } from "zod";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { ChatOpenAI } from "@langchain/openai";


const filePickerSchema = z.object({
  prompt: z.string().describe("The first number to operate on."),
});
const filePickerTool = new DynamicStructuredTool({
  name: "filePicker",
  description: "Can pick which files to use out of the downloaded repository.",
  schema: filePickerSchema,
  func: async ({ userInput }) => {
    // Functions must return strings
    console.log(`The file picker received the input: ${operation}`);
  },
});

// function filePickerTool(input) {
//     const result = input.toUpperCase();
//     console.log(`The file picker received the input: ${input}`);
//     return result;
//   }
  
export { filePickerTool };