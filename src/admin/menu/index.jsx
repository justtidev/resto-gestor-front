import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";

import { Utensils } from "lucide-react";
import { FaCamera, FaCheck, FaEdit, FaImage, FaTrashAlt } from "react-icons/fa";
import { MdUploadFile } from "react-icons/md";
import { FaCircleCheck } from "react-icons/fa6";

function MenuIndex() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const elementosPorPagina = 10;
  const [paginaActual, setPaginaActual] = useState(1);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    // se ejecuta al cargar el componente
    setLoading(true);
    console.log(loading);
    axios
      .get("/menuItem/")
      .then((respuesta) => {
        setLoading(false);
        console.log("index menu item", respuesta);
        if (respuesta.status === 200) {
          setData(respuesta.data.data);
        } else {
          console.log("error");
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, []);

  const handleInsImg = (id) => {
    navigate(`/admin/imagen/menuItem/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/admin/menuItem/${id}`);
  };
  const eliminarMenuItem = (id) => {
    axios
      .delete(`/menuItem/${id}`)
      .then((respuesta) => {
        if (respuesta.status === 200) {
          console.log("MenuItem eliminado con éxito");
          // Actualiza la lista de menuItems
          axios
            .get("/menuItem/")
            .then((respuesta) => {
              setData(respuesta.data.data);
            })
            .catch((error) => {
              console.log("Error al actualizar la lista de menuItems", error);
            });
        } else {
          console.log("Error al eliminar el menuItem", respuesta.status);
        }
      })
      .catch((error) => {
        console.log("Error al eliminar el menuItem", error);
      });
  };

  const handleDelete = (id) => {
    // Implementar lógica para eliminar un menuItem
    console.log(`Eliminar menuItem con id ${id}`);
    if (window.confirm(`¿Está seguro de eliminar el menuItem con id ${id}?`)) {
      eliminarMenuItem(id);
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
    <>
      <div className=" bg-gray-50">
        <div className="p-4 text-3xl font-medium text-center text-white bg-green-600 rounded-b-lg shadow">
          Gestion de MenuItems
        </div>

        <div className="flex items-center justify-between p-6">
          <input
            type="text"
            className="p-2 w-full max-w-sm border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Buscar por nombre"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
          <div className="relative group">
            <button
              disabled={userRole === 3}
              onClick={() =>
                userRole !== 3 && navigate(`/admin/menuItem/nuevo`)
              }
              className={`flex items-center gap-2 px-4 py-2 ml-6 font-normal rounded-md 
                ${
                  userRole === 3
                    ? "bg-gray-600 cursor-not-allowed text-white"
                    : "bg-green-600 text-white hover:bg-green-700 hover:text-accent"
                }`}
            >
              <Utensils /> Crear MenuItem
            </button>
            {userRole === 3 && (
              <span className="absolute left-1/2 -translate-x-1/2 mt-1 hidden group-hover:block text-xs bg-black text-white px-2 py-1 rounded shadow">
                No autorizado
              </span>
            )}
          </div>
        </div>

        <div className="px-6 py-10 overflow-auto">
          {loading ? (
            <div className="text-center text-gray-600 py-10 animate-pulse">
              Cargando...
            </div>
          ) : (
            <table className="mx-auto text-center  border-gray-400 table-auto shadow-md">
              <thead className="bg-gray-800 text-white ">
                <tr className="font-normal">
                  <th className="p-3">Nombre</th>

                  <th className="p-3">Precio</th>

                  <th className="p-3">Categoria</th>
                  <th className="p-3">Disponible</th>
                  <th className="p-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white ">
                {filtrarElementosSegunPagina()
                  .filter((menuItem) =>
                    menuItem.nombre.toLowerCase().includes(filtro.toLowerCase())
                  )
                  .map((menuItem) => (
                    <tr
                      className="  text-center hover:bg-gray-400 odd:bg-gray-300 transition duration-200 ease-in-out"
                      key={menuItem.id}
                    >
                      <td className="p-3 text-center">{menuItem.nombre}</td>

                      <td className="p-3 text-center">
                        {menuItem.precio_item}
                      </td>
                      <td className="p-3 text-center">
                        {menuItem.Categorium.nombre}
                      </td>
                      {menuItem.disponible ? (
                        <td className="p-3 text-center">
                          {" "}
                          <div className="inline-flex items-center gap-3">
                            {" "}
                            <FaCircleCheck className="text-green-600" />{" "}
                          </div>{" "}
                        </td>
                      ) : (
                        <td className="p-3 text-black text-center ">
                          {" "}
                          <div className="flex justify-center items-center gap-3"></div>{" "}
                          <FaTimes />{" "}
                        </td>
                      )}

                      {/* Acciones */}
                      <td className="flex m-2 gap-3 px-4">
                        {/* Editar */}
                         <div className="relative group inline-block">
                        <div
                          disabled={userRole === 3}
                            onClick={() => userRole !== 3 && handleEdit(menuItem.id)}
                            className={`inline-flex items-center gap-3 px-3 py-1 rounded 
                              ${userRole === 3
                                ? "text-gray-600 cursor-not-allowed"
                                : "text-green-600 hover:bg-accent"
                              }`}
                         
                        >
                          <FaEdit title="Editar" />
                        </div>
                         {userRole === 3 && (
                            <span className="absolute left-1/2 -translate-x-1/2 mt-1 hidden group-hover:block text-xs bg-black text-white px-2 py-1 rounded shadow">
                              No autorizado
                            </span>
                          )}
                        </div>
                        
                        {/* ESTO ERA PARA SUBIR LA IMAGEN DESDE EL PRODUCTO */}
                          <div className="relative group inline-block">
                        <div
                          onClick={() => userRole !== 3 && handleInsImg(menuItem.id)}
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded
                              ${userRole === 3
                                ? "text-gray-600 cursor-not-allowed"
                                : "text-blue-600 hover:bg-accent"
                              }`}
                          >
                            <FaCamera />
                          </div>
                          {userRole === 3 && (
                            <span className="absolute left-1/2 -translate-x-1/2 mt-1 hidden group-hover:block text-xs bg-black text-white px-2 py-1 rounded shadow">
                              No autorizado
                            </span>
                          )}
                        </div>
                        {/* Borrar */}
                        <div className="relative group inline-block">
                        <div
                          disabled={userRole === 3}
                            onClick={() => userRole !== 3 && handleDelete(menuItem.id)}
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded 
                              ${userRole === 3
                                ? "text-gray-600 cursor-not-allowed"
                                : "text-textPrimary hover:bg-accent"
                              }`}
                          >
                            <FaTrashAlt title="Borrar" />
                          </div>
                          {userRole === 3 && (
                            <span className="absolute left-1/2 -translate-x-1/2 mt-1 hidden group-hover:block text-xs bg-black text-white px-2 py-1 rounded shadow">
                              No autorizado
                            </span>
                          )}
                        </div>
                        
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex justify-center mt-5">
          {filtrarElementosSegunPagina().filter((menuItem) =>
            menuItem.nombre.toLowerCase().includes(filtro.toLowerCase())
          ).length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="px-4 py-2 text-center border border-gray-400"
              >
                No se encontraron menuItems que coincidan con su búsqueda.
              </td>
            </tr>
          ) : (
            <div>
              {Array.from({ length: calcularCantidadPaginas() }, (_, i) => (
                <button
                  key={i + 1}
                  className={`mx-2 py-2 px-4 rounded ${
                    paginaActual === i + 1
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => cambiarPagina(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default MenuIndex;
