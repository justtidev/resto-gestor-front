import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const FormularioMenu = () => {
    //hook de navegación programática, permite la navegación en respuesta a eventos
    const navigate = useNavigate();
    //Accede al parametro de la ruta 
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null)
    //Definimos un valor inicial con useState y con set podemos actualizar ese valor

    const [menuItem, setMenuItem] = useState({
        nombre: "",
        descripcionBreve: "",
        precio_item: 0,
        disponible: false,
        CategoriumId: "",

        

    });

    const [categoria, setCategoria] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(0);


    const obtenerCategorias = async () => {
        try {
            setLoading(true);
            const respuesta = await axios.get('/categoria/');
            console.log(respuesta);
            setCategoria(respuesta.data.data);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    }


    useEffect(() => {
        obtenerCategorias()

        console.log("id", id)



        if (id !== "nuevo") {
            const fetchMenuItem = async () => {
                try {
                    setLoading(true);
                    const respuesta = await axios.get('/menuItem/' + id);
                    setMenuItem(respuesta.data.data);
                    setCategoriaSeleccionada(respuesta.data.data.CategoriumId);
                    setLoading(false);
                } catch (error) {
                    setError(error.message);
                    setLoading(false);
                }
            };
            fetchMenuItem(id)
        }
        else {

            setMenuItem({
                nombre: "",
                descripcionBreve: "",
                precio_item: 0,
                disponible: false,
                CategoriumId: "",
            });
        }

    }, [id])

    const handleChange = (event) => {
        console.log(event.target.name, event.target.value);
        if (event.target.name === 'disponible') {
            setMenuItem({ ...menuItem, [event.target.name]: event.target.checked });
        } else {
            const { name, value } = event.target;
            setMenuItem({ ...menuItem, [name]: value });
        }
    };
    const handleSubmit = async (event) => {
        event.preventDefault();

        console.log('categoria ' + categoriaSeleccionada);

        menuItem.CategoriumId = categoriaSeleccionada;

        try {
            if (id === 'nuevo') {
                const respuesta = await axios.post('/menuItem', menuItem);

                console.log('llego' + respuesta.data);
                navigate('/admin/menuItem');
            } else {
                const respuesta = await axios.put('/menuItem/' + id, menuItem);
                console.log(respuesta.data);
                navigate('/admin/menuItem');
            }
        } catch (error) {
            setError(error.message);
        }

    };


    return (
          <div className="min-h-screen bg-gray-100 py-10">
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
        {categoria.id ? "Editar MenuItem" : "Crear MenuItem"}
        </h2>
            {loading ? (
                <p className="text-center text-gray-600">Cargando...</p>
            ) : (
                
                    <form
  className="space-y-6 max-w-md mx-auto px-4"
  onSubmit={handleSubmit}
>
  <div className="flex flex-col gap-4">
    <div className="flex flex-col">
      <label
        className="mb-2 text-sm font-bold text-gray-700"
        htmlFor="nombre"
      >
        Nombre
      </label>
      <input
        className="px-3 py-2 rounded-md border bg-transparent shadow-md focus:ring focus:ring-[#F4C430] focus:outline-none w-full"
        id="nombre"
        type="text"
        name="nombre"
        value={menuItem.nombre}
        onChange={handleChange}
      />
    </div>

    <div className="flex flex-col">
      <label
        className="mb-2 text-sm font-bold text-gray-700"
        htmlFor="descripcionBreve"
      >
        Descripción Breve
      </label>
      <textarea
        id="descripcionBreve"
        name="descripcionBreve"
        value={menuItem.descripcionBreve}
        onChange={handleChange}
        className="px-3 py-2 rounded-md border bg-transparent shadow-md focus:ring focus:ring-[#F4C430] focus:outline-none w-full resize-none"
        rows={4}
      />
    </div>

    <div className="flex flex-col">
      <label
        className="mb-2 text-sm font-bold text-gray-700"
        htmlFor="precio_item"
      >
        Precio
      </label>
      <input
        id="precio_item"
        type="number"
        name="precio_item"
        value={menuItem.precio_item}
        onChange={handleChange}
        className="px-3 py-2 rounded-md border bg-transparent shadow-md focus:ring focus:ring-[#F4C430] focus:outline-none w-full"
      />
    </div>

    <div className="flex flex-col">
      <label
        className="mb-2 text-sm font-bold text-gray-700"
        htmlFor="categoria"
      >
        Categoría
      </label>
      <select
        id="categoria"
        value={categoriaSeleccionada}
        onChange={(e) => setCategoriaSeleccionada(Number(e.target.value))}
        className="px-3 py-2 rounded-md border bg-transparent shadow-md focus:ring focus:ring-[#F4C430] focus:outline-none w-full"
      >
        {categoria.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.id} {cat.nombre}
          </option>
        ))}
      </select>
    </div>

    <div className="flex items-center gap-2">
      <input
        id="disponible"
        type="checkbox"
        name="disponible"
        checked={menuItem.disponible}
        onChange={handleChange}
        className="w-4 h-4 rounded border-gray-300 focus:ring focus:ring-[#F4C430]"
      />
      <label
        className="text-sm font-bold text-gray-700"
        htmlFor="disponible"
      >
        Disponible
      </label>
    </div>
  </div>

  {error && (
    <div className="text-red-500 text-sm mt-2">
      <p>Error: {error}</p>
    </div>
  )}

  <div className="flex justify-center space-x-4">
    <button
      className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md transition"
      type="submit"
    >
      Guardar
    </button>
    <button
      className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-md transition"
      type="button"
      onClick={() => navigate('/admin/menuItem')}
    >
      Cancelar
    </button>
  </div>
</form>

            )
            }
          </div> 
    </div>

    );


}

export default FormularioMenu;