import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { getProducts } from '../services/productService';
import { addToCart as addToCartAPI } from '../services/cartService';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    search: '',
    sort_by: 'newest'
  });
  const { isAuthenticated, user } = useContext(AuthContext);
  const { addToCart: addToLocalCart } = useContext(CartContext);
  const { addToWishlist, isInWishlist, removeFromWishlist } = useContext(WishlistContext);
  const navigate = useNavigate();

  const fetchProducts = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError('');
      
      // Prepare params for the API call
      const apiParams = { 
        ...filters,
        page: page
      };
      
      const response = await getProducts(apiParams);
      
      // Handle the response properly based on Laravel pagination structure
      if (response && response.data && response.data.data && Array.isArray(response.data.data)) {
        // Laravel paginated response: { data: { data: [...], current_page: 1, last_page: 5, ... } }
        setProducts(response.data.data);
        setCurrentPage(response.data.current_page || 1);
        setTotalPages(response.data.last_page || 1);
      } else if (response && response.data && Array.isArray(response.data)) {
        // Simple pagination response: { data: [...], current_page: 1, last_page: 5, ... }
        setProducts(response.data);
        setCurrentPage(response.current_page || 1);
        setTotalPages(response.last_page || 1);
      } else if (response && Array.isArray(response)) {
        // Direct array response (no pagination)
        setProducts(response);
        setCurrentPage(1);
        setTotalPages(1);
      } else {
        setProducts([]);
        setCurrentPage(1);
        setTotalPages(1);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to fetch products. Please make sure the backend server is running. Error: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [filters]);
  
  useEffect(() => {
    fetchProducts(currentPage);
  }, [fetchProducts, currentPage]);

  const handleFilterChange = (e) => {
    e.preventDefault(); // Prevent form submission
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleSearchChange = (e) => {
    e.preventDefault(); // Prevent form submission
    setFilters({
      ...filters,
      search: e.target.value
    });
    setCurrentPage(1); // Reset to first page when search changes
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Prevent form submission
    // The search is already handled by the useEffect when filters change
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      // Add to local cart for non-authenticated users
      addToLocalCart(product);
      return;
    }
    
    try {
      await addToCartAPI(product.id, 1);
      // Also add to local cart for immediate UI update
      addToLocalCart(product);
    } catch (err) {
      setError('Failed to add item to cart');
      console.error('Error adding to cart:', err);
    }
  };

  const handleToggleWishlist = async (product) => {
    if (!isAuthenticated) {
      // For non-authenticated users, we could show a login prompt
      return;
    }
    
    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product);
    }
  };

  const openSellModal = () => {
    // Check screen size
    if (window.innerWidth >= 768) {
      // Large screen - navigate to sell page with modal state
      navigate('/sell', { state: { isModal: true } });
    } else {
      // Small screen - navigate to sell page
      navigate('/sell');
    }
  };

  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
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
    );
  }

  return (
    <div className="shop-page container mx-auto px-4 py-8">
      {/* Header with title and add product button */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-2">Our Luxury Collection</h1>
          <p className="text-lg text-gray-300">Discover exclusive items from top sellers</p>
        </div>
        
        {isAuthenticated && (
          <button 
            onClick={openSellModal}
            className="mt-4 md:mt-0 bg-gradient-to-r from-gold to-yellow-600 hover:from-yellow-600 hover:to-gold text-black font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Sell Your Product
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="rounded-2xl shadow-lg p-6 mb-10 bg-gradient-to-r from-gray-800 to-gray-900">
        <form onSubmit={handleSearchSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="md:col-span-2">
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
              <label className="block text-sm font-medium text-white mb-2">Category</label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all text-white"
              >
                <option value="" className="bg-gray-700">All Categories</option>
                <option value="jewelry" className="bg-gray-700">Jewelry</option>
                <option value="watches" className="bg-gray-700">Watches</option>
                <option value="bags" className="bg-gray-700">Bags</option>
                <option value="accessories" className="bg-gray-700">Accessories</option>
                <option value="electronics" className="bg-gray-700">Electronics</option>
                <option value="fashion" className="bg-gray-700">Fashion</option>
                <option value="home_garden" className="bg-gray-700">Home & Garden</option>
                <option value="sports_outdoors" className="bg-gray-700">Sports & Outdoors</option>
                <option value="books" className="bg-gray-700">Books</option>
                <option value="beauty_personal_care" className="bg-gray-700">Beauty & Personal Care</option>
                <option value="automotive" className="bg-gray-700">Automotive</option>
                <option value="health_wellness" className="bg-gray-700">Health & Wellness</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white mb-2">Min Price</label>
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="0"
                className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white mb-2">Sort By</label>
              <select
                name="sort_by"
                value={filters.sort_by}
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
        </form>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products && products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-700">
              <div className="relative">
                {/* Product Image */}
                <img 
                  src={product.images && product.images.length > 0 ? 
                    (product.images[0].startsWith('http') ? product.images[0] : `/storage/${product.images[0]}`) : 
                    'https://via.placeholder.com/300x300.png?text=Product+Image'} 
                  alt={product.title || 'Product'}
                  className="w-full h-64 object-cover cursor-pointer"
                  onClick={() => handleViewProduct(product.id)}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x300.png?text=Product+Image';
                  }}
                />
                <div className="absolute top-4 right-4 bg-gradient-to-r from-gold to-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold shadow-md">
                  {product.is_featured ? 'Featured' : 'New'}
                </div>
                <button
                  onClick={() => handleToggleWishlist(product)}
                  className="absolute bottom-4 right-4 bg-gray-900 p-2 rounded-full shadow-md hover:bg-gray-700 transition-colors"
                  aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <svg 
                    className={`w-5 h-5 ${isInWishlist(product.id) ? 'text-red-500 fill-current' : 'text-gray-300'}`} 
                    fill={isInWishlist(product.id) ? "currentColor" : "none"} 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 
                    className="text-xl font-bold text-white line-clamp-1 cursor-pointer hover:text-gold transition-colors"
                    onClick={() => handleViewProduct(product.id)}
                  >
                    {product.title || 'Untitled Product'}
                  </h3>
                  {product.seller && (
                    <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">
                      By {product.seller.name}
                    </span>
                  )}
                </div>
                <p className="text-gray-300 mb-4 line-clamp-2 text-sm">{product.description || 'No description available'}</p>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-gold">${product.price || '0.00'}</span>
                    {product.view_count !== undefined && (
                      <span className="text-xs text-gray-400">Views: {product.view_count}</span>
                    )}
                  </div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="bg-gradient-to-r from-gold to-yellow-600 hover:from-yellow-600 hover:to-gold text-black font-bold py-2 px-4 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <h3 className="text-xl font-bold text-white mb-2">No products found</h3>
            <p className="text-gray-400">Try adjusting your filters or check back later.</p>
          </div>
        )}
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

      {/* Empty state */}
      {products.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="bg-gray-800 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No products found</h3>
          <p className="text-gray-400">Try adjusting your filters or check back later.</p>
        </div>
      )}
    </div>
  );
};

export default Shop;