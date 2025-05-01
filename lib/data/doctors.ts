import { env } from 'process';

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber?: string;
  country: string;
}

// Function to fetch doctors from the USA API
const fetchUSADoctors = async (
  city: string,
  zipCode: string,
  specialty: string,
): Promise<Doctor[]> => {
  let url = `https://npiregistry.cms.hhs.gov/api/?version=2.1&city=${city}&postal_code=${zipCode}&enumeration_type=NPI-1`;

  let taxonomyDescription = specialty;
  if (specialty.toLowerCase() === 'general practice') {
    taxonomyDescription = 'General Practice';
  }
  if (specialty.toLowerCase() === 'cardiologist') {
    taxonomyDescription = 'Pharmacist, Cardiology';
  }

  if (taxonomyDescription) {
    url += `&taxonomy_description=${taxonomyDescription}`;
  }

  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    if (data.result_count === 0) {
      return []; // Return an empty array if no doctors are found
    }

    // Process and format the data
    const doctors: Doctor[] = data.results
      .map((item: any) => {
        const practiceLocation =
          item.practiceLocations && item.practiceLocations.length > 0
            ? item.practiceLocations[0]
            : null;
        const firstAddress =
          item.addresses && item.addresses.length > 0 ? item.addresses[0] : {};

        if (
          (practiceLocation?.city || firstAddress.city)?.toLowerCase() !==
            city.toLowerCase() ||
          (practiceLocation?.state || firstAddress.state) !== 'MA'
        ) {
          return null;
        }
        //Filter to keep only doctors with General Practice as primary specialty.
        if (taxonomyDescription === 'General Practice') {
          const isPrimaryGeneralPractice = item.taxonomies.some(
            (taxonomy: any) =>
              taxonomy.desc === 'General Practice' && taxonomy.primary === true,
          );
          if (!isPrimaryGeneralPractice) {
            return null; // Skip this doctor if not primary general practice
          }
        }

        const address = practiceLocation
          ? `${practiceLocation.address_1 || ''} ${
              practiceLocation.address_2 || ''
            }`.trim()
          : `${firstAddress.address_1 || ''} ${
              firstAddress.address_2 || ''
            }`.trim();

        return {
          id: item.number,
          name: `${item.basic.name_prefix || ''} ${item.basic.first_name || ''} ${item.basic.last_name || ''} ${item.basic.credential || ''}`,
          specialty:
            item.taxonomies.length > 0
              ? item.taxonomies[0].desc
              : 'Not available',
          address: `${address}`.trim(),
          city: practiceLocation.city || firstAddress.city || 'Not available',
          state:
            practiceLocation.state || firstAddress.state || 'Not available',
          zipCode:
            practiceLocation.postal_code ||
            firstAddress.postal_code ||
            'Not available',
          phoneNumber: practiceLocation
            ? practiceLocation.telephone_number
            : firstAddress.telephone_number || undefined,

          country: 'USA',
        };
      })
      .filter((doctor: Doctor | null) => doctor !== null) as Doctor[]; // Filter out null entries

    return doctors;
  } catch (error) {
    console.error('Error fetching USA doctors:', error);
    return []; // Return an empty array in case of error
  }
};

// Function to fetch doctors from the India API
const fetchIndiaDoctors = async (
  city: string,
  zipCode: string,
  specialty: string,
  insurance: string,
): Promise<Doctor[]> => {
  const apiKey = env.INDIA_DOCTOR_API_KEY; // Replace with your actual API key
  const hprId = env.INDIA_HPR_ID; // Replace with your actual HPR ID

  if (!apiKey || !hprId) {
    console.error('Missing API key or HPR ID for India doctors search.');
    return [];
  }

  let url = `https://hpr.abdm.gov.in/api/v1/doctors`;

  const headers: Record<string, string> = {
    'X-CM-ID': hprId,
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${apiKey}`,
  };

  const body: Record<string, string | undefined> = {};

  if (specialty) {
    body.specialty = specialty;
  }
  if (zipCode) {
    body.pincode = zipCode;
  }
  if (city) {
    body.city = city;
  }

  const requestOptions: RequestInit = {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  };

  try {
    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.length === 0) {
      return [];
    }

    // Process and format the data
    const doctors: Doctor[] = data.map((item: any) => {
      // Use the first address from the array or default to an empty string
      const firstAddress =
        item.address && item.address.length > 0 ? item.address[0] : {};

      return {
        id: item.hprId,
        name: `${item.firstName || ''} ${item.middleName || ''} ${item.lastName || ''}`,
        specialty: item.specialty || 'Not available',
        address: firstAddress.addressLine || 'Not available',
        city: firstAddress.city || 'Not available',
        state: firstAddress.state || 'Not available',
        zipCode: firstAddress.pincode || 'Not available',
        phoneNumber: item.phoneNumber || 'Not available',
        country: 'India',
      };
    });

    return doctors;
  } catch (error) {
    console.error('Error fetching India doctors:', error);
    return [];
  }
};

// Placeholder function for searching the database
// In a real application, this would involve more complex filtering logic
// and potentially API calls if the data is external.
export const findDoctors = async ({
  country,
  city,
  zipCode,
  specialty,
  insurance,
}: {
  country: string;
  city: string;
  zipCode: string;
  specialty?: string;
}): Promise<Doctor[]> => {
  console.log('INDIA_DOCTOR_API_KEY:', process.env.INDIA_DOCTOR_API_KEY);
  console.log('INDIA_HPR_ID:', process.env.INDIA_HPR_ID);

  console.log('Searching doctors with criteria:', {
    country,
    city,
    zipCode,
    specialty,
  });

  if (typeof country !== 'string') {
    console.error('Invalid criteria: country must be a string.', { country });
    return [];
  }
  if (typeof city !== 'string' && typeof zipCode !== 'string') {
    console.error(
      'Invalid criteria: Either city or zipCode must be a string.',
      { city, zipCode },
    );
    return [];
  }

  // Check the country and call the appropriate API
  switch (country.toLowerCase()) {
    case 'usa':
      return await fetchUSADoctors(city, zipCode, specialty || '');
    case 'india':
      return await fetchIndiaDoctors(city, zipCode, specialty || '');
    default:
      console.error(`Unsupported country: ${country}`);
      return [];
  }
};
