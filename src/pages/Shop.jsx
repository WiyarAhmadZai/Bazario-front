import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { getProducts } from '../services/productService';
import { addToCart as addToCartAPI } from '../services/cartService';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'name'
  });
  const { isAuthenticated } = useContext(AuthContext);
  const { addToCart: addToLocalCart } = useContext(CartContext);
  const { addToWishlist, isInWishlist, removeFromWishlist } = useContext(WishlistContext);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts(filters);
      setProducts(response.data || []);
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
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-4xl font-bold mb-4 md:mb-0 text-gray-800">Our Luxury Collection</h1>
        
        <div className="flex flex-wrap gap-4">
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gold shadow-sm"
          >
            <option value="">All Categories</option>
            <option value="jewelry">Jewelry</option>
            <option value="watches">Watches</option>
            <option value="bags">Bags</option>
            <option value="accessories">Accessories</option>
          </select>
          
          <select
            name="sortBy"
            value={filters.sortBy}
            onChange={handleFilterChange}
            className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gold shadow-sm"
          >
            <option value="name">Sort by Name</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="newest">Newest First</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="relative">
              <img 
                src={`/src/assets/${product.image || 'abstract-art-circle-clockwork-414579.jpg'}`} 
                alt={product.title}
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-2 right-2 bg-gold text-black px-3 py-1 rounded-full text-sm font-bold">
                New
              </div>
              <button
                onClick={() => handleToggleWishlist(product)}
                className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
              >
                <svg 
                  className={`w-5 h-5 ${isInWishlist(product.id) ? 'text-red-500 fill-current' : 'text-gray-600'}`} 
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
              <h3 className="text-xl font-bold mb-2 text-gray-800">{product.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-gold">${product.price.toFixed(2)}</span>
                <button 
                  className="bg-gold hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded-full transition-colors duration-300 shadow-md hover:shadow-lg"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">No products found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Shop;