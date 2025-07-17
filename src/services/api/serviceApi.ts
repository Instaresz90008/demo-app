// Define service interface
export interface Service {
  id: string;
  name: string;
  duration_mins?: number;
  cost_factor?: number;
  description?: string;
  is_active?: boolean;
  serviceType?: "one-to-one" | "one-to-many" | "group";
  meetingType?: string;
  createdAt?: string;
  additionalSettings?: {
    meetingTypesConfig?: Array<{
      id: string; // e.g. "video", "phone", "in-person"
      enabled: boolean;
      price?: string;
      meetingLink?: string;
      location?: string;
      phoneNumber?: string;
      maxParticipants?: string;
      recordingEnabled?: boolean;
      parkingAvailable?: boolean;
    }>;
  };
}

// Mutate the mockServices array for create/update/delete in-memory operations
let mockServices: Service[] = [
  {
    id: '1',
    name: 'Business Consultation',
    duration_mins: 30,
    cost_factor: 50,
    is_active: true,
    serviceType: "one-to-one",
    meetingType: "video",
    createdAt: "2025-06-10T10:00:00.000Z",
    additionalSettings: {
      meetingTypesConfig: [
        { id: "video", enabled: true, price: "99" },
        { id: "phone", enabled: true, price: "79" },
        { id: "in-person", enabled: true, price: "149" }
      ]
    }
  },
  {
    id: '2',
    name: 'Strategy Session',
    duration_mins: 60,
    cost_factor: 150,
    is_active: true,
    serviceType: "group",
    meetingType: "video",
    createdAt: "2025-06-11T11:30:00.000Z",
    additionalSettings: {
      meetingTypesConfig: [
        { id: "video", enabled: true, price: "199" },
        { id: "phone", enabled: true, price: "179" },
        { id: "in-person", enabled: false }
      ]
    }
  },
  {
    id: '3',
    name: 'Team Onboarding',
    duration_mins: 90,
    cost_factor: 200,
    is_active: true,
    serviceType: "one-to-many",
    meetingType: "video",
    createdAt: "2025-06-12T14:00:00.000Z",
    additionalSettings: {
      meetingTypesConfig: [
        { id: "video", enabled: true, price: "299" },
        { id: "phone", enabled: false },
        { id: "in-person", enabled: true, price: "399" }
      ]
    }
  },
  {
    id: '4',
    name: 'Quick Chat',
    duration_mins: 15,
    cost_factor: 25,
    is_active: true,
    serviceType: "one-to-one",
    meetingType: "phone",
    createdAt: "2025-06-13T09:00:00.000Z",
    additionalSettings: {
      meetingTypesConfig: [
        { id: "video", enabled: false },
        { id: "phone", enabled: true, price: "49" },
        { id: "in-person", enabled: false }
      ]
    }
  },
];

const serviceApi = {
  // Get all services for the current user
  getUserServices: async (): Promise<Service[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockServices]);
      }, 500);
    });
  },

  getServiceById: async (id: string): Promise<Service | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const service = mockServices.find(s => s.id === id);
        resolve(service);
      }, 300);
    });
  },

  // NEW: Create a service
  createService: async (service: Omit<Service, 'id'> & Partial<Pick<Service, 'id'>>) => {
    return new Promise<Service>((resolve) => {
      setTimeout(() => {
        const newId = (Math.max(...mockServices.map(s => Number(s.id)), 0) + 1).toString();
        const newService: Service = {
          ...service,
          id: service.id ?? newId,
        };
        mockServices.push(newService);
        resolve({ ...newService });
      }, 400);
    });
  },

  // NEW: Update a service
  updateService: async (id: string, updates: Partial<Service>) => {
    return new Promise<Service>((resolve, reject) => {
      setTimeout(() => {
        const idx = mockServices.findIndex(s => s.id === id);
        if (idx === -1) return reject(new Error('Not found'));
        mockServices[idx] = { ...mockServices[idx], ...updates };
        resolve({ ...mockServices[idx] });
      }, 400);
    });
  },

  // NEW: Delete a service
  deleteService: async (id: string) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const len = mockServices.length;
        mockServices = mockServices.filter(service => service.id !== id);
        if (mockServices.length === len) return reject(new Error('Not found'));
        resolve();
      }, 300);
    });
  },
};

export default serviceApi;
