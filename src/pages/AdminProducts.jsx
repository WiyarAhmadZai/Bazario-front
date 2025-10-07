import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AuthContext } from '../context/AuthContext';
import { getAdminProducts, updateProduct } from '../services/productService';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    status: '', // Empty by default to show all statuses
    sort_by: 'newest' // Sort by newest first by default
  });
  
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Check if user is admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/'); // Redirect non-admin users
    }
  }, [user, navigate]);

  // Fetch products for admin
  const fetchProducts = async (page = 1) => {
    if (!user || user.role !== 'admin') return;
    
    setLoading(true);
    setError('');
    
    try {
      // Build request params
      const params = {
        page: page,
        per_page: 12,
        sort_by: 'newest', // Always sort by newest first
        ...filters
      };
      
      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });
      
      console.log('Fetching admin products with params:', params);
      
      const response = await getAdminProducts(params);
      console.log('Admin products response:', response);
      
      if (response && response.data && Array.isArray(response.data)) {
        // Log the first few products to see their image data
        response.data.slice(0, 3).forEach(product => {
          console.log('Product ID:', product.id, 'Title:', product.title);
          console.log('Images:', product.images, 'Type:', typeof product.images);
          console.log('Parsed image URL:', getImageUrl(product.images));
          console.log('---');
        });
        
        setProducts(response.data);
        setCurrentPage(response.current_page || 1);
        setTotalPages(response.last_page || 1);
      } else if (response && typeof response === 'object' && response.data === undefined) {
        // Handle case where response is directly an array (non-paginated)
        if (Array.isArray(response)) {
          setProducts(response);
          setCurrentPage(1);
          setTotalPages(1);
        } else {
          setProducts([]);
          setCurrentPage(1);
          setTotalPages(1);
        }
      } else {
        setProducts([]);
        setCurrentPage(1);
        setTotalPages(1);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to fetch products: ' + (err.message || 'Unknown error'));
      setProducts([]);
      setCurrentPage(1);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchProducts(1);
    }
  }, [user, filters]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSearchChange = (e) => {
    setFilters({
      ...filters,
      search: e.target.value
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchProducts(page);
  };

  // Helper function to get image URL
  const getImageUrl = (imagePath) => {
    console.log('Processing image path:', imagePath, 'Type:', typeof imagePath);
    
    // Handle null, undefined, or empty paths
    if (!imagePath || imagePath === '' || imagePath === '[]' || imagePath === 'null' || imagePath === 'undefined') {
      return 'https://placehold.co/300x300/374151/FFFFFF?text=No+Image';
    }
    
    // Handle string representations of arrays (JSON) - this is the main fix
    if (typeof imagePath === 'string' && imagePath.startsWith('[')) {
      try {
        const parsed = JSON.parse(imagePath);
        console.log('Parsed image array:', parsed);
        if (Array.isArray(parsed) && parsed.length > 0) {
          imagePath = parsed[0]; // Get the first image from the parsed array
          console.log('Using first image:', imagePath);
        } else {
          return 'https://placehold.co/300x300/374151/FFFFFF?text=No+Image';
        }
      } catch (e) {
        console.error('Error parsing image array:', e, 'Input:', imagePath);
        return 'https://placehold.co/300x300/374151/FFFFFF?text=No+Image';
      }
    }
    
    // Handle direct arrays
    if (Array.isArray(imagePath)) {
      console.log('Direct array found:', imagePath);
      if (imagePath.length === 0) {
        return 'https://placehold.co/300x300/374151/FFFFFF?text=No+Image';
      }
      imagePath = imagePath[0]; // Use the first image
      console.log('Using first image from array:', imagePath);
    }
    
    // Additional check for empty or whitespace-only strings
    if (typeof imagePath === 'string' && imagePath.trim() === '') {
      return 'https://placehold.co/300x300/374151/FFFFFF?text=No+Image';
    }
    
    // Handle absolute URLs (including placeholder URLs)
    if (typeof imagePath === 'string' && imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Handle relative paths
    if (typeof imagePath === 'string') {
      if (imagePath.startsWith('/storage/')) {
        return imagePath;
      } else if (imagePath.startsWith('products/')) {
        return `/storage/${imagePath}`;
      } else if (imagePath.trim() !== '') {
        return `/storage/products/${imagePath}`;
      }
    }
    
    // Fallback for any other cases
    console.log('Using fallback image');
    return 'https://placehold.co/300x300/374151/FFFFFF?text=No+Image';
  };

  // Update product status with confirmation
  const updateProductStatus = async (productId, status) => {
    // Show confirmation dialog first
    const result = await Swal.fire({
      title: 'Confirm Status Change',
      text: `Are you sure you want to change this product's status to "${status}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, change it!',
      cancelButtonText: 'Cancel'
    });

    // If user cancels, don't proceed
    if (!result.isConfirmed) {
      return;
    }

    try {
      console.log(`Updating product ${productId} to status ${status}`);
      
      // Show loading state
      setLoading(true);
      
      const response = await updateProduct(productId, { status });
      console.log('Update response:', response);
      console.log('Response status field:', response.status);
      console.log('Response product field:', response.product);
      console.log(`Successfully updated product ${productId} to status ${status}`);
      
      // Use the status from the response if available
      const actualStatus = response.status || response.product?.status || status;
      console.log('Actual status from response:', actualStatus);
      
      // Show success message with SweetAlert
      Swal.fire({
        title: 'Success!',
        text: `Product status successfully changed to ${status}!`,
        icon: 'success',
        confirmButtonText: 'OK'
      });
      
      // Update the product status in the local state without reloading the page
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product.id === productId ? { ...product, status: actualStatus } : product
        )
      );
      
      // Clear any previous errors
      setError('');
      
      // Force refresh the products list to ensure we have the latest data
      setTimeout(() => {
        fetchProducts(currentPage);
      }, 1000);
      
    } catch (err) {
      console.error('Error updating product status:', err);
      let errorMessage = 'Failed to update product status.';
      
      if (err.response) {
        console.error('Response status:', err.response.status);
        console.error('Response data:', err.response.data);
        
        if (err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data && err.response.data.error) {
          errorMessage = err.response.data.error;
        } else if (err.response.status === 403) {
          errorMessage = 'Access denied. Admin privileges required.';
        } else if (err.response.status === 401) {
          errorMessage = 'Authentication required. Please login again.';
        } else if (err.response.status === 404) {
          errorMessage = 'Product not found.';
        }
      } else if (err.request) {
        errorMessage = 'No response from server. Please check your connection.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      
      // Show error message with SweetAlert
      Swal.fire({
        title: 'Error!',
        text: `Error: ${errorMessage}`,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">Access denied. Admins only.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-products container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-2">Product Management</h1>
          <p className="text-lg text-gray-300">Manage product approvals and status ({products.length} products)</p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => fetchProducts(currentPage)}
            disabled={loading}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center disabled:opacity-50"
            title="Refresh products list"
          >
            <svg className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl shadow-lg p-6 mb-10 bg-gradient-to-r from-gray-800 to-gray-900">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Search</label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleSearchChange}
              placeholder="Search products..."
              className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white mb-2">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all text-white"
            >
              <option value="" className="bg-gray-700">All Status</option>
              <option value="pending" className="bg-gray-700">Pending</option>
              <option value="approved" className="bg-gray-700">Approved</option>
              <option value="rejected" className="bg-gray-700">Rejected</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white mb-2">Sort By</label>
            <select
              name="sort_by"
              value={filters.sort_by || 'newest'}
              onChange={handleFilterChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all text-white"
            >
              <option value="newest" className="bg-gray-700">Newest First</option>
              <option value="name" className="bg-gray-700">Name</option>
              <option value="price_low" className="bg-gray-700">Price: Low to High</option>
              <option value="price_high" className="bg-gray-700">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="block sm:inline">{error}</span>
          </div>
          <div className="mt-2">
            <button 
              onClick={() => fetchProducts(currentPage)}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
        </div>
      )}

      {/* Products Table */}
      {!loading && (
        <div className="relative">
          {products && products.length > 0 ? (
            <>
              <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Product</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Seller</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Price</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-750">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-16 w-16">
                              <img 
                                className="h-16 w-16 object-cover rounded-lg" 
                                src={product.images && product.images.length > 0 ? 
                                  (() => {
                                    // Handle different image data formats
                                    let firstImage = null;
                                    
                                    // If product.images is an array, use the first element
                                    if (Array.isArray(product.images)) {
                                      if (product.images.length > 0) {
                                        firstImage = product.images[0];
                                      }
                                    } 
                                    // If product.images is a string
                                    else if (typeof product.images === 'string') {
                                      // If it's a JSON array string, parse it
                                      if (product.images.startsWith('[')) {
                                        try {
                                          const parsedArray = JSON.parse(product.images);
                                          if (Array.isArray(parsedArray) && parsedArray.length > 0) {
                                            firstImage = parsedArray[0];
                                          }
                                        } catch (e) {
                                          console.error('Error parsing product images array for product', product.id, e);
                                          // If parsing fails, use the string directly if it looks like a path
                                          if (product.images.length > 5 && !product.images.includes('[')) {
                                            firstImage = product.images;
                                          }
                                        }
                                      } else {
                                        // Regular string path
                                        firstImage = product.images;
                                      }
                                    }
                                    
                                    // If we couldn't extract a valid image, use placeholder
                                    if (!firstImage) {
                                      return 'https://placehold.co/300x300/374151/FFFFFF?text=No+Image';
                                    }
                                    
                                    const finalUrl = getImageUrl(firstImage);
                                    return finalUrl;
                                  })() : 
                                  'https://placehold.co/300x300/374151/FFFFFF?text=Product+Image'} 
                                alt={product.title || 'Product'}
                                onError={(e) => {
                                  e.target.src = 'https://placehold.co/300x300/374151/FFFFFF?text=Product+Image';
                                }}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-white">{product.title || 'Untitled Product'}</div>
                              <div className="text-sm text-gray-400 line-clamp-1">{product.description || 'No description'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-white">{product.seller?.name || 'Unknown Seller'}</div>
                          <div className="text-sm text-gray-400">{product.seller?.email || ''}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          ${parseFloat(product.price)?.toFixed(2) || '0.00'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            product.status === 'approved' ? 'bg-green-100 text-green-800' :
                            product.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {product.status || 'Unknown'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {product.status !== 'approved' && (
                            <button
                              onClick={() => updateProductStatus(product.id, 'approved')}
                              className="text-green-500 hover:text-green-700 mr-3"
                            >
                              Approve
                            </button>
                          )}
                          {product.status !== 'rejected' && (
                            <button
                              onClick={() => updateProductStatus(product.id, 'rejected')}
                              className="text-red-500 hover:text-red-700 mr-3"
                            >
                              Reject
                            </button>
                          )}
                          {product.status !== 'pending' && (
                            <button
                              onClick={() => updateProductStatus(product.id, 'pending')}
                              className="text-yellow-500 hover:text-yellow-700 mr-3"
                            >
                              Set Pending
                            </button>
                          )}
                          <button
                            onClick={() => navigate(`/product/${product.id}`)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-12">
                  <div className="flex space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-full transition-all ${
                          currentPage === page
                            ? 'bg-gradient-to-r from-gold to-yellow-600 text-black font-bold'
                            : 'bg-gray-700 text-white hover:bg-gray-600'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl font-bold text-white mb-2">No products found</h3>
              <p className="text-gray-400">Try adjusting your filters or check back later.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminProducts;