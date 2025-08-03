import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { Check, X, Receipt, Trash } from 'lucide-react';
import ModalConfirmacion from "./ModalConfirmacion";

// Componente individual de tarjeta
export default function Card({ comanda, liberarMesa, tomarPedidoHumano, mozoAsignado,  }) {
  const [mostrarVerMas, setMostrarVerMas] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
    const ulRef = useRef(null)
    const navigate = useNavigate(); // Inicializa el hook de navegación
const [cerrada, setCerrada] = useState(comanda.estado_Comanda === "Cerrada");
const [metodoPago, setMetodoPago] = useState("Efectivo");
const [mostrarConfirmacionCancelacion, setMostrarConfirmacionCancelacion] = useState(false);

  
useEffect(() => {
    const checkOverflow = () => {
      // Verificamos si la altura de desplazamiento es mayor que la altura visible
      if (ulRef.current) {
        const isOverflowing = ulRef.current.scrollHeight > ulRef.current.clientHeight;
        setMostrarVerMas(isOverflowing);
      }
    };

    // Verificamos al montar el componente y cada vez que cambien los ítems
    checkOverflow();
    
    
  }, [comanda.ComandaItems]);

   const cerrarComanda = async (id) => {
      setMostrarModal(false); // Cerrar el modal antes de realizar la acción
      try {
        await axios.put(`/comanda/${comanda.id}`, {
          estado_Comanda: "Cerrada",  
          fecha_cierre: new Date(),
          
        });
        toast.success("✅ Comanda cerrada. Llevar cuenta a la mesa.");
        setCerrada(true); // <-- Esto actualiza el estado local 
      } catch (error){
        toast.error("❌ No se pudo cerrar la comanda.");
        console.log(error)
      }
    };

    const registrarPago = async (id) => {
    try {
      await axios.put(`/comanda/${comanda.id}`, {
        estado_Comanda: "Pagada",
        metodo_pago: metodoPago,
        fecha_cierre: new Date(),
        pagadaEn: new Date(),
      });
      toast.success("✅ Pago registrado.");
      setMostrarModal(false); // Cerrar el modal después de registrar el pago
    } catch(error ) {
      toast.error("❌ No se pudo registrar el pago.");
      console.log(error);
    }
  };

  const confirmarCancelacion = async () => {
  try {
    // 1. Cancelar la comanda
    await axios.put(`/comanda/${comanda.id}`, {
      estado_Comanda: "Cancelada",
    });

    // 2. Usar la función que te pasó el padre para liberar la mesa
    await liberarMesa(comanda); // <-- ¡Esto hace la magia!

    toast.success("✅ Comanda cancelada");
    setMostrarModal(false); // cerrar el modal principal
  } catch (error) {
    toast.error("❌ Error al cancelar la comanda.");
    console.error(error);
  } finally {
    setMostrarConfirmacionCancelacion(false);
  }
};


;



  if (!comanda)
    return <div className="p-6 text-[#263238]">Cargando comanda...</div>;


//Visualizar las tarjetas de comandas activas
  const tarjeta = (
    //  flex y flex-col para la altura uniforme de la tarjeta
    <div className=" bg-[#F5F5DC] h-full flex flex-col  rounded-2xl p-5 shadow-md border border-[#e0e0e0] hover:shadow-lg hover:scale-105 transition  ">
       {/* Contenido superior de la tarjeta */}
      <div   className="flex-1">
        
         <div className="" >
        <div className="text-[#212121] font-semibold text-lg mb-2 mx-1 font-sans flex justify-between">
   
  <span>Mesa: {comanda.Mesa?.numero || "?"}</span>
  {" | "}
  {comanda.Usuario.nombre == "IA" ? (
    <span className="titilar border bg-accent text-black px-2 py-1 rounded inline-flex items-center gap-2">
      {comanda.Usuario.nombre}
      <button
        onClick={()=> tomarPedidoHumano(comanda)}
        className="text-xs bg-white text-red-600 border border-red-500 rounded px-2 py-1 hover:bg-red-100"
      >
        🧑 Tomar
      </button>
    </span>
  ) : (
    <span className="font-semibold"> Mozo:{comanda.Usuario?.nombre }</span>
  )}
</div>


        <ul
          className="text-[#757575] text-sm m-1 space-y-1 mb-2 h-20 max-h-18 overflow-hidden relative flex-shrink-0"
          ref={ulRef}
        >
            {/* Gradiente para el efecto de desvanecimiento */}
        {mostrarVerMas && (
          <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-[#F5F5DC] to-transparent pointer-events-none "></div>
        )}
            {comanda.ComandaItems?.map((item, i) => (
              <li key={i}>
                {item.MenuItem?.nombre} x <span className="text-right"> {item.cantidad}</span> { item.observaciones=== "" ? "": <span className="font-bold text-green-600 ">({item.observaciones })</span>}
              </li>
            ))}
          </ul>
        
{/* El contenido inferior ocupa el espacio restante */}
      <div >
        <div className="text-center text-[#212121] font-semibold mt-0 m-4">
          ${Number(comanda.precio_total).toFixed(2)}
        </div>

        <div className=" text-sm font-medium text-center text-[#263238] m-4">
          Estado: {comanda.estado_Comanda}
        </div>
        </div>
       </div>
         {/* Botones que quedan al final de la tarjeta */}
        {comanda.estado_Comanda === "Pagada" && (
      <button
        onClick={() => liberarMesa(comanda)}
        className="mt-2 bg-accent font-semibold text-[#263238] px-2 py-1.5 text-sm rounded-xl w-full  hover:bg-gray-600 hover:text-accent transition shadow-lg"
      >
        Liberar Mesa
      </button>
    )}
      

      {(comanda.estado_Comanda === "Confirmada" || comanda.estado_Comanda === "Cerrada") && (
        <button
          onClick={() => setMostrarModal(true)}
          className="mt-2 font-semibold bg-accent text-[#263238] px-2 py-1.5 text-sm rounded-xl hover:bg-gray-600 hover:text-accent transition shadow-lg w-full"
        >
          Ver más
        </button>
      )}
    </div>
    </div>
  )

  return (
    <>
      
    {tarjeta}

    {mostrarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4">
          <div className= "relative bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-lg">
         
           
           <button
              onClick={() => setMostrarModal(false)}
              className="absolute top-3 right-3 bg-transparent text-gray-500 hover:text-[#263238] p-2 rounded-full"
              aria-label="Cerrar" >
            <FaTimes size={20} />
            </button>
            <h2 className="text-xl flex gap-4 font-semibold mb-4 text-[#212121]">
              Mesa: {comanda.Mesa?.numero}  <span>{"|"}</span> <span className=" ">   Mozo: {comanda.Usuario.nombre}</span>
            </h2>
            
            <ul className="mb-4 text-sm text-[#757575] space-y-1">
              {comanda.ComandaItems?.map((item, i) => (
                <li key={i} className="flex justify-between">
                  <span>{item.MenuItem?.nombre} x {item.cantidad} </span>
                    { item.observaciones=== "" ? "": <span className="font-bold text-green-600 ">({item.observaciones })</span>}
                    <span className="text-right min-w-16 text-[#212121]">${item.MenuItem?.precio_item * item.cantidad}</span>
                </li>
              ))}
            </ul>
            <div className="text-right text-[#212121] font-semibold mb-3">
              Total: ${Number(comanda.precio_total).toFixed(2)}
            </div>
                <div className="flex gap-6 justify-center">
         
      
          {comanda.estado_Comanda === "Confirmada" && (
          <button
            onClick= {() => cerrarComanda(comanda.id)} 
            className="flex items-center gap-2 p-4  bg-accent text-textPrimary rounded-xl font-semibold hover:bg-gray-600 hover:text-accent transition shadow-lg"
          >
            <Check size={20}/>
            Imprimir
          </button>)}

           
       
       {cerrada && (
          <div className="font-sans  space-y-4">
            <div>
              <label className="block mb-4  underline text-green-600 font-sans">Método de pago</label>
              <select
                className="font-sans border rounded p-2 w-full"
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value)}
              >
                <option value="Efectivo">Efectivo</option>
                <option value="Débito">Débito</option>
                <option value="Crédito">Crédito</option>
                <option value="MercadoPago">MercadoPago</option>
              </select>
            </div>

            <button
              onClick={()=> registrarPago(comanda.id)}
              className="flex items-center gap-2 p-4 bg-accent text-textPrimary rounded-xl font-semibold  hover:bg-gray-500 hover:text-[#F4C430] transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check size={20} />
            Pagar
            </button>
          </div>
)}
          
     

          {!cerrada && (       
                    <button
           onClick={() => setMostrarConfirmacionCancelacion(true)}
            className="flex items-center gap-2 p-4 bg-darkGray text-white rounded-xl font-semibold hover:bg-gray-600 hover:text-accent transition shadow-lg"
          >
            <Trash size={20} />
            Cancelar
          </button>)}
        </div>
          </div>
        </div>
      )}
      {mostrarConfirmacionCancelacion && (
  <ModalConfirmacion
    mensaje="Esta acción cancelará la comanda y liberará la mesa. ¿Deseás continuar?"
    onConfirmar={confirmarCancelacion}
    onCancelar={() => setMostrarConfirmacionCancelacion(false)}
  />
)}

    </>
  );
}
