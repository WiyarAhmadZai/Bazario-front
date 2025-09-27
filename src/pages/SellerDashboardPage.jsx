import React from 'react';
import { useAuth } from '../context/AuthContext';
import EnhancedSellerDashboard from '../components/seller/EnhancedSellerDashboard';

const SellerDashboardPage = () => {
  const { user } = useAuth();

  if (!user || user.role !== 'seller') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You must be logged in as a seller to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <EnhancedSellerDashboard />
    </div>
  );
};

export default SellerDashboardPage;