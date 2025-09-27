import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import adminService from '../../services/adminService';

const CommissionSettings = () => {
  const [commissionPercentage, setCommissionPercentage] = useState(2.00);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchCommissionSettings();
    }
  }, [user]);

  const fetchCommissionSettings = async () => {
    try {
      setLoading(true);
      const response = await adminService.getCommissionSettings();
      if (response.data) {
        setCommissionPercentage(response.data.percentage || 2.00);
      }
    } catch (err) {
      setError('Failed to fetch commission settings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setSuccess(null);
      setError(null);
      
      await adminService.updateCommissionSettings(commissionPercentage);
      
      setSuccess('Commission settings updated successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to update commission settings');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading commission settings...</div>;
  }

  return (
    <div className="glass p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Commission Settings</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSave}>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Commission Percentage (%)
          </label>
          <div className="flex items-center">
            <input
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={commissionPercentage}
              onChange={(e) => setCommissionPercentage(parseFloat(e.target.value) || 0)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <span className="ml-2 text-lg">%</span>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            This percentage will be applied to all sales as commission to the admin.
          </p>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-2">Commission Calculation Example</h3>
          <p className="text-sm">
            For a product priced at $100 with a {commissionPercentage}% commission:
          </p>
          <ul className="mt-2 text-sm space-y-1">
            <li className="flex justify-between">
              <span>Product Price:</span>
              <span>$100.00</span>
            </li>
            <li className="flex justify-between">
              <span>Admin Commission ({commissionPercentage}%):</span>
              <span>${(100 * commissionPercentage / 100).toFixed(2)}</span>
            </li>
            <li className="flex justify-between font-semibold">
              <span>Seller Receives:</span>
              <span>${(100 - (100 * commissionPercentage / 100)).toFixed(2)}</span>
            </li>
          </ul>
        </div>
        
        <button
          type="submit"
          disabled={saving}
          className="luxury-button px-6 py-3 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
};

export default CommissionSettings;