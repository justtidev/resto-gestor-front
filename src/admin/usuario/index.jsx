import { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

import { FaEdit, FaTrashAlt, FaUserPlus } from 'react-icons/fa';


function UsuarioIndex() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [paginaActual, setPaginaActual] = useState(1);
  const [filtro, setFiltro] = useState('');

  const elementosPorPagina = 10;

  // Función para cargar los usuarios desde la API
  // y actualizar el estado de data 
const fetchUsuarios = async () => {
  try{
    setLoading(true);
    console.log("Token actual:", axios.defaults.headers.common['Authorization']);
    const respuesta = await axios.get('/usuario/');
    
     console.log("***", respuesta.data.data);
    
    setData(respuesta.data.data);
    setLoading(false)
      }catch (error){
        console.error("Error al cargar los usuarios:", error);
      setLoading(false);
      }
    }
    // useEffect para cargar los usuarios al montar el componente
  // y actualizar el estado de data
  useEffect(() => {
    fetchUsuarios();
   
  }, []);

  // Función para manejar la edición de un usuario
  const handleEdit = (id) => navigate(`/admin/usuario/${id}`);
  const borrarElemento = (id) => {
    if (window.confirm(`¿Desea borrar el usuario con id ${id}?`)) {
      axios.delete('/usuario/' + id).then(() => {
        setData(data.filter(u => u.id !== id));
      });
    }
  };

  // Filtrar los usuarios según el filtro de búsqueda
  // y paginar los resultados 
  const usuariosFiltrados = data.filter(
    u => `${u.nombre} ${u.apellido}`.toLowerCase().includes(filtro.toLowerCase())
  );

  const usuariosPagina = usuariosFiltrados.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );
