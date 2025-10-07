import api from "./api";

// Get posts
export const getPosts = async (params = {}) => {
  try {
    const response = await api.get("/posts", { params });
    return response.data;
  } catch (error) {
    console.error("Error getting posts:", error);
    throw error;
  }
};

// Get sponsored posts
export const getSponsoredPosts = async (params = {}) => {
  try {
    const response = await api.get("/posts/sponsored", { params });
    return response.data;
  } catch (error) {
    console.error("Error getting sponsored posts:", error);
    throw error;
  }
};

// Get post comments
export const getPostComments = async (postId) => {
  try {
    const response = await api.get(`/posts/${postId}/comments`);
    return response.data;
  } catch (error) {
    console.error("Error getting post comments:", error);
    throw error;
  }
};

// Add a comment to a post
export const addPostComment = async (postId, data) => {
  try {
    const response = await api.post(`/posts/${postId}/comments`, data);
    return response.data;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};

// Create a new post
export const createPost = async (postData) => {
  try {
    const formData = new FormData();
    formData.append("content", postData.content);
    formData.append("visibility", postData.visibility || "public");

    if (postData.images && postData.images.length > 0) {
      postData.images.forEach((image, index) => {
        formData.append(`images[${index}]`, image);
      });
    }

    const response = await api.post("/posts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

// Get a specific post
export const getPost = async (postId) => {
  try {
    const response = await api.get(`/posts/${postId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting post:", error);
    throw error;
  }
};

// Update a post
export const updatePost = async (postId, postData) => {
  try {
    const formData = new FormData();
    formData.append("content", postData.content);
    formData.append("visibility", postData.visibility || "public");
    formData.append("_method", "PUT");

    if (postData.images && postData.images.length > 0) {
      postData.images.forEach((image, index) => {
        formData.append(`images[${index}]`, image);
      });
    }

    const response = await api.post(`/posts/${postId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
};

// Delete a post
export const deletePost = async (postId) => {
  try {
    const response = await api.delete(`/posts/${postId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};

// Like or unlike a post
export const likePost = async (postId) => {
  try {
    const response = await api.post(`/posts/${postId}/like`);
    return response.data;
  } catch (error) {
    console.error("Error liking post:", error);
    throw error;
  }
};

// Favorite or unfavorite a post
export const favoritePost = async (postId) => {
  try {
    const response = await api.post(`/posts/${postId}/favorite`);
    return response.data;
  } catch (error) {
    console.error("Error favoriting post:", error);
    throw error;
  }
};

export default {
  getPosts,
  getSponsoredPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
  likePost,
  favoritePost,
  getPostComments,
  addPostComment,
};
