const API_BASE_URL = 'http://localhost:8000/api';

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}/${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };
  
  try {
    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Real API functions
export const api = {
  // Kit operations
  kits: {
    getAll: () => apiRequest('kits'),
    create: (kitData) => apiRequest('kits/create', {
      method: 'POST',
      body: JSON.stringify(kitData),
    }),
    update: (id, kitData) => apiRequest(`kits/update?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(kitData),
    }),
    delete: (id) => apiRequest(`kits/delete?id=${id}`, {
      method: 'DELETE',
    }),
  },

  // Student operations
  students: {
    getAll: () => apiRequest('students'),
    create: (studentData) => apiRequest('students/create', {
      method: 'POST',
      body: JSON.stringify(studentData),
    }),
    update: (id, studentData) => apiRequest(`students/update?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(studentData),
    }),
    delete: (id) => apiRequest(`students/delete?id=${id}`, {
      method: 'DELETE',
    }),
  },

  // Loan operations
  loans: {
    getAll: () => apiRequest('loans'),
    create: (loanData) => apiRequest('loans/create', {
      method: 'POST',
      body: JSON.stringify(loanData),
    }),
    return: (id, returnData) => apiRequest(`loans/return?id=${id}`, {
      method: 'POST',
      body: JSON.stringify(returnData),
    }),
  },
};

// Export for use in components
export default api;