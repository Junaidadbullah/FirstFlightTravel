export const sendRequest = async (endpoint, options = {}) => {
  const baseUrl = 'http://localhost:3001'; // Backend Port
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    // Agar login fail ho, toh error message bhejें
    throw new Error(data.message || 'Unauthorized Access');
  }

  return data;
};