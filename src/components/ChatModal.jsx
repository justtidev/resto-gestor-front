import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRef } from "react";
import { getSpeechRecognition } from "../utils/speechRecognition";

function ChatModal({ mesaId, onClose  }) {
  const chatContainerRef = useRef(null);
  const [mensajes, setMensajes] = useState([]);
  const [entrada, setEntrada] = useState("");
  const [cargando, setCargando] = useState(false);
const [chatBloqueado, setChatBloqueado] = useState(false);

   
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [mensajes, cargando]);

  // consulta al backend para saber si el chat ya está bloqueado, usando mesaId
   useEffect(() => {
    console.log("💬 ChatModal montado con mesaId:", mesaId);

const verificarChatBloqueado = async () => {
 try {
   const res = await axios.get(`/comanda/comanda-activa/${mesaId}`);
    console.log("mesaId", mesaId)
  if (res.data.estado === 'Confirmada') {
    setChatBloqueado(true);
    console.log("res.data", res.data)
  }
} catch (error) {
      console.error("Error al verificar estado del chat:", error);
    }
  
  }
  verificarChatBloqueado();
}, [mesaId]);

 

  const hablar = (texto) => {
    const utter = new SpeechSynthesisUtterance(texto);
    utter.lang = "es-AR";
    speechSynthesis.speak(utter);
  };

 const escuchar = () => {
    const recognition = getSpeechRecognition();
    console.log("recognition", recognition);
    if (!recognition) return;

    recognition.start();

    recognition.onstart = () => {
      console.log("🎤 Escuchando...");
    };

    recognition.onresult = (event) => {
      const texto = event.results[0][0].transcript;
      console.log("✅ Reconocido:", texto);
      setEntrada(texto); // Cargar en input
      enviarMensaje(texto); // Enviar automáticamente
    };

   recognition.onerror = (event) => {
  console.error("❌ Error de reconocimiento:", event.error);
  let mensaje = "";

  switch (event.error) {
    case "network":
      mensaje = "Error de red al iniciar el reconocimiento de voz. Verificá tu conexión.";
      break;
    case "not-allowed":
      mensaje = "Permiso de micrófono denegado. Activalo en la configuración del navegador.";
      break;
    case "service-not-allowed":
      mensaje = "El reconocimiento de voz no está disponible en este momento.";
      break;
    default:
      mensaje = "Ocurrió un error con el reconocimiento de voz.";
  }

  setMensajes((prev) => [...prev, { rol: "IA", texto: `⚠️ ${mensaje}` }]);
};


    recognition.onend = () => {
      console.log("🔇 Reconocimiento finalizado");
    };
  };

  const enviarMensaje = async (textoManual) => {
    const texto = typeof textoManual === 'string' ? textoManual : entrada;
    if (!texto.trim()) return;

    const nuevoMensaje = { rol: "Cliente", texto };
    setMensajes((prev) => [...prev, nuevoMensaje]);
    setEntrada("");
    setCargando(true);
    

    try {
      const res = await axios.post("/api/ask-and-create", {
        question: texto,
        MesaId: mesaId,
        UsuarioId: "12"
      });

      const data = res.data;
      const respuesta = data.text || "No se pudo procesar la respuesta.";

      setMensajes((prev) => [...prev, { rol: "IA", texto: respuesta }]);
      hablar(respuesta);
console.log("dataBloqueado", data.chatBloqueado)
      if (data.chatBloqueado) {
        setChatBloqueado(true);
      }

  
  

      if (data.necesitaClarificacion) {
        console.warn("🔍 Se necesita aclaración:", respuesta);
        // Aquí podrías agregar botones para que el usuario elija
      }

      if (data.comanda) {
        console.log("✅ Comanda creada:", data.comanda);
        await axios.put(`/mesa/${mesaId}`, {
    estado: "Ocupada",
  });
        // Podés mostrar un mensaje, actualizar estado global, etc.
      }

    } catch (err) {
      console.error("Error al conectar con el agente:", err);
      setMensajes((prev) => [
        ...prev,
        { rol: "IA", texto: "⚠️ Error al conectar con el agente. Por favor, intentá nuevamente." }
      ]);
    } finally {
      setCargando(false);
    }
  };
  

 return (
 <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center sm:items-center z-50">
  <div className="bg-white w-full sm:max-w-lg md:max-w-xl rounded-t-xl sm:rounded-xl shadow-lg p-6 sm:p-8 max-h-[90vh] flex flex-col">
    {/* Header */}
    <div className="relative mb-4 sm:mb-6 px-2 sm:px-4 pt-4 sm:pt-6">
        {/* Botón cerrar arriba a la izquierda */}
  <button
    onClick={onClose}
    className="absolute top-2 right-2 px-1 sm:top-4 sm:right-4 text-gray-800 hover:text-green-600 font-bold text-2xl sm:text-xl"
    aria-label="Cerrar chat"
  >
    &times;
  </button>
      {/* Título centrado */}
  <div className="text-center mt-2 sm:mt-0">
    <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Agente Virtual de mesa {mesaId}</h2>
    <p className="text-sm sm:text-base text-gray-600">Para hacer consultas e iniciar el pedido</p>
  </div>
</div>

    {/* Contenedor mensajes */}
    <div
      ref={chatContainerRef}
      className="flex-1 overflow-y-auto mb-4 space-y-2 border rounded p-4 bg-gray-50"
      style={{ minHeight: "300px" }}
    >
      {mensajes.map((msg, index) => (
        <div
          key={index}
          className={`text-sm p-2 rounded-lg max-w-[80%] ${
            msg.rol === "Cliente"
              ? "bg-green-100 ml-auto text-right"
              : "bg-gray-200 text-left"
          }`}
        >
          <strong>{msg.rol}:</strong> {msg.texto}
        </div>
      ))}
      {cargando && (
        <p className="text-sm text-gray-500 italic">Agente escribiendo...</p>
      )}
    </div>

    {/* Input y botones */}
    <div className="flex items-center gap-2">
      <input
        value={entrada}
        onChange={(e) => setEntrada(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && enviarMensaje()}
        placeholder={chatBloqueado ? "El chat está cerrado, pedir al Mozo/a" : "Decí tu pedido o consulta"}
        className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" 
        disabled={chatBloqueado}
      />
      <button
        onClick={() =>enviarMensaje()}
        disabled={chatBloqueado}
  className={`px-4 py-2 text-white rounded ${
    chatBloqueado ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
  }`}
      >
        Enviar
      </button>
      <button
        onClick={escuchar}
        className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        🎤
      </button>
    </div>
  </div>
</div>

);
}

export default ChatModal;