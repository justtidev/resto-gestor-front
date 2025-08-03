import { useContext } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import Logo from "../components/Logo";
import { BiCategory } from "react-icons/bi";
import { MdPhoto } from "react-icons/md";
import { User2, Menu, X } from "lucide-react";
import { Utensils, Table, LogOut } from "lucide-react";
import { useState } from "react";
import AsideBar from "../components/AsideBar";
import { UserCircle2 } from "lucide-react";
import {AuthContext} from "../contexts/AuthContext";

import { useLogout } from "../hooks/useLogout";

function LayoutAdmin() {
 
  const handleLogout = useLogout();
 

     const {userName, userRole} = useContext(AuthContext);

  const menuItems = [
    { name: "Usuario", icon: <User2 size={18} />, path: "/admin/usuario" },
    { name: "Menu", icon: <Utensils size={18} />, path: "/admin/menuItem" },
    { name: "Mesa", icon: <Table size={18} />, path: "/admin/mesa" },
    { name: "Categoria", icon: <BiCategory size={18} />, path: "/admin/categoria" },
    { name: "Imagen", icon: <MdPhoto size={18} />, path: "/admin/imagen" },
  ];

  return (
  <div className="flex h-screen bg-[#FFFDF7] text-[#212121] font-sans">
    {/* Sidebar lateral */}
    <AsideBar />

    {/* Contenido principal (navbar + contenido de página) */}
    <div className="flex flex-col flex-1 ">
      {/* Navbar */}
      
      <nav className="text-[#263238]  px-4 py-6 bg-[#FFFDF7] shadow-md">
        <div className="flex items-center justify-between">
          
           <h2  className="text-3xl font-bold text-[#263238]" >Panel de Administración</h2>
            
            <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 p-2 rounded-xl bg-[#ECEFF1]">
          <UserCircle2 size={24} />
         
            <p className="font-semibold text-sm">{userName}</p>
          
          
        </div>
          <button className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl  text-white bg-[#37474F] hover:bg-[#263238] transition" onClick={handleLogout} >
            
            <LogOut size={16} /> Salir
          </button>
        
        

        {/* Menú */}
   
            
          </div>
        </div>
      </nav>

      {/* Contenido de las rutas */}
      <main className="flex-1 p-4 overflow-y-auto">
        <Outlet />
      </main>
    </div>
    </div>
 
);
}
export default LayoutAdmin;