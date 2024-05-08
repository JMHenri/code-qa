import { z } from "zod";
import { DynamicStructuredTool } from "@langchain/core/tools";
import fs from "fs";
import path from "path";
import { ChatOpenAI } from "@langchain/openai";
import filePickerPrompt from "../prompts/file-picker.js";

const filePickerInternalSchema = z.object({
  filePaths: z.array(z.string()).describe("The array of file paths."),
});

const filePickerInternalTool = new DynamicStructuredTool({
  name: "filehandler",
  description: "Sends the files chosen to the next tool.",
  schema: filePickerInternalSchema,
  func: async ({ filePaths }) => {
    return filePaths;
  },
});

const filePickerSchema = z.object({
  userQuestion: z.string().describe("The user's question."),
});

const llm = new ChatOpenAI({ model: "gpt-4-turbo", temperature: 0 });
const llmWithInternalTool = llm.bindTools([filePickerInternalTool]);

const filePickerTool = new DynamicStructuredTool({
  name: "filePicker",
  description: "Can pick which files to use out of the downloaded repository.",
  schema: filePickerSchema,
  func: async ({ userQuestion }) => {
    const repoPath = path.resolve("downloaded-repo");
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

    const prompt = filePickerPrompt({ userQuestion, fileArray });
    console.log(`The file picker received the input ${userQuestion}`);
    console.log(`Available files: ${JSON.stringify(fileArray)}`);

    const response = await llmWithInternalTool.invoke(prompt);
    let selectedFiles = [];
    if (
      response.tool_calls &&
      response.tool_calls[0] &&
      response.tool_calls[0].args &&
      response.tool_calls[0].args.filePaths
    ) {
      selectedFiles = response.tool_calls[0].args.filePaths;
    } else {
      throw new Error("Invalid response from the file picker tool.");
    }

    return selectedFiles;
  },
});

export { filePickerTool };