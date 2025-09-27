import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getWishlist, removeFromWishlist } from '../services/wishlistService';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await getWishlist();
      setWishlistItems(response.data || []);
    } catch (err) {
      setError('Failed to fetch wishlist items');
      console.error('Error fetching wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await removeFromWishlist(productId);
      setWishlistItems(prevItems => prevItems.filter(item => item.id !== productId));
    } catch (err) {
      setError('Failed to remove item from wishlist');
      console.error('Error removing from wishlist:', err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Please Login to View Your Wishlist</h2>
        <p className="text-gray-600 mb-6">You need to be logged in to manage your wishlist.</p>
        <Link to="/login" className="luxury-button">
          Login
        </Link>
      </div>
    );
  }

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

  if (wishlistItems.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Your Wishlist is Empty</h2>
        <p className="text-gray-600 mb-6">Looks like you haven't added anything to your wishlist yet.</p>
        <Link to="/shop" className="luxury-button">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistItems.map((item) => (
          <div key={item.id} className="product-card relative">
            <button 
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 z-10"
              onClick={() => handleRemoveFromWishlist(item.id)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
            </button>
            
            <div className="bg-gray-200 h-48 rounded-lg mb-4 flex items-center justify-center">
              {item.image ? (
                <img 
                  src={`/src/assets/${item.image}`} 
                  alt={item.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="bg-gray-300 border-2 border-dashed rounded-xl w-16 h-16" />
              )}
            </div>
            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gold">${item.price}</span>
              <button className="luxury-button px-4 py-2 text-sm">Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;