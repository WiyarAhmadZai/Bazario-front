import api from "./api";

// Register a new user
export const register = async (userData) => {
  try {
    const response = await api.post("/register", userData);
    return response.data;
  } catch (error) {
    // Handle different types of errors
    if (error.response && error.response.data) {
      // Return the response data even for error status codes
      // This allows the frontend to handle redirect_to_verification
      return error.response.data;
    } else if (error.message) {
      throw { message: error.message };
    } else {
      throw { message: "An unexpected error occurred" };
    }
  }
};

// Login user
export const login = async (credentials) => {
  try {
    const response = await api.post("/login", credentials);
    return response.data;
  } catch (error) {
    // Handle different types of errors
    if (error.response && error.response.data) {
      // Return the response data even for error status codes
      // This allows the frontend to handle redirect_to_verification
      return error.response.data;
    } else if (error.message) {
      throw { message: error.message };
    } else {
      throw { message: "An unexpected error occurred" };
    }
  }
};

// Logout user
export const logout = async () => {
  try {
    const response = await api.post("/logout");
    return response.data;
  } catch (error) {
    // Handle different types of errors
    if (error.response && error.response.data) {
      throw error.response.data;
    } else if (error.message) {
      throw { message: error.message };
    } else {
      throw { message: "An unexpected error occurred" };
    }
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const response = await api.get("/user");
    return response.data;
  } catch (error) {
    // Handle different types of errors
    if (error.response && error.response.data) {
      throw error.response.data;
    } else if (error.message) {
      throw { message: error.message };
    } else {
      throw { message: "An unexpected error occurred" };
    }
  }
};

// Update user profile
export const updateProfile = async (userData, isMultipart = false) => {
  try {
    const config = {
      headers: isMultipart
        ? {
            "Content-Type": "multipart/form-data",
          }
        : {
            "Content-Type": "application/json",
          },
    };

    // Use POST for multipart (file uploads) and PUT for regular updates
    const method = isMultipart ? "post" : "put";
    const response = await api[method]("/user/profile", userData, config);

    console.log("Profile update response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Profile update error:", error);

    // Handle different types of errors
    if (error.response && error.response.data) {
      throw error.response.data;
    } else if (error.message) {
      throw { message: error.message };
    } else {
      throw { message: "An unexpected error occurred" };
    }
  }
};
