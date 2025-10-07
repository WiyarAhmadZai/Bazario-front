import api from "./api";

// Like a product
export const likeProduct = async (productId) => {
  try {
    const response = await api.post(`/products/${productId}/like`);
    return response.data;
  } catch (error) {
    console.error("Error liking product:", error);
    // If user is not authenticated, show message
    if (error.response?.status === 401) {
      throw new Error("Please login to like products");
    }
    throw error;
  }
};

// Unlike a product
export const unlikeProduct = async (productId) => {
  try {
    const response = await api.delete(`/products/${productId}/like`);
    return response.data;
  } catch (error) {
    console.error("Error unliking product:", error);
    // If user is not authenticated, show message
    if (error.response?.status === 401) {
      throw new Error("Please login to unlike products");
    }
    throw error;
  }
};

// Get like status for a product
export const getLikeStatus = async (productId) => {
  try {
    const response = await api.get(`/products/${productId}/like-status`);
    return response.data;
  } catch (error) {
    console.error("Error getting like status:", error);
    // If user is not authenticated, return not liked
    if (error.response?.status === 401) {
      return { liked: false };
    }
    throw error;
  }
};

// Get like count for a product
export const getLikeCount = async (productId) => {
  try {
    const response = await api.get(`/products/${productId}/like-count`);
    return response.data;
  } catch (error) {
    console.error("Error getting like count:", error);
    throw error;
  }
};

export default {
  likeProduct,
  unlikeProduct,
  getLikeStatus,
  getLikeCount,
};
