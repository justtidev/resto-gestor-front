import {Minus, Plus, ShoppingCart, Trash2, Edit3 } from 'lucide-react';


const OrderSummary = ({ orderItems, updateOrderItem, comandaExistente }) => {
  const totalAmount = orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const itemCount = orderItems.reduce((total, item) => total + item.quantity, 0);

  const handleQuantityChange = (productId, newQuantity) => {
    const item = orderItems.find(item => item.id === productId);
    updateOrderItem(productId, newQuantity, item.comments);
  };

  const handleCommentsChange = (productId, newComments) => {
    const item = orderItems.find(item => item.id === productId);
    updateOrderItem(productId, item.quantity, newComments);
  };

  if (orderItems.length === 0 ) {
    return (
      <div className="bg-lightGray rounded-2xl p-8 shadow-md border border-gray-200 mb-6">
        <div className="text-center">
          <ShoppingCart size={48} className="mx-auto text-textSecondary mb-4" />
          <h2 className="text-2xl font-bold text-textPrimary mb-2">Comanda Vacía</h2>
          <p className="text-textSecondary">Selecciona una categoría para agregar productos</p>
          
        </div>
      </div>
    );
  }

  return (
    <div className="bg-lightGray rounded-2xl p-6 shadow-md border border-gray-200 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-textPrimary flex items-center gap-2">
          <ShoppingCart size={24} />
          Comanda 
        </h2>
        <div className="text-right">
          <div className="text-sm text-textSecondary">
            {itemCount} producto{itemCount !== 1 ? 's' : ''}
          </div>
          <div className="text-2xl font-bold text-textPrimary">
            Total: ${totalAmount}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {orderItems.map((item) => (
          <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <h3 className="font-semibold text-textPrimary text-lg">
                  {item.name}
                </h3>
                </div>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-textSecondary">
                    ${item.price} c/u
                  </span>
                  <span className="font-bold text-textPrimary">
                    Subtotal: ${item.price * item.quantity}
                  </span>
                </div>
              
              {updateOrderItem && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  className="w-8 h-8 selection: text-white bg-darkGray rounded-full flex items-center justify-center hover:bg-gray-500 transition text-lg font-bold"
                >
                 <Minus size={16}/>
                </button>
                
                <span className="text-xl font-bold text-textPrimary w-8 text-center">
                  {item.quantity}
                </span>
                
                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  className="w-8 h-8 bg-darkGray text-white rounded-full flex items-center justify-center hover:bg-gray-500 transition text-lg font-bold"
                >
                  <Plus size={16}/>
                </button>
                
                <button
                  onClick={() => updateOrderItem(item.id, 0, '')}
                  className="w-8 h-8 bg-transparent text-black  rounded-full flex items-center justify-center hover:bg-lightGray transition ml-2"
                >
                  <Trash2 className="" size={16} />
                </button>
               
              </div>
)}
            </div>
            
            <div  className="mt-3">
              <div className="flex items-center gap-2 mb-2">
                <Edit3 size={16} className="text-textSecondary" />
                <label className="text-sm font-medium text-textSecondary">
                  Comentarios: 
                </label>
              </div>
              <textarea
                value={item.comments}
                onChange={(e) => handleCommentsChange(item.id, e.target.value)}
                placeholder="Agregar comentarios especiales..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent text-sm"
                rows="1"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderSummary;