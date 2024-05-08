import { z } from "zod";
import { DynamicStructuredTool } from "@langchain/core/tools";


const summarizeSchema = z.object({
  finalSummary: z.string().describe("The answer to the user's question."),
});
const summaryTool = new DynamicStructuredTool({
  name: "summary",
  description: "Returns the summary to the user",
  schema: summarizeSchema,
  func: async ({ summary }) => {
    return summary
  },
});
  
export { summaryTool };