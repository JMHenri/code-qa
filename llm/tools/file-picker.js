import { z } from "zod";
import { DynamicStructuredTool } from "@langchain/core/tools";
import fs from "fs";
import path from "path";
import { ChatOpenAI } from "@langchain/openai";
import filePickerPrompt from "./prompts/file-picker-prompt.js";

const filePickerSchema = z.object({
  userQuestion: z.string().describe("The user's question."),
});

const filePickerInternalTool = new DynamicStructuredTool({
  name: "filePickerInternal",
  description: "Picks the relevant files from the downloaded repository based on the user's question.",
  schema: filePickerSchema,
  func: async ({ userQuestion }) => {
    const repoPath = path.resolve("../../downloaded-repo");
    const fileArray = [];

    // Recursively get all file paths in the repository
    const getFilePaths = (dirPath) => {
      const files = fs.readdirSync(dirPath);
      files.forEach((file) => {
        const filePath = path.join(dirPath, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          getFilePaths(filePath);
        } else {
          fileArray.push(filePath);
        }
      });
    };

    getFilePaths(repoPath);

    const prompt = filePickerPrompt({ userInput: userQuestion, fileArray });
    console.log(`The file picker received the input ${userQuestion}`);
    console.log(`Available files: ${JSON.stringify(fileArray)}`);

    return prompt;
  },
});

const llm = new ChatOpenAI({ model: "gpt-4-turbo", temperature: 0 });
const llmWithInternalTool = llm.bindTools([filePickerInternalTool]);

const filePickerTool = new DynamicStructuredTool({
  name: "filePicker",
  description: "Can pick which files to use out of the downloaded repository.",
  schema: filePickerSchema,
  func: async ({ userQuestion }) => {
    const response = await llmWithInternalTool.invoke(userQuestion);
    const selectedFiles = JSON.parse(response.trim());
    return selectedFiles;
  },
});

export { filePickerTool };