import { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useLogout } from "../hooks/useLogout";
import useVolverDashboard from "../hooks/useVolverDashboard";
import { ArrowLeft } from "lucide-react"; // Opcional para

const Register = () => {
  const [usuario, setUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [RolId, setRolId] = useState(2);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register(usuario, contraseña, nombre, apellido, email, RolId);
      navigate("/login");
    } catch (error) {
      setError(error);
      console.error("Error de registro:", error);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 py-10">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
            Registro
          </h2>
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="usuario"
                  className="block text-sm font-medium  text-gray-700"
                >
                  Usuario
                </label>

                <input
                  id="usuario"
                  name="usuario"
                  type="text"
                  placeholder="usuario"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  className="mt-2 px-2 block w-full rounded-md border bg-transparent shadow-md  focus:ring focus:ring-[#F4C430]"
                />
              </div>
              <div>
                <label
                  htmlFor="nombre"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nombre
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Nombre"
                  className="mt-2 px-2 block w-full rounded-md border bg-transparent  border-spacing-x-0.5 shadow-md 
               focus:ring focus:ring-[#F4C430]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="apellido"
                className="block text-sm font-medium text-gray-700"
              >
                Apellido
              </label>
              <input
                id="apellido"
                name="apellido"
                type="text"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                placeholder="Apellido"
                className="mt-2 px-2 block w-full rounded-md border bg-transparent shadow-md  focus:ring focus:ring-[#F4C430]"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                className="mt-2 px-2 block w-full rounded-md border bg-transparent shadow-md  focus:ring focus:ring-[#F4C430]"
              />
            </div>

            <div>
              <label
                htmlFor="contraseña"
                className="block text-sm font-medium text-gray-700"
              >
                Contraseña
              </label>

              <input
                id="contraseña"
                name="contraseña"
                type="contraseña"
                placeholder="Contraseña"
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <div className="flex justify-center gap-4">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md transition"
              >
                Registrarse
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/usuario")}
                className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-md transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
