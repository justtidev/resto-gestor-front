import { useEffect, useState, useContext } from "react";

import { AuthContext } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { ImageIcon } from "lucide-react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useParams } from "react-router-dom";

function ImagenIndex() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [paginaActual, setPaginaActual] = useState(1);
  const [filtro, setFiltro] = useState("");
  const elementosPorPagina = 10;
  const { userRole } = useContext(AuthContext);
  useEffect(() => {
    setLoading(true);
    axios
      .get("/imagen/")
      .then((respuesta) => {
        setLoading(false);
        if (respuesta.status === 200) {
          setData(respuesta.data.data);
          console.log("Imagen", respuesta);
        } else {
          console.log("error");
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, []);

  const handleEdit = (id) => {
    navigate(`/admin/imagen/${id}`);
  };

  const eliminarImagen = (id) => {
    axios
      .delete(`/imagen/${id}`)
      .then((respuesta) => {
        if (respuesta.status === 200) {
          console.log("Imagen eliminada con éxito");
          // Actualiza la lista de libros
          axios
            .get("/imagen/")
            .then((respuesta) => {
              setData(respuesta.data.data);
              // navigate('/admin/producto');
            })
            .catch((error) => {
              console.log("Error al actualizar la lista de imagen", error);
            });
        } else {
          console.log("Error al eliminar la imagen", respuesta.status);
        }
      })
      .catch((error) => {
        console.log("Error al eliminar la imagen", error);
      });
  };

  const handleDelete = (id) => {
    // Implementar lógica para eliminar una imagen
    console.log(`Eliminar imagen con id ${id}`);
    if (window.confirm(`¿Está seguro de eliminar la imagen con id ${id}?`)) {
      eliminarImagen(id);
    }
  };
  const cambiarPagina = (pagina) => {
    setPaginaActual(pagina);
  };

  const calcularCantidadPaginas = () => {
    return Math.ceil(data.length / elementosPorPagina);
  };

  const filtrarElementosSegunPagina = () => {
    const inicio = (paginaActual - 1) * elementosPorPagina;
    const fin = inicio + elementosPorPagina;
    return data.slice(inicio, fin);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="p-4 text-3xl font-medium text-center text-white bg-green-600 rounded-b-lg shadow">
        Gestion de Imagenes
      </div>

      <div className="flex justify-between items-center p-6">
        <input
          type="text"
          className="p-2 w-full max-w-sm border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Buscar imagen"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
        {/* Las IMAGENES nuevas se cargan desde menuitems */}
        {/*  <div className="relative group">
        <button
          className={`flex items-center gap-2 px-4 py-2 ml-6 font-normal rounded-md 
              ${userRole === 3
                ? "bg-gray-600 cursor-not-allowed text-white"
                : "bg-green-600 text-white hover:bg-green-700 hover:text-accent"
              }`}
           disabled={userRole === 3}
          onClick={() => navigate(`/admin/imagen/nuevo`)}
        >
          <ImageIcon /> Crear Imagen
        </button>
         {userRole === 3 && (
            <span className="absolute left-1/2 -translate-x-1/2 mt-1 hidden group-hover:block text-xs bg-black text-white px-2 py-1 rounded shadow">
              No autorizado
            </span>
          )}
      </div> */}
      </div>
      
      {/* TABLA  */}
      <div className="px-6 py-10 overflow-auto">
        {loading ? (
          <div className="text-center text-gray-600 py-10 animate-pulse">
            Cargando...
          </div>
        ) : (
          <div className="overflow-auto">
          <table className="mx-auto text-center table-auto border border-gray-300 shadow-md min-w-[700px]">
            <thead className="bg-gray-800 text-white ">
              <tr className="font-normal">
                <th className="p-3">Nombre</th>
                {/*    <th className='px-4 py-2 border-2 border-gray-200'>Ubicacion</th> */}

                <th className="p-3">Producto</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {
                filtrarElementosSegunPagina()
                  .filter((imagen) =>
                    imagen.ubicacion
                      .toLowerCase()
                      .includes(filtro.toLowerCase())
                  )
                  .map((imagen) => (
                    <tr
                      className="hover:bg-gray-400 odd:bg-gray-300 transition duration-200 ease-in-out "
                      key={imagen.id}
                    >
                      <td className="p-3">{imagen.nombre}</td>
                      {/*    <td className='border border-gray-200 text-center '>{imagen.ubicacion}</td> */}

                      <td className="p-3">{imagen.MenuItem.nombre}</td>

                      <td className="p-3">
                        {/* Editar */}
                        <div className="relative group inline-block">
                        <button
                           disabled={userRole === 3} 
                            onClick={() => userRole !== 3 && handleEdit(imagen.id)}
                          className={`inline-flex items-center gap-1 px-3 py-1 bg-transparent
                          ${
        userRole === 3
          ? "text-gray-600 cursor-not-allowed"
          : "text-blue-600 hover:bg-accent"
      }`}
                         
                        >
                          <FaEdit title="Editar" />
                        </button>
                         {userRole === 3 && (
                            <span className="absolute left-1/2 -translate-x-1/2 mt-1 hidden group-hover:block text-xs bg-black text-white px-2 py-1 rounded shadow z-10 ">
                              No autorizado
                            </span>
                          )}
                        </div>
                        {/* Borrar */}
                         <div className="relative group inline-block">
                          <button
                            disabled={userRole === 3} 
                                onClick={() =>  userRole !== 3 &&  handleDelete(imagen.id)}
                               className={`inline-flex items-center gap-1 px-3 py-1 rounded bg-transparent
      ${
        userRole === 3
          ? "text-gray-600 cursor-not-allowed"
          : "text-textPrimary hover:bg-accent"
      }`}
                        
                          >
                            <FaTrashAlt title="Borrar" />
                          </button>
                          {userRole === 3 && (
                            <span className="absolute left-1/2 -translate-x-1/2 mt-1 hidden group-hover:block text-xs bg-black text-white px-2 py-1 rounded shadow z-10">
                              No autorizado
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  )) }
                  {/*  : (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">No se encontraron imagenes.</td>
                </tr>
           ) */}
                
            </tbody>
          </table>
          </div>
        )}

        {/* Paginación */}
        <div className="flex justify-center mt-6">
          {Array.from({ length: calcularCantidadPaginas() }, (_, i) => (
            <button
              key={i + 1}
              className={`mx-2 py-2 px-4 rounded ${
                paginaActual === i + 1
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => cambiarPagina(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  
  );
}

export default ImagenIndex;
