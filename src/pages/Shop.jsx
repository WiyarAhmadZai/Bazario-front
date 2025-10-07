import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { getProducts } from '../services/productService';
import { getCategories } from '../services/categoryService';
import { likeProduct, unlikeProduct, getLikeStatus, getLikeCount } from '../services/likeService';
import ShareModal from '../components/ShareModal';
// SVG Icons
const HeartIcon = ({ filled = false }) => (
  <svg className="w-4 h-4" fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const ShareIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
  </svg>
);

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
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productLikes, setProductLikes] = useState({});
  
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
        
        // Fetch like counts and status for all products
        const likePromises = response.data.map(async (product) => {
          try {
            const [likeCountResponse, likeStatusResponse] = await Promise.all([
              getLikeCount(product.id),
              getLikeStatus(product.id)
            ]);
            return { 
              productId: product.id, 
              likeCount: likeCountResponse.like_count,
              liked: likeStatusResponse.liked
            };
          } catch (err) {
            console.error(`Error fetching like data for product ${product.id}:`, err);
            return { productId: product.id, likeCount: 0, liked: false };
          }
        });
        
        const likeData = await Promise.all(likePromises);
        const likesMap = {};
        likeData.forEach(({ productId, likeCount, liked }) => {
          likesMap[productId] = { likeCount, liked };
        });
        setProductLikes(likesMap);
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

  // Like functionality
  const handleLike = async (productId, e) => {
    e.stopPropagation();
    try {
      const currentLikeStatus = productLikes[productId];
      if (currentLikeStatus?.liked) {
        await unlikeProduct(productId);
        setProductLikes(prev => ({
          ...prev,
          [productId]: { ...prev[productId], liked: false, likeCount: prev[productId].likeCount - 1 }
        }));
      } else {
        await likeProduct(productId);
        setProductLikes(prev => ({
          ...prev,
          [productId]: { ...prev[productId], liked: true, likeCount: prev[productId].likeCount + 1 }
        }));
      }
    } catch (err) {
      console.error('Error toggling like:', err);
      if (err.message === "Please login to like products" || err.message === "Please login to unlike products") {
        alert("Please login to like products");
        // Optionally redirect to login page
        // navigate('/login');
      }
    }
  };

  const handleShare = (product, e) => {
    e.stopPropagation();
    setSelectedProduct(product);
    setShowShareModal(true);
  };

  // Calculate discount percentage
  const calculateDiscountPercentage = (originalPrice, discount) => {
    if (!discount || discount <= 0) return 0;
    return Math.round((discount / originalPrice) * 100);
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
                {products.map((product) => {
                  const discountPercentage = calculateDiscountPercentage(product.price, product.discount);
                  const discountedPrice = product.price - (product.discount || 0);
                  const likeInfo = productLikes[product.id] || { likeCount: 0, liked: false };
                  
                  return (
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
                              if (imageUrl.startsWith('http')) {
                                return imageUrl;
                              } else {
                                // Fix: Check if imageUrl already starts with 'products/' to avoid duplication
                                if (imageUrl.startsWith('/storage/')) {
                                  return imageUrl;
                                } else if (imageUrl.startsWith('products/')) {
                                  return `/storage/${imageUrl}`;
                                } else {
                                  return `/storage/products/${imageUrl}`;
                                }
                              }
                            })() : 
                            'https://placehold.co/300x300/374151/FFFFFF?text=Product+Image'} 
                          alt={product.title || 'Product'}
                          className="w-full h-64 object-cover cursor-pointer"
                          onClick={() => handleViewProduct(product.id)}
                          onError={(e) => {
                            e.target.src = 'https://placehold.co/300x300/374151/FFFFFF?text=Product+Image';
                          }}
                        />
                        {/* Discount Badge */}
                        {discountPercentage > 0 && (
                          <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
                            -{discountPercentage}%
                          </div>
                        )}
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
                        
                        {/* Price Section */}
                        <div className="mb-4">
                          {discountPercentage > 0 ? (
                            <div className="flex items-center space-x-2">
                              <span className="text-2xl font-bold text-gold">${discountedPrice.toFixed(2)}</span>
                              <span className="text-gray-400 line-through text-sm">${parseFloat(product.price).toFixed(2)}</span>
                            </div>
                          ) : (
                            <span className="text-2xl font-bold text-gold">${product.price || '0.00'}</span>
                          )}
                          {product.view_count !== undefined && (
                            <span className="text-xs text-gray-400 block">Views: {product.view_count}</span>
                          )}
                        </div>
                        
                        {/* Like and Share Buttons */}
                        <div className="flex items-center justify-between mb-4">
                          <button
                            onClick={(e) => handleLike(product.id, e)}
                            className={`group flex items-center space-x-2 px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                              likeInfo.liked 
                                ? 'bg-red-500 text-white shadow-lg' 
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:shadow-md'
                            }`}
                          >
                            <HeartIcon filled={likeInfo.liked} />
                            <span className="font-medium">{likeInfo.likeCount}</span>
                          </button>
                          
                          <button
                            onClick={(e) => handleShare(product, e)}
                            className="group flex items-center space-x-2 px-4 py-2 rounded-full text-sm bg-gray-700 text-gray-300 hover:bg-gray-600 hover:shadow-md transition-all duration-300"
                          >
                            <ShareIcon />
                            <span className="font-medium">Share</span>
                          </button>
                        </div>
                        
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="w-full bg-gradient-to-r from-gold to-yellow-600 hover:from-yellow-600 hover:to-gold text-black font-bold py-2 px-4 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  );
                })}
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

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        product={selectedProduct}
      />
    </div>
  );
};

export default Shop;