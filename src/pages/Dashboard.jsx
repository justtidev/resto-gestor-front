

import {  useEffect ,useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Search, LayoutDashboard, Utensils, Table, ClipboardList, FileText, Settings, UserCircle2, LogOut } from 'lucide-react';

import { useLogout } from '../hooks/useLogout';
import{ AuthContext } from '../contexts/AuthContext';
import Mesas from '../components/Mesas'
import axios from 'axios';
import { toast } from 'react-toastify';
import CardComandaActiva from '../components/CardComandaActiva';
import socket from '../socket'; // Importar el socket
import AsideBar from '../components/AsideBar';








const Dashboard = () => {

  const [selectedItem, setSelectedItem] = useState('Mesas');
   const handleLogout = useLogout();
   const {userName, userRole} = useContext(AuthContext);
   const [comandas, setComandas] = useState([]);
   const [mesas, setMesas] = useState([]);
 const [estados, setEstados] = useState([]);

  


   const obtenerMesas = async () => {
   
    try {
      const respuesta = await axios.get(`/mesa`);
      if (respuesta.status === 200) 
     setMesas(respuesta.data.data);
      setEstados(respuesta.data.estadosDisponibles);
      
      console.log('mesas', respuesta.data.data);  
      
    } catch (error) {
      console.error("Error al obtener mesa:", error);
     
     setMesas({})
    
    }
    }

 const actualizarComandas = async () => {
    try {
      const response = await axios.get("/comanda/activas");
      setComandas(response.data.data);
      console.log("Comandas activas:", response.data.data);
    } catch (err) {
      console.error("Error al cargar comandas activas", err);
    }
  };
useEffect(() => {
 

  actualizarComandas();
  obtenerMesas(); // Llamada inicial
 

  socket.on("actualizarComandas", actualizarComandas); // Se actualiza solo cuando el backend lo emite
   socket.on("actualizarMesas", obtenerMesas);
  

  return () => {
    socket.off("actualizarComandas", actualizarComandas); // Limpieza al desmontar
  socket.off("actualizarMesas", obtenerMesas);
  };
  }, []);

 



  return (
    <div className="flex min-h-screen bg-[#FFFDF7] text-[#212121] font-sans">
     
 <AsideBar/>

         

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ml-2 mb-6">
          <h2 className="text-3xl font-bold text-[#263238]">Mesas</h2>
          <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 p-3 rounded-xl ">
          <UserCircle2 size={20} />
          <div className="text-sm text-center">
            <p className="font-semibold text-[#263238]">{userName}</p>
            {/* <p className="text-xs text-gray-300">Administrador</p> */}
          </div>
        </div>
          <button className="flex items-center gap-2 text-black hover:bg-stone-500 hover:text-[#F4C430] transition px-4 py-2 rounded-xl text-sm" onClick={handleLogout} >
            
            <LogOut size={16} /> Salir
          </button>
        </div>
        </div>

       
   
       <Mesas 
     obtenerMesas={obtenerMesas} 
     estados = {estados} 
     mesas={mesas}/> 

  
    <CardComandaActiva
      userName={userName}
      comandas={comandas}
      actualizarComandas={actualizarComandas}
      
     
      
    />
 

          
      


        
      </main>
      </div>
    
  );
}



export default Dashboard; 
