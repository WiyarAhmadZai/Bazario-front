import React, { useState, useEffect } from 'react';
import { getProducts } from '../services/productService';
import { getOrders } from '../services/orderService';
import { getCategories } from '../services/categoryService';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, ordersRes, categoriesRes] = await Promise.all([
        getProducts(),
        getOrders(),
        getCategories()
      ]);
      
      setProducts(productsRes.data);
      setOrders(ordersRes.data);
      setCategories(categoriesRes.data);
    } catch (err) {
      console.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total), 0);
  const pendingOrders = orders.filter(order => order.status === 'pending').length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="glass p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-gold">${totalRevenue.toFixed(2)}</p>
        </div>
        
        <div className="glass p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Total Orders</h3>
          <p className="text-3xl font-bold text-gold">{orders.length}</p>
        </div>
        
        <div className="glass p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Pending Orders</h3>
          <p className="text-3xl font-bold text-gold">{pendingOrders}</p>
        </div>
        
        <div className="glass p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Products</h3>
          <p className="text-3xl font-bold text-gold">{products.length}</p>
        </div>
      </div>
      
      {/* Recent Orders */}
      <div className="glass p-6 rounded-lg mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Recent Orders</h2>
          <button className="luxury-button px-4 py-2 text-sm">
            View All Orders
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap">#{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.user?.name || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${order.total}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Manage Products</h3>
          <p className="text-gray-600 mb-4">Add, edit, or remove products from your store.</p>
          <button className="luxury-button w-full">
            Manage Products
          </button>
        </div>
        
        <div className="glass p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Manage Categories</h3>
          <p className="text-gray-600 mb-4">Organize your products into categories.</p>
          <button className="luxury-button w-full">
            Manage Categories
          </button>
        </div>
        
        <div className="glass p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Manage Orders</h3>
          <p className="text-gray-600 mb-4">View and update order statuses.</p>
          <button className="luxury-button w-full">
            Manage Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;