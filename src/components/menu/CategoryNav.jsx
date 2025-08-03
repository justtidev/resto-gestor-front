import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CategoryNav = () => {
  const [categorias, setCategorias] = useState([]);
  const [activeSection, setActiveSection] = useState('section-1');

  useEffect(() => {
    axios.get('/categoria')
      .then(res => {
        setCategorias(res.data.data);
      })
      .catch(err => {
        console.error('Error al obtener categorías:', err);
      });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = categorias.map((_, index) => `section-${index + 1}`);

      for (const sectionId of sections) {
        const section = document.getElementById(sectionId);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [categorias]);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 100,
        behavior: 'smooth',
      });
    }
  };

  return (
    <nav className="bg-[#263238] py-3 mb-8 w-full overflow-x-auto no-scrollbar">
      
        <ul className="flex space-x-6 justify-center px-4 sm:px-6 md:px-8"> 
          {categorias.map((cat, index) => (
            <li key={cat.id}>
              <button
                onClick={() => scrollToSection(`section-${index + 1}`)}
                className={`px-4 py-2 whitespace-nowrap text-sm font-medium transition-colors ${
                  activeSection === `section-${index + 1}`
                    ? 'text-amber-700 border-b-2 border-amber-500'
                    : 'text-stone-600 hover:text-amber-600'
                }`}
              >
                {cat.nombre}
              </button>
            </li>
          ))}
        </ul>
      
    </nav>
  );
};

export default CategoryNav;