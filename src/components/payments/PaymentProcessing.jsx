import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import paymentService from '../../services/paymentService';

const PaymentProcessing = ({ order, onPaymentSuccess }) => {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const navigate = useNavigate();

  const paymentMethods = [
    { id: 'hesab_pay', name: 'Hesab Pay', description: 'Afghan payment gateway' },
    { id: 'momo', name: 'MoMo', description: 'Mobile money payment' },
    { id: 'bank_transfer', name: 'Bank Transfer', description: 'Manual bank transfer' },
    { id: 'cod', name: 'Cash on Delivery', description: 'Pay when you receive the order' }
  ];

  const handlePayment = async () => {
    if (!selectedMethod) {
      setError('Please select a payment method');
      return;
    }

    try {
      setProcessing(true);
      setError(null);

      if (selectedMethod === 'bank_transfer' && receipt) {
        // Handle bank transfer with receipt
        await paymentService.confirmBankTransfer(order.id, receipt);
        onPaymentSuccess('Bank transfer receipt uploaded. Waiting for admin verification.');
      } else {
        // Handle other payment methods
        const response = await paymentService.processPayment(order.id, selectedMethod);
        
        if (selectedMethod === 'hesab_pay' || selectedMethod === 'momo') {
          // For gateway payments, show simulation option for testing
          alert(`Redirect to ${selectedMethod} payment gateway. For testing, click OK to simulate payment.`);
          // Simulate successful payment
          onPaymentSuccess(`Payment processed successfully via ${selectedMethod}`);
        } else if (selectedMethod === 'cod') {
          onPaymentSuccess('Order placed successfully. You will pay when you receive the order.');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process payment');
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const handleSimulatePayment = async () => {
    try {
      setProcessing(true);
      await paymentService.simulatePayment(selectedMethod);
      onPaymentSuccess(`Payment simulated successfully for ${selectedMethod}`);
    } catch (err) {
      setError('Failed to simulate payment');
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="glass p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Payment Processing</h2>
      
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">Order Summary</h3>
        <div className="flex justify-between mb-1">
          <span>Product Price:</span>
          <span>${order.total_amount?.toFixed(2) || '0.00'}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span>Platform Commission (2%):</span>
          <span>${(order.total_amount * 0.02).toFixed(2) || '0.00'}</span>
        </div>
        <div className="flex justify-between font-semibold border-t pt-2">
          <span>Amount to Seller:</span>
          <span>${(order.total_amount * 0.98).toFixed(2) || '0.00'}</span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="mb-6">
        <h3 className="font-semibold mb-3">Select Payment Method</h3>
        <div className="space-y-3">
          {paymentMethods.map(method => (
            <div 
              key={method.id}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                selectedMethod === method.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedMethod(method.id)}
            >
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full border mr-3 ${
                  selectedMethod === method.id 
                    ? 'bg-blue-500 border-blue-500' 
                    : 'border-gray-300'
                }`}>
                  {selectedMethod === method.id && (
                    <div className="w-2 h-2 bg-gray-300 rounded-full m-0.5"></div>
                  )}
                </div>
                <div>
                  <div className="font-medium">{method.name}</div>
                  <div className="text-sm text-gray-500">{method.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedMethod === 'bank_transfer' && (
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
          <h3 className="font-semibold mb-2">Bank Transfer Details</h3>
          <p className="text-sm mb-3">
            Please transfer the amount to the following bank account:
          </p>
          <div className="bg-black bg-opacity-30 backdrop-blur-lg p-3 rounded mb-3 border border-gray-700">
            <div className="flex justify-between mb-1">
              <span>Account Name:</span>
              <span>Luxury Marketplace</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Account Number:</span>
              <span>1234567890</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Bank Name:</span>
              <span>Sample Bank</span>
            </div>
            <div className="flex justify-between">
              <span>Reference:</span>
              <span>ORDER-{order.id}</span>
            </div>
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-2">
              Upload Receipt
            </label>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setReceipt(e.target.files[0])}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          onClick={handlePayment}
          disabled={processing || !selectedMethod || (selectedMethod === 'bank_transfer' && !receipt)}
          className="luxury-button px-6 py-3 disabled:opacity-50"
        >
          {processing ? 'Processing...' : 'Proceed with Payment'}
        </button>
        
        {(selectedMethod === 'hesab_pay' || selectedMethod === 'momo') && (
          <button
            onClick={handleSimulatePayment}
            disabled={processing}
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
          >
            Simulate Payment (Test)
          </button>
        )}
        
        <button
          onClick={() => navigate('/orders')}
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PaymentProcessing;