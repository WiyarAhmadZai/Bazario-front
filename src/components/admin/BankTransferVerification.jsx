import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import adminService from '../../services/adminService';

const BankTransferVerification = () => {
  const { user } = useAuth();
  const [pendingTransfers, setPendingTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchPendingTransfers();
    }
  }, [user]);

  const fetchPendingTransfers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getPendingBankTransfers();
      setPendingTransfers(response.data.data || response.data);
    } catch (err) {
      setError('Failed to fetch pending bank transfers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (transferId) => {
    try {
      await adminService.approveBankTransfer(transferId);
      // Remove the approved transfer from the list
      setPendingTransfers(pendingTransfers.filter(transfer => transfer.id !== transferId));
    } catch (err) {
      console.error('Failed to approve bank transfer', err);
    }
  };

  const handleReject = async (transferId, reason) => {
    try {
      await adminService.rejectBankTransfer(transferId, reason);
      // Remove the rejected transfer from the list
      setPendingTransfers(pendingTransfers.filter(transfer => transfer.id !== transferId));
    } catch (err) {
      console.error('Failed to reject bank transfer', err);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return <div className="text-center py-8">Loading pending bank transfers...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="glass p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Bank Transfer Verification</h2>
      
      {pendingTransfers.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No pending bank transfers for verification</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingTransfers.map(transfer => (
            <div key={transfer.id} className="glass p-4 rounded-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold">Transfer #{transfer.id}</h3>
                  <p className="text-sm text-gray-500">
                    Order #{transfer.order_id}
                  </p>
                </div>
                {getStatusBadge(transfer.status)}
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Amount:</span>
                  <span className="font-medium">{formatCurrency(transfer.amount)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Buyer:</span>
                  <span className="font-medium">{transfer.buyer?.name || 'Unknown Buyer'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Seller:</span>
                  <span className="font-medium">{transfer.seller?.name || 'Unknown Seller'}</span>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">Receipt:</p>
                {transfer.receipt_url ? (
                  <a 
                    href={transfer.receipt_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block w-full h-32 bg-gray-100 rounded-lg overflow-hidden"
                  >
                    <img 
                      src={transfer.receipt_url} 
                      alt="Bank transfer receipt" 
                      className="w-full h-full object-contain"
                    />
                  </a>
                ) : (
                  <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">No receipt uploaded</span>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleApprove(transfer.id)}
                  className="luxury-button flex-1"
                >
                  Approve
                </button>
                <button
                  onClick={() => {
                    const reason = prompt('Enter rejection reason:');
                    if (reason) {
                      handleReject(transfer.id, reason);
                    }
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BankTransferVerification;