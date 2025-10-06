import api from "./api";

// Get reviews for a product
export const getProductReviews = async (productId) => {
  try {
    console.log("=== REVIEWS SERVICE - GET PRODUCT REVIEWS ===");
    console.log("Product ID:", productId);

    const response = await api.get(`/reviews/${productId}`);
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("=== REVIEWS SERVICE ERROR - GET PRODUCT REVIEWS ===");
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

// Add a review for a product
export const addProductReview = async (productId, reviewData) => {
  try {
    console.log("=== REVIEWS SERVICE - ADD PRODUCT REVIEW ===");
    console.log("Product ID:", productId);
    console.log("Review Data:", reviewData);

    const response = await api.post(`/reviews/${productId}`, reviewData);
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("=== REVIEWS SERVICE ERROR - ADD PRODUCT REVIEW ===");
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

// Add a reply to a review
export const addReviewReply = async (productId, reviewId, replyData) => {
  try {
    console.log("=== REVIEWS SERVICE - ADD REVIEW REPLY ===");
    console.log("Product ID:", productId);
    console.log("Review ID:", reviewId);
    console.log("Reply Data:", replyData);

    const response = await api.post(
      `/reviews/${productId}/reply/${reviewId}`,
      replyData
    );
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("=== REVIEWS SERVICE ERROR - ADD REVIEW REPLY ===");
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

// Delete a review or reply
export const deleteReview = async (reviewId) => {
  try {
    console.log("=== REVIEWS SERVICE - DELETE REVIEW ===");
    console.log("Review ID:", reviewId);

    const response = await api.delete(`/reviews/${reviewId}`);
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("=== REVIEWS SERVICE ERROR - DELETE REVIEW ===");
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

// Update a review or reply
export const updateReview = async (reviewId, reviewData) => {
  try {
    console.log("=== REVIEWS SERVICE - UPDATE REVIEW ===");
    console.log("Review ID:", reviewId);
    console.log("Review Data:", reviewData);

    const response = await api.put(`/reviews/${reviewId}`, reviewData);
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("=== REVIEWS SERVICE ERROR - UPDATE REVIEW ===");
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

export default {
  getProductReviews,
  addProductReview,
  addReviewReply,
  deleteReview,
  updateReview,
};
