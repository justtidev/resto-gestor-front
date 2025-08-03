import { Search } from 'lucide-react';

const Header = ({  tableNumber, waiterName, searchQuery, setSearchQuery, onSearchClick }) => {
  const handleSearchClick = (e) => {
    e.preventDefault();
    onSearchClick();
  };

  const handleInputClick = (e) => {
    e.preventDefault();
    onSearchClick();
  };

  return (
    <header className="bg-darkGray text-white p-4 shadow-lg">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-6">
          <div className="bg-accent text-textPrimary px-4 py-2 rounded-xl font-bold text-lg">
            Mesa: {tableNumber}
          </div>
          <div className="text-lg font-medium">
            Mozo: {waiterName}
          </div>
        </div>
        
        <div 
          className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-xl min-w-50 cursor-pointer hover:bg-white/20 transition"
          onClick={handleSearchClick}
        >
          
          <Search className="text-white/70" size={20} />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClick={handleInputClick}
            className="bg-transparent outline-none flex-1 text-white placeholder-white/70 cursor-pointer"
            readOnly
          />
         
        </div>
        
      </div>
    </header>
  );
};

export default Header;