import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import adminService from '../../services/adminService';

const OrderManagement = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchOrders();
    }
  }, [user, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // For now, we'll use a placeholder as we don't have a specific admin orders endpoint
      // In a real implementation, this would call an admin-specific endpoint
      const response = await adminService.getUsers(); // Placeholder
      setOrders([]); // Placeholder empty array
    } catch (err) {
      setError('Failed to fetch orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      // Placeholder for actual implementation
      // await orderService.updateOrderStatus(orderId, newStatus);
      // fetchOrders(); // Refresh the order list
    } catch (err) {
      console.error('Failed to update order status', err);
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-blue-100 text-blue-800',
      processing: 'bg-indigo-100 text-indigo-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getPaymentStatusBadge = (status) => {
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

  // Placeholder data for demonstration
  const placeholderOrders = [
    {
      id: 1,
      buyer: { name: 'John Doe', email: 'john@example.com' },
      seller: { name: 'Jane Smith' },
      total_amount: 150.00,
      commission_amount: 3.00,
      seller_amount: 147.00,
      status: 'processing',
      payment_status: 'completed',
      payment_method: 'hesab_pay',
      created_at: '2023-05-15T10:30:00Z'
    },
    {
      id: 2,
      buyer: { name: 'Alice Johnson', email: 'alice@example.com' },
      seller: { name: 'Bob Wilson' },
      total_amount: 89.99,
      commission_amount: 1.80,
      seller_amount: 88.19,
      status: 'shipped',
      payment_status: 'completed',
      payment_method: 'momo',
      created_at: '2023-05-14T14:15:00Z'
    }
  ];

  const filteredOrders = placeholderOrders.filter(order => 
    (statusFilter === 'all' || order.status === statusFilter) &&
    (order.buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     order.buyer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
     order.id.toString().includes(searchTerm))
  );

  if (loading) {
    return <div className="text-center py-8">Loading orders...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="glass p-6 rounded-lg">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">Order Management</h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
            />
            <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3">Order</th>
              <th className="text-left py-3">Buyer</th>
              <th className="text-left py-3">Seller</th>
              <th className="text-left py-3">Amount</th>
              <th className="text-left py-3">Status</th>
              <th className="text-left py-3">Payment</th>
              <th className="text-left py-3">Method</th>
              <th className="text-left py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id} className="border-b">
                <td className="py-3">
                  <div className="font-medium">#{order.id}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </div>
                </td>
                <td className="py-3">
                  <div className="font-medium">{order.buyer.name}</div>
                  <div className="text-sm text-gray-500">{order.buyer.email}</div>
                </td>
                <td className="py-3">{order.seller.name}</td>
                <td className="py-3">
                  <div>${order.total_amount.toFixed(2)}</div>
                  <div className="text-sm text-gray-500">
                    Admin: ${order.commission_amount.toFixed(2)} | 
                    Seller: ${order.seller_amount.toFixed(2)}
                  </div>
                </td>
                <td className="py-3">{getStatusBadge(order.status)}</td>
                <td className="py-3">{getPaymentStatusBadge(order.payment_status)}</td>
                <td className="py-3">
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                    {order.payment_method.replace('_', ' ')}
                  </span>
                </td>
                <td className="py-3">
                  <select
                    value={order.status}
                    onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                    className="p-1 border border-gray-300 rounded text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {filteredOrders.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No orders found
        </div>
      )}
    </div>
  );
};

export default OrderManagement;