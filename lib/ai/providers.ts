import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { tool } from 'ai'; // Corrected import path

// Create the Google Generative AI provider instance
const google = createGoogleGenerativeAI({
  // Use the API key from environment variables
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

// Define a function to get the appropriate Google model
const getGoogleModel = (modelName: string) => {
  // Map your internal model names to actual Google model IDs
  switch (modelName) {
    case 'title-model':
      // Use a suitable Gemini model for title generation (e.g., gemini-1.5-flash-latest)
      return google('models/gemini-1.5-flash-latest');
    case 'text-model':
    case 'default': // Fallback for other cases
      // Use a general-purpose Gemini model (e.g., gemini-1.5-pro-latest)
      return google('models/gemini-1.5-pro-latest');
    // Add more cases if you have other specific model names
    default:
      // You might want to throw an error or return a default model
      console.warn(`Unknown model name: ${modelName}. Falling back to default.`);
      return google('models/gemini-1.5-pro-latest');
  }
};

// Define the provider object that your application will use
export const myProvider = {
  // The languageModel function now returns the appropriate Google model
  languageModel: (modelName: string) => getGoogleModel(modelName),

  // Include the tool function if it's used elsewhere in your project
  tool,
};
