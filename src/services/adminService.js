import api from "./api";

// Toggle sponsor status for a product
export const toggleSponsor = async (productId, sponsorData) => {
  try {
    const response = await api.post(
      `/admin/products/${productId}/sponsor`,
      sponsorData
    );
    return response.data;
  } catch (error) {
    console.error("Error toggling sponsor status:", error);
    throw error;
  }
};

// Expire sponsorships
export const expireSponsorships = async () => {
  try {
    const response = await api.post("/admin/expire-sponsorships");
    return response.data;
  } catch (error) {
    console.error("Error expiring sponsorships:", error);
    throw error;
  }
};

export default {
  toggleSponsor,
  expireSponsorships,
};
