import api from "./api";

// Follow/Unfollow a user
export const followUser = async (userId) => {
  try {
    const response = await api.post(`/follow/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error following user:", error);
    throw error;
  }
};

// Toggle notification settings for a followed user
export const toggleNotification = async (
  userId,
  type = "post",
  enabled = true
) => {
  try {
    const response = await api.post(`/follow/${userId}/notify`, {
      type,
      enabled,
    });
    return response.data;
  } catch (error) {
    console.error("Error toggling notification:", error);
    throw error;
  }
};

// Get follow status and notification settings
export const getFollowStatus = async (userId) => {
  try {
    const response = await api.get(`/follow/${userId}/status`);
    return response.data;
  } catch (error) {
    console.error("Error getting follow status:", error);
    throw error;
  }
};

// Get user's followers
export const getFollowers = async (userId, page = 1) => {
  try {
    const response = await api.get(`/follow/${userId}/followers?page=${page}`);
    return response.data;
  } catch (error) {
    console.error("Error getting followers:", error);
    throw error;
  }
};

// Get user's following
export const getFollowing = async (userId, page = 1) => {
  try {
    const response = await api.get(`/follow/${userId}/following?page=${page}`);
    return response.data;
  } catch (error) {
    console.error("Error getting following:", error);
    throw error;
  }
};

export default {
  followUser,
  toggleNotification,
  getFollowStatus,
  getFollowers,
  getFollowing,
};
