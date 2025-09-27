import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    paymentMethod: 'cod'
  });
  
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Process order
    console.log('Order placed:', { ...formData, items: cartItems });
    clearCart();
    setOrderPlaced(true);
    
    // Redirect to orders page after 3 seconds
    setTimeout(() => {
      navigate('/orders');
    }, 3000);
  };

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
        <p className="text-gray-600 mb-6">Add items to your cart before checking out.</p>
        <button 
          onClick={() => navigate('/shop')}
          className="luxury-button"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-4">Order Placed Successfully!</h2>
        <p className="text-gray-600 mb-6">Thank you for your order. You will be redirected to your orders page shortly.</p>
        <button 
          onClick={() => navigate('/orders')}
          className="luxury-button"
        >
          View Orders
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Billing Information */}
            <div className="glass p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Billing Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    className="glass w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gold focus:border-gold"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    className="glass w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gold focus:border-gold"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="glass w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gold focus:border-gold"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    className="glass w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gold focus:border-gold"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            
            {/* Shipping Address */}
            <div className="glass p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    required
                    className="glass w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gold focus:border-gold"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      required
                      className="glass w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gold focus:border-gold"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      required
                      className="glass w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gold focus:border-gold"
                      value={formData.state}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      required
                      className="glass w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gold focus:border-gold"
                      value={formData.zipCode}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Payment Method */}
            <div className="glass p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="cod"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleChange}
                    className="h-4 w-4 text-gold focus:ring-gold border-gray-300"
                  />
                  <label htmlFor="cod" className="ml-3 block text-sm font-medium text-gray-700">
                    Cash on Delivery
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="credit-card"
                    name="paymentMethod"
                    value="credit-card"
                    disabled
                    className="h-4 w-4 text-gold focus:ring-gold border-gray-300"
                  />
                  <label htmlFor="credit-card" className="ml-3 block text-sm font-medium text-gray-700">
                    Credit Card (Coming Soon)
                  </label>
                </div>
              </div>
            </div>
            
            <button type="submit" className="luxury-button w-full">
              Place Order
            </button>
          </form>
        </div>
        
        {/* Order Summary */}
        <div>
          <div className="glass p-6 rounded-lg sticky top-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;