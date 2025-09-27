import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import adminService from '../../services/adminService';

const TransactionHistory = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchTransactions();
    }
  }, [user, methodFilter, statusFilter]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      // Placeholder for actual implementation
      // const response = await adminService.getTransactionHistory({ method: methodFilter, status: statusFilter });
      
      // Placeholder data for demonstration
      setTransactions([
        {
          id: 1,
          order_id: 1001,
          amount: 150.00,
          admin_share: 3.00,
          seller_share: 147.00,
          payment_method: 'hesab_pay',
          reference: 'HP20230515001',
          status: 'completed',
          created_at: '2023-05-15T10:30:00Z',
          seller: { name: 'Jane Smith' },
          buyer: { name: 'John Doe' }
        },
        {
          id: 2,
          order_id: 1002,
          amount: 89.99,
          admin_share: 1.80,
          seller_share: 88.19,
          payment_method: 'momo',
          reference: 'MM20230514002',
          status: 'completed',
          created_at: '2023-05-14T14:15:00Z',
          seller: { name: 'Bob Wilson' },
          buyer: { name: 'Alice Johnson' }
        },
        {
          id: 3,
          order_id: 1003,
          amount: 250.00,
          admin_share: 5.00,
          seller_share: 245.00,
          payment_method: 'bank_transfer',
          reference: 'BT20230513003',
          status: 'pending',
          created_at: '2023-05-13T09:45:00Z',
          seller: { name: 'Alice Johnson' },
          buyer: { name: 'Charlie Brown' }
        }
      ]);
    } catch (err) {
      setError('Failed to fetch transactions');
      console.error(err);
    } finally {
      setLoading(false);
    }
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

  const getMethodBadge = (method) => {
    const methodClasses = {
      hesab_pay: 'bg-blue-100 text-blue-800',
      momo: 'bg-green-100 text-green-800',
      bank_transfer: 'bg-purple-100 text-purple-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${methodClasses[method] || 'bg-gray-100 text-gray-800'}`}>
        {method.replace('_', ' ')}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const filteredTransactions = transactions.filter(transaction => 
    (methodFilter === 'all' || transaction.payment_method === methodFilter) &&
    (statusFilter === 'all' || transaction.status === statusFilter) &&
    (transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
     transaction.seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     transaction.buyer.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return <div className="text-center py-8">Loading transactions...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="glass p-6 rounded-lg">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">Transaction History</h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
            />
            <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Methods</option>
            <option value="hesab_pay">Hesab Pay</option>
            <option value="momo">MoMo</option>
            <option value="bank_transfer">Bank Transfer</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3">Transaction</th>
              <th className="text-left py-3">Order</th>
              <th className="text-left py-3">Buyer</th>
              <th className="text-left py-3">Seller</th>
              <th className="text-left py-3">Amount</th>
              <th className="text-left py-3">Method</th>
              <th className="text-left py-3">Status</th>
              <th className="text-left py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map(transaction => (
              <tr key={transaction.id} className="border-b">
                <td className="py-3">
                  <div className="font-medium">#{transaction.id}</div>
                  <div className="text-sm text-gray-500">{transaction.reference}</div>
                </td>
                <td className="py-3">#{transaction.order_id}</td>
                <td className="py-3">{transaction.buyer.name}</td>
                <td className="py-3">{transaction.seller.name}</td>
                <td className="py-3">
                  <div>{formatCurrency(transaction.amount)}</div>
                  <div className="text-xs text-gray-500">
                    Admin: {formatCurrency(transaction.admin_share)} | 
                    Seller: {formatCurrency(transaction.seller_share)}
                  </div>
                </td>
                <td className="py-3">{getMethodBadge(transaction.payment_method)}</td>
                <td className="py-3">{getStatusBadge(transaction.status)}</td>
                <td className="py-3">
                  {new Date(transaction.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {filteredTransactions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No transactions found
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;