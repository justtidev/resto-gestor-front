import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios';
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
// Si querés ver todos los errores
/* axios.interceptors.response.use(
  response => response,
  error => {
    console.error("Axios error:", error); // Agregá esto
    return Promise.reject(error);
  }
); */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
