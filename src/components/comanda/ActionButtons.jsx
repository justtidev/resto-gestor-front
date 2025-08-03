import { Check, X, Receipt } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import ModalConfirmacion from '../ModalConfirmacion';



const ActionButtons = ({ orderItems, tableNumber, comandaExistente}) => {
  const navigate = useNavigate();
  const { userId } = useContext(AuthContext);
  const [mostrarConfirmacionCancelacion, setMostrarConfirmacionCancelacion] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const totalAmount = orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const itemCount = orderItems.reduce((total, item) => total + item.quantity, 0);



const handleSubmit = async () => {
  if (isSubmitting) return; // evita clicks repetidos
  setIsSubmitting(true);

  try {
    await crearComanda(); // o lo que llame a tu API
    actualizarComandas(); // refrescar la lista
  } catch (err) {
    console.error("Error al crear comanda", err);
  } finally {
    setIsSubmitting(false);
  }
};

  const enviarComanda = async ({ orderItems, tableNumber}) => {
  try {
  
   const payload = {
  MesaId: parseInt(tableNumber),
  UsuarioId: parseInt(userId),
  productos: orderItems.map((item) => ({
    id: item.id, // MenuItemId
    cantidad: item.quantity,
    observaciones: item.comments,
    precio_unitario: item.price, // necesario si no enviás el subtotal
  })),
};


  if (comandaExistente) {
  try {await axios.put(`/comanda/${comandaExistente.id}`, payload);

  toast.success("Comanda actualizada correctamente", {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: false,
    pauseOnHover: false,
    draggable: false,
  });

  await axios.put(`/mesa/${tableNumber}`, {
    estado: "Ocupada",
  });

  setTimeout(() => {
    navigate("/Dashboard");
  }, 2000);
} catch (error) {
    console.error("❌ Error al enviar comanda", error);
     toast.error("Error al enviar la comanda", {
      position: "top-center",
    });
  }
} else {
    // Si no hay comanda existente, crear una nueva
 const response= await axios.post("/comanda", payload); 

    if (response.status === 201) {
       // ✅ Mostrar notificación de éxito
      toast.success("Comanda enviada correctamente", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        pauseOnHover: false,
        draggable: false,
       })
    }
      await axios.put(`/mesa/${tableNumber}`, {
        estado: "Ocupada",
      });


    // Esperar un segundo antes de redirigir
      setTimeout(() => {
        navigate("/Dashboard");
      }, 2000);
     }
  } catch (error) {
    console.error("❌ Error al enviar comanda", error);
     toast.error("Error al enviar la comanda", {
      position: "top-center",
    });
  }
};
  

  const handleCancel = () => {
  if (comandaExistente?.estado_Comanda === "Confirmada") {
    toast.info("La comanda no se modifica.", {
      position: "top-center",
      autoClose: 2000,
    });
    navigate('/dashboard');
  } else {
    setMostrarConfirmacionCancelacion(true);
  }
};

// ✅ Esta función debe estar afuera del handleCancel
const confirmarCancelacion = async () => {
  try {
    await axios.put(`/mesa/${tableNumber}`, { estado: "Libre" });
    toast.info("La comanda fue cancelada", {
      position: "top-center",
      autoClose: 2000,
    });
    navigate('/dashboard');
  } catch (error) {
    console.error("Error al cancelar comanda", error);
    toast.error("Error al cancelar la comanda", {
      position: "top-center",
    });
  }
};

  

  return (
    <>
    {mostrarConfirmacionCancelacion && (
  <ModalConfirmacion
    mensaje="Esta acción cancelará la comanda y liberará la mesa. ¿Deseás continuar?"
    onConfirmar={confirmarCancelacion}
    onCancelar={() => setMostrarConfirmacionCancelacion(false)}
  />
)}

    <div className="fixed bottom-0 left-0 right-64 bg-white border-t border-gray-200 p-6 shadow-2xl">
      <div className="max-w-4xl mx-auto">
        {orderItems.length > 0 && (
          <div className="mb-4 p-4 bg-lightGray rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt size={20} className="text-textSecondary" />
                <span className="font-medium text-textPrimary">
                  {itemCount} producto{itemCount !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="text-2xl font-bold text-textPrimary">
                Total: ${totalAmount}
              </div>
            </div>
          </div>
        )}
        
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => handleCancel()}
            className="flex items-center gap-2 px-4 py-4 bg-darkGray text-white rounded-xl font-semibold hover:bg-gray-600 hover:text-accent transition shadow-lg"
          >
            <X size={20} />
            Cancelar
          </button>
          
          <button
            onClick={()=> enviarComanda({
      orderItems,
      tableNumber
      
    })}
            disabled={orderItems.length === 0 || isSubmitting}
            className="flex items-center gap-2 px-4 py-4 bg-accent text-textPrimary rounded-xl font-semibold  hover:bg-gray-500 hover:text-[#F4C430] transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          > 
            <Check size={20} />
            Confirmar
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default ActionButtons;