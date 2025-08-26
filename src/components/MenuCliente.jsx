import React, { useEffect, useState } from 'react';
import { Utensils } from 'lucide-react';
import Header from '../components/menu/Header';
import CategoryNav from '../components/menu/CategoryNav';
import MenuSection from '../components/menu/MenuSection';
import Footer from '../components/menu/Footer';
import { useLogout } from '../hooks/useLogout';
import useVolverDashboard from '../hooks/useVolverDashboard';
import { ArrowLeft } from 'lucide-react';
import ChatModal from '../components/ChatModal';
import axios from "axios";


export default function MenuCliente() {
  const handleLogout = useLogout();
  const volverDashboard = useVolverDashboard();

  const [menuItems, setMenuItems] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const mesaId = parseInt(new URLSearchParams(window.location.search).get("mesa")) || 1;
  const categoriasAgrupadas = menuItems.reduce((acc, item) => {
  const categoria = item.Categorium?.nombre || "Sin categoría";
  if (!acc[categoria]) acc[categoria] = [];
  acc[categoria].push(item);
  return acc;
}, {});

const [scrolled, setScrolled] = useState(false);

useEffect(() => {
  const handleScroll = () => {
    setScrolled(window.scrollY > 10);
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);


useEffect(() => {
  const fetchMenuItems = async () => {
    try {
      const res = await axios.get("/menuItem");
      const items = res.data.data;
      if (Array.isArray(items)) setMenuItems(items);
      else console.error("Formato inesperado:", res.data);
    } catch (err) {
      console.error("Error al cargar el menú:", err);
    }
  };
  fetchMenuItems();
}, []);
console.log(menuItems)

  return (

<div>
   <Header />
   {/* Barra flotante con categorías y botón de agente */}
<div className="fixed top-[160px] w-full z-40  bg-[#263238]  ">
   <div className={`fixed w-full z-50 bg-[#263238]  shadow-md transition-all duration-300 ${
    scrolled ? 'top-0' : 'top-24' // cambia según si se scrolleó o no
  }`}
  >

    <CategoryNav />
   
  </div>
</div>






      {modalAbierto && (
        <ChatModal mesaId={mesaId} onClose={() => setModalAbierto(false)} />
      )}
     
        <main className=" pt-[160px] container mx-auto px-4 sm:px-6 md:px-8 max-w-6xl">
  {Object.entries(categoriasAgrupadas).map(([categoria, items], index) => (
    <MenuSection
      key={categoria}
      title={categoria}
      items={items}
      priority={index + 1}
    />
  ))}
</main>

   
      <button
/*       onClick={() => setModalAbierto(true)}
      className="bg-green-600 text-white px-4 py-4  rounded-full shadow-md hover:bg-green-700 transition text-sm sm:text-base  self-end" */
        onClick={() => setModalAbierto(true)}
  className="fixed bottom-8 right-4 z-50 bg-green-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-green-700 transition text-sm sm:text-base"

    >
      💬 Agente Virtual
    </button>  
      <Footer />

    
</div>

    
  );
}



