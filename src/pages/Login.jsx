import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Info } from 'lucide-react';

const Login = () => {
  const [usuario, setUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');
  const [formTried, setFormTried] = useState(false); // 👈 solo se activa al enviar
  const { login, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setFormTried(true); // Marca que se intentó enviar el formulario

    if (!usuario || !contraseña) {
      setError("Por favor complete todos los campos.");
      return;
    }

    if (usuario.length < 4 || contraseña.length < 4) {
      setError("Los campos deben tener al menos 4 caracteres.");
      return;
    }

    try {
      await login(usuario, contraseña);
      navigate('/dashboard');
    } catch (error) {
      setError("Usuario o contraseña incorrectos.");
      console.error("Error al loguearse:", error);
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFDF7] p-4">
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden flex flex-col md:flex-row max-w-4xl w-full">
        <div className="hidden md:block md:w-1/2">
          <img
            src="https://images.pexels.com/photos/2741461/pexels-photo-2741461.jpeg"
            alt="Comida"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-bold text-[#5D4037] mb-6 text-center">Iniciar Sesión</h2>
         
         
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="usuario" className="block text-sm font-medium text-[#212121] mb-1">Usuario</label>
              <div className="flex items-center border rounded-lg px-3 py-2 bg-[#F5F5DC]">
                <User className="text-[#757575] mr-2" size={18} />
                <input
                  id="usuario"
                  type="text"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  className="w-full bg-transparent outline-none text-[#212121]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="contraseña" className="block text-sm font-medium text-[#212121] mb-1">Contraseña</label>
              <div className="flex items-center border rounded-lg px-3 py-2 bg-[#F5F5DC]">
                <Lock className="text-[#757575] mr-2" size={18} />
                <input
                  id="contraseña"
                  type="password"
                  value={contraseña}
                  onChange={(e) => setContraseña(e.target.value)}
                  className="w-full bg-transparent outline-none text-[#212121]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#F4C430] text-[#212121] py-2 px-4 rounded-lg font-semibold hover:bg-[#e6b800] transition"
            >
              Iniciar Sesión
            </button>

            {formTried && error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}

               {/* 🔑 Info para reclutadores */}
          <div className="bg-[#F5F5DC] border border-[#E6E6E6] rounded-lg py-2 px-4 mb-1 flex items-center gap-2">
            <Info className="text-[#5D4037]" size={20} />
            <div className="text-sm text-[#212121]">
              <p><span className="font-semibold">Usuario:</span> demo</p>
              <p><span className="font-semibold">Contraseña:</span> 1234</p>
            </div>
          </div>

            {/* <div className="text-center">
              <Link to="/recuperar" className="text-sm text-[#757575] hover:underline">
                ¿Olvidó su contraseña?
              </Link>
            </div> */}
          </form>
        
       
         
       </div>
        </div>
    </div>
  );
};

export default Login;
