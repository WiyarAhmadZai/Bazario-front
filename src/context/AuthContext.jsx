import React, { createContext, useState, useEffect, useContext } from 'react';
import { getCurrentUser } from '../services/authService';

// Create the context
export const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in when app loads
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
          // First set the user from localStorage for immediate UI update
          const parsedUserData = JSON.parse(userData);
          // Ensure the user object has a role property
          if (parsedUserData && typeof parsedUserData === 'object') {
            if (!parsedUserData.role) {
              parsedUserData.role = 'customer'; // Default role
            }
            setUser(parsedUserData);
          }
          
          // Then fetch fresh data from server to ensure sync (but only once)
          try {
            const freshUserData = await getCurrentUser();
            // Only update if data is actually different
            if (JSON.stringify(freshUserData) !== JSON.stringify(parsedUserData)) {
              localStorage.setItem('user', JSON.stringify(freshUserData));
              setUser(freshUserData);
            }
          } catch (error) {
            console.error('Failed to fetch fresh user data:', error);
            // If server request fails, keep using localStorage data
            // Only logout if it's specifically a 401 error (unauthorized)
            if (error.response?.status === 401) {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              setUser(null);
            }
          }
        }
      } catch (error) {
        console.error('Error reading from localStorage:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []); // Empty dependency array to run only once

  // Login function
  const login = (userData, token) => {
    try {
      // Ensure the user object has a role property
      if (userData && typeof userData === 'object' && !userData.role) {
        userData.role = 'customer'; // Default role
      }
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  // Logout function
  const logout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  };

  // Update user profile
  const updateProfile = (userData) => {
    try {
      // Ensure the user object has a role property
      if (userData && typeof userData === 'object' && !userData.role) {
        userData.role = 'customer'; // Default role
      }
      
      // Always update both localStorage and state with fresh data
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      // Force a refresh of the user data to ensure sync
      console.log('Profile updated:', userData);
    } catch (error) {
      console.error('Error updating profile in localStorage:', error);
    }
  };

  // Check if user is admin
  const isAdmin = user && user.role === 'admin';

  // Check if user is authenticated
  const isAuthenticated = !!user && !!localStorage.getItem('token');

  const value = {
    user,
    login,
    logout,
    updateProfile,
    isAdmin,
    isAuthenticated,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};