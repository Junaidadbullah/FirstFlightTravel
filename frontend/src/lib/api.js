export const sendRequest = async (endpoint, options = {}) => {
  const baseUrl = 'http://localhost:3001'; // Aapka backend port
  
  // Browser environment check taake localStorage crash na ho
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  // Default headers setup
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Agar token mojud hai toh Authorization header mein add karein
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    // Response ko parse karein
    const data = await response.json();

    // 🔴 AGAR RESPONSE OK NAHI HAI (e.g. 401, 404, 500)
    if (!response.ok) {
      
      // Check karein agar token expire ho gaya hai (15 seconds baad status 401 aayega)
      if (response.status === 401) {
        console.warn("Token expired! Logging out...");
        
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token'); // 1. LocalStorage se token saaf karein
          alert("Aapka session khatam ho gaya hai . Dobara login karein."); // 2. User ko bataein
          window.location.href = '/login'; // 3. Foran login page par bhej dein
        }
        return; // Mazeed execution rokein
      }

      // Agar koi aur error hai (jaise ghalat password) toh message throw karein
      throw new Error(data.message || 'Unauthorized Access');
    }

    // Agar sab theek hai toh data return karein
    return data;

  } catch (error) {
    // Network errors ya manually thrown errors handle karein
    throw error;
  }
  
};