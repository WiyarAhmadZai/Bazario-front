import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { getProductById } from '../services/productService';
import { addToCart as addToCartAPI } from '../services/cartService';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { isAuthenticated } = useContext(AuthContext);
  const { addToCart: addToLocalCart } = useContext(CartContext);
  const { addToWishlist, isInWishlist, removeFromWishlist } = useContext(WishlistContext);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await getProductById(id);
      setProduct(response.data);
    } catch (err) {
      setError('Failed to fetch product details');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (value) => {
    if (value >= 1 && value <= 10) {
      setQuantity(value);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      // Add to local cart for non-authenticated users
      addToLocalCart(product, quantity);
      return;
    }
    
    try {
      await addToCartAPI(product.id, quantity);
      // Also add to local cart for immediate UI update
      addToLocalCart(product, quantity);
      // Redirect to cart page
      navigate('/cart');
    } catch (err) {
      setError('Failed to add item to cart');
      console.error('Error adding to cart:', err);
    }
  };

  const handleToggleWishlist = async () => {
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
      <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4 text-white">Product Not Found</h2>
        <p className="text-gray-400 mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <button 
          onClick={() => navigate('/shop')}
          className="bg-gradient-to-r from-gold to-yellow-600 hover:from-yellow-600 hover:to-gold text-black font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div>
          <div className="mb-4">
            <img 
              src={product.images && product.images.length > 0 ? `/storage/${product.images[0]}` : `/src/assets/abstract-art-circle-clockwork-414579.jpg`} 
              alt={product.title}
              className="w-full h-96 object-cover rounded-xl shadow-lg"
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <img 
                  key={index}
                  src={`/storage/${image}`} 
                  alt={`${product.title} ${index + 1}`}
                  className={`w-full h-24 object-cover rounded-lg cursor-pointer border-2 ${selectedImage === index ? 'border-gold' : 'border-gray-600'}`}
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="mb-4">
            <span className="text-gold font-semibold">{product.category?.name || 'Product'}</span>
            <h1 className="text-3xl font-bold text-white mt-2">{product.title}</h1>
          </div>

          <div className="flex items-center mb-6">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
              ))}
            </div>
            <span className="ml-2 text-gray-400">(24 reviews)</span>
          </div>

          <p className="text-3xl font-bold text-gold mb-6">${product.price.toFixed(2)}</p>

          <p className="text-gray-300 mb-8">{product.description}</p>

          {product.features && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3 text-white">Key Features</h3>
              <ul className="grid grid-cols-2 gap-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg className="w-5 h-5 text-gold mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center mb-8">
            <div className="mr-6">
              <span className="text-gray-300 mr-3">Quantity:</span>
              <div className="flex items-center border border-gray-600 rounded-lg bg-gray-800">
                <button 
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="px-3 py-2 text-gray-300 hover:text-white"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-4 py-2 text-white">{quantity}</span>
                <button 
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="px-3 py-2 text-gray-300 hover:text-white"
                  disabled={quantity >= 10}
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex-1">
              {product.in_stock ? (
                <button 
                  onClick={handleAddToCart}
                  className="w-full bg-gradient-to-r from-gold to-yellow-600 hover:from-yellow-600 hover:to-gold text-black font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Add to Cart
                </button>
              ) : (
                <button className="w-full bg-gray-700 text-gray-500 font-bold py-3 px-6 rounded-lg cursor-not-allowed" disabled>
                  Out of Stock
                </button>
              )}
            </div>
          </div>

          <div className="border-t border-gray-700 pt-6">
            <div className="flex space-x-6">
              <button className="flex items-center text-gray-400 hover:text-gold transition-colors">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
                Share
              </button>
              <button 
                onClick={handleToggleWishlist}
                className="flex items-center text-gray-400 hover:text-gold transition-colors"
              >
                <svg 
                  className={`w-5 h-5 mr-2 ${isInWishlist(product.id) ? 'text-red-500 fill-current' : ''}`} 
                  fill={isInWishlist(product.id) ? "currentColor" : "none"} 
                  stroke="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                {isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Reviews */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-white mb-6">Customer Reviews</h2>
        <div className="bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400 mr-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
              ))}
            </div>
            <span className="text-gray-400">4.8 (24 reviews)</span>
          </div>
          
          <div className="space-y-6">
            {[1, 2, 3].map((review) => (
              <div key={review} className="border-b border-gray-700 pb-6 last:border-0 last:pb-0">
                <div className="flex justify-between mb-2">
                  <h4 className="font-semibold text-white">John D.</h4>
                  <span className="text-gray-500 text-sm">2 days ago</span>
                </div>
                <div className="flex text-yellow-400 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-gray-300">
                  Absolutely stunning watch! The craftsmanship is exceptional and it looks even better in person. 
                  Worth every penny for a special occasion piece.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;