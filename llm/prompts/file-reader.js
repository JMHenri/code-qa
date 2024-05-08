const fileReaderPrompt = ({ userInput, fileData }) => `
You are a module in a langchain system that is designed to help users answer questions about their codebase.
Your role is to return any relevant information from the provided fileData based on the user's question.
If the fileData answers the users question, return the relevant information as a string.
If not, return "no relevant information found".

--- User Input ---
${userInput || 'empty'}

--- File Data ---
${fileData || 'empty'}
`;

export default fileReaderPrompt;