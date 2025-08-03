
import { useEffect } from "react";
import { ClipboardList } from "lucide-react";
import { useState } from "react";
import { useContext } from "react";

import { toast } from "react-toastify";
import axios from 'axios';
import Card from './Card'
import socket from "../socket"; // Importar el socket

export default function CardComandaActiva({ comandas, userName, actualizarComandas }) {
  const [mozoAsignado, setMozoAsignado] = useState(null);
  
  
    const liberarMesa = async (comanda) => {
       console.log("llega a liberar en cardComanda ") 
    try {
      await axios.put(`/mesa/${comanda.Mesa.id}`, { estado: "Libre" });
      await axios.put(`/comanda/${comanda.id}`, {
              estado_Comanda: "Liberada",
            });
            setMozoAsignado(null)
      toast.success("✅ Mesa liberada.");
      await axios.post('/api/reset-chat', {
  MesaId: comanda.MesaId
});



    } catch (error){
      toast.error("❌ Error al liberar la mesa.");
      console.log("error al liberar", error)
    }
  
  };
useEffect(() => {
  const handleActualizarComandas = () => {
    console.log("🔄 actualizarComandas desde CardComandaActiva");
    actualizarComandas();
  };

  socket.on("actualizarComandas", handleActualizarComandas);

  return () => {
    socket.off("actualizarComandas", handleActualizarComandas);
  };
}, [actualizarComandas]);

const tomarPedidoHumano = async (comanda) => {
  
  try {
    await axios.put(`/comanda/${comanda.id}/asignar-a-humano`, {
     
      nombre: userName, // quien esté logueado
    });

    toast.success("👨‍🍳 Pedido asignado a mozo humano");
    setMozoAsignado(userName); // cambiar en frontend
  } catch (err) {
    console.error("Error al tomar pedido:", err);
    toast.error("⚠️ No se pudo asignar la comanda");
  }
};




  return (
    <div className="p-4">
      <h3 className="text-2xl font-semibold text-[#263238] mb-4 flex items-center gap-2">
        <ClipboardList size={20} /> Comandas Activas
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
 {comandas.map((comanda) => {
  const todosItemsLiberadosOCancelados = comanda.ComandaItems?.every(
    (item) =>
      item.estado_Comanda === "Liberada" ||
      item.estado_Comanda === "Cancelada"
  );

    // Si todos los items están liberados o cancelados, no mostrar la tarjeta
  if (todosItemsLiberadosOCancelados) return null;


          return <Card  comanda={comanda} liberarMesa={liberarMesa} key={comanda.id} tomarPedidoHumano={tomarPedidoHumano} mozoAsignado={mozoAsignado} setMozoAsignado={setMozoAsignado} />;
        })}
      </div>
    </div>
  );
}

