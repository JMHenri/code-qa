import { z } from "zod";
import { DynamicStructuredTool } from "@langchain/core/tools";


const fileReaderSchema = z.object({
  prompt: z.string().describe("The user's question."),
  relevantFiles: z.string().array().describe("A list of files that could possibly answer the user request. Return the files that are most likely to answer the user request."),
});
const fileReaderTool = new DynamicStructuredTool({
  name: "fileReader",
  description: "Can pick which files to use out of the downloaded repository.",
  schema: fileReaderSchema,
  func: async ({ userInput }) => {
    console.log(`The file Reader received the input: ${operation}`);
    return ["the groq class is located in devika", "the groq class is not located in makefile"];
  },
});
  
export { fileReaderTool };