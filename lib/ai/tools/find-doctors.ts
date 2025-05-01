import { z } from 'zod';
import { tool } from 'ai';
import { Doctor, findDoctors } from '@/lib/data/doctors';

export const findDoctorsTool = tool({
  description:
    'Find doctors or clinics based on location. You must provide a city and country or a zip code and country. Country is mandatory. You can optionally provide the specialty and insurance provider. If `city`, `zipCode` or `country` are not provided, ask the user for the missing information.',
  parameters: z.object({
    city: z
      .string()
      .optional()
      .describe('The city to search for doctors in. Use this or zipCode.'),
    zipCode: z
      .string()
      .optional()
      .describe('The zip code to search for doctors in. Use this or city.'),
    country: z
      .string()
      .optional()
      .describe('The country to search for doctors in. Use USA or India.'),
    specialty: z
      .string()
      .optional()
      .describe(
        'The medical specialty required (e.g., General Practice, Cardiology, Pediatrics, Urgent Care).',
      ),
  }),
  execute: async ({ city, zipCode, specialty, country }) => {
    // Map "general practitioner" or "general practitioners" to "General Practice"
    // Map "cardiologist" or "cardiologists" to "Pharmacist, Cardiology"
    let mappedSpecialty = specialty;
    let userSpecialty = specialty;
    if (
      specialty?.toLowerCase() === 'general practitioner' ||
      specialty?.toLowerCase() === 'general practitioners'
    ) {
      userSpecialty = 'general practitioner';
      mappedSpecialty = 'General Practice';
    } else if (
      specialty?.toLowerCase() === 'cardiologist' ||
      specialty?.toLowerCase() === 'cardiologists'
    ) {
      userSpecialty = 'cardiologist';
      mappedSpecialty = 'Pharmacist, Cardiology';
    }

      // Ensure at least city or zipCode is provided before calling the actual function
    if ((!city && !zipCode) || !country) {
      return {
        status: 'error',
        message:
          'Please provide a city or zip code and a country for the search.',
        results: [],
      };
    }

    try {
      const doctors = await findDoctors({
        city,
        zipCode,
        country,
        specialty: mappedSpecialty,
      });

      if (doctors.length === 0) {
        if (userSpecialty && city) {
          const state = country === 'USA' ? ', MA' : '';
          return {
            status: 'success',
            message: `I couldn't find any ${userSpecialty} doctors in ${city}${state} matching your criteria. This could be because the API does not have any doctors with that specialty in that location. Could you please double-check the spelling or try a different specialty or location?`,
            results: [],
          };
        }

        if (city) {
          return {
            status: 'success',
            message: `I couldn't find any doctors in ${city} matching your criteria.`,
            results: [],
          };
        }

        return {
          status: 'success',
          message: 'No doctors found matching your criteria.',
          results: [],
        };
      }

      // Format the results for the AI to present in a list format
      const formattedResults = doctors
        .map((doc: Doctor) => {
          let result = `\n- Name: ${doc.name}\n`;
          result += `  - Specialty: ${doc.specialty}\n`;
          result += `  - Address: ${doc.address}\n`;
          result += `  - City: ${doc.city}\n`;
          result += `  - State: ${doc.state}\n`;
          result += `  - Zip Code: ${doc.zipCode}\n`;
          if (doc.phoneNumber) {
            result += `  - Phone Number: ${doc.phoneNumber}\n`;
          }
          return result;
        })
        .join('');

      return {
        status: 'success',
        message: `Found ${doctors.length} doctor(s)/clinic(s) matching your criteria:`,
        results: formattedResults,
      };
    } catch (error) {
      console.error('Error finding doctors:', error);
      return {
        status: 'error',
        message: 'An error occurred while searching for doctors.',
        results: [],
      };
    }
  },
});
