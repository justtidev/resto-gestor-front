import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function FormularioMesa() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
     const [estado, setEstado] = useState("Libre");
    const [mesa, setMesa] = useState({
        nombre: '',
        estado: estado
    });
     
       const [estados, setEstados] = useState([]);
      


    const fetchMesa = async () => {
        try {
            setLoading(true);
            const respuesta = await axios.get('/mesa/' + id);
             setEstados(respuesta.data.estadosDisponibles);
            setMesa(respuesta.data.data);
            console.log("mesa", respuesta.data.data);
            setEstado(respuesta.data.data.estado);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };


    useEffect(() => {

        console.log("id", id)

        if (id === "nuevo") {

            setMesa({
                numero:'',
                estado:estado
            });

        }
         else {
            fetchMesa(id)
        }

    }, [id])

    const handleChange = (event) => {
        const { name, value } = event.target;
        setMesa({ ...mesa, [name]: value });
        if (name === "estado") {
            setEstado(value); // Actualiza el estado si el campo es "estado"
            console.log("Estado ", name, " cambiado a ", value );
        }
     
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            if (id === 'nuevo') {
                const respuesta = await axios.post('/mesa', mesa);
                console.log(respuesta.data);
                navigate('/admin/mesa');
            } else {
                const respuesta = await axios.put('/mesa/' + id, mesa);
                console.log(respuesta.data);
                navigate('/admin/mesa');
            }
        } catch (error) {
            setError(error.message);
        }
    };


   return (
  <div className="min-h-screen bg-gray-100 py-10">
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
        {mesa.id ? "Editar Mesa" : "Crear Nueva Mesa"}
      </h2>

      {loading ? (
        <p className="text-center text-gray-600">Cargando...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Número de mesa */}
          <div>
            <label htmlFor="numero" className="block text-sm font-medium text-gray-700">
              Número
            </label>
            <input
              id="numero"
              type="number"
              name="numero"
              value={mesa.numero}
              onChange={handleChange}
              placeholder="Número de mesa"
              className="mt-2 px-3 py-2 w-full rounded-md border bg-white shadow-sm focus:outline-none focus:ring focus:ring-[#F4C430]"
            />
          </div>

          {/* Estado */}
          <div>
            {id === "nuevo" ? (
              <p className="text-sm font-medium text-gray-700">El estado es 'Libre' por defecto</p>
            ) : (
              <>
                <label htmlFor="estado" className="block text-sm font-medium text-gray-700">
                  Estado
                </label>
                <select
                  id="estado"
                  name="estado"
                  value={estado}
                  onChange={handleChange}
                  className="mt-2 px-3 py-2 w-full rounded-md border bg-white shadow-sm focus:outline-none focus:ring focus:ring-[#F4C430]"
                >
                  {estados.map((estado) => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>

          {/* Código QR */}
          {mesa.qrBase64 && (
            <div className="text-center">
              <label className="block mb-2 text-sm font-medium text-gray-700">QR (no editable)</label>
              <div className="inline-block p-2 border rounded-lg shadow-md bg-white">
                <img
                  src={mesa.qrBase64}
                  alt={`QR Mesa ${mesa.numero}`}
                  className="w-36 h-36 object-contain"
                />
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="text-red-500 text-sm text-center">
              <p>Error: {error}</p>
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-center gap-4">
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md transition"
              type="submit"
            >
              Guardar
            </button>
            <button
              className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-md transition"
              type="button"
              onClick={() => navigate('/admin/mesa')}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  </div>
);

}
           
export default FormularioMesa;