console.log("UsuarioIndex montado")
  return (
    <div className=" bg-gray-50">
   
      <div className= "p-4 text-3xl font-medium text-center text-white bg-green-600 rounded-b-lg shadow">
        Gestión de Usuarios
      </div>

      <div className="flex justify-between items-center p-6">
        <input
          type="text"
          className="p-2 w-full max-w-sm border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Buscar por nombre o apellido"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />

        <button
          className="flex items-center gap-2 px-4 py-2 ml-6 font-normal text-white bg-green-600 rounded-md hover:bg-green-700"
          onClick={() => navigate(`/admin/usuario/nuevo`)}
        >
          <FaUserPlus /> Crear Usuario
        </button>
      </div>

      <div className="px-6 py-10 overflow-auto">
        {loading ? (
          <div className="text-center text-gray-600 py-10 animate-pulse">Cargando usuarios...</div>
        ) : (
          <table className="mx-auto text-center table-auto border border-gray-300 shadow-md min-w-[700px]">
            <thead className="bg-gray-800 text-white ">
              <tr className="font-normal">
               <th className="p-3">Id</th>
                <th className="p-3">Usuario</th>
                <th className="p-3">Nombre</th>
                <th className="p-3">Apellido</th>
                <th className="p-3">Rol</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {usuariosPagina.length ? usuariosPagina.map((u) => (
                <tr key={u.id} className="hover:bg-gray-500 transition odd:bg-gray-300">
                 <td className="p-3">{u.id}</td>
                  <td className="p-3">{u.usuario}</td>
                  <td className="p-3">{u.nombre}</td>
                  <td className="p-3">{u.apellido}</td>
                  <td className="p-3">{u.RolId}</td>
                  <td className="p-3 space-x-2">
                    <div
                      onClick={() => handleEdit(u.id)}
                      className="inline-flex items-center gap-1 px-3 py-1 text-green-600 rounded hover:bg-accent"
                      aria-label="Editar usuario"
                    >
                      <FaEdit title= "Editar" /> 
                    </div>
                    <div
                      onClick={() => borrarElemento(u.id)}
                      className="inline-flex items-center gap-1 px-3 py-1 text-textPrimary cursor-pointer rounded hover:bg-accent"
                      aria-label="Borrar usuario"
                    >
                      <FaTrashAlt  title= "Borrar" /> 
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">No se encontraron usuarios.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {/* Paginación */}
        <div className="flex justify-center mt-6">
          {Array.from({ length: Math.ceil(usuariosFiltrados.length / elementosPorPagina) }, (_, i) => (
            <button
              key={i}
              onClick={() => setPaginaActual(i + 1)}
              className={`mx-1 px-4 py-2 rounded ${paginaActual === i + 1 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UsuarioIndex;





/* import { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom"
import axios from 'axios';
import LayoutAdmin from '../LayoutAdmin';

function UsuarioIndex() {

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const [paginaActual, setPaginaActual] = useState(1);
    const [filtro, setFiltro] = useState('');

    const elementosPorPagina = 10;
   
    useEffect(() => {

        // se ejecuta al cargar el componente
        setLoading(true);

        cargarUsuarios();

    }, [])

    const cargarUsuarios = () => {
        axios.get('/usuario/').then((respuesta) => {
            console.log("***", respuesta)

            setLoading(false);
            if (respuesta.status === 200) {
                
                setData(respuesta.data.data)
            } else {
                console.log("error")
            }

        }).catch((error) => {
            console.log("error", error)
        });
    }
    const handleEdit = (id) => {
        navigate(`/admin/usuario/${id}`);
      };
 

    const borrarElementoDB = (id) => {
        axios.delete('/usuario/' + id).then((respuesta) => {
            console.log("***", respuesta)
            cargarUsuarios();
        }).catch((error) => {
            console.log("error", error)
        });



    }

    const borrarElemento = (id) => {
        console.log("borrar elemento", id);
        if (window.confirm(`¿Desea borrar el elemento con id ${id}?`)) {
            console.log("confirma borrar")
            borrarElementoDB(id);
        }
    }

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

        <div>
<LayoutAdmin/>

                <div className='p-6 text-2xl font-bold text-center text-white bg-green '>
                    Gestion de Usuarios
                </div>
                {console.log(loading)}
                {loading  ? 'Cargando...' : ''}
                <div className='flex justify-center w-full mt-10'>

               
                <div className='w-1/4'>
                        <input
                            type='text'
                            className='w-full p-2 mb-4 border border-gray-400 rounded'
                            placeholder='Buscar por apellido'
                            value={filtro}
                            onChange={(e) => setFiltro(e.target.value)}
                        />

                </div>

                <div className='ml-5'>
                    
                        <button className='p-2 bg-green-500 rounded-md hover:bg-green-700 hover:text-white ' onClick={()=> navigate("/register")}>Crear Usuario</button>
                    </div>
            </div>




            <div className='m-5'>
                <table className='w-full border border-collapse border-gray-400 table-auto  '>
                    <thead className=' bg-black'>
                        <tr className='font-thin  text-slate-200 m-4'>
                            <th className='p-3'>ID</th>
                            <th className='p-3'>Usuario</th>
                            <th className='p-3'>Nombre</th>
                            <th className='p-3'>Apellido</th>
                           
                            <th className='p-3'>Rol</th>
                            <th className='p-3'>Acciones</th>

                        </tr>
                      
                    </thead>
                    <tbody className='bg-slate-200 p-3'>
                        {filtrarElementosSegunPagina().filter((usuario) =>
                            usuario.nombre.toLowerCase().includes(filtro.toLowerCase())).map((usuario) => (
                                <tr key={usuario.id}>
                                    <td className='p-3'>{usuario.id}</td>
                                    <td className='p-3'>{usuario.usuario}</td>
                                    <td className='p-3'>{usuario.nombre}</td>
                                    <td className='p-3'>{usuario.apellido}</td>
                                   
                                    <td className='p-3'>{usuario.RolId}</td>

                                    <td className='flex m-2 gap-3 px-4'>
                                        
                                            <button className='"px-1 py-1 bg-green-600 rounded hover:bg-green-700 text-white flex items-center justify-center"' onClick={() => handleEdit(usuario.id) }>EDITAR</button> 
                                        
                                            <button className='p-1 text-white bg-red-500 rounded-md hover:bg-red-800' onClick={() => borrarElemento(usuario.id)}>
                                                BORRAR</button> </td>

                                </tr>
                            ))}
                    </tbody>

                </table>

            </div>

        <div>
      
        <div className='flex justify-center mt-5'>
        {filtrarElementosSegunPagina().filter((usuario) =>
          usuario.nombre.toLowerCase().includes(filtro.toLowerCase())
        ).length === 0 ? (
          <tr>
            <td colSpan={5} className='px-4 py-2 text-center border border-gray-400'>
              No se encontraron usuarios que coincidan con su búsqueda.
            </td>
          </tr>
        ) :
          <div  >
            {Array.from({ length: calcularCantidadPaginas() }, (_, i) => (
              <button
                key={i + 1}
                className={`mx-2 py-2 px-4 rounded ${paginaActual === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'
                  }`}
                onClick={() => cambiarPagina(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        }
      </div>
    </div>
  </div>
    )
}

export default UsuarioIndex; */