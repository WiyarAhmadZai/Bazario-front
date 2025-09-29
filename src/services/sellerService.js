import api from './api';

class SellerService {
  /**
   * Get seller's products
   * @param {number} page - Page number
   * @returns {Promise}
   */
  getProducts(page = 1) {
    return api.get(`/seller/products?page=${page}`);
  }

  /**
   * Create a new product
   * @param {object} productData
   * @returns {Promise}
   */
  createProduct(productData) {
    return api.post('/seller/products', productData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  /**
   * Update a product
   * @param {number} productId
   * @param {object} productData
   * @returns {Promise}
   */
  updateProduct(productId, productData) {
    return api.post(`/seller/products/${productId}`, productData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  /**
   * Delete a product
   * @param {number} productId
   * @returns {Promise}
   */
  deleteProduct(productId) {
    return api.delete(`/seller/products/${productId}`);
  }
}

export default new SellerService();