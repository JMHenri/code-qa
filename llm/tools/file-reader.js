import { z } from "zod";
import { DynamicStructuredTool } from "@langchain/core/tools";
import fs from "fs";
import path from "path";
import { ChatOpenAI } from "@langchain/openai";
import fileReaderPrompt from "../prompts/file-reader.js";

const fileReaderInternalSchema = z.object({
  response: z.string().describe("The relevant information from the file."),
});

const fileReaderInternalTool = new DynamicStructuredTool({
  name: "fileReaderInternal",
  description: "Returns the relevant information from the file.",
  schema: fileReaderInternalSchema,
  func: async ({ response }) => {
    return response;
  },
});

const fileReaderExternalSchema = z.object({
  userQuestion: z.string().describe("The user's question."),
  fileNames: z.array(z.string()).describe("The list of file names to read."),
});

const llm = new ChatOpenAI({ model: "gpt-4-turbo", temperature: 0 });
const llmWithInternalTool = llm.bindTools([fileReaderInternalTool]);

const fileReaderTool = new DynamicStructuredTool({
  name: "fileReader",
  description: "Can read the content of files from the downloaded repository.",
  schema: fileReaderExternalSchema,
  func: async ({ userQuestion, fileNames }) => {
    const repoPath = path.resolve("downloaded-repo");

    const promises = fileNames.slice(0, 5).map(async (fileName) => {
      const filePath = path.join(repoPath, fileName);
      try {
        const fileData = fs.readFileSync(filePath, "utf-8");
        const prompt = fileReaderPrompt({ userInput: userQuestion, fileData });
        console.log(`The file reader received the input ${userQuestion}`);
        console.log(`File data: ${fileData}`);

        const response = await llmWithInternalTool.invoke(prompt);
        return response.tool_calls[0].args.response;
      } catch (error) {
        console.error(`Error reading file ${filePath}:`, error);
        return "Error reading file";
      }
    });

    const responses = await Promise.all(promises);
    return responses;
  },
});

export { fileReaderTool };