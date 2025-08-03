import React, { useState, useEffect, useContext } from 'react';
import Logo from '../Logo'; // Adjust the import path as necessary
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const { token } = useContext(AuthContext); // o { token } si no tenés user completo
const navigate = useNavigate();


  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
   <header className={` bg-[#263238] shadow-md ${
  scrolled ? 'py-8' : 'py-6'
}`}>

      <div className="container w-full px-4 bg-[#263238]  flex justify-center ">
     
     <Logo/>
      </div>
      {token && (
  <button
    onClick={() => navigate("/dashboard")}
    className=" fixed top-2 px-4 py-2 bg-gray-700 text-white text-sm rounded-md hover:bg-gray-800 transition"
  >
    ⬅ Volver
  </button>
)}

    </header>
  );
};

export default Header;