import { Coffee, UtensilsCrossed, Cookie, HamburgerIcon, PizzaIcon, Sandwich } from 'lucide-react';
import { FaCheese } from 'react-icons/fa';
import { FaWater } from 'react-icons/fa6';
import { GiFrenchFries } from 'react-icons/gi';



const CategorySidebar = ({ categorias, selectedCategory, setSelectedCategory, onCategoryClick }) => {
  const handleCategoryClick = (categoryName) => {
    console.log('Category clicked:', categoryName); // Debug log
    setSelectedCategory(categoryName);
    onCategoryClick();
  };

    const categoryIcon = (category) => {
   
    switch (category) {
      case 'Hamburguesa':
        return <HamburgerIcon size= {20}/>;
      case 'Pizza':
        return <PizzaIcon size={20}/> ;
        case 'Picada':
        return <FaCheese size={20}/> ;
        case 'Bebida':
        return <FaWater size={20}/> ;
        case 'Sandwich':
        return <Sandwich size={20}/> ;
        case 'Papas Fritas':
        return <GiFrenchFries size={20}/> ;
        
      default:
        return <UtensilsCrossed size={20} />; //  por defecto
    }
  }

  return (
    <aside className="w-64 bg-darkGray text-white p-6 min-h-screen">
      <h3 className="text-xl font-bold mb-6 text-accent">Categorías</h3>
      <nav className="space-y-2">
        {categorias.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.nombre)}
            className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition ${
              selectedCategory === category.nombre 
                ? 'bg-accent text-textPrimary hover:bg-white/10' 
                : 'hover:bg-white/10'
            }`}
          >
            <span>{categoryIcon(category.nombre)}</span>
            {category.nombre}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default CategorySidebar;