export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  acceptedInsurance: string[]; // List of accepted insurance providers (use general names for mocking)
  contact: string;
  // Add other relevant fields like ratings, hospital affiliations, etc. if needed
}

export const mockDoctorDatabase: Doctor[] = [
  {
    id: 'doc1',
    name: 'Dr. Alice Smith',
    specialty: 'General Practice',
    address: {
      street: '123 Health St',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62704',
    },
    acceptedInsurance: ['BlueCross', 'Aetna', 'Cigna', 'Medicare'],
    contact: '555-1234',
  },
  {
    id: 'doc2',
    name: 'Dr. Bob Johnson',
    specialty: 'Cardiology',
    address: {
      street: '456 Heart Ave',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62702',
    },
    acceptedInsurance: ['BlueCross', 'UnitedHealthcare', 'Medicare'],
    contact: '555-5678',
  },
  {
    id: 'doc3',
    name: 'Dr. Carol Williams',
    specialty: 'Pediatrics',
    address: {
      street: '789 Child Way',
      city: 'Shelbyville',
      state: 'IL',
      zipCode: '62565',
    },
    acceptedInsurance: ['Aetna', 'Cigna', 'Medicaid'],
    contact: '555-9012',
  },
  {
    id: 'doc4',
    name: 'Springfield Urgent Care',
    specialty: 'Urgent Care',
    address: {
      street: '101 Speedy Rd',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62704',
    },
    acceptedInsurance: ['BlueCross', 'Aetna', 'Cigna', 'UnitedHealthcare', 'Medicare', 'Medicaid'],
    contact: '555-1122',
  },
  {
    id: 'doc5',
    name: 'Dr. David Brown',
    specialty: 'Dermatology',
    address: {
      street: '234 Skin Blvd',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62703',
    },
    acceptedInsurance: ['BlueCross', 'Aetna', 'UnitedHealthcare'],
    contact: '555-3344',
  },
  {
    id: 'doc6',
    name: 'Shelbyville Community Clinic',
    specialty: 'General Practice',
    address: {
      street: '567 Community Dr',
      city: 'Shelbyville',
      state: 'IL',
      zipCode: '62565',
    },
    acceptedInsurance: ['Aetna', 'Cigna', 'Medicare', 'Medicaid'],
    contact: '555-6677',
  }
];

// Placeholder function for searching the database
// In a real application, this would involve more complex filtering logic
// and potentially API calls if the data is external.
export const findDoctors = async (criteria: {
  city?: string;
  zipCode?: string;
  specialty?: string;
  insurance?: string;
}): Promise<Doctor[]> => {
  console.log("Searching doctors with criteria:", criteria);
  return mockDoctorDatabase.filter(doctor => {
    let match = true;
    if (criteria.zipCode && doctor.address.zipCode !== criteria.zipCode) {
      match = false;
    }
    if (criteria.city && doctor.address.city.toLowerCase() !== criteria.city.toLowerCase()) {
      match = false;
    }
    if (criteria.specialty && !doctor.specialty.toLowerCase().includes(criteria.specialty.toLowerCase())) {
      match = false;
    }
    if (criteria.insurance && !doctor.acceptedInsurance.some(ins => ins.toLowerCase() === criteria.insurance?.toLowerCase())) {
        // For mock data, allow partial match or handle 'any'/'none'
        if (criteria.insurance.toLowerCase() !== 'any' && criteria.insurance.toLowerCase() !== 'none') {
             match = false;
        }
    }
    return match;
  });
};
