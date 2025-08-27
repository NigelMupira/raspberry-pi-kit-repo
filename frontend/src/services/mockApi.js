// Mock API service for development with localStorage persistence
const simulateDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// localStorage keys
const STORAGE_KEYS = {
  KITS: 'kit_repository_kits',
  STUDENTS: 'kit_repository_students', 
  LOANS: 'kit_repository_loans'
};

// Initialize or load data from localStorage
const initializeData = () => {
  // Default sample data
  const defaultKits = [
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

  const defaultStudents = [
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
    }
  ];

  const defaultLoans = [
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

  // Load data from localStorage or use defaults
  const loadData = (key, defaultValue) => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return defaultValue;
    }
  };

  const saveData = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  };

  // Initialize data
  let kits = loadData(STORAGE_KEYS.KITS, defaultKits);
  let students = loadData(STORAGE_KEYS.STUDENTS, defaultStudents);
  let loans = loadData(STORAGE_KEYS.LOANS, defaultLoans);

  return { kits, students, loans, saveData };
};

// Initialize data
const { kits: mockKits, students: mockStudents, loans: mockLoans, saveData } = initializeData();

// Mock API functions with persistence
export const mockAPI = {
  // Kit operations
  kits: {
    getAll: async () => {
      await simulateDelay();
      const { kits } = initializeData();
      return kits;
    },
    
    create: async (kitData) => {
      await simulateDelay();
      const { kits, saveData } = initializeData();
      const newKit = {
        id: Math.max(...kits.map(k => k.id), 0) + 1,
        ...kitData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      kits.push(newKit);
      saveData(STORAGE_KEYS.KITS, kits);
      return { message: "Kit created successfully", kit_id: newKit.id };
    },
    
    update: async (id, kitData) => {
      await simulateDelay();
      const { kits, saveData } = initializeData();
      const index = kits.findIndex(kit => kit.id === id);
      if (index !== -1) {
        kits[index] = { ...kits[index], ...kitData, updated_at: new Date().toISOString() };
        saveData(STORAGE_KEYS.KITS, kits);
        return { message: "Kit updated successfully" };
      }
      throw new Error("Kit not found");
    },
    
    delete: async (id) => {
      await simulateDelay();
      const { kits, saveData } = initializeData();
      const index = kits.findIndex(kit => kit.id === id);
      if (index !== -1) {
        kits.splice(index, 1);
        saveData(STORAGE_KEYS.KITS, kits);
        return { message: "Kit deleted successfully" };
      }
      throw new Error("Kit not found");
    }
  },

  // Student operations
  students: {
    getAll: async () => {
      await simulateDelay();
      const { students } = initializeData();
      return students;
    },
    
    create: async (studentData) => {
      await simulateDelay();
      const { students, saveData } = initializeData();
      const newStudent = {
        id: Math.max(...students.map(s => s.id), 0) + 1,
        ...studentData,
        createdAt: new Date().toISOString().split('T')[0]
      };
      students.push(newStudent);
      saveData(STORAGE_KEYS.STUDENTS, students);
      return { message: "Student created successfully", student_id: newStudent.id };
    },
    
    update: async (id, studentData) => {
      await simulateDelay();
      const { students, saveData } = initializeData();
      const index = students.findIndex(student => student.id === id);
      if (index !== -1) {
        students[index] = { ...students[index], ...studentData };
        saveData(STORAGE_KEYS.STUDENTS, students);
        return { message: "Student updated successfully" };
      }
      throw new Error("Student not found");
    },
    
    delete: async (id) => {
      await simulateDelay();
      const { students, saveData } = initializeData();
      const index = students.findIndex(student => student.id === id);
      if (index !== -1) {
        students.splice(index, 1);
        saveData(STORAGE_KEYS.STUDENTS, students);
        return { message: "Student deleted successfully" };
      }
      throw new Error("Student not found");
    }
  },

  // Loan operations
  loans: {
    getAll: async () => {
      await simulateDelay();
      const { loans, kits, students } = initializeData();
      
      // Enrich loan data with kit and student info
      return loans.map(loan => {
        const kit = kits.find(k => k.id === loan.kitId);
        const student = students.find(s => s.id === loan.studentId);
        
        // Calculate status
        let status = 'Active';
        if (loan.returned) {
          status = 'Returned';
        } else {
          const dueDate = new Date(loan.due.replace(' ', 'T'));
          const now = new Date();
          if (dueDate < now) {
            status = 'Overdue';
          }
        }
        
        return {
          ...loan,
          kitName: kit?.name || 'Unknown Kit',
          studentName: student?.name || 'Unknown Student',
          status: status
        };
      });
    },
    
    create: async (loanData) => {
      await simulateDelay();
      const { loans, kits, students, saveData } = initializeData();
      
      const kit = kits.find(k => k.id === loanData.kitId);
      if (!kit) throw new Error("Kit not found");
      
      if (kit.status !== 'Available') {
        throw new Error("Kit is not available for loan");
      }
      
      const student = students.find(s => s.id === loanData.studentId);
      if (!student) throw new Error("Student not found");
      
      const newLoan = {
        id: Math.max(...loans.map(l => l.id), 0) + 1,
        ...loanData,
        borrowed: new Date().toISOString().replace('T', ' ').substring(0, 19),
        returned: null,
        conditionReturned: null,
        componentsReturned: [],
        componentsIncluded: kit.components.map(c => c.id),
        kitName: kit.name,
        studentName: student.name
      };
      
      loans.push(newLoan);
      
      // Update kit status
      const kitIndex = kits.findIndex(k => k.id === loanData.kitId);
      if (kitIndex !== -1) {
        kits[kitIndex].status = 'Loaned';
        kits[kitIndex].updated_at = new Date().toISOString();
      }
      
      saveData(STORAGE_KEYS.LOANS, loans);
      saveData(STORAGE_KEYS.KITS, kits);
      
      return { message: "Loan created successfully", loan_id: newLoan.id };
    },
    
    return: async (loanId, returnData) => {
      await simulateDelay();
      const { loans, kits, saveData } = initializeData();
      
      const loanIndex = loans.findIndex(l => l.id === loanId);
      if (loanIndex === -1) throw new Error("Loan not found");
      
      const loan = loans[loanIndex];
      loan.returned = new Date().toISOString().replace('T', ' ').substring(0, 19);
      loan.conditionReturned = returnData.conditionReturned;
      loan.componentsReturned = returnData.componentsReturned || [];
      
      // Update kit status and condition
      const kitIndex = kits.findIndex(k => k.id === loan.kitId);
      if (kitIndex !== -1) {
        kits[kitIndex].status = 'Available';
        kits[kitIndex].condition = returnData.conditionReturned;
        kits[kitIndex].updated_at = new Date().toISOString();
      }
      
      saveData(STORAGE_KEYS.LOANS, loans);
      saveData(STORAGE_KEYS.KITS, kits);
      
      return { message: "Loan returned successfully" };
    },
    
    // Helper method to clear all data (for testing)
    clearAllData: () => {
      localStorage.removeItem(STORAGE_KEYS.KITS);
      localStorage.removeItem(STORAGE_KEYS.STUDENTS);
      localStorage.removeItem(STORAGE_KEYS.LOANS);
      window.location.reload();
    }
  }
};

// Export for use in components
export default mockAPI;