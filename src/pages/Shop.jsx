import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { getProducts } from '../services/productService';
import { getCategories } from '../services/categoryService';
import { likeProduct, unlikeProduct, getLikeStatus, getLikeCount } from '../services/likeService';
// Removed ShareModal import - using custom share modal
import Pagination from '../components/Pagination';
import RecordsPerPageSelector from '../components/RecordsPerPageSelector';
import { ProductSkeletonGrid } from '../components/ProductSkeleton';
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
  const [totalItems, setTotalItems] = useState(0);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    sort_by: 'newest'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productLikes, setProductLikes] = useState({});
  const [isSearching, setIsSearching] = useState(false);
  
  const { isAuthenticated } = useContext(AuthContext);
  const { addToCart: addToLocalCart } = useContext(CartContext);
  const { addToWishlist, isInWishlist, removeFromWishlist, wishlistItems } = useContext(WishlistContext);
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

  // Debounced search function (optimized)
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId;
      return (searchValue) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          // Only search if value is empty or has 2+ characters
          if (searchValue === '' || searchValue.length >= 2) {
            setFilters(prev => {
              const newFilters = {
                ...prev,
                search: searchValue
              };
              setIsSearching(false);
              // Reset to page 1 and fetch products
              setCurrentPage(1);
              fetchProductsWithPerPage(1, recordsPerPage, newFilters);
              return newFilters;
            });
          } else {
            setIsSearching(false);
          }
        }, 300); // Reduced delay to 300ms for better UX
      };
    })(),
    [recordsPerPage]
  );

  // Handle search input change
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsSearching(true);
    debouncedSearch(value);
  };

  // Fetch products
  const fetchProducts = async (page = 1, customFilters = null) => {
    setLoading(true);
    setError('');
    
    try {
      // Build request params
      const activeFilters = customFilters || filters;
      const params = {
        page: page,
        status: 'approved', // Explicitly add approved status for shop page
        per_page: recordsPerPage,
        ...activeFilters
      };
      
      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });
      
      console.log('Fetching products with params:', params);
      
      const response = await getProducts(params);
      
      if (response && response.data) {
        // Handle paginated response
        const productsData = Array.isArray(response.data) ? response.data : response.data.data || [];
        console.log('=== SHOP PAGE DEBUG ===');
        console.log('Full API response:', response);
        console.log('Received products:', productsData);
        console.log('Products count:', productsData.length);
        console.log('Total products:', response.data.total || 0);
        console.log('Products by seller:');
        productsData.forEach((product, index) => {
          console.log(`${index + 1}. ID: ${product.id}, Title: ${product.title}, Seller: ${product.seller?.name} (${product.seller?.email})`);
        });
        console.log('=== END SHOP DEBUG ===');
        
        setProducts(productsData);
        setCurrentPage(response.data.current_page || 1);
        setTotalPages(response.data.last_page || 1);
        setTotalItems(response.data.total || 0);
        
        
        // Initialize like data with default values (no need to fetch immediately)
        const likesMap = {};
        productsData.forEach((product) => {
          likesMap[product.id] = {
            likeCount: 0,
            liked: false,
            loading: false
          };
        });
        setProductLikes(likesMap);
        
        // Fetch like counts and status in background (non-blocking)
        fetchLikeDataInBackground(productsData);
      } else {
        setProducts([]);
        setCurrentPage(1);
        setTotalPages(1);
        setTotalItems(0);
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

  // Fetch products with specific per_page value
  const fetchProductsWithPerPage = async (page = 1, perPage = recordsPerPage, customFilters = null) => {
    setLoading(true);
    setError('');
    
    try {
      // Build request params
      const activeFilters = customFilters || filters;
      const params = {
        page: page,
        status: 'approved', // Explicitly add approved status for shop page
        per_page: perPage,
        ...activeFilters
      };
      
      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });
      
      console.log('Fetching products with params:', params);
      
      const response = await getProducts(params);
      
      if (response && response.data) {
        // Handle paginated response
        const productsData = Array.isArray(response.data) ? response.data : response.data.data || [];
        console.log('=== SHOP PAGE DEBUG ===');
        console.log('Full API response:', response);
        console.log('Received products:', productsData);
        console.log('Products count:', productsData.length);
        console.log('Total products:', response.data.total || 0);
        console.log('Products by seller:');
        productsData.forEach((product, index) => {
          console.log(`${index + 1}. ID: ${product.id}, Title: ${product.title}, Seller: ${product.seller?.name} (${product.seller?.email})`);
        });
        console.log('=== END SHOP DEBUG ===');
        
        setProducts(productsData);
        setCurrentPage(response.data.current_page || 1);
        setTotalPages(response.data.last_page || 1);
        setTotalItems(response.data.total || 0);
        
        
        // Initialize like data with default values (no need to fetch immediately)
        const likesMap = {};
        productsData.forEach((product) => {
          likesMap[product.id] = {
            likeCount: 0,
            liked: false,
            loading: false
          };
        });
        setProductLikes(likesMap);
        
        // Fetch like counts and status in background (non-blocking)
        fetchLikeDataInBackground(productsData);
      } else {
        setProducts([]);
        setCurrentPage(1);
        setTotalPages(1);
        setTotalItems(0);
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

  // Fetch like data in background without blocking UI
  const fetchLikeDataInBackground = async (products) => {
    try {
      const likePromises = products.map(async (product) => {
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
        likesMap[productId] = {
          likeCount,
          liked,
          loading: false
        };
      });
      setProductLikes(prev => ({ ...prev, ...likesMap }));
    } catch (err) {
      console.error('Error fetching like data in background:', err);
    }
  };

  // Initial load
  useEffect(() => {
    fetchCategories();
    fetchProductsWithPerPage(1, recordsPerPage);
  }, []);

  // Refresh data when products are updated
  useEffect(() => {
    const checkForUpdates = () => {
      const lastUpdate = localStorage.getItem('productUpdated');
      if (lastUpdate) {
        const updateTime = parseInt(lastUpdate);
        const now = Date.now();
        // If update was within last 30 seconds, refresh data
        if (now - updateTime < 30000) {
          fetchProducts(currentPage);
          localStorage.removeItem('productUpdated');
        }
      }
    };

    checkForUpdates(); // Check immediately when component mounts
  }, [currentPage]);

  // Remove this useEffect as we now handle filter changes directly in handleFilterChange

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = {
      ...filters,
      [name]: value
    };
    setFilters(newFilters);
    // Reset to page 1 when filters change
    setCurrentPage(1);
    fetchProductsWithPerPage(1, recordsPerPage, newFilters);
  };

  // Clear all filters
  const clearFilters = () => {
    const clearedFilters = {
      category: '',
      search: '',
      sort_by: 'newest'
    };
    setFilters(clearedFilters);
    setSearchTerm('');
    setCurrentPage(1);
    fetchProductsWithPerPage(1, recordsPerPage, clearedFilters);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchProductsWithPerPage(page, recordsPerPage);
  };

  const handleRecordsPerPageChange = (e) => {
    const newRecordsPerPage = parseInt(e.target.value);
    setRecordsPerPage(newRecordsPerPage);
    setCurrentPage(1); // Reset to first page
    // Use the new value directly in the API call
    fetchProductsWithPerPage(1, newRecordsPerPage);
  };

  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = (product) => {
    addToLocalCart(product);
  };

  const handleToggleWishlist = async (product) => {
    try {
      if (isInWishlist(product.id)) {
        await removeFromWishlist(product.id);
      } else {
        await addToWishlist(product);
      }
    } catch (error) {
      console.error('Shop: Error toggling wishlist:', error);
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
    const url = `${window.location.origin}/product/${product.id}`;
    const title = product?.title || 'Check out this product';
    
    if (navigator.share) {
      navigator.share({
        title: title,
        text: `Check out this product: ${title}`,
        url: url
      });
    } else {
      navigator.clipboard.writeText(url);
      Swal.fire({
        title: 'Link Copied!',
        text: 'Product link has been copied to clipboard',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    }
  };

  // Calculate discount percentage
  const calculateDiscountPercentage = (originalPrice, discount) => {
    if (!discount || discount <= 0) return 0;
    // Discount is already stored as a percentage, so return it directly
    return Math.round(discount);
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
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-semibold text-white">Filter Products</h3>
            {(filters.search || filters.category || filters.sort_by !== 'newest') && (
              <div className="flex flex-wrap gap-2 mt-2">
                {filters.search && (
                  <span className="px-2 py-1 bg-gold text-black text-xs rounded-full">
                    Search: "{filters.search}"
                  </span>
                )}
                {filters.category && (
                  <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                    Category: {categories.find(c => c.slug === filters.category)?.name || filters.category}
                  </span>
                )}
                {filters.sort_by !== 'newest' && (
                  <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                    Sort: {filters.sort_by.replace('_', ' ')}
                  </span>
                )}
              </div>
            )}
          </div>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Clear All Filters
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-white mb-2">
              Search {isSearching && <span className="text-gold text-xs">(Searching...)</span>}
            </label>
            <div className="relative">
              <input
                type="text"
                name="search"
                value={searchTerm}
                onChange={handleSearchInputChange}
                placeholder="Search products..."
                className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all text-white"
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    const clearedFilters = { ...filters, search: '' };
                    setFilters(clearedFilters);
                    setCurrentPage(1);
                    fetchProducts(1, clearedFilters);
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  title="Clear search"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
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
          
          <RecordsPerPageSelector
            value={recordsPerPage}
            onChange={handleRecordsPerPageChange}
            label="Products per Page"
            options={[10, 20, 30, 40, 50]}
          />
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
        <div className="py-8">
          <ProductSkeletonGrid count={recordsPerPage} />
        </div>
      )}

      {/* Products Grid */}
      {!loading && (
        <div className="relative">
          {products && products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {products.map((product) => {
                  const discountPercentage = calculateDiscountPercentage(product.price, product.discount);
                  const discountedPrice = product.price - (product.price * (product.discount || 0) / 100);
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
                          className="w-full h-48 object-cover cursor-pointer"
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
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleToggleWishlist(product);
                          }}
                          className={`absolute bottom-4 right-4 p-2 rounded-full shadow-md transition-colors ${
                            isInWishlist(product.id) 
                              ? 'bg-red-500 text-white hover:bg-red-600' 
                              : 'bg-gray-900 text-gray-300 hover:bg-gray-700'
                          }`}
                          aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                        >
                          <HeartIcon filled={isInWishlist(product.id)} />
                        </button>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 
                            className="text-xl font-bold text-white line-clamp-1 cursor-pointer hover:text-gold transition-colors"
                            onClick={() => handleViewProduct(product.id)}
                          >
                            {product.title || 'Untitled Product'}
                          </h3>
                          {product.seller && (
                            <span className="text-[10px] bg-gray-700 text-gray-300 px-2 py-1 rounded-full">
                              By {product.seller.name}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-300 mb-3 line-clamp-2 text-sm">{product.description || 'No description available'}</p>
                        
                        {/* Price Section */}
                        <div className="mb-3">
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
                        <div className="flex items-center justify-between mb-3">
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
              
              {/* Enhanced Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalItems={totalItems}
                itemsPerPage={recordsPerPage}
              />
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
      {showShareModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 max-w-md w-full border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Share Product</h3>
              <button 
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <button 
                onClick={() => shareProduct('facebook')}
                className="flex flex-col items-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <svg className="w-6 h-6 text-blue-500 mb-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                </svg>
                <span className="text-white text-sm">Facebook</span>
              </button>
              <button 
                onClick={() => shareProduct('twitter')}
                className="flex flex-col items-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <svg className="w-6 h-6 text-blue-400 mb-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
                <span className="text-white text-sm">Twitter</span>
              </button>
              <button 
                onClick={() => shareProduct('whatsapp')}
                className="flex flex-col items-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <svg className="w-6 h-6 text-green-500 mb-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                <span className="text-white text-sm">WhatsApp</span>
              </button>
              <button 
                onClick={() => shareProduct('linkedin')}
                className="flex flex-col items-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <svg className="w-6 h-6 text-blue-600 mb-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                <span className="text-white text-sm">LinkedIn</span>
              </button>
              <button 
                onClick={() => shareProduct('email')}
                className="flex flex-col items-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <svg className="w-6 h-6 text-gray-300 mb-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                <span className="text-white text-sm">Email</span>
              </button>
              <button 
                onClick={() => shareProduct('copy')}
                className="flex flex-col items-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <svg className="w-6 h-6 text-gold mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span className="text-white text-sm">Copy Link</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;