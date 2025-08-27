// Mock API service for development
const simulateDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data
const mockKits = [
  {
    id: 1,
    name: "Raspberry Pi Pico Advanced Kit",
    description: "Complete kit for advanced IoT and embedded systems projects",
    condition: "Excellent",
    status: "Available",
    image: "https://placehold.co/300x200/3a6df0/white?text=Pi+Pico+Kit",
    components: [
      { id: 1, name: "Raspberry Pi Pico", quantity: 1 },
      { id: 2, name: "Breadboard", quantity: 1 },
      { id: 3, name: "Jumper Wires", quantity: 40 },
      { id: 4, name: "LEDs (Various Colors)", quantity: 20 },
      { id: 5, name: "Resistors (Assorted)", quantity: 50 }
    ],
    created_at: "2023-05-10 10:30:00",
    updated_at: "2023-05-10 10:30:00"
  },
  {
    id: 2,
    name: "Raspberry Pi 4 Starter Kit",
    description: "Beginner-friendly kit for learning Raspberry Pi",
    condition: "Good",
    status: "Loaned",
    image: "https://placehold.co/300x200/4caf50/white?text=Pi+4+Kit",
    components: [
      { id: 101, name: "Raspberry Pi 4", quantity: 1 },
      { id: 102, name: "Power Supply", quantity: 1 },
      { id: 103, name: "MicroSD Card", quantity: 1 },
      { id: 104, name: "Case", quantity: 1 }
    ],
    created_at: "2023-05-15 14:20:00",
    updated_at: "2023-05-15 14:20:00"
  }
];

const mockStudents = [
  {
    id: 1,
    name: "John Smith",
    studentId: "S12345",
    email: "john@university.edu",
    phone: "555-1234",
    program: "Computer Science",
    createdAt: "2023-05-10"
  },
  {
    id: 2,
    name: "Maria Garcia",
    studentId: "S23456",
    email: "maria@university.edu",
    phone: "555-5678",
    program: "Electrical Engineering",
    createdAt: "2023-05-15"
  },
  {
    id: 3,
    name: "David Kim",
    studentId: "S34567",
    email: "david@university.edu",
    phone: "555-9012",
    program: "Information Technology",
    createdAt: "2023-05-20"
  }
];

const mockLoans = [
  {
    id: 1,
    kitId: 2,
    studentId: 1,
    borrowed: "2023-05-10 10:30:00",
    returned: null,
    due: "2023-05-17 10:30:00",
    conditionBorrowed: "Good",
    conditionReturned: null,
    componentsIncluded: [101, 102, 103, 104],
    componentsReturned: [],
    kitName: "Raspberry Pi 4 Starter Kit",
    studentName: "John Smith"
  },
  {
    id: 2,
    kitId: 1,
    studentId: 2,
    borrowed: "2023-06-01 14:15:00",
    returned: "2023-06-08 11:20:00",
    due: "2023-06-08 14:15:00",
    conditionBorrowed: "Excellent",
    conditionReturned: "Excellent",
    componentsIncluded: [1, 2, 3, 4, 5],
    componentsReturned: [1, 2, 3, 4, 5],
    kitName: "Raspberry Pi Pico Advanced Kit",
    studentName: "Maria Garcia"
  }
];

// Mock API functions
export const mockAPI = {
  // Kit operations
  kits: {
    getAll: async () => {
      await simulateDelay();
      return mockKits;
    },
    
    create: async (kitData) => {
      await simulateDelay();
      const newKit = {
        id: Math.max(...mockKits.map(k => k.id)) + 1,
        ...kitData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      mockKits.push(newKit);
      return { message: "Kit created successfully", kit_id: newKit.id };
    },
    
    update: async (id, kitData) => {
      await simulateDelay();
      const index = mockKits.findIndex(kit => kit.id === id);
      if (index !== -1) {
        mockKits[index] = { ...mockKits[index], ...kitData, updated_at: new Date().toISOString() };
        return { message: "Kit updated successfully" };
      }
      throw new Error("Kit not found");
    },
    
    delete: async (id) => {
      await simulateDelay();
      const index = mockKits.findIndex(kit => kit.id === id);
      if (index !== -1) {
        mockKits.splice(index, 1);
        return { message: "Kit deleted successfully" };
      }
      throw new Error("Kit not found");
    }
  },

  // Student operations
  students: {
    getAll: async () => {
      await simulateDelay();
      return mockStudents;
    },
    
    create: async (studentData) => {
      await simulateDelay();
      const newStudent = {
        id: Math.max(...mockStudents.map(s => s.id)) + 1,
        ...studentData,
        createdAt: new Date().toISOString().split('T')[0]
      };
      mockStudents.push(newStudent);
      return { message: "Student created successfully", student_id: newStudent.id };
    },
    
    update: async (id, studentData) => {
      await simulateDelay();
      const index = mockStudents.findIndex(student => student.id === id);
      if (index !== -1) {
        mockStudents[index] = { ...mockStudents[index], ...studentData };
        return { message: "Student updated successfully" };
      }
      throw new Error("Student not found");
    },
    
    delete: async (id) => {
      await simulateDelay();
      const index = mockStudents.findIndex(student => student.id === id);
      if (index !== -1) {
        mockStudents.splice(index, 1);
        return { message: "Student deleted successfully" };
      }
      throw new Error("Student not found");
    }
  },

  // Loan operations
  loans: {
    getAll: async () => {
      await simulateDelay();
      // Enrich loan data with kit and student info
      return mockLoans.map(loan => {
        const kit = mockKits.find(k => k.id === loan.kitId);
        const student = mockStudents.find(s => s.id === loan.studentId);
        return {
          ...loan,
          kitName: kit?.name || 'Unknown Kit',
          studentName: student?.name || 'Unknown Student'
        };
      });
    },
    
    create: async (loanData) => {
      await simulateDelay();
      const kit = mockKits.find(k => k.id === loanData.kitId);
      if (!kit) throw new Error("Kit not found");
      
      const newLoan = {
        id: Math.max(...mockLoans.map(l => l.id), 0) + 1,
        ...loanData,
        borrowed: new Date().toISOString().replace('T', ' ').substring(0, 19),
        returned: null,
        conditionReturned: null,
        componentsReturned: [],
        componentsIncluded: kit.components.map(c => c.id),
        kitName: kit.name
      };
      
      mockLoans.push(newLoan);
      
      // Update kit status
      kit.status = 'Loaned';
      kit.updated_at = new Date().toISOString();
      
      return { message: "Loan created successfully", loan_id: newLoan.id };
    },
    
    return: async (loanId, returnData) => {
      await simulateDelay();
      const loan = mockLoans.find(l => l.id === loanId);
      if (!loan) throw new Error("Loan not found");
      
      loan.returned = new Date().toISOString().replace('T', ' ').substring(0, 19);
      loan.conditionReturned = returnData.conditionReturned;
      loan.componentsReturned = returnData.componentsReturned || [];
      
      // Update kit status and condition
      const kit = mockKits.find(k => k.id === loan.kitId);
      if (kit) {
        kit.status = 'Available';
        kit.condition = returnData.conditionReturned;
        kit.updated_at = new Date().toISOString();
      }
      
      return { message: "Loan returned successfully" };
    }
  }
};

// Export for use in components
export default mockAPI;