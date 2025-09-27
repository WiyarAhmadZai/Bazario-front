import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from './ProductCard';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();

  const handleAddToCart = (product) => {
    // In a real implementation, this would add the product to the cart
    console.log('Adding to cart:', product);
  };

  const handleRemoveFromWishlist = (productId) => {
    removeFromWishlist(productId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
      
      {wishlistItems.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium">Your wishlist is empty</h3>
          <p className="mt-1 text-gray-500">Start adding products to your wishlist</p>
        </div>
      ) : (
        <div>
          <div className="mb-4 flex justify-between items-center">
            <p className="text-gray-600">{wishlistItems.length} items in wishlist</p>
            <button
              onClick={() => {
                // In a real implementation, this would clear all items
                console.log('Clearing wishlist');
              }}
              className="text-red-600 hover:text-red-800"
            >
              Clear Wishlist
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div key={item.id} className="relative">
                <ProductCard 
                  product={item.product} 
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={() => handleRemoveFromWishlist(item.product.id)}
                />
                <button
                  onClick={() => handleRemoveFromWishlist(item.product.id)}
                  className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;