import React, { useState, useEffect } from 'react';
import sellerService from '../../services/sellerService';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Placeholder for actual implementation
      // In a real app, this would call an endpoint to get seller's orders
      // const response = await sellerService.getOrders();
      
      // Placeholder data for demonstration
      setOrders([
        {
          id: 1001,
          buyer: { name: 'John Doe', email: 'john@example.com' },
          total_amount: 150.00,
          commission_amount: 3.00,
          seller_amount: 147.00,
          status: 'processing',
          payment_status: 'completed',
          payment_method: 'hesab_pay',
          created_at: '2023-05-15T10:30:00Z',
          items: [
            { id: 1, product: { name: 'Luxury Watch' }, quantity: 1, price: 150.00 }
          ]
        },
        {
          id: 1002,
          buyer: { name: 'Alice Johnson', email: 'alice@example.com' },
          total_amount: 89.99,
          commission_amount: 1.80,
          seller_amount: 88.19,
          status: 'shipped',
          payment_status: 'completed',
          payment_method: 'momo',
          created_at: '2023-05-14T14:15:00Z',
          items: [
            { id: 2, product: { name: 'Designer Sunglasses' }, quantity: 1, price: 89.99 }
          ]
        },
        {
          id: 1003,
          buyer: { name: 'Charlie Brown', email: 'charlie@example.com' },
          total_amount: 250.00,
          commission_amount: 5.00,
          seller_amount: 245.00,
          status: 'pending',
          payment_status: 'pending',
          payment_method: 'bank_transfer',
          created_at: '2023-05-13T09:45:00Z',
          items: [
            { id: 3, product: { name: 'Premium Wallet' }, quantity: 2, price: 125.00 }
          ]
        }
      ]);
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
      // await sellerService.updateOrderStatus(orderId, newStatus);
      // fetchOrders(); // Refresh the order list
      
      // For demo, just update local state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const filteredOrders = orders.filter(order => 
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
              <th className="text-left py-3">Items</th>
              <th className="text-left py-3">Amount</th>
              <th className="text-left py-3">Status</th>
              <th className="text-left py-3">Payment</th>
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
                <td className="py-3">
                  <div>
                    {order.items.map(item => (
                      <div key={item.id} className="text-sm">
                        {item.product.name} × {item.quantity}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="py-3">
                  <div>{formatCurrency(order.total_amount)}</div>
                  <div className="text-sm text-gray-500">
                    You get: {formatCurrency(order.seller_amount)}
                  </div>
                </td>
                <td className="py-3">{getStatusBadge(order.status)}</td>
                <td className="py-3">{getPaymentStatusBadge(order.payment_status)}</td>
                <td className="py-3">
                  <select
                    value={order.status}
                    onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                    className="p-1 border border-gray-300 rounded text-sm"
                  >
                    <option value="pending">Pending</option>
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