// utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  timeout: 30000, 
  withCredentials:true
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Handle 401 Unauthorized without logging it as an error
      console.log('Unauthorized access - 401');
      return Promise.resolve({ status: 401, data: null });
    }
    return Promise.reject(error);
  }
);
// axios.defaults.withCredentials = true
// axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
export default api;
