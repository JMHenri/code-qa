import { z } from "zod";
import { DynamicStructuredTool } from "@langchain/core/tools";
import fs from "fs";
import path from "path";
import filePickerPrompt from "./prompts/file-picker-prompt.js";

const filePickerSchema = z.object({
  userQuestion: z.string().describe("The user's question."),
});

const filePickerTool = new DynamicStructuredTool({
  name: "filePicker",
  description: "Can pick which files to use out of the downloaded repository.",
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

    const prompt = filePickerPrompt({ userQuestion, fileArray });
    console.log(`The file picker received the input ${userQuestion}`);
    console.log(`Available files: ${JSON.stringify(fileArray)}`);

    // Send the prompt to the OpenAI API
    const response = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 100,
        n: 1,
        stop: null,
        temperature: 0.5,
      }),
    });

    const data = await response.json();
    const selectedFiles = JSON.parse(data.choices[0].text.trim());

    return selectedFiles;
  },
});

export { filePickerTool };