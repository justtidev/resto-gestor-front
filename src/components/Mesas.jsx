import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import socket from "../socket"; // Importar el socket

export default function Mesas({obtenerMesas,estados, mesas}) {
    


 const [estadoSeleccionado, setEstadoSeleccionado] = useState("");
 const { id } = useParams(); // Obtener el ID de la mesa desde los parámetros de la URL
const navigate = useNavigate();


   
  
  
useEffect(() => {
  obtenerMesas(); // Llamada inicial

 


  socket.on("actualizarMesas", () => {
    obtenerMesas(); // Se vuelve a cargar solo cuando el backend lo indica
  });

  return () => {
    socket.off("actualizarMesas"); // Limpieza al desmontar
  };
}, []);


 
  
  

  const colorEstado = (estado) => {
    switch (estado) {
      case 'Libre':
        return 'bg-green-500'; // Verde
      case 'Ocupada':
        return 'bg-accent'; // Amarillo
      default:
        return 'bg-gray-300'; // Gris por defecto
    }
  }

return ( 
 
  <div>
       {/* Estados de mesas */}
      <div className="flex flex-wrap gap-3 mt-10 mb-10 ">
          {estados.map((estado) => (
            <div
              key={estado}
              className="flex items-center gap-2 bg-white border border-[#e0e0e0] px-4 py-2 rounded-xl shadow-sm"
            >
              <span className={`w-3 h-3 rounded-full ${colorEstado(estado)}`}></span>
              <span className="text-sm font-medium text-[#263238]">{estado}</span>
            </div>
))}
        </div>

     {/* MESAS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4  gap-4 mb-10 pr-24">
          {mesas.map((m) => (
          
             
            
              <div
                key={m.id}
                className={`w-28 h-28 flex flex-col items-center justify-center rounded-full ${colorEstado(m.estado)} text-white text-xl font-bold shadow-lg hover:scale-105 transition hover:cursor-pointer `}
                onClick={() => navigate("/comanda/" + m.id)}
                
              >
                {m.numero}
                <span className="text-base font-normal">{m.estado}</span>
              </div>
           ) )
}
        </div>
</div>
        )

}