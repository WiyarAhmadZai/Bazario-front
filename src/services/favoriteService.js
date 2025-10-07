import api from "./api";

export const addToFavorites = async (productId) => {
  try {
    const response = await api.post(`/products/${productId}/favorite`);
    return response.data;
  } catch (error) {
    console.error("Error adding to favorites:", error);
    throw error;
  }
};

export const removeFromFavorites = async (productId) => {
  try {
    const response = await api.delete(`/products/${productId}/favorite`);
    return response.data;
  } catch (error) {
    console.error("Error removing from favorites:", error);
    throw error;
  }
};

export const getFavorites = async (params = {}) => {
  try {
    const response = await api.get("/favorites", { params });
    return response.data;
  } catch (error) {
    console.error("Error getting favorites:", error);
    throw error;
  }
};

export default {
  addToFavorites,
  removeFromFavorites,
  getFavorites,
};
