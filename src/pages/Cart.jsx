import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { getCart, updateCartItem, removeFromCart } from '../services/cartService';

const Cart = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useContext(AuthContext);
  const { cartItems, updateQuantity, removeFromCart: removeContextItem } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await getCart();
      // We're using context for cart items, so we don't need to set state here
    } catch (err) {
      setError('Failed to fetch cart items');
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(itemId);
      return;
    }
    
    if (isAuthenticated) {
      try {
        await updateCartItem(itemId, newQuantity);
        updateQuantity(itemId, newQuantity);
      } catch (err) {
        setError('Failed to update item quantity');
        console.error('Error updating cart item:', err);
      }
    } else {
      // For non-authenticated users, update context only
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleRemoveFromCart = async (itemId) => {
    if (isAuthenticated) {
      try {
        await removeFromCart(itemId);
        removeContextItem(itemId);
      } catch (err) {
        setError('Failed to remove item from cart');
        console.error('Error removing from cart:', err);
      }
    } else {
      // For non-authenticated users, update context only
      removeContextItem(itemId);
    }
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
                  {item.images && item.images.length > 0 ? (
                    <img 
                      src={item.images[0].startsWith('http') ? item.images[0] : `/storage/${item.images[0]}`} 
                      alt={item.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="bg-gray-300 border-2 border-dashed rounded-xl w-16 h-16" />
                  )}
                </div>
                
                <div className="flex-1 sm:ml-6 w-full">
                  <div className="flex flex-col sm:flex-row justify-between">
                    <div className="mb-4 sm:mb-0">
                      <h3 className="text-lg font-semibold">{item.title || 'Product'}</h3>
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
                      
                      <button 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleRemoveFromCart(item.id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
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
    </div>
  );
};

export default Cart;