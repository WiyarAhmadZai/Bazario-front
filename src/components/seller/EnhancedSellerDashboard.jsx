import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import sellerService from '../../services/sellerService';
import ProductForm from './ProductForm';
import SalesAnalytics from './SalesAnalytics';
import OrderManagement from './OrderManagement';
import Swal from 'sweetalert2'; // Add SweetAlert2 import

const EnhancedSellerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('products');
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.role === 'seller') {
      fetchProducts();
    }
  }, [user]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await sellerService.getProducts();
      setProducts(response.data.data || response.data);
    } catch (err) {
      setError('Failed to fetch products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSaved = () => {
    setShowForm(false);
    setEditingProduct(null);
    fetchProducts();
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await sellerService.deleteProduct(productId);
        setProducts(products.filter(product => product.id !== productId));
        Swal.fire(
          'Deleted!',
          'Your product has been deleted.',
          'success'
        );
      } catch (err) {
        console.error('Failed to delete product', err);
        Swal.fire(
          'Error!',
          'Failed to delete product. Please try again.',
          'error'
        );
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'analytics':
        return <SalesAnalytics />;
      case 'orders':
        return <OrderManagement />;
      case 'products':
      default:
        if (showForm) {
          return (
            <ProductForm
              product={editingProduct}
              onSaved={handleProductSaved}
              onCancel={() => {
                setShowForm(false);
                setEditingProduct(null);
              }}
            />
          );
        }
        
        return (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">My Products</h2>
              <button
                onClick={() => setShowForm(true)}
                className="luxury-button px-4 py-2"
              >
                Add New Product
              </button>
            </div>
            
            {products.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">You haven't added any products yet</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="luxury-button px-4 py-2"
                >
                  Create Your First Product
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3">Product</th>
                      <th className="text-left py-3">Price</th>
                      <th className="text-left py-3">Stock</th>
                      <th className="text-left py-3">Status</th>
                      <th className="text-left py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.id} className="border-b">
                        <td className="py-3">
                          <div className="flex items-center">
                            {product.images && product.images.length > 0 && (
                              <img 
                                src={product.images[0]} 
                                alt={product.title} 
                                className="w-12 h-12 object-cover rounded mr-3"
                              />
                            )}
                            <div>
                              <div className="font-medium">{product.title}</div>
                              <div className="text-sm text-gray-500">{product.category?.name || 'Uncategorized'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3">${product.price}</td>
                        <td className="py-3">{product.stock}</td>
                        <td className="py-3">{getStatusBadge(product.status)}</td>
                        <td className="py-3">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        );
    }
  };

  if (loading && activeTab === 'products' && !showForm) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  if (error && activeTab === 'products' && !showForm) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Seller Dashboard</h1>
        <div className="text-right">
          <p className="text-gray-500">Welcome back,</p>
          <p className="font-semibold">{user?.name}</p>
        </div>
      </div>
      
      <div className="glass p-6 rounded-lg">
        <div className="flex flex-wrap gap-4 border-b border-gray-200 pb-4">
          <button
            onClick={() => {
              setActiveTab('products');
              setShowForm(false);
            }}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'products' && !showForm
                ? 'bg-blue-500 text-white' 
                : 'hover:bg-gray-100'
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'analytics' 
                ? 'bg-blue-500 text-white' 
                : 'hover:bg-gray-100'
            }`}
          >
            Analytics
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
        </div>
        
        <div className="mt-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default EnhancedSellerDashboard;