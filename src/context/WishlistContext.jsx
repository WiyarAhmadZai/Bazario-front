import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { getFavorites, addToFavorites, removeFromFavorites } from '../services/favoriteService';

// Create the context
export const WishlistContext = createContext();

// Create a provider component
export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useContext(AuthContext);

  // Load wishlist from API when user is authenticated, localStorage otherwise
  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      // Load from localStorage for non-authenticated users
      try {
        const wishlistKey = user ? `wishlist_${user.id}` : 'wishlist_guest';
        const savedWishlist = localStorage.getItem(wishlistKey);
        if (savedWishlist) {
          setWishlistItems(JSON.parse(savedWishlist));
        } else {
          setWishlistItems([]);
        }
      } catch (error) {
        console.error('Error loading wishlist from localStorage:', error);
        setWishlistItems([]);
      }
      setLoading(false);
    }
  }, [isAuthenticated, user?.id]);

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
    if (isAuthenticated) {
      try {
        await addToFavorites(product.id);
        // Add to local state
        setWishlistItems(prevItems => {
          const exists = prevItems.find(item => String(item.id) === String(product.id));
          if (!exists) {
            return [...prevItems, product];
          }
          return prevItems;
        });
      } catch (error) {
        console.error('Error adding to wishlist:', error);
      }
    } else {
      // For non-authenticated users, use localStorage
      try {
        const wishlistKey = user ? `wishlist_${user.id}` : 'wishlist_guest';
        const savedWishlist = localStorage.getItem(wishlistKey);
        const wishlistItems = savedWishlist ? JSON.parse(savedWishlist) : [];
        const exists = wishlistItems.find(item => String(item.id) === String(product.id));
        if (!exists) {
          const updatedWishlist = [...wishlistItems, product];
          localStorage.setItem(wishlistKey, JSON.stringify(updatedWishlist));
          setWishlistItems(updatedWishlist);
        }
      } catch (error) {
        console.error('Error adding to wishlist (localStorage):', error);
      }
    }
  };

  // Remove item from wishlist
  const handleRemoveFromWishlist = async (productId) => {
    if (isAuthenticated) {
      try {
        await removeFromFavorites(productId);
        // Remove from local state
        setWishlistItems(prevItems => prevItems.filter(item => String(item.id) !== String(productId)));
      } catch (error) {
        console.error('Error removing from wishlist:', error);
      }
    } else {
      // For non-authenticated users, use localStorage
      try {
        const wishlistKey = user ? `wishlist_${user.id}` : 'wishlist_guest';
        const savedWishlist = localStorage.getItem(wishlistKey);
        const wishlistItems = savedWishlist ? JSON.parse(savedWishlist) : [];
        const updatedWishlist = wishlistItems.filter(item => String(item.id) !== String(productId));
        localStorage.setItem(wishlistKey, JSON.stringify(updatedWishlist));
        setWishlistItems(updatedWishlist);
      } catch (error) {
        console.error('Error removing from wishlist (localStorage):', error);
      }
    }
  };

  // Check if item is in wishlist
  const isInWishlist = (productId) => {
    // Convert both IDs to strings for comparison to handle type mismatches
    return wishlistItems.some(item => String(item.id) === String(productId));
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