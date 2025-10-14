import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import ShareModal from '../components/ShareModal';
import Swal from 'sweetalert2';
// Cart functionality is handled by CartContext

// Helper function to get product image URL (same logic as Shop page)
const getProductImageUrl = (product) => {
  if (!product.images) {
    return 'https://placehold.co/300x300/374151/FFFFFF?text=Product+Image';
  }

  let imageUrl = '';
  
  if (Array.isArray(product.images) && product.images.length > 0) {
    imageUrl = product.images[0];
  } else if (typeof product.images === 'string') {
    try {
      // Try to parse as JSON array
      const imagesArray = JSON.parse(product.images);
      if (Array.isArray(imagesArray) && imagesArray.length > 0) {
        imageUrl = imagesArray[0];
      }
    } catch (e) {
      // If parsing fails, use the string directly
      imageUrl = product.images;
    }
  }
  
  // Handle absolute vs relative URLs
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  } else {
    // Fix: Check if imageUrl already starts with 'products/' to avoid duplication
    if (imageUrl.startsWith('/storage/')) {
      return imageUrl;
    } else if (imageUrl.startsWith('products/')) {
      return `/storage/${imageUrl}`;
    } else {
      return `/storage/products/${imageUrl}`;
    }
  }
};

const Cart = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { isAuthenticated } = useContext(AuthContext);
  const { cartItems, updateQuantity, removeFromCart: removeContextItem } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Cart items are managed by CartContext and persisted in localStorage
    // No need to fetch from API as CartContext handles persistence
    setLoading(false);
  }, []);

  const handleShare = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedProduct(product);
    setShowShareModal(true);
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(itemId);
      return;
    }
    
    // Update quantity in context (which persists to localStorage)
    updateQuantity(itemId, newQuantity);
  };

  const handleRemoveFromCart = (itemId) => {
    // Remove item from context (which persists to localStorage)
    removeContextItem(itemId);
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + (item.price * item.quantity || 0),
    0
  );

  if (!isAuthenticated && cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
        <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
        <button 
          onClick={() => navigate('/shop')}
          className="luxury-button"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
        <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
        <button 
          onClick={() => navigate('/shop')}
          className="luxury-button"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="glass rounded-lg overflow-hidden">
            {cartItems.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row items-center p-6 border-b border-gray-200 last:border-0">
                <div className="bg-gray-200 h-24 w-24 rounded-lg mb-4 sm:mb-0 flex items-center justify-center">
                  <Link 
                    to={`/product/${item.id}`}
                    className="w-full h-full block"
                  >
                    <img 
                      src={getProductImageUrl(item)} 
                      alt={item.title || 'Product'}
                      className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/300x300/374151/FFFFFF?text=Product+Image';
                      }}
                    />
                  </Link>
                </div>
                
                <div className="flex-1 sm:ml-6 w-full">
                  <div className="flex flex-col sm:flex-row justify-between">
                    <div className="mb-4 sm:mb-0">
                      <Link 
                        to={`/product/${item.id}`}
                        className="text-lg font-semibold hover:text-gold transition-colors cursor-pointer"
                      >
                        {item.title || 'Product'}
                      </Link>
                      <p className="text-gray-600">${item.price || 0}</p>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <button 
                          className="luxury-button px-3 py-1 rounded-l-full text-sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span className="px-3 py-1 bg-gray-800 border-t border-b border-gray-600">{item.quantity}</span>
                        <button 
                          className="luxury-button px-3 py-1 rounded-r-full text-sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      
                      <div className="font-semibold">${(item.price * item.quantity || 0).toFixed(2)}</div>
                      
                      <div className="flex items-center space-x-2">
                        <button 
                          className="text-blue-500 hover:text-blue-700"
                          onClick={(e) => handleShare(item, e)}
                          title="Share product"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                          </svg>
                        </button>
                        
                        <button 
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleRemoveFromCart(item.id)}
                          title="Remove from cart"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <div className="glass p-6 rounded-lg sticky top-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${(cartTotal * 0.08).toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-300 pt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${(cartTotal * 1.08).toFixed(2)}</span>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/checkout')}
              className="luxury-button w-full text-center block"
            >
              Proceed to Checkout
            </button>
            
            <button 
              onClick={() => navigate('/shop')}
              className="block text-center mt-4 text-gold hover:underline"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        product={selectedProduct}
      />
    </div>
  );
};

export default Cart;