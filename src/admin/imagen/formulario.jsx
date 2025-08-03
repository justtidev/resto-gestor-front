import React,{ useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";



function FormularioImagen() {
    //hook de navegación programática, permite la navegación en respuesta a eventos
    const navigate = useNavigate();
    //Accede al parametro de la ruta
    const { id } = useParams();

    //Definimos un valor inicial con useState y con set podemos actualizar ese valor
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
   const [imagenes, setImagenes] = useState([]);    
    const [imagen, setImagen] = useState({
     
     nombre: '',
     ubicacion: '',
      MenuItemId:id ,
     
   });
   const fetchImagen = async () => {
    try {
      setLoading(true);
      const respuesta = await axios.get('imagen/menuitem/'+ id);
      console.log(respuesta);
      setImagenes(respuesta.data.data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

useEffect(() => {     
  fetchImagen();  
}, [id]);

const handleChange = (event) => {


  const { name, value } = event.target;
  setImagen({ ...imagen, [name]: value });
}
  
const handleSubmit = async (event) => {
event.preventDefault();
try {        
   imagen.MenuItemId = id;
    const respuesta = await axios.post('/imagen', imagen);
    console.log('******', imagen)
    console.log(respuesta.data);
    if (respuesta.status === 200 || respuesta.status === 201) {
      console.log('Imagen guardada con éxito');
      // Actualiza la lista de imagenes
      fetchImagen();
    } else {
      console.log('Error al guardar la imagen', respuesta.status);
    }
  } catch (error) {
    setImagen({nombre:"", ubicacion:"" });  
     navigate('/admin/imagen');
    console.log('Error al guardar la imagen', error);
}
};

  return (
    <>
    <div>
    <div>
    <div className='p-6 text-2xl font-bold text-center text-white bg-green-600'>
    { imagen.id ?  "Editar imagen" : "Crear nueva imagen"} 
    </div>
    {loading ? (
      <p>Cargando...</p>
    ) : (
      <div className="max-w-md p-5 mx-auto mt-10 bg-white rounded-lg shadow-md">
          
        <form onSubmit={handleSubmit}>
             <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="nombre">
            Nombre
            </label>
            <input
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              id="nombre"
              type="text"
              name="nombre"
              value={imagen.nombre}
              onChange={handleChange}
            />
            </div>
          <div className="mb-4">
            
            <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="ubicacion">
            Ubicacion:
            </label>
            <input
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              id="ubicacion"
              type="text"
              name="ubicacion"
              value={imagen.ubicacion}
              onChange={handleChange}
            />
          </div>
        
          
          
         
          
          <div className='flex justify-center'>

            <button
              className="px-4 py-2 mx-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Guardar
            </button>
            <button
              className="px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700 focus:outline-none focus:shadow-outline"
              type="button"
              onClick={() => navigate('/admin/imagen')}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>

    )}
    {error && <p style={{ color: 'green' }}>{error}</p>}
  </div>
     
   

  </div>
  </>
);
}

export default FormularioImagen;




    
   