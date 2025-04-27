import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createDocumentHandler } from '@/lib/artifacts/server';
import { experimental_generateImage, type ImageModel } from 'ai'; // Corrected import to ImageModel

// Instantiate the Google Generative AI provider for image generation
// Use the API key from environment variables
const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export const imageDocumentHandler = createDocumentHandler<'image'>({
  kind: 'image',
  onCreateDocument: async ({ title, dataStream }) => {
    let draftContent = '';

    try {
      const { image } = await experimental_generateImage({
        model: google('imagegen') as unknown as ImageModel, // Cast to unknown first, then ImageModel
        prompt: title,
        n: 1,
      });

      draftContent = image.base64;

      dataStream.writeData({
        type: 'image-delta',
        content: image.base64,
      });
    } catch (error) {
      console.error('Error generating image on create:', error);
      // Optionally write an error message to the data stream
      dataStream.writeData({
          type: 'error',
          content: 'Failed to generate image. Please try again.',
      });
      // Or throw the error to be caught by createDocumentHandler's error handling
      throw error; 
    }

    return draftContent;
  },
  onUpdateDocument: async ({ description, dataStream }) => {
    let draftContent = '';

    try {
      const { image } = await experimental_generateImage({
        model: google('imagegen') as unknown as ImageModel, // Cast to unknown first, then ImageModel
        prompt: description,
        n: 1,
      });

      draftContent = image.base64;

      dataStream.writeData({
        type: 'image-delta',
        content: image.base64,
      });
    } catch (error) {
       console.error('Error generating image on update:', error);
       // Optionally write an error message to the data stream
       dataStream.writeData({
           type: 'error',
           content: 'Failed to update image. Please try again.',
       });
       // Or throw the error to be caught by createDocumentHandler's error handling
       throw error;
    }

    return draftContent;
  },
});
