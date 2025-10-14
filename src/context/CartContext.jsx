import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

// Create the context
export const CartContext = createContext();

// Create a provider component
export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState(() => {
    // Initialize cart from localStorage immediately
    try {
      const cartKey = user ? `cart_${user.id}` : 'cart_guest';
      const savedCart = localStorage.getItem(cartKey);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          console.log('CartContext: Initialized with saved cart for user:', user?.id || 'guest', parsedCart);
          return parsedCart;
        }
      }
    } catch (error) {
      console.error('Error loading cart from localStorage on init:', error);
    }
    console.log('CartContext: Initialized with empty cart for user:', user?.id || 'guest');
    return [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      const cartKey = user ? `cart_${user.id}` : 'cart_guest';
      console.log('CartContext: Saving cart to localStorage for user:', user?.id || 'guest', cartItems);
      localStorage.setItem(cartKey, JSON.stringify(cartItems));
      console.log('CartContext: Cart saved successfully for user:', user?.id || 'guest');
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems, user]);

  // Reload cart when user changes
  useEffect(() => {
    try {
      const cartKey = user ? `cart_${user.id}` : 'cart_guest';
      const savedCart = localStorage.getItem(cartKey);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          console.log('CartContext: User changed, loading cart for user:', user?.id || 'guest', parsedCart);
          setCartItems(parsedCart);
        }
      } else {
        console.log('CartContext: User changed, no saved cart for user:', user?.id || 'guest');
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error loading cart for user change:', error);
      setCartItems([]);
    }
  }, [user?.id]);

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate total items in cart
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Calculate total price
  const cartTotal = cartItems.reduce(
    (total, item) => total + (item.price * item.quantity),
    0
  );

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};