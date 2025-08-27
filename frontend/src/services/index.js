import { mockAPI } from './mockApi';
import { api } from './api';

// Check if we should use mock data (for development)
const USE_MOCK_DATA = true; // Set to false when your real API is working

// Export the appropriate API based on environment
export const kitAPI = USE_MOCK_DATA ? mockAPI.kits : api.kits;
export const studentAPI = USE_MOCK_DATA ? mockAPI.students : api.students;
export const loanAPI = USE_MOCK_DATA ? mockAPI.loans : api.loans;

// Helper to switch between mock and real API
export const setUseMockData = (useMock) => {
  window.location.reload(); // Reload to apply changes
};

export default {
  kits: kitAPI,
  students: studentAPI,
  loans: loanAPI,
  setUseMockData
};