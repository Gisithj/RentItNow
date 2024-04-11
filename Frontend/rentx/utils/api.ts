// utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  timeout: 30000, 
  withCredentials:true
});
// axios.defaults.withCredentials = true
// axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
export default api;
