import api from './api';

class SellerService {
  /**
   * Get seller's products
   * @returns {Promise}
   */
  getProducts() {
    return api.get('/seller/products');
  }

  /**
   * Create a new product
   * @param {object} productData
   * @returns {Promise}
   */
  createProduct(productData) {
    return api.post('/seller/products', productData);
  }

  /**
   * Update a product
   * @param {number} productId
   * @param {object} productData
   * @returns {Promise}
   */
  updateProduct(productId, productData) {
    return api.put(`/seller/products/${productId}`, productData);
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