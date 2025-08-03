// src/hooks/useVolverAlDashboard.js
import { useNavigate } from 'react-router-dom';

const useVolverDashboard = () => {
  const navigate = useNavigate();

  const volverDashboard = () => {
    navigate('/dashboard'); // Asegúrate que esta ruta existe
  };

  return volverDashboard;
};

export default useVolverDashboard;
