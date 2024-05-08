import { z } from "zod";
import { DynamicStructuredTool } from "@langchain/core/tools";


const summarizeSchema = z.object({
  prompt: z.string().describe("The user's question."),
  fileSummaries: z.string().array().describe("A list of summaries that could possibly answer the user request. Read these and compile them into a succinct and useful answer for the user."),
});
const summarizeTool = new DynamicStructuredTool({
  name: "fileReader",
  description: "Can pick which files to use out of the downloaded repository.",
  schema: summarizeSchema,
  func: async ({ userInput }) => {
    console.log(`The file Reader received the input: ${operation}`);
    return "the groq class is located in devika and it is used to instantiate a groq object"
  },
});
  
export { summarizeTool };