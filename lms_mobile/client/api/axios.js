import axios from 'axios';

// IMPORTANT: Replace this IP with your computer's actual local IPv4 address.
// On Windows, open cmd and type `ipconfig` to find your IPv4 Address (e.g., 192.168.1.5)
// If using the Android Studio Emulator, you can use '10.0.2.2' instead.
const API_URL = 'http://10.247.208.64:5000/api'; 

const API = axios.create({
  baseURL: API_URL,
});

export default API;