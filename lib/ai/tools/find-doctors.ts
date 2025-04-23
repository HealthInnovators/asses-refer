import { z } from 'zod';
import { tool } from 'ai/react';
import { findDoctors } from '@/lib/data/doctors'; // Adjust path if necessary

export const findDoctorsTool = tool({
  description: 'Find doctors or clinics based on location (city or zip code), specialty, and optionally, insurance provider. Ask the user for this information if not provided.',
  parameters: z.object({
    city: z.string().optional().describe('The city to search for doctors in. Use this or zipCode.'),
    zipCode: z.string().optional().describe('The zip code to search for doctors in. Use this or city.'),
    specialty: z.string().optional().describe('The medical specialty required (e.g., General Practice, Cardiology, Pediatrics, Urgent Care).'),
    insurance: z.string().optional().describe('The user\'s insurance provider (e.g., BlueCross, Aetna). If not provided, search for all.'),
  }),
  execute: async ({ city, zipCode, specialty, insurance }) => {
    // Ensure at least city or zipCode is provided before calling the actual function
    if (!city && !zipCode) {
        return {
            status: "error",
            message: "Please provide a city or zip code for the search.",
            results: []
        };
    }

    try {
      const doctors = await findDoctors({
        city,
        zipCode,
        specialty,
        // Handle empty string or undefined for insurance
        insurance: insurance || undefined
      });

      if (doctors.length === 0) {
        return {
            status: "success",
            message: "No doctors found matching your criteria in the mock database.",
            results: []
        };
      }

      // Format the results for the AI to present
      const formattedResults = doctors.map(doc => (
        `Name: ${doc.name}, Specialty: ${doc.specialty}, Address: ${doc.address.street}, ${doc.address.city}, ${doc.address.state} ${doc.address.zipCode}, Contact: ${doc.contact}, Insurance Accepted: ${doc.acceptedInsurance.join(', ') || 'N/A'}`)).join('\n---\n');
      

      return {
        status: "success",
        message: `Found ${doctors.length} doctor(s)/clinic(s) matching your criteria:`,
        results: formattedResults
      };

    } catch (error) {
      console.error("Error finding doctors:", error);
      return {
        status: "error",
        message: "An error occurred while searching for doctors.",
        results: []
      };
    }
  }
});
