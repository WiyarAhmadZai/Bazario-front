import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, onAddToCart, onAddToWishlist }) => {
  const navigate = useNavigate();
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const calculateDiscountedPrice = (price, discount) => {
    if (!discount) return price;
    return price - (price * discount / 100);
  };

  const discountedPrice = calculateDiscountedPrice(product.price, product.discount);

  return (
    <div className="glass rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        {product.images && product.images.length > 0 ? (
          <img 
            src={product.images[0]} 
            alt={product.title} 
            className="w-full h-48 object-cover cursor-pointer"
            onClick={() => navigate(`/product/${product.id}`)}
          />
        ) : (
          <div 
            className="w-full h-48 bg-gray-200 flex items-center justify-center cursor-pointer"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            <span className="text-gray-500">No Image</span>
          </div>
        )}
        
        {product.discount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
            {product.discount}% OFF
          </div>
        )}
        
        {product.is_featured && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-sm font-bold">
            Featured
          </div>
        )}
        
        <button
          onClick={() => onAddToWishlist && onAddToWishlist(product)}
          className="absolute bottom-2 right-2 bg-gray-800 p-2 rounded-full shadow-md hover:bg-gray-700 transition-colors border border-gray-600"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 
            className="font-semibold text-lg cursor-pointer hover:text-blue-600 transition-colors"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            {product.title}
          </h3>
          <div className="text-right">
            {product.discount ? (
              <>
                <div className="text-lg font-bold">{formatCurrency(discountedPrice)}</div>
                <div className="text-sm text-gray-500 line-through">{formatCurrency(product.price)}</div>
              </>
            ) : (
              <div className="text-lg font-bold">{formatCurrency(product.price)}</div>
            )}
          </div>
        </div>
        
        <div className="flex items-center mb-3">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <svg 
                key={i} 
                className={`w-4 h-4 ${i < (product.rating || 0) ? 'fill-current' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-gray-500 ml-2">({product.review_count || 0})</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {product.stock > 0 ? (
              <span className="text-green-600">In Stock ({product.stock})</span>
            ) : (
              <span className="text-red-600">Out of Stock</span>
            )}
          </div>
          <button
            onClick={() => onAddToCart && onAddToCart(product)}
            disabled={product.stock <= 0}
            className={`px-4 py-2 rounded-lg transition-colors ${
              product.stock <= 0 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'luxury-button hover:opacity-90'
            }`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;