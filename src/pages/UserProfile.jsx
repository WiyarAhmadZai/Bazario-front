import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserProfile } from '../services/userService';
import { getProducts } from '../services/productService';

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserProfile();
    fetchUserProducts();
  }, [id]);

  const fetchUserProfile = async () => {
    try {
      const response = await getUserProfile(id);
      setUser(response);
    } catch (err) {
      setError('Failed to fetch user profile');
      console.error('Error fetching user profile:', err);
    }
  };

  const fetchUserProducts = async () => {
    try {
      const response = await getProducts({ seller_id: id });
      setProducts(response.data || response || []);
    } catch (err) {
      console.error('Error fetching user products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://placehold.co/300x300/374151/FFFFFF?text=Product+Image';
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    } else {
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
    
    if (Array.isArray(images)) {
      return images;
    }
    
    if (typeof images === 'string') {
      try {
        const imagesArray = JSON.parse(images);
        if (Array.isArray(imagesArray)) {
          return imagesArray;
        }
      } catch (e) {
        return [images];
      }
    }
    
    return [];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
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

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4 text-white">User Not Found</h2>
        <p className="text-gray-400 mb-6">The user profile you're looking for doesn't exist.</p>
        <button 
          onClick={() => navigate('/')}
          className="bg-gradient-to-r from-gold to-yellow-600 hover:from-yellow-600 hover:to-gold text-black font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* User Profile Header */}
      <div className="bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center">
          <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-gold shadow-lg mb-4 md:mb-0 md:mr-6">
            {user.avatar ? (
              <img 
                src={`http://localhost:8000/storage/${user.avatar}`} 
                alt={user.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className="bg-gradient-to-r from-gold to-yellow-500 h-full w-full flex items-center justify-center" style={{display: user.avatar ? 'none' : 'flex'}}>
              <span className="text-black font-bold text-3xl">{user.name?.charAt(0) || 'U'}</span>
            </div>
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
            <p className="text-gray-400 mb-2">Member since {new Date(user.created_at).toLocaleDateString()}</p>
            <p className="text-gray-300">{user.bio || 'No bio available'}</p>
          </div>
        </div>
      </div>

      {/* User Products */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Products Posted by {user.name}</h2>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const productImages = parseImages(product.images);
              return (
                <div 
                  key={product.id} 
                  className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-700 cursor-pointer"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <div className="relative">
                    <img 
                      src={productImages.length > 0 ? getImageUrl(productImages[0]) : 'https://placehold.co/300x300/374151/FFFFFF?text=Product+Image'} 
                      alt={product.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/300x300/374151/FFFFFF?text=Product+Image';
                      }}
                    />
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-gold to-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold">
                      {product.is_featured ? 'Featured' : 'New'}
                    </div>
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                      {formatDate(product.created_at)}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white line-clamp-1">{product.title || 'Untitled Product'}</h3>
                    <p className="text-gold font-bold mt-2">${parseFloat(product.price)?.toFixed(2) || '0.00'}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-xl p-8 text-center">
            <p className="text-gray-400">This user hasn't posted any products yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;