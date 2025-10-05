import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { getProductById, getProducts } from '../services/productService';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [relatedProductsPage, setRelatedProductsPage] = useState(1);
  const [relatedProductsTotalPages, setRelatedProductsTotalPages] = useState(1);
  const { isAuthenticated, user } = useContext(AuthContext);
  const { addToCart: addToLocalCart } = useContext(CartContext);
  const { addToWishlist, isInWishlist, removeFromWishlist } = useContext(WishlistContext);

  useEffect(() => {
    fetchProduct();
    fetchRelatedProducts(1);
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await getProductById(id);
      setProduct(response);
      setSelectedImage(0); // Reset to first image
    } catch (err) {
      setError('Failed to fetch product details');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (page = 1) => {
    if (!product) return;
    
    try {
      const response = await getProducts({
        category: product.category?.slug,
        exclude: product.id,
        page: page,
        per_page: 5 // Only 5 related products per page
      });
      
      if (response && response.data && Array.isArray(response.data)) {
        setRelatedProducts(response.data);
        setRelatedProductsPage(response.current_page || 1);
        setRelatedProductsTotalPages(response.last_page || 1);
      }
    } catch (err) {
      console.error('Error fetching related products:', err);
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
      // Assuming addToCartAPI exists - you'll need to implement this
      // await addToCartAPI(product.id, quantity);
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

  const handleRelatedProductsPageChange = (page) => {
    setRelatedProductsPage(page);
    fetchRelatedProducts(page);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://placehold.co/300x300/374151/FFFFFF?text=Product+Image';
    
    // Handle absolute vs relative URLs
    if (imagePath.startsWith('http')) {
      return imagePath;
    } else {
      // Fix: Check if imagePath already starts with 'products/' to avoid duplication
      if (imagePath.startsWith('/storage/')) {
        return imagePath;
      } else if (imagePath.startsWith('products/')) {
        return `/storage/${imagePath}`;
      } else {
        return `/storage/products/${imagePath}`;
      }
    }
  };

  const parseImages = (images) => {
    if (!images) return [];
    
    // Handle array of images
    if (Array.isArray(images)) {
      return images;
    }
    
    // Handle string (possibly JSON)
    if (typeof images === 'string') {
      try {
        // Try to parse as JSON array
        const imagesArray = JSON.parse(images);
        if (Array.isArray(imagesArray)) {
          return imagesArray;
        }
      } catch (e) {
        // If parsing fails, return as single item array
        return [images];
      }
    }
    
    return [];
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

  const productImages = parseImages(product.images);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div>
          <div className="mb-4">
            {productImages.length > 0 ? (
              <img 
                src={getImageUrl(productImages[selectedImage])}
                alt={product.title}
                className="w-full h-96 object-cover rounded-xl shadow-lg"
              />
            ) : (
              <img 
                src="https://placehold.co/600x400/374151/FFFFFF?text=Product+Image"
                alt={product.title}
                className="w-full h-96 object-cover rounded-xl shadow-lg"
              />
            )}
          </div>
          {productImages.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {productImages.map((image, index) => (
                <img 
                  key={index}
                  src={getImageUrl(image)} 
                  alt={`${product.title} ${index + 1}`}
                  className={`w-full h-24 object-cover rounded-lg cursor-pointer border-2 ${selectedImage === index ? 'border-gold' : 'border-gray-600'}`}
                  onClick={() => setSelectedImage(index)}
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/300x300/374151/FFFFFF?text=Product+Image';
                  }}
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

          <p className="text-3xl font-bold text-gold mb-6">${parseFloat(product.price)?.toFixed(2) || '0.00'}</p>

          <p className="text-gray-300 mb-8">{product.description}</p>

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
              {product.stock > 0 ? (
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

      {/* Related Products */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-white mb-6">Related Products</h2>
        {relatedProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {relatedProducts.map((relatedProduct) => {
                const relatedImages = parseImages(relatedProduct.images);
                return (
                  <div 
                    key={relatedProduct.id} 
                    className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-700 cursor-pointer"
                    onClick={() => navigate(`/product/${relatedProduct.id}`)}
                  >
                    <div className="relative">
                      <img 
                        src={relatedImages.length > 0 ? getImageUrl(relatedImages[0]) : 'https://placehold.co/300x300/374151/FFFFFF?text=Product+Image'} 
                        alt={relatedProduct.title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.target.src = 'https://placehold.co/300x300/374151/FFFFFF?text=Product+Image';
                        }}
                      />
                      <div className="absolute top-2 right-2 bg-gradient-to-r from-gold to-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold">
                        {relatedProduct.is_featured ? 'Featured' : 'New'}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-white line-clamp-1">{relatedProduct.title || 'Untitled Product'}</h3>
                      <p className="text-gold font-bold mt-2">${parseFloat(relatedProduct.price)?.toFixed(2) || '0.00'}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Pagination for related products */}
            {relatedProductsTotalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex space-x-2">
                  {Array.from({ length: relatedProductsTotalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handleRelatedProductsPageChange(page)}
                      className={`px-3 py-1 rounded-full transition-all ${
                        relatedProductsPage === page
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
          <div className="text-center py-8 text-gray-400">
            No related products found in this category.
          </div>
        )}
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