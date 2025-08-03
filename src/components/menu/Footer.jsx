import React from 'react';
import { MapPin, Instagram, Utensils } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#263238] text-stone-200 py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Utensils className="h-8 w-8 text-amber-500" strokeWidth={1.5} />
            <span className="text-2xl font-serif font-bold text-white">Resto</span>
          </div>
          
          <div className="flex gap-6">
            <a href="https://www.google.com/maps/search/?api=1&query=Libertad%20111%2C%20Santa%20Rosa%20de%20Calamuchita%205196" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-amber-400 transition-colors">
              <MapPin size={18} />
              <span>Libertad 111, Santa Rosa de Calamuchita 5196</span>
            </a>
            </div>
            <div>
            <a href="https://www.instagram.com" className="flex items-center gap-2 hover:text-amber-400 transition-colors">
              <Instagram size={18} />
              <span>@somosresto</span>
            </a>
          </div>
        </div>
        
        <div className="mt-8 text-center text-stone-400 text-sm">
          <p>© {new Date().getFullYear()} Resto. Todos los derechos reservados.</p>
          <p>Diseñado por Justina Navarro Ocampo</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;