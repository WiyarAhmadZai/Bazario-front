import api from "./api";

// Simple cache for products
const productCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Get all products (public - only approved)
export const getProducts = async (params = {}) => {
  try {
    console.log("=== PRODUCT SERVICE - GET PRODUCTS ===");
    console.log("Params received:", params);

    // Create cache key
    const cacheKey = JSON.stringify(params);
    const cached = productCache.get(cacheKey);

    // Check if we have valid cached data
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log("Returning cached products data");
      return cached.data;
    }

    // Map frontend params to backend params
    // Only add status filter if it's explicitly provided
    const backendParams = { ...params };

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

    console.log("Backend params to send:", backendParams);

    // Log the full URL that will be requested
    const urlParams = new URLSearchParams(backendParams).toString();
    console.log("Full request URL:", `/products?${urlParams}`);

    const response = await api.get("/products", { params: backendParams });
    console.log("API Response status:", response.status);
    console.log("API Response headers:", response.headers);
    console.log("API Response data:", response.data);

    // Cache the response
    productCache.set(cacheKey, {
      data: response.data,
      timestamp: Date.now(),
    });

    // Clean up old cache entries (keep only last 50)
    if (productCache.size > 50) {
      const oldestKey = productCache.keys().next().value;
      productCache.delete(oldestKey);
    }

    // Check if response.data is an array or object
    if (response.data && typeof response.data === "object") {
      if (Array.isArray(response.data)) {
        console.log(
          "Response data is ARRAY with",
          response.data.length,
          "items"
        );
      } else if (response.data.data && Array.isArray(response.data.data)) {
        console.log(
          "Response data is PAGINATED OBJECT with",
          response.data.data.length,
          "items"
        );
        console.log("Pagination info:", {
          current_page: response.data.current_page,
          last_page: response.data.last_page,
          total: response.data.total,
          per_page: response.data.per_page,
        });
      } else {
        console.log(
          "Response data is OBJECT but not paginated:",
          response.data
        );
      }
    } else {
      console.log(
        "Response data is not an object:",
        typeof response.data,
        response.data
      );
    }

    return response.data;
  } catch (error) {
    console.error("=== PRODUCT SERVICE ERROR ===");
    console.error("Error:", error);
    console.error("Error response:", error.response);
    if (error.response && error.response.data) {
      throw error.response.data;
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

// Get all products for admin (all statuses)
export const getAdminProducts = async (params = {}) => {
  try {
    console.log("=== PRODUCT SERVICE - GET ADMIN PRODUCTS ===");
    console.log("Params received:", params);

    // Map frontend params to backend params
    const backendParams = { ...params };

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

    console.log("Backend params to send:", backendParams);

    // Log the full URL that will be requested
    const urlParams = new URLSearchParams(backendParams).toString();
    console.log("Full request URL:", `/admin/products?${urlParams}`);

    const response = await api.get("/admin/products", {
      params: backendParams,
    });
    console.log("API Response status:", response.status);
    console.log("API Response headers:", response.headers);
    console.log("API Response data:", response.data);

    return response.data;
  } catch (error) {
    console.error("=== PRODUCT SERVICE ERROR - GET ADMIN PRODUCTS ===");
    console.error("Error:", error);
    if (error.response) {
      console.error("Error response status:", error.response.status);
      console.error("Error response data:", error.response.data);
      if (error.response.data) {
        throw error.response.data;
      } else {
        throw new Error(
          `HTTP ${error.response.status}: ${error.response.statusText}`
        );
      }
    } else if (error.request) {
      console.error("Error request:", error.request);
      throw new Error(
        "No response received from server. Please check your connection."
      );
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error(
        "An unknown error occurred while fetching admin products"
      );
    }
  }
};

// Get product by ID
export const getProductById = async (id) => {
  try {
    console.log("=== PRODUCT SERVICE - GET PRODUCT BY ID ===");
    console.log("Product ID:", id);

    const response = await api.get(`/products/${id}`);
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("=== PRODUCT SERVICE ERROR - GET PRODUCT BY ID ===");
    console.error("Error:", error);
    if (error.response && error.response.data) {
      throw error.response.data;
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

// Update a product (admin only)
export const updateProduct = async (id, productData) => {
  try {
    console.log("=== PRODUCT SERVICE - UPDATE PRODUCT ===");
    console.log("Product ID:", id);
    console.log("Product Data:", productData);

    const response = await api.put(`/admin/products/${id}`, productData);
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("=== PRODUCT SERVICE ERROR - UPDATE PRODUCT ===");
    console.error("Error:", error);
    if (error.response) {
      console.error("Error response status:", error.response.status);
      console.error("Error response data:", error.response.data);
      if (error.response.data) {
        throw error.response.data;
      } else {
        throw new Error(
          `HTTP ${error.response.status}: ${error.response.statusText}`
        );
      }
    } else if (error.request) {
      console.error("Error request:", error.request);
      throw new Error(
        "No response received from server. Please check your connection."
      );
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred while updating the product");
    }
  }
};
