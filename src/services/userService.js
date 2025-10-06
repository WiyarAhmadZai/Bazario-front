import api from './api';

// Get user profile by ID
export const getUserProfile = async (id) => {
  try {
    console.log('=== USER SERVICE - GET USER PROFILE ===');
    console.log('User ID:', id);
    
    const response = await api.get(`/users/${id}`);
    console.log('API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('=== USER SERVICE ERROR - GET USER PROFILE ===');
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

export default {
  getUserProfile
};