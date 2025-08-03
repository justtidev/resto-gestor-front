import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function FormularioCategoria() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [categoria, setCategoria] = useState({
        nombre: '',
    });

    const fetchCategoria = async () => {
        try {
            setLoading(true);
            const respuesta = await axios.get('/categoria/' + id);
            setCategoria(respuesta.data.data);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };


    useEffect(() => {

        console.log("id", id)

        if (id === "nuevo") {

            setCategoria({
                nombre:'',
            });

        }
         else {
            fetchCategoria(id)
        }

    }, [id])

    const handleChange = (event) => {
        const { name, value } = event.target;
        setCategoria({ ...categoria, [name]: value });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            if (id === 'nuevo') {
                const respuesta = await axios.post('/categoria', categoria);
                console.log(respuesta.data);
                navigate('/admin/categoria');
            } else {
                const respuesta = await axios.put('/categoria/' + id, categoria);
                console.log(respuesta.data);
                navigate('/admin/categoria');
            }
        } catch (error) {
            setError(error.message);
        }
    };


    return (
         <div className="min-h-screen bg-gray-100 py-10">
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
        {categoria.id ? "Editar Categoria" : "Crear Nueva Categoria"}
        </h2>
            {loading ? (
                <p className="text-center text-gray-600">Cargando...</p>
            ) : (
           
                    <form onSubmit={handleSubmit}
                    className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                            <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="nombre">Nombre</label>
                        
                        <input
                            id="nombre"
                            type="text"
                            name="nombre"
                            value={categoria.nombre}
                            onChange={handleChange}

                           className="mt-2 px-2 block w-full rounded-md border bg-transparent shadow-md  focus:ring focus:ring-[#F4C430]"/>

  </div>
  </div>
             
             {error && (<div className="text-red-500 text-sm mt-2">
                <p>Error: {error}</p>
              </div>
            )}

                        <div className="flex justify-center bflex space-x-2">
                            <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md transition" type="submit" >Guardar</button>
                            <button
                                className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-md transition" 
                                type="button"
                                onClick={() => navigate('/admin/categoria')}
                            >
                                Cancelar
                            </button>
                        </div>
                    </form >
                 
            )
            }
        </div>
    </div>

    );

}


export default FormularioCategoria;