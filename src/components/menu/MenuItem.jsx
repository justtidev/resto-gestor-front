import React from 'react';

const MenuItem = ({ nombre, descripcion, precio_item, imagen }) => {
  return (
   <div className="w-[300px] h-[300px] bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group flex flex-col">
  <div className="h-36 overflow-hidden">
    <img
      src={imagen || '/default-image.jpg'}
      alt={nombre}
      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
    />
  </div>
  <div className="p-4 flex flex-col flex-grow justify-between">
    <div>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-semibold text-stone-800 truncate">{nombre}</h3>
        <span className="px-3 py-1 bg-accent text-amber-800 font-bold rounded-full text-sm">
          ${precio_item}
        </span>
      </div>
      <p className="text-stone-600 text-sm line-clamp-3">{descripcion}</p>
    </div>
  </div>
</div>

  );
};

export default MenuItem;
