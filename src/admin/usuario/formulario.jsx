
 import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { useContext } from "react";

import axios from "axios";

const FormularioUsuario = ()=> {

    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null)
    const {register} = useContext(AuthContext);

    const [usuario, setUsuario] = useState({
        
        usuario: '',
        nombre: '',
        apellido: '',
        email: '',
        contraseña: '',
        RolId: '',
    });
    const [data, setData] = useState({});
    
    const [rol, setRol] = useState([]);
    const [rolSeleccionado, setRolSeleccionado] = useState(0);


    const obtenerRol = async () => {
        try {
            setLoading(true);
            const respuesta = await axios.get('/rol/');
            console.log("respuesta", respuesta);
            setRol(respuesta.data.data);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    }



        
    

    //Trae la data de la BD del objeto mediante metodo put, llamado por axios
    const fetchUsuario = async () => {
        try{
            setLoading(true);
            const respuesta = await axios.get('/usuario/' + id);
            setUsuario(respuesta.data.data);
            setRolSeleccionado(respuesta.data.data.RolId);
           setLoading(false);
        }catch (error){
            setError(error.message);
            setLoading(false);
        }
    };


    useEffect(() => {

        console.log("id", id)
        if (id=== "nuevo") {
        obtenerRol()
        }else {
        fetchUsuario(id)
        obtenerRol(id)
        }        
        
    }, [id])

    const handleChange = (event) => {
        console.log(event.target.name, event.target.value);
        if (event.target.name === 'disponible') {
            setUsuario({ ...usuario, [event.target.name]: event.target.checked });

        } else {
            const { name, value } = event.target;
            setUsuario({ ...usuario, [name]: value });
          
        }
    };
      const handleSubmit = async (event) => {
        event.preventDefault();
try {
            if (id === 'nuevo') {
                console.log("rol", rolSeleccionado)
        usuario.RolId= rolSeleccionado;
        console.log("usuario", usuario);
        if (!usuario.usuario || !usuario.nombre || !usuario.apellido || !usuario.email || !usuario.contraseña) 
            setError("Por favor, completa todos los campos.");
                const respuesta = await register( usuario);
                console.log("respuesta", respuesta);
                // Si es un nuevo usuario, redirige a la lista de usuarios 
                alert("Usuario creado correctamente");                 
                navigate('/admin/usuario');
            } else {
                const respuesta = await axios.put('/usuario/' + id, usuario);
                console.log(respuesta.data);
                alert("Usuario actualizado correctamente");
                navigate('/admin/usuario');
            }
        } catch (error) {
            setError(error.message);
            console.error("Error al guardar el usuario:", error);
        }

    };


    
return (
  <div className="min-h-screen bg-gray-100 py-10">
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
        {usuario.id ? "Editar Usuario" : "Crear Nuevo Usuario"}
      </h2>

      {loading ? (
        <p className="text-center text-gray-600">Cargando...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="usuario" className="block text-sm font-medium  text-gray-700">
                Usuario
              </label>
              <input
                id="usuario"
                name="usuario"
                type="text"
                value={usuario.usuario}
                onChange={handleChange}
                 placeholder="Nombre de usuario"
                className="mt-2 px-2 block w-full rounded-md border bg-transparent shadow-md  focus:ring focus:ring-[#F4C430]"
              />
            </div>
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                Nombre
              </label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                value={usuario.nombre}
                onChange={handleChange}
                placeholder="Nombre"
                className="mt-2 px-2 block w-full rounded-md border bg-transparent  border-spacing-x-0.5 shadow-md 
               focus:ring focus:ring-[#F4C430]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="apellido" className="block text-sm font-medium text-gray-700">
              Apellido
            </label>
            <input
              id="apellido"
              name="apellido"
              type="text"
              value={usuario.apellido}
              onChange={handleChange}
              placeholder="Apellido"
              className="mt-2 px-2 block w-full rounded-md border bg-transparent shadow-md  focus:ring focus:ring-[#F4C430]"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={usuario.email}
              onChange={handleChange}
              placeholder="Email"
              autoComplete="email"

              className="mt-2 px-2 block w-full rounded-md border bg-transparent shadow-md  focus:ring focus:ring-[#F4C430]"
            />
          </div>

          <div>
            <label htmlFor="contraseña" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              id="contraseña"
              name="contraseña"
              type="password"
              value={usuario.contraseña}
              onChange={handleChange}
              placeholder="********"
              autoComplete="new-password"
              className="mt-2 px-2 block w-full rounded-md border bg-transparent shadow-md  focus:ring focus:ring-[#F4C430]"
            />
          </div>

          <div>
            <label htmlFor="rol" className="block text-sm font-medium text-gray-700">
              Rol
            </label>
            <select
              id="rol"
              name="rol"
              value={rolSeleccionado}
              onChange={(e) => setRolSeleccionado(Number(e.target.value))}
              className="m-2 block w-full rounded-md border bg-transparent shadow-md  focus:ring focus:ring-[#F4C430]"
            >
              <option value={0} disabled>Selecciona un rol</option>
              {rol.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.nombre}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div className="flex justify-center gap-4">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md transition"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/usuario')}
              className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-md transition"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  </div>
);}
export default FormularioUsuario