import { z } from "zod";
import { DynamicStructuredTool } from "@langchain/core/tools";


const filePickerSchema = z.object({
  prompt: z.string().describe("The first number to operate on."),
});
const filePickerTool = new DynamicStructuredTool({
  name: "filePicker",
  description: "Can pick which files to use out of the downloaded repository.",
  schema: filePickerSchema,
  func: async ({ userInput }) => {
    console.log(`The file picker received the input: ${operation}`);
    return {
      files: ["devika.py", "Makefile"],
    };
  },
});
  
export { filePickerTool };