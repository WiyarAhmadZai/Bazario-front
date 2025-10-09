import api from "./api";

// Get dashboard data for admin
export const getDashboardData = async () => {
  try {
    const response = await api.get("/admin/dashboard");
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
};

// Get all users for admin
export const getUsers = async (params = {}) => {
  try {
    const response = await api.get("/admin/users", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Get all products for admin
export const getProducts = async (params = {}) => {
  try {
    const response = await api.get("/admin/products", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Create product as admin
export const createProduct = async (productData) => {
  try {
    const response = await api.post("/admin/products", productData);
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

// Update product as admin
export const updateProduct = async (productId, productData) => {
  try {
    const response = await api.put(`/admin/products/${productId}`, productData);
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

// Delete product as admin
export const deleteProduct = async (productId) => {
  try {
    const response = await api.delete(`/admin/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

// Toggle sponsor status for a product
export const toggleSponsor = async (productId, sponsorData) => {
  try {
    const response = await api.post(
      `/admin/products/${productId}/sponsor`,
      sponsorData
    );
    return response.data;
  } catch (error) {
    console.error("Error toggling sponsor status:", error);
    throw error;
  }
};

// Expire sponsorships
export const expireSponsorships = async () => {
  try {
    const response = await api.post("/admin/expire-sponsorships");
    return response.data;
  } catch (error) {
    console.error("Error expiring sponsorships:", error);
    throw error;
  }
};

export default {
  getDashboardData,
  getUsers,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleSponsor,
  expireSponsorships,
};
