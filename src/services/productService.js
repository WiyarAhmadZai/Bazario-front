import api from './api';

// Get all products
export const getProducts = async (params = {}) => {
  try {
    console.log('=== PRODUCT SERVICE - GET PRODUCTS ===');
    console.log('Params received:', params);
    
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
    
    console.log('Backend params to send:', backendParams);
    
    // Log the full URL that will be requested
    const urlParams = new URLSearchParams(backendParams).toString();
    console.log('Full request URL:', `/products?${urlParams}`);
    
    const response = await api.get('/products', { params: backendParams });
    console.log('API Response status:', response.status);
    console.log('API Response headers:', response.headers);
    console.log('API Response data:', response.data);
    
    // Check if response.data is an array or object
    if (response.data && typeof response.data === 'object') {
      if (Array.isArray(response.data)) {
        console.log('Response data is ARRAY with', response.data.length, 'items');
      } else if (response.data.data && Array.isArray(response.data.data)) {
        console.log('Response data is PAGINATED OBJECT with', response.data.data.length, 'items');
        console.log('Pagination info:', {
          current_page: response.data.current_page,
          last_page: response.data.last_page,
          total: response.data.total,
          per_page: response.data.per_page
        });
      } else {
        console.log('Response data is OBJECT but not paginated:', response.data);
      }
    } else {
      console.log('Response data is not an object:', typeof response.data, response.data);
    }
    
    return response.data;
  } catch (error) {
    console.error('=== PRODUCT SERVICE ERROR ===');
    console.error('Error:', error);
    console.error('Error response:', error.response);
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
    console.log('=== PRODUCT SERVICE - GET PRODUCT BY ID ===');
    console.log('Product ID:', id);
    
    const response = await api.get(`/products/${id}`);
    console.log('API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('=== PRODUCT SERVICE ERROR - GET PRODUCT BY ID ===');
    console.error('Error:', error);
    if (error.response && error.response.data) {
      throw error.response.data;
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};