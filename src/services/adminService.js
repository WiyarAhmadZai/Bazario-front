import api from './api';

class AdminService {
  /**
   * Get pending products
   * @returns {Promise}
   */
  getPendingProducts() {
    return api.get('/admin/products/pending');
  }

  /**
   * Approve a product
   * @param {number} productId
   * @returns {Promise}
   */
  approveProduct(productId) {
    return api.put(`/admin/products/${productId}/approve`);
  }

  /**
   * Reject a product
   * @param {number} productId
   * @param {string} reason
   * @returns {Promise}
   */
  rejectProduct(productId, reason) {
    return api.put(`/admin/products/${productId}/reject`, { reason });
  }

  /**
   * Get commission settings
   * @returns {Promise}
   */
  getCommissionSettings() {
    return api.get('/admin/commission');
  }

  /**
   * Update commission settings
   * @param {number} percentage
   * @returns {Promise}
   */
  updateCommissionSettings(percentage) {
    return api.put('/admin/commission', { percentage });
  }

  /**
   * Get users
   * @returns {Promise}
   */
  getUsers() {
    return api.get('/admin/users');
  }

  /**
   * Manage user
   * @param {number} userId
   * @param {object} actionData
   * @returns {Promise}
   */
  manageUser(userId, actionData) {
    return api.put(`/admin/users/${userId}`, actionData);
  }

  /**
   * Get sales report
   * @param {object} params
   * @returns {Promise}
   */
  getSalesReport(params = {}) {
    return api.get('/admin/reports/sales', { params });
  }

  /**
   * Get top sellers
   * @returns {Promise}
   */
  getTopSellers() {
    return api.get('/admin/reports/top-sellers');
  }

  /**
   * Get pending bank transfers
   * @returns {Promise}
   */
  getPendingBankTransfers() {
    return api.get('/admin/bank-transfers/pending');
  }

  /**
   * Approve bank transfer
   * @param {number} transactionId
   * @returns {Promise}
   */
  approveBankTransfer(transactionId) {
    return api.put(`/admin/bank-transfers/${transactionId}/approve`);
  }

  /**
   * Reject bank transfer
   * @param {number} transactionId
   * @param {string} reason
   * @returns {Promise}
   */
  rejectBankTransfer(transactionId, reason) {
    return api.put(`/admin/bank-transfers/${transactionId}/reject`, { reason });
  }
}

export default new AdminService();