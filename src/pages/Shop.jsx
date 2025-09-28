import React, { useState, useEffect, useContext } from 'react';
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
    sortBy: 'name'
  });
  const { isAuthenticated, user } = useContext(AuthContext);
  const { addToCart: addToLocalCart } = useContext(CartContext);
  const { addToWishlist, isInWishlist, removeFromWishlist } = useContext(WishlistContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts(currentPage);
  }, [filters, currentPage]);

  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      const response = await getProducts({ ...filters, page });
      setProducts(response.data.data || []);
      setCurrentPage(response.data.current_page || 1);
      setTotalPages(response.data.last_page || 1);
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
    setCurrentPage(1); // Reset to first page when filter changes
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
        <span className="block sm:inline">{error}</span>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
            <label className="block text-sm font-medium text-white mb-2">Max Price</label>
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              placeholder="1000"
              className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white mb-2">Sort By</label>
            <select
              name="sortBy"
              value={filters.sortBy}
              onChange={handleFilterChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all text-white"
            >
              <option value="name" className="bg-gray-700">Name</option>
              <option value="price_low" className="bg-gray-700">Price: Low to High</option>
              <option value="price_high" className="bg-gray-700">Price: High to Low</option>
              <option value="newest" className="bg-gray-700">Newest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product) => (
          <div key={product.id} className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-700">
            <div className="relative">
              <img 
                src={product.images && product.images.length > 0 ? `/storage/${product.images[0]}` : `/src/assets/abstract-art-circle-clockwork-414579.jpg`} 
                alt={product.title}
                className="w-full h-64 object-cover"
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
                <h3 className="text-xl font-bold text-white line-clamp-1">{product.title}</h3>
                {product.seller && (
                  <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">
                    By {product.seller.name}
                  </span>
                )}
              </div>
              <p className="text-gray-300 mb-4 line-clamp-2 text-sm">{product.description}</p>
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-gold">${product.price.toFixed(2)}</span>
                  {product.discount > 0 && (
                    <span className="text-sm text-gray-400 line-through">${(product.price + product.discount).toFixed(2)}</span>
                  )}
                </div>
                <button 
                  className="bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-500 hover:to-gold text-black font-bold py-2 px-4 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-16">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg ${currentPage === 1 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            >
              Previous
            </button>
            
            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              // Show first, last, current, and nearby pages
              if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-lg ${currentPage === page ? 'bg-gold text-black font-bold' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                  >
                    {page}
                  </button>
                );
              }
              
              // Show ellipsis for skipped pages
              if (page === currentPage - 2 || page === currentPage + 2) {
                return <span key={page} className="px-2 py-2 text-gray-500">...</span>;
              }
              
              return null;
            })}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg ${currentPage === totalPages ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            >
              Next
            </button>
          </nav>
        </div>
      )}

      {products.length === 0 && !loading && (
        <div className="text-center py-16">
          <div className="bg-gray-800 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-2xl font-medium text-white mb-2">No products found</h3>
          <p className="text-gray-400 max-w-md mx-auto">Try adjusting your search or filter to find what you're looking for.</p>
        </div>
      )}
    </div>
  );
};

export default Shop;