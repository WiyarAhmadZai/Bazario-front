import api from './api';

// Get user's wishlist
export const getWishlist = async () => {
  try {
    const response = await api.get('/wishlist');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Add item to wishlist
export const addToWishlist = async (productId) => {
  try {
    const response = await api.post('/wishlist', { product_id: productId });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Remove item from wishlist
export const removeFromWishlist = async (wishlistItemId) => {
  try {
    const response = await api.delete(`/wishlist/${wishlistItemId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};