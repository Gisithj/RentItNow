// utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:44375/api',
  timeout: 5000, 
  withCredentials:true
});
// axios.defaults.withCredentials = true
// axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
export default api;
