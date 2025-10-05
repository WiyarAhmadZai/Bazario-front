import api from './api';

// Get all categories
export const getCategories = async () => {
  try {
    console.log('=== CATEGORY SERVICE - GET CATEGORIES ===');
    const response = await api.get('/categories');
    console.log('Categories response:', response.data);
    return response.data;
  } catch (error) {
    console.error('=== CATEGORY SERVICE ERROR ===');
    console.error('Error:', error);
    throw error.response.data;
  }
};

// Get category by ID
export const getCategoryById = async (id) => {
  try {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Create a new category (admin only)
export const createCategory = async (categoryData) => {
  try {
    const response = await api.post('/categories', categoryData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Update a category (admin only)
export const updateCategory = async (id, categoryData) => {
  try {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Delete a category (admin only)
export const deleteCategory = async (id) => {
  try {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};