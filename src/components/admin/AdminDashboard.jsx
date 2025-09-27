import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import ProductApproval from './ProductApproval';
import CommissionSettings from './CommissionSettings';
import UserManagement from './UserManagement';
import OrderManagement from './OrderManagement';
import Reports from './Reports';
import TransactionHistory from './TransactionHistory';
import BankTransferVerification from './BankTransferVerification';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'products':
        return <ProductApproval />;
      case 'commission':
        return <CommissionSettings />;
      case 'users':
        return <UserManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'reports':
        return <Reports />;
      case 'transactions':
        return <TransactionHistory />;
      case 'bank-transfers':
        return <BankTransferVerification />;
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="glass p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Users</span>
                  <span className="font-bold">1,248</span>
                </div>
                <div className="flex justify-between">
                  <span>Pending Products</span>
                  <span className="font-bold">24</span>
                </div>
                <div className="flex justify-between">
                  <span>Pending Transfers</span>
                  <span className="font-bold">3</span>
                </div>
                <div className="flex justify-between">
                  <span>Today's Sales</span>
                  <span className="font-bold">$2,450.00</span>
                </div>
              </div>
            </div>
            
            <div className="glass p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <p className="text-sm">New product submitted by Jane Smith</p>
                    <p className="text-xs text-gray-500">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <p className="text-sm">Order #1005 has been shipped</p>
                    <p className="text-xs text-gray-500">15 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <p className="text-sm">New bank transfer pending verification</p>
                    <p className="text-xs text-gray-500">1 hour ago</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="glass p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">System Status</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>API Status</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Operational</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Database</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Operational</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Payment Gateways</span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Degraded</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Storage</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">75% Used</span>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="text-right">
          <p className="text-gray-500">Welcome back,</p>
          <p className="font-semibold">{user?.name}</p>
        </div>
      </div>
      
      <div className="glass p-6 rounded-lg">
        <div className="flex flex-wrap gap-4 border-b border-gray-200 pb-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'overview' 
                ? 'bg-blue-500 text-white' 
                : 'hover:bg-gray-100'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'products' 
                ? 'bg-blue-500 text-white' 
                : 'hover:bg-gray-100'
            }`}
          >
            Product Approval
          </button>
          <button
            onClick={() => setActiveTab('commission')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'commission' 
                ? 'bg-blue-500 text-white' 
                : 'hover:bg-gray-100'
            }`}
          >
            Commission Settings
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'users' 
                ? 'bg-blue-500 text-white' 
                : 'hover:bg-gray-100'
            }`}
          >
            User Management
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'orders' 
                ? 'bg-blue-500 text-white' 
                : 'hover:bg-gray-100'
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'reports' 
                ? 'bg-blue-500 text-white' 
                : 'hover:bg-gray-100'
            }`}
          >
            Reports
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'transactions' 
                ? 'bg-blue-500 text-white' 
                : 'hover:bg-gray-100'
            }`}
          >
            Transactions
          </button>
          <button
            onClick={() => setActiveTab('bank-transfers')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'bank-transfers' 
                ? 'bg-blue-500 text-white' 
                : 'hover:bg-gray-100'
            }`}
          >
            Bank Transfers
          </button>
        </div>
        
        <div className="mt-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;