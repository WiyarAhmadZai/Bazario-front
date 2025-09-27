import api from './api';

class PaymentService {
  /**
   * Process payment for an order
   * @param {number} orderId
   * @param {string} paymentMethod
   * @returns {Promise}
   */
  processPayment(orderId, paymentMethod) {
    return api.post(`/payments/process/${orderId}`, { payment_method: paymentMethod });
  }

  /**
   * Confirm bank transfer payment
   * @param {number} orderId
   * @param {File} receipt
   * @returns {Promise}
   */
  confirmBankTransfer(orderId, receipt) {
    const formData = new FormData();
    formData.append('receipt', receipt);
    return api.post(`/payments/confirm-bank-transfer/${orderId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * Simulate payment for testing
   * @param {string} gateway
   * @returns {Promise}
   */
  simulatePayment(gateway) {
    // This is a mock function for testing purposes
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: `Payment simulated for ${gateway}` });
      }, 1000);
    });
  }
}

export default new PaymentService();