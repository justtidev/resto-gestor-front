import { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';

import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { Table2Icon } from 'lucide-react';
import { FaDownload } from 'react-icons/fa6';
import { IoPhonePortrait } from 'react-icons/io5';

function MesaIndex() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [paginaActual, setPaginaActual] = useState(1);
  const [filtro, setFiltro] = useState('');

  const elementosPorPagina = 10;
  const { userRole } = useContext(AuthContext);

  // Función para cargar los usuarios desde la API
  // y actualizar el estado de data 
const fetchMesas = async () => {
  try{
    setLoading(true);
    const respuesta = await axios.get('/mesa/');
     console.log("***", respuesta.data.data);
    
    setData(respuesta.data.data);
    setLoading(false)
      }catch (error){
        console.error("Error al cargar los usuarios:", error);
      setLoading(false);
      }
    }
    // useEffect para cargar las mesas al montar el componente
  // y actualizar el estado de data
  useEffect(() => {
    fetchMesas();
   
  }, []);

  // Función para manejar la edición de mesa
  const handleEdit = (id) => navigate(`/admin/mesa/${id}`);
  const borrarElemento = (id) => {
    if (window.confirm(`¿Desea borrar el usuario con id ${id}?`)) {
      axios.delete('/mesa/' + id).then(() => {
        setData(data.filter(u => u.id !== id));
      });
    }
  };

  // Filtrar los usuarios según el filtro de búsqueda
  // y paginar los resultados 
  const mesasFiltradas = data.filter(
    u => `${u.numero} ${u.estado}`.toLowerCase().includes(filtro.toLowerCase())
  );

  const mesasPagina = mesasFiltradas.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  function descargarTodosLosQR(mesas) {
  mesas.forEach((mesa) => {
    const enlace = document.createElement("a");
    enlace.href = mesa.qrBase64;
    enlace.download = `mesa-${mesa.numero}.png`;
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
  });
}

  return (
    <div className=" bg-gray-50">
    

      <div className= "p-4 text-3xl font-medium text-center text-white bg-green-600 rounded-b-lg shadow">
        Gestión de Mesas
      </div>

      <div className="flex justify-between items-center p-6">
        <input
          type="text"
          className="p-2  max-w-sm border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Buscar por número o estado"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />



{/*Crear Mesa*/}
<div className='flex items-center gap-2'>
  <div className="relative-group" >
        <button
          disabled={userRole === 3}
              onClick={() => userRole !== 3 && navigate(`/admin/mesa/nuevo`)}
              className={`flex items-center gap-2 px-4 py-2 ml-6 font-normal rounded-md
                ${userRole === 3
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-green-600 text-white hover:bg-green-700 hover:text-accent"
                }`}
            >
              <Table2Icon /> Crear Mesa
            </button>
            {userRole === 3 && (
              <span className="absolute left-1/2 -translate-x-1/2 mt-1 hidden group-hover:block text-xs bg-black text-white px-2 py-1 rounded shadow">
                No autorizado
              </span>
            )}
          </div>

         
          {/* Descargar todos los QR (siempre habilitado) */}
        
        <button
  onClick={() => descargarTodosLosQR(listaMesas)}
  className="flex items-center gap-2 px-4 py-2 font-normal bg-green-600 text-white rounded hover:bg-green-700  hover:text-accent"
>
 <FaDownload/> Descargar todos los QR
</button>
      </div>
</div>
{/* //TABLA */}
    <div className="px-6 py-10 overflow-auto">
  {loading ? (
    <div className="text-center text-gray-600 py-10 animate-pulse">Cargando ...</div>
  ) : (
    <div className="overflow-auto">
      <table className="mx-auto text-center table-auto border border-gray-300 shadow-md min-w-[700px]">
        <thead className="bg-gray-800 text-white">
          <tr className="font-normal">
            <th className="p-4">Número</th>
            <th className="p-4">Estado</th>
            <th className="p-4">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {mesasPagina.length ? mesasPagina.map((u) => (
            <tr key={u.id} className="hover:bg-gray-400 odd:bg-gray-300">
              <td className="p-3">{u.numero}</td>
              <td className="p-3">{u.estado}</td>
              <td className="p-3 flex items-center gap-2">
                <a
                  href={u.qrBase64}
                  download={`mesa-${u.numero}.png`}
                  className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded hover:text-accent text-sm"
                >
                  <FaDownload /> Descargar QR
                </a>
                 {/* Editar */}
                        <div className="relative group inline-block">
                          <button
                            disabled={userRole === 3}
                            onClick={() => userRole !== 3 && handleEdit(u.id)}
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded
                              ${userRole === 3
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-green-600 hover:bg-accent"
                              }`}
                          >
                            <FaEdit title="Editar" />
                          </button>
                          {userRole === 3 && (
                            <span className="absolute left-1/2 -translate-x-1/2 mt-1 hidden group-hover:block text-xs bg-black text-white px-2 py-1 rounded shadow">
                              No autorizado
                            </span>
                          )}
                        </div>

                        {/* Borrar */}
                        <div className="relative group inline-block">
                          <button
                            disabled={userRole === 3}
                            onClick={() => userRole !== 3 && borrarElemento(u.id)}
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded
                              ${userRole === 3
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-textPrimary hover:bg-accent"
                              }`}
                          >
                            <FaTrashAlt title="Borrar" />
                          </button>
                          {userRole === 3 && (
                            <span className="absolute left-1/2 -translate-x-1/2 mt-1 hidden group-hover:block text-xs bg-black text-white px-2 py-1 rounded shadow">
                              No autorizado
                            </span>
                          )}
      
                </div>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="3" className="p-4 text-center text-gray-500">
                No se encontraron mesas.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )}

  {/* Paginación */}
  <div className="flex justify-center mt-6">
    {Array.from({ length: Math.ceil(mesasFiltradas.length / elementosPorPagina) }, (_, i) => (
      <button
        key={i}
        onClick={() => setPaginaActual(i + 1)}
        className={`mx-1 px-4 py-2 rounded ${
          paginaActual === i + 1
            ? 'bg-green-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        {i + 1}
      </button>
    ))}
  </div>
</div>

    </div>
  );
}

export default MesaIndex;



