import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/comanda/Header";
import CategorySidebar from "../components/comanda/CategorySidebar";
import ProductModal from "../components/comanda/ProductModal";
import OrderSummary from "../components/comanda/OrderSummary";
import ActionButtons from "../components/comanda/ActionButtons";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";


const Comanda = () => {
  const { id:mesaId } = useParams();
  const [selectedCategory, setSelectedCategory] = useState("Hamburguesa");
  const [categorias, SetCategorias] = useState([]); // Estado para categorías del backend
  const [searchQuery, setSearchQuery] = useState("");
  const [orderItems, setOrderItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [verDisponibles, setVerdisponibles] = useState(true);
  const [data, setData] = useState([]); // Estado para productos del backend
  const [cantidadItems, setCantidadItems] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(true);
  const { userName, userRole } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [comandaExistente, setComandaExistente] = useState(null);


  const buscarItems = async () => {
    try {
      const respuesta = await axios.get(
        `/menuItem/lista?filtro=${searchQuery}&categoria=${selectedCategory}`
      );

      if (respuesta.status === 200)
        console.log("respuesta menuItems", respuesta);

      setData(respuesta.data.data);
      setError(null);
    } catch (err) {
      console.error("error al buscar items", err);
      setError("Error al cargar los items");
    } finally {
      setLoading(false);
    }
  };

  const cargarCategorias = () => {
    axios
      .get("/categoria/")
      .then((respuesta) => {
        if (respuesta.status === 200) {
          console.log("respuesta cargarCategorias", respuesta.data.data);
          SetCategorias(respuesta.data.data);

          setLoading(false);
        } else {
          console.log("error");
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  useEffect(() => {
    setLoading(true);
    //console.log("inicia busqueda")
    buscarItems();
    //buscar categorias
    cargarCategorias();
  }, []);

  useEffect(() => {
  const buscarComandaActiva = async () => {
    try {
      const response = await axios.get(`/comanda/mesa/${mesaId}`);
      if (response.data?.data) {
        const comanda = response.data.data;
        setComandaExistente(comanda);
        console.log("Comanda activa encontrada:", comanda);
 /* if (comandaExistente.estado_Comanda === "Liberada") {
    setOrderItems([])
  } */
        // Transformar ítems para usarlos en orderItems
        const itemsTransformados = comanda.ComandaItems.map((item) => ({
          id: item.MenuItem.id,
          name: item.MenuItem.nombre,
          quantity: item.cantidad,
          comments: item.observaciones,
          price: parseFloat(item.precio_subtotal) / item.cantidad,
        }));

        setOrderItems(itemsTransformados);
      }
    } catch (error) {
      console.log("No hay comanda activa, se puede crear una nueva.");
    }
  };

  buscarComandaActiva();
}, [mesaId]);

  const addToOrder = (product) => {
    console.log("Adding to order:", product);
    const existingItem = orderItems.find((item) => item.id === product.id);
    if (existingItem) {
      setOrderItems(
        orderItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setOrderItems([
        ...orderItems,
        {
          ...product,
          quantity: 1,
          comments: "",

          // Normalizamos los nombres de propiedades para el carrito
          name: product.nombre,
          price: parseFloat(product.precio_item),
        },
      ]);
    }
  };

  const updateOrderItem = (productId, quantity, comments) => {
    console.log(
      "Updating order item:",
      productId,
      "quantity:",
      quantity,
      "comments:",
      comments
    );

    if (quantity <= 0) {
      console.log("Removing item from order:", productId);
      setOrderItems((prev) => prev.filter((item) => item.id !== productId));
    } else {
      const existingItem = orderItems.find((item) => item.id === productId);
      if (existingItem) {
        console.log("Updating existing item");
        setOrderItems((prev) =>
          prev.map((item) =>
            item.id === productId ? { ...item, quantity, comments } : item
          )
        );
      } else {
        console.log("Adding new item to order");
        const product = data.find((p) => p.id === productId);
        if (product) {
          setOrderItems((prev) => [
            ...prev,
            {
              ...product,
              quantity,
              comments,
              // Normalizamos los nombres de propiedades para el carrito
              name: product.nombre,
              price: parseFloat(product.precio_item),
            },
          ]);
        } else {
          console.error("Product not found:", productId);
        }
      }
    }
  };

  const openModal = () => {
    console.log("Opening modal");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    console.log("Closing modal");
    setIsModalOpen(false);
  };

  // Mostrar loading o error
  if (loading) {
    return (
      <div className="min-h-screen bg-cream font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-textSecondary">Cargando productos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cream font-sans flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={buscarItems} className="btn-primary">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  console.log("Current order items:", orderItems);
  console.log("Modal state:", isModalOpen);


  return (
    <div className=" min-h-screen bg-cream font-sans">
      <Header
        tableNumber={mesaId}
        waiterName={userName}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchClick={openModal}
      />

      <div className="flex">
        <main className="flex-1 p-6 pb-32">
          <OrderSummary
            data={data}
            comandaExistente={comandaExistente}
            orderItems={orderItems}
            updateOrderItem={updateOrderItem}
          />

          <ActionButtons orderItems={orderItems} tableNumber={mesaId} comandaExistente={comandaExistente}  />
        </main>
        <div className="flex">
          <CategorySidebar
            menuItems={data}
            categorias={categorias}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onCategoryClick={openModal}
          />
        </div>
        <ProductModal
          menuItems={data}
          categorias={categorias}
          isOpen={isModalOpen}
          onClose={closeModal}
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          orderItems={orderItems}
          addToOrder={addToOrder}
          updateOrderItem={updateOrderItem}
        />
        
      </div>
    </div>
  );
};

export default Comanda;
