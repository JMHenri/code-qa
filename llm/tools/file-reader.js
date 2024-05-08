import { z } from "zod";
import { DynamicStructuredTool } from "@langchain/core/tools";
import fs from "fs";
import path from "path";
import { ChatOpenAI } from "@langchain/openai";
import fileReaderPrompt from "./prompts/file-reader-prompt.js";

const fileReaderInternalSchema = z.object({
  userQuestion: z.string().describe("The user's question."),
  fileName: z.string().describe("The name of the file to read."),
});

const fileReaderExternalSchema = z.object({
  userQuestion: z.string().describe("The user's question."),
  fileNames: z.array(z.string()).describe("The list of file names to read."),
});

const fileReaderInternalTool = new DynamicStructuredTool({
  name: "fileReaderInternal",
  description: "Reads the content of a file and returns relevant information based on the user's question.",
  schema: fileReaderInternalSchema,
  func: async ({ userQuestion, fileName }) => {
    const repoPath = path.resolve("../../downloaded-repo");
    const filePath = path.join(repoPath, fileName);

    try {
      const fileData = fs.readFileSync(filePath, "utf-8");
      const prompt = fileReaderPrompt({ userInput: userQuestion, fileData });
      console.log(`The file reader received the input ${userQuestion}`);
      console.log(`File data: ${fileData}`);
      return prompt;
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error);
      return "Error reading file";
    }
  },
});

const llm = new ChatOpenAI({ model: "gpt-4-turbo", temperature: 0 });
const llmWithInternalTool = llm.bindTools([fileReaderInternalTool]);

const fileReaderTool = new DynamicStructuredTool({
  name: "fileReader",
  description: "Can read the content of files from the downloaded repository.",
  schema: fileReaderExternalSchema,
  func: async ({ userQuestion, fileNames }) => {
    const promises = fileNames.slice(0, 5).map(async (fileName) => {
      const response = await llmWithInternalTool.invoke({ userQuestion, fileName });
      return response.trim();
    });

    const responses = await Promise.all(promises);
    return responses.join("\n");
  },
});

export { fileReaderTool };