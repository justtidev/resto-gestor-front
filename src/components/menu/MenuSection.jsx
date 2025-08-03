import React, { useRef, useEffect, useState } from 'react';
import MenuItem from './MenuItem';

const MenuSection = ({ title, items, priority }) => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id={`section-${priority}`}
      className={`mb-16 transition-opacity duration-700 ease-in-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ transitionDelay: `${priority * 0.1}s` }}
    >
      <div className="relative mb-8">
        <h2 className="text-3xl font-serif font-bold text-[#263238] text-center">
          {title}
        </h2>
        <div className="absolute left-1/2 -translate-x-1/2 w-24 h-1 bg-amber-500 bottom-0 mt-2"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 justify-items-center">
        {items.map((item) => (
          <div className="w-[300px]" >
          <MenuItem
            key={item.id}
            nombre={item.nombre}
            descripcion={item.descripcionBreve}
            precio_item={item.precio_item}
            imagen={item.Imagens[0]?.ubicacion}
          />
          </div>
        ))}
      </div>
    </section>
  );
};

export default MenuSection;
