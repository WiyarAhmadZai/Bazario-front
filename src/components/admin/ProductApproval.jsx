import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import adminService from '../../services/adminService';

const ProductApproval = () => {
  const [pendingProducts, setPendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchPendingProducts();
    }
  }, [user]);

  const fetchPendingProducts = async () => {
    try {
      setLoading(true);
      const response = await adminService.getPendingProducts();
      setPendingProducts(response.data.data || response.data);
    } catch (err) {
      setError('Failed to fetch pending products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (productId) => {
    try {
      await adminService.approveProduct(productId);
      // Remove the approved product from the list
      setPendingProducts(pendingProducts.filter(product => product.id !== productId));
    } catch (err) {
      console.error('Failed to approve product', err);
    }
  };

  const handleReject = async (productId, reason) => {
    try {
      await adminService.rejectProduct(productId, reason);
      // Remove the rejected product from the list
      setPendingProducts(pendingProducts.filter(product => product.id !== productId));
    } catch (err) {
      console.error('Failed to reject product', err);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading pending products...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="glass p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Product Approval</h2>
      
      {pendingProducts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No pending products for approval</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingProducts.map(product => (
            <div key={product.id} className="glass p-4 rounded-lg">
              <div className="flex items-center mb-4">
                {product.images && product.images.length > 0 && (
                  <img 
                    src={product.images[0]} 
                    alt={product.title} 
                    className="w-16 h-16 object-cover rounded mr-4"
                  />
                )}
                <div>
                  <h3 className="font-semibold">{product.title}</h3>
                  <p className="text-sm text-gray-500">by {product.seller?.name || 'Unknown Seller'}</p>
                </div>
              </div>
              
              <p className="text-sm mb-4 line-clamp-2">{product.description}</p>
              
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold">${product.price}</span>
                <span className="text-sm px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                  {product.category?.name || 'Uncategorized'}
                </span>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleApprove(product.id)}
                  className="luxury-button flex-1"
                >
                  Approve
                </button>
                <button
                  onClick={() => {
                    const reason = prompt('Enter rejection reason:');
                    if (reason) {
                      handleReject(product.id, reason);
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

export default ProductApproval;