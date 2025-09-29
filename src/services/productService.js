import api from './api';

// Get all products
export const getProducts = async (params = {}) => {
  try {
    // Map frontend params to backend params
    const backendParams = {
      status: 'approved',
      ...params
    };
    
    // Handle search parameter
    if (params.search) {
      backendParams.search = params.search;
    }
    
    // Handle min_price and max_price
    if (params.minPrice) {
      backendParams.min_price = params.minPrice;
    }
    
    if (params.maxPrice) {
      backendParams.max_price = params.maxPrice;
    }
    
    const response = await api.get('/products', { params: backendParams });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};

// Get product by ID
export const getProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};

// Create a new product (admin only)
export const createProduct = async (productData) => {
  try {
    const response = await api.post('/products', productData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};

// Update a product (admin only)
export const updateProduct = async (id, productData) => {
  try {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};

// Delete a product (admin only)
export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};