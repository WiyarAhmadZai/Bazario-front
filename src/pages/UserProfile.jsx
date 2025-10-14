import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserProfile } from '../services/userService';
import { getProducts } from '../services/productService';
import { likeProduct, unlikeProduct, getLikeStatus, getLikeCount } from '../services/likeService';
// Using simple SVG icons instead of react-icons for now
const PhoneIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
  </svg>
);

const WhatsappIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
  </svg>
);

const EnvelopeIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
  </svg>
);

const MapIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
  </svg>
);

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

const BriefcaseIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
  </svg>
);

const GlobeIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
  </svg>
);

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productLikes, setProductLikes] = useState({});
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    fetchUserProfile();
    fetchUserProducts();
  }, [id]);

  // Refresh data when products are updated
  useEffect(() => {
    const checkForUpdates = () => {
      const lastUpdate = localStorage.getItem('productUpdated');
      if (lastUpdate) {
        const updateTime = parseInt(lastUpdate);
        const now = Date.now();
        // If update was within last 30 seconds, refresh data
        if (now - updateTime < 30000) {
          fetchUserProducts();
          localStorage.removeItem('productUpdated');
        }
      }
    };

    checkForUpdates(); // Check immediately when component mounts
  }, []);

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
      const productsData = response.data || response || [];
      setProducts(productsData);
      
      // Fetch like counts and status for all products
      const likePromises = productsData.map(async (product) => {
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
    } catch (err) {
      console.error('Error fetching user products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Contact action functions
  const handlePhoneCall = (phone) => {
    if (phone) {
      window.open(`tel:${phone}`, '_self');
    }
  };

  const handleWhatsAppMessage = (phone) => {
    if (phone) {
      const message = `Hi ${user?.name}, I'm interested in your products!`;
      window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
    }
  };

  const handleEmail = (email) => {
    if (email) {
      window.open(`mailto:${email}`, '_self');
    }
  };

  const handleLocation = (address, city, country) => {
    const fullAddress = [address, city, country].filter(Boolean).join(', ');
    if (fullAddress) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`, '_blank');
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

  // Handle product share
  const shareProduct = (platform) => {
    const url = `${window.location.origin}/product/${selectedProduct.id}`;
    const title = selectedProduct?.title || 'Check out this product';
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
      email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this product: ${url}`)}`
    };
    
    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      // Show a temporary message or feedback
      alert('Link copied to clipboard!');
      setShowShareModal(false);
      return;
    }
    
    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank');
    }
    setShowShareModal(false);
  };

  // Handle profile share
  const handleProfileShare = () => {
    const url = window.location.href;
    const title = `${user.name}'s Profile`;
    const text = `Check out ${user.name}'s profile and products!`;
    
    if (navigator.share) {
      navigator.share({
        title: title,
        text: text,
        url: url
      });
    } else {
      navigator.clipboard.writeText(url);
      // Show a temporary message or feedback
      alert('Profile link copied to clipboard!');
    }
  };

  // Calculate discount percentage
  const calculateDiscountPercentage = (originalPrice, discount) => {
    if (!discount || discount <= 0) return 0;
    // Discount is already stored as a percentage, so return it directly
    return Math.round(discount);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Modern Profile Header */}
        <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden mb-8">
          {/* Cover Photo Section */}
          <div className="h-48 bg-gradient-to-r from-gold via-yellow-500 to-bronze relative">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute bottom-4 right-4">
              <button className="bg-white/90 hover:bg-white text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Edit Cover
              </button>
            </div>
          </div>
          
          {/* Profile Info Section */}
          <div className="px-8 pb-8 -mt-16 relative">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between">
              {/* Profile Image and Basic Info */}
              <div className="flex flex-col lg:flex-row lg:items-end space-y-4 lg:space-y-0 lg:space-x-6">
                <div className="relative">
                  <div 
                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300"
                    onClick={() => setShowImageModal(true)}
                    title="Click to view full size"
                  >
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
                    <div className="bg-gradient-to-br from-gray-400 to-gray-600 h-full w-full flex items-center justify-center" style={{display: user.avatar ? 'none' : 'flex'}}>
                      <span className="text-white font-bold text-4xl">{user.name?.charAt(0) || 'U'}</span>
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white"></div>
                </div>
                
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{user.name}</h1>
                  <div className="flex items-center space-x-4 text-gray-400">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-gold" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      Member since {new Date(user.created_at).toLocaleDateString()}
                    </span>
                    {user.role && (
                      <span className="bg-gradient-to-r from-gold/20 to-yellow-500/20 text-gold border border-gold/30 px-2 py-1 rounded-full text-sm font-medium">
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    )}
                  </div>
                  {user.bio && (
                    <p className="text-gray-300 max-w-2xl">{user.bio}</p>
                  )}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex space-x-3 mt-6 lg:mt-0">
                {user.phone && (
                  <button
                    onClick={() => handlePhoneCall(user.phone)}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl"
                  >
                    <PhoneIcon />
                    <span>Call</span>
                  </button>
                )}
                {user.phone && (
                  <button
                    onClick={() => handleWhatsAppMessage(user.phone)}
                    className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl"
                  >
                    <WhatsappIcon />
                    <span>WhatsApp</span>
                  </button>
                )}
                {user.email && (
                  <button
                    onClick={() => handleEmail(user.email)}
                    className="bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-500 hover:to-gold text-black px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl"
                  >
                    <EnvelopeIcon />
                    <span>Email</span>
                  </button>
                )}
                <button 
                  onClick={handleProfileShare}
                  className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  <ShareIcon />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Information Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Contact Information Card */}
          <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-xl shadow-xl border border-gray-700/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-gold" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              Contact Information
            </h3>
            <div className="space-y-3">
              {user.email && (
                <div className="flex items-center text-gray-300">
                  <EnvelopeIcon />
                  <span className="ml-3">{user.email}</span>
                </div>
              )}
              {user.phone && (
                <div className="flex items-center text-gray-300">
                  <PhoneIcon />
                  <span className="ml-3">{user.phone}</span>
                </div>
              )}
              {(user.address || user.city || user.country) && (
                <div className="flex items-center text-gray-300">
                  <MapIcon />
                  <span className="ml-3">
                    {[user.address, user.city, user.country].filter(Boolean).join(', ')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Professional Information Card */}
          <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-xl shadow-xl border border-gray-700/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-gold" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
              </svg>
              Professional Info
            </h3>
            <div className="space-y-3">
              {user.profession && (
                <div className="flex items-center text-gray-300">
                  <BriefcaseIcon />
                  <span className="ml-3">{user.profession}</span>
                </div>
              )}
              {user.role && (
                <div className="flex items-center text-gray-300">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-3 capitalize">{user.role}</span>
                </div>
              )}
              <div className="flex items-center text-gray-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span className="ml-3">Joined {new Date(user.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-xl shadow-xl border border-gray-700/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-gold" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
              Statistics
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Products</span>
                <span className="font-semibold text-gold">{products.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Approved</span>
                <span className="font-semibold text-green-400">{products.filter(p => p.status === 'approved').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Pending</span>
                <span className="font-semibold text-yellow-400">{products.filter(p => p.status === 'pending').length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-700/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Products by {user.name}</h2>
              <p className="text-gray-400 mt-1">
                {products.length} {products.length === 1 ? 'product' : 'products'} available
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-lg font-bold text-gold">{products.length}</div>
                <div className="text-xs text-gray-400">Total</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-400">
                  {products.filter(p => p.status === 'approved').length}
                </div>
                <div className="text-xs text-gray-400">Approved</div>
              </div>
            </div>
          </div>
        
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const productImages = parseImages(product.images);
              const discountPercentage = calculateDiscountPercentage(product.price, product.discount);
              const discountedPrice = product.price - (product.price * (product.discount || 0) / 100);
              const likeInfo = productLikes[product.id] || { likeCount: 0, liked: false };
              
              return (
                <div 
                  key={product.id} 
                  className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-700/50 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group hover:scale-105"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <div className="relative">
                    <img 
                      src={productImages.length > 0 ? getImageUrl(productImages[0]) : 'https://placehold.co/300x300/374151/FFFFFF?text=Product+Image'} 
                      alt={product.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/300x300/374151/FFFFFF?text=Product+Image';
                      }}
                    />
                    
                    {/* Status Badge */}
                    <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${
                      product.status === 'approved' ? 'bg-green-500 text-white' :
                      product.status === 'pending' ? 'bg-yellow-500 text-black' :
                      product.status === 'rejected' ? 'bg-red-500 text-white' :
                      'bg-gray-500 text-white'
                    }`}>
                      {product.status?.charAt(0).toUpperCase() + product.status?.slice(1)}
                    </div>
                    
                    {/* Discount Badge */}
                    {discountPercentage > 0 && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        -{discountPercentage}%
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white line-clamp-2 mb-2 group-hover:text-gold transition-colors">
                      {product.title || 'Untitled Product'}
                    </h3>
                    
                    {/* Price Section */}
                    <div className="mb-3">
                      {discountPercentage > 0 ? (
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-gold">${discountedPrice.toFixed(2)}</span>
                          <span className="text-sm text-gray-400 line-through">${parseFloat(product.price).toFixed(2)}</span>
                        </div>
                      ) : (
                        <p className="text-lg font-bold text-gold">${parseFloat(product.price)?.toFixed(2) || '0.00'}</p>
                      )}
                    </div>
                    
                    {/* Product Meta */}
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <HeartIcon filled={false} />
                        <span>{likeInfo.likeCount}</span>
                      </div>
                      <span>{formatDate(product.created_at)}</span>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(product.id, e);
                        }}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          likeInfo.liked 
                            ? 'bg-red-500 text-white hover:bg-red-600' 
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        <HeartIcon filled={likeInfo.liked} />
                        <span>Like</span>
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare(product, e);
                        }}
                        className="flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
                      >
                        <ShareIcon />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center border border-gray-600">
              <svg className="w-8 h-8 text-gold" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM8 15a1 1 0 100-2 1 1 0 000 2zm4 0a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No Products Yet</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              {user.name} hasn't posted any products yet. Check back later for new items!
            </p>
          </div>
        )}
        </div>
      </div>

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

      {/* Image Modal */}
      {showImageModal && user.avatar && (
        <div 
          className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div 
            className="relative max-w-6xl max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute -top-6 -right-6 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-full p-3 shadow-2xl transition-all duration-300 z-10 hover:scale-110"
              title="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Image Container */}
            <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-gray-800 to-gray-900 p-6 border border-gray-700">
              <img
                src={`http://localhost:8000/storage/${user.avatar}`}
                alt={user.name}
                className="max-w-full max-h-full object-contain rounded-lg"
                style={{ 
                  maxHeight: '85vh', 
                  maxWidth: '85vw',
                  width: 'auto',
                  height: 'auto'
                }}
              />
              
              {/* User Name Overlay */}
              <div className="absolute bottom-6 left-6 right-6 bg-gradient-to-r from-gray-800/95 to-gray-900/95 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-gold to-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-black font-bold text-lg">{user.name?.charAt(0) || 'U'}</span>
                  </div>
                  <div>
                    <h3 className="text-white text-xl font-bold">{user.name}</h3>
                    <p className="text-gray-400">Profile Picture</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;