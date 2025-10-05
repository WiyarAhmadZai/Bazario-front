import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { getProducts } from '../services/productService';
import { getCategories } from '../services/categoryService';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    sort_by: 'newest'
  });
  
  const { isAuthenticated } = useContext(AuthContext);
  const { addToCart: addToLocalCart } = useContext(CartContext);
  const { addToWishlist, isInWishlist, removeFromWishlist } = useContext(WishlistContext);
  const navigate = useNavigate();

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const categoryData = await getCategories();
      setCategories(categoryData);
    } catch (err) {
      console.error('Error fetching categories:', err);
      // Set fallback categories
      setCategories([
        { id: 1, name: 'Electronics', slug: 'electronics' },
        { id: 2, name: 'Fashion', slug: 'fashion' },
        { id: 3, name: 'Home & Garden', slug: 'home-garden' },
        { id: 4, name: 'Sports & Outdoors', slug: 'sports-outdoors' },
        { id: 5, name: 'Books', slug: 'books' },
        { id: 6, name: 'Beauty & Personal Care', slug: 'beauty-personal-care' },
        { id: 7, name: 'Automotive', slug: 'automotive' },
        { id: 8, name: 'Health & Wellness', slug: 'health-wellness' }
      ]);
    }
  };

  // Fetch products
  const fetchProducts = async (page = 1) => {
    setLoading(true);
    setError('');
    
    try {
      // Build request params
      const params = {
        page: page,
        status: 'approved', // Explicitly add approved status for shop page
        per_page: 12,
        sort_by: 'newest', // Explicitly set to newest
        ...filters
      };
      
      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });
      
      console.log('Fetching products with params:', params);
      
      const response = await getProducts(params);
      
      if (response && response.data && Array.isArray(response.data)) {
        console.log('Received products:', response.data);
        setProducts(response.data);
        setCurrentPage(response.current_page || 1);
        setTotalPages(response.last_page || 1);
      } else {
        setProducts([]);
        setCurrentPage(1);
        setTotalPages(1);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to fetch products. Please make sure the backend server is running.');
      setProducts([]);
      setCurrentPage(1);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchCategories();
    fetchProducts(1);
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts(1);
  }, [filters]);

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

  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = (product) => {
    addToLocalCart(product);
  };

  const handleToggleWishlist = async (product) => {
    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product);
    }
  };

  const openSellModal = () => {
    if (window.innerWidth >= 768) {
      navigate('/sell', { state: { isModal: true } });
    } else {
      navigate('/sell');
    }
  };

  return (
    <div className="shop-page container mx-auto px-4 py-8">
      {/* Header */}
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
              {categories.map((category) => (
                <option key={category.id} value={category.slug} className="bg-gray-700">
                  {category.name}
                </option>
              ))}
            </select>
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

      {/* Products Grid */}
      {!loading && (
        <div className="relative">
          {products && products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((product) => (
                  <div key={product.id} className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-700">
                    <div className="relative">
                      {/* Product Image */}
                      <img 
                        src={product.images && product.images.length > 0 ? 
                          (() => {
                            // Handle array of images
                            let imageUrl = '';
                            if (Array.isArray(product.images) && product.images.length > 0) {
                              imageUrl = product.images[0];
                            } else if (typeof product.images === 'string') {
                              try {
                                // Try to parse as JSON array
                                const imagesArray = JSON.parse(product.images);
                                if (Array.isArray(imagesArray) && imagesArray.length > 0) {
                                  imageUrl = imagesArray[0];
                                }
                              } catch (e) {
                                // If parsing fails, use the string directly
                                imageUrl = product.images;
                              }
                            }
                            
                            // Handle absolute vs relative URLs
                            return imageUrl.startsWith('http') ? imageUrl : `/storage/${imageUrl}`;
                          })() : 
                          'https://placehold.co/300x300/374151/FFFFFF?text=Product+Image'} 
                        alt={product.title || 'Product'}
                        className="w-full h-64 object-cover cursor-pointer"
                        onClick={() => handleViewProduct(product.id)}
                        onError={(e) => {
                          e.target.src = 'https://placehold.co/300x300/374151/FFFFFF?text=Product+Image';
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
                ))}
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

export default Shop;