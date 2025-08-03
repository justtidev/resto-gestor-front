import { useState, useEffect } from 'react';
import { X, Minus, Plus, Search } from 'lucide-react';


const ProductModal = ({ menuItems, categorias, isOpen, onClose, selectedCategory, searchQuery, orderItems, addToOrder, updateOrderItem }) => {
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [selectedProducts, setSelectedProducts] = useState({});

  console.log("MenuItems", menuItems)

  useEffect(() => {
    if (isOpen) {
      setLocalSearchQuery(searchQuery);
      // Initialize selected products with current order quantities
      const initialSelected = {};
      orderItems.forEach(item => {
        initialSelected[item.id] = {
          quantity: item.quantity,
          comments: item.comments
        };
      });
      console.log("CategoriaSeleccionada", selectedCategory)
      setSelectedProducts(initialSelected);
      console.log('Modal opened, initialized with:', initialSelected);
    }
  }, [isOpen, searchQuery, orderItems]);

  if (!isOpen) return null;

  const allProducts = menuItems || [];
  

  console.log("selectedCategory", selectedCategory)
  const categoryProducts = allProducts.filter(product => product.Categorium?.nombre === selectedCategory);

    console.log("categoryProducts", categoryProducts)
  const filteredProducts = localSearchQuery
    ? allProducts.filter(product =>
        product.nombre.toLowerCase().includes(localSearchQuery.toLowerCase())
      || product.descripcionBreve?.toLowerCase().includes(localSearchQuery.toLowerCase()))
    : categoryProducts;

  const handleQuantityChange = (product, newQuantity) => {
    console.log('Changing quantity for product:', product.nombre, 'to:', newQuantity);
    
    if (newQuantity <= 0) {
      const newSelected = { ...selectedProducts };
      delete newSelected[product.id];
      setSelectedProducts(newSelected);
    } else {
      setSelectedProducts(prev => ({
        ...prev,
        [product.id]: {
          quantity: newQuantity,
          comments: prev[product.id]?.comments || ''
        }
      }));
    }
  };

  const handleCommentsChange = (productId, comments) => {
    setSelectedProducts(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        comments
      }
    }));
  };

  const handleConfirm = () => {
    console.log('Confirming selection:', selectedProducts);
    
    // First, remove items that are no longer selected
    orderItems.forEach(item => {
      if (!selectedProducts[item.id]) {
        console.log('Removing item:', item.name);
        updateOrderItem(item.id, 0, '');
      }
    });

    // Then, update or add items that are selected
    Object.entries(selectedProducts).forEach(([productId, selectedData]) => {
      const product = allProducts.find(p => p.id === parseInt(productId));
      if (product && selectedData.quantity > 0) {
        console.log('Updating/Adding item:', product.nombre, 'quantity:', selectedData.quantity);
        updateOrderItem(product.id, selectedData.quantity, selectedData.comments);
      }
    });

    onClose();
  };

  const getProductQuantity = (productId) => {
    return selectedProducts[productId]?.quantity || 0;
  };

  const getProductComments = (productId) => {
    return selectedProducts[productId]?.comments || '';
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0  bg-black bg-opacity-50 items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl w-full max-w-4xl h-[85vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="bg-darkGray text-white p-6 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold">
              {localSearchQuery ? 'Resultados de Búsqueda' : selectedCategory}
            </h2>
            <p className="text-white/70 mt-1">
              {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} disponible{filteredProducts.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 bg-lightGray p-4 rounded-xl">
            <Search className="text-textSecondary" size={20} />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              className="bg-transparent outline-none flex-1 text-textPrimary placeholder-textSecondary"
            />
          </div>
        </div>

        {/* Products List */}
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="space-y-4">
            {filteredProducts.map((product) => {
              const quantity = getProductQuantity(product.id);
              const comments = getProductComments(product.id);
              
              return (
                <div key={product.id} className="bg-lightGray rounded-xl p-4 border border-gray-200 ">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-textPrimary">
                        {product.nombre}
                      </h3>
                      <p className="text-xl font-bold text-textPrimary mt-1">
                        ${product.precio_item}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleQuantityChange(product, quantity - 1)}
                        className="w-10 h-10 bg-darkGray text-white rounded-full flex items-center justify-center hover:bg-gray-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={quantity === 0}
                      >
                        <Minus size={16} />
                      </button>
                      
                      <span className="text-xl font-bold text-textPrimary w-8 text-center">
                        {quantity}
                      </span>
                      
                      <button
                        onClick={() => handleQuantityChange(product, quantity + 1)}
                        className="w-10 h-10 bg-darkGray text-white rounded-full flex items-center justify-center hover:bg-gray-500 transition"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                  
                  {quantity > 0 && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-textSecondary mb-2">
                        Comentarios:
                      </label>
                      <textarea
                        value={comments}
                        onChange={(e) => handleCommentsChange(product.id, e.target.value)}
                        placeholder="Agregar comentarios especiales..."
                        className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                        rows="1"
                      />
                    </div>
                  )}
                </div>
              );
            })}
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-12 text-textSecondary">
                <p className="text-lg">No se encontraron productos</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="flex gap-4 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              className="px-6 py-3 bg-accent text-textPrimary rounded-xl font-semibold hover:bg-yellow-500 transition"
            >
              Confirmar Selección
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;