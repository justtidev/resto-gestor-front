import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from '../../contexts/AuthContext';
import { BiCategory } from "react-icons/bi";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
function CategoriaIndex() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [paginaActual, setPaginaActual] = useState(1);
  const [filtro, setFiltro] = useState("");
   const { userRole } = useContext(AuthContext);

  const elementosPorPagina = 10;

  useEffect(() => {
    // se ejecuta al cargar el componente
    setLoading(true);

    cargarCategorias();
  }, []);

  const cargarCategorias = () => {
    axios
      .get("/categoria/")
      .then((respuesta) => {
        console.log("***", respuesta);

        setLoading(false);
        if (respuesta.status === 200) {
          console.log("respuesta correcta", respuesta.data.data);
          setData(respuesta.data.data);
        } else {
          console.log("error");
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const borrarElementoDB = (id) => {
    axios
      .delete("/categoria/" + id)
      .then((respuesta) => {
        console.log("***", respuesta);
        cargarCategorias();
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const borrarElemento = (id) => {
    console.log("borrar elemento", id);
    if (window.confirm(`¿Desea borrar el elemento con id ${id}?`)) {
      console.log("confirma borrar");
      borrarElementoDB(id);
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
    <div className="min-h-screen bg-gray-50">
     
      <div className="p-4 text-3xl font-medium text-center text-white bg-green-600 rounded-b-lg shadow">
        Gestion de Categorias
      </div>
      <div className="flex justify-between items-center p-6">
        <input
          type="text"
          className="p-2 w-full max-w-sm border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Buscar por número o estado"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />

        <button
          className="flex items-center gap-2 px-4 py-2 ml-6 font-normal text-white bg-green-600 rounded-md hover:bg-green-700 hover:text-accent"
          onClick={() => userRole !== 3 && navigate("/admin/categoria/nuevo")}
          disabled={userRole === 3}
        >
          <BiCategory /> Crear Categoria
        </button>
          {userRole === 3 && (
    <span className="absolute left-1/2 -translate-x-1/2 mt-1 hidden group-hover:block text-xs bg-black text-white px-2 py-1 rounded shadow">
      No autorizado
    </span>
  )}
      </div>
      {/* TABLA */}
      <div className="px-6 py-10 overflow-auto">
        {loading ? (
          <div className="text-center text-gray-600 py-10 animate-pulse">
            Cargando ...
          </div>
        ) : (
          <table className="mx-auto text-center table-auto border border-gray-300 shadow-md min-w-[700px]">
            <thead className="bg-gray-800 text-white ">
              <tr className="font-normal ">
                <th className="p-3">Nombre</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtrarElementosSegunPagina()
                .filter((categoria) =>
                  categoria.nombre.toLowerCase().includes(filtro.toLowerCase())
                )
                .map((categoria) => (
                  <tr
                    className="hover:bg-gray-400 odd:bg-gray-300"
                    key={categoria.id}
                  >
                    <td className=" p-3">{categoria.nombre}</td>

                    <td className="p-3 ">
                      <div
                        className="inline-flex items-center gap-1 px-3 py-1 text-green-600 cursor-pointer rounded hover:bg-accent"
                        onClick={() =>
                           userRole !== 3 && navigate("/admin/categoria/" + categoria.id)
                        }
                        disabled={userRole === 3} // 🔒 deshabilita edición
                      >
                        <FaEdit title= "Editar" />
                      </div>
                        {userRole === 3 && (
    <span className="absolute left-1/2 -translate-x-1/2 mt-1 hidden group-hover:block text-xs bg-black text-white px-2 py-1 rounded shadow">
      No autorizado
    </span>
  )}
                      <div
                        className={`inline-flex items-center gap-1 px-3 py-1 text-textPrimary cursor-pointer rounded ${
                        userRole === 3
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-textPrimary hover:bg-accent"
                      }`}
                        onClick={() => userRole !== 3 && borrarElemento(categoria.id)}
                        disabled={userRole === 3} // 🔒 deshabilita borrar
                      >
                        <FaTrashAlt  title= "Borrar"/>
                      </div>
                        {userRole === 3 && (
    <span className="absolute left-1/2 -translate-x-1/2 mt-1 hidden group-hover:block text-xs bg-black text-white px-2 py-1 rounded shadow">
      No autorizado
    </span>
  )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
        <div className="flex justify-center mt-6">
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
      </div>
    </div>
  );
}

export default CategoriaIndex;
