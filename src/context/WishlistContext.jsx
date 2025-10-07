import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { getFavorites, addToFavorites, removeFromFavorites } from '../services/favoriteService';

// Create the context
export const WishlistContext = createContext();

// Create a provider component
export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useContext(AuthContext);

  // Load wishlist from API when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      setWishlistItems([]);
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await getFavorites();
      setWishlistItems(response.data || []);
    } catch (error) {
      console.error('Error loading wishlist from API:', error);
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Add item to wishlist
  const handleAddToWishlist = async (product) => {
    if (!isAuthenticated) {
      // For non-authenticated users, we could use localStorage
      // but for now, we'll just return
      return;
    }
    
    try {
      await addToFavorites(product.id);
      // Add to local state
      setWishlistItems(prevItems => {
        const exists = prevItems.find(item => item.id === product.id);
        if (!exists) {
          return [...prevItems, product];
        }
        return prevItems;
      });
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  // Remove item from wishlist
  const handleRemoveFromWishlist = async (productId) => {
    if (!isAuthenticated) {
      // For non-authenticated users, we could use localStorage
      // but for now, we'll just return
      return;
    }
    
    try {
      await removeFromFavorites(productId);
      // Remove from local state
      setWishlistItems(prevItems => prevItems.filter(item => item.id !== productId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  // Check if item is in wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.id === productId);
  };

  // Clear wishlist
  const clearWishlist = () => {
    setWishlistItems([]);
  };

  // Calculate wishlist items count
  const wishlistCount = wishlistItems.length;

  const value = {
    wishlistItems,
    addToWishlist: handleAddToWishlist,
    removeFromWishlist: handleRemoveFromWishlist,
    isInWishlist,
    clearWishlist,
    wishlistCount,
    loading
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};