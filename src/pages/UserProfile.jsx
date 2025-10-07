import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserProfile } from '../services/userService';
import { getProducts } from '../services/productService';
import { likeProduct, unlikeProduct, getLikeStatus, getLikeCount } from '../services/likeService';
import ShareModal from '../components/ShareModal';
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
    <div className="container mx-auto px-4 py-8">
      {/* User Profile Header */}
      <div className="bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900 rounded-2xl shadow-2xl p-6 mb-8 border border-gray-700">
        <div className="flex flex-col xl:flex-row items-center xl:items-start">
          {/* Profile Image Section - Centered on mobile, left on desktop */}
          <div className="relative mb-6 xl:mb-0 xl:mr-8 flex-shrink-0">
            <div className="relative">
              {/* Main Profile Image */}
              <div 
                className="h-40 w-40 xl:h-48 xl:w-48 rounded-full overflow-hidden border-4 border-gold shadow-2xl ring-4 ring-gold/20 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-3xl"
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
                <div className="bg-gradient-to-br from-gold via-yellow-500 to-yellow-600 h-full w-full flex items-center justify-center" style={{display: user.avatar ? 'none' : 'flex'}}>
                  <span className="text-black font-bold text-5xl xl:text-6xl">{user.name?.charAt(0) || 'U'}</span>
                </div>
              </div>
              
              {/* Online Status Indicator */}
              <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-green-500 rounded-full border-4 border-gray-800 flex items-center justify-center">
                <div className="h-3 w-3 bg-white rounded-full animate-pulse"></div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-2 -left-2 h-6 w-6 bg-gold rounded-full opacity-60"></div>
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-yellow-400 rounded-full opacity-40"></div>
            </div>
          </div>
          
          {/* Main Content Area - Uses full width */}
          <div className="w-full xl:flex-1">
            {/* Top Row: Name, Bio, and Contact */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Left Column: Name and Bio */}
              <div className="space-y-4">
                <div>
                  <h1 className="text-3xl xl:text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {user.name}
                  </h1>
                  <div className="flex items-center text-sm text-gray-400 mb-3">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    Member since {new Date(user.created_at).toLocaleDateString()}
                  </div>
                </div>
                
                {/* Bio Section */}
                <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
                  <p className="text-gray-300 leading-relaxed">
                    {user.bio || 'No bio available'}
                  </p>
                </div>
              </div>
              
              {/* Right Column: Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-3">Contact Information</h3>
                <div className="grid grid-cols-2 gap-3">
                  {user.phone && (
                    <button
                      onClick={() => handlePhoneCall(user.phone)}
                      className="group flex flex-col items-center justify-center bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg border border-green-400/20"
                      title="Call"
                    >
                      <PhoneIcon />
                      <span className="text-sm font-medium mt-1">Call</span>
                    </button>
                  )}
                  
                  {user.phone && (
                    <button
                      onClick={() => handleWhatsAppMessage(user.phone)}
                      className="group flex flex-col items-center justify-center bg-gradient-to-br from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white p-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg border border-green-300/20"
                      title="WhatsApp"
                    >
                      <WhatsappIcon />
                      <span className="text-sm font-medium mt-1">WhatsApp</span>
                    </button>
                  )}
                  
                  {user.email && (
                    <button
                      onClick={() => handleEmail(user.email)}
                      className="group flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg border border-blue-400/20"
                      title="Email"
                    >
                      <EnvelopeIcon />
                      <span className="text-sm font-medium mt-1">Email</span>
                    </button>
                  )}
                  
                  {(user.address || user.city || user.country) && (
                    <button
                      onClick={() => handleLocation(user.address, user.city, user.country)}
                      className="group flex flex-col items-center justify-center bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg border border-red-400/20"
                      title="Location"
                    >
                      <MapIcon />
                      <span className="text-sm font-medium mt-1">Location</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Bottom Row: Additional Information - Full Width */}
            {(user.profession || user.city || user.country) && (
              <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gold" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  Additional Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {user.profession && (
                    <div className="flex items-center space-x-3 bg-gray-800/50 px-4 py-3 rounded-lg border border-gray-600">
                      <BriefcaseIcon />
                      <div>
                        <span className="text-sm text-gray-400">Profession</span>
                        <p className="text-white font-medium">{user.profession}</p>
                      </div>
                    </div>
                  )}
                  {user.city && (
                    <div className="flex items-center space-x-3 bg-gray-800/50 px-4 py-3 rounded-lg border border-gray-600">
                      <GlobeIcon />
                      <div>
                        <span className="text-sm text-gray-400">City</span>
                        <p className="text-white font-medium">{user.city}</p>
                      </div>
                    </div>
                  )}
                  {user.country && (
                    <div className="flex items-center space-x-3 bg-gray-800/50 px-4 py-3 rounded-lg border border-gray-600">
                      <GlobeIcon />
                      <div>
                        <span className="text-sm text-gray-400">Country</span>
                        <p className="text-white font-medium">{user.country}</p>
                      </div>
                    </div>
                  )}
            </div>
          </div>
            )}
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
              const discountPercentage = calculateDiscountPercentage(product.price, product.discount);
              const discountedPrice = product.price - (product.price * (product.discount || 0) / 100);
              const likeInfo = productLikes[product.id] || { likeCount: 0, liked: false };
              
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
                    {/* Discount Badge */}
                    {discountPercentage > 0 && (
                      <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                        -{discountPercentage}%
                    </div>
                    )}
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                      {formatDate(product.created_at)}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white line-clamp-1">{product.title || 'Untitled Product'}</h3>
                    
                    {/* Price Section */}
                    <div className="mt-2">
                      {discountPercentage > 0 ? (
                        <div className="flex items-center space-x-2">
                          <span className="text-gold font-bold text-lg">${discountedPrice.toFixed(2)}</span>
                          <span className="text-gray-400 line-through text-sm">${parseFloat(product.price).toFixed(2)}</span>
                        </div>
                      ) : (
                        <p className="text-gold font-bold text-lg">${parseFloat(product.price)?.toFixed(2) || '0.00'}</p>
                      )}
                    </div>
                    
                    {/* Like and Share Buttons */}
                    <div className="flex items-center justify-between mt-3">
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

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        product={selectedProduct}
      />

      {/* Image Modal */}
      {showImageModal && user.avatar && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            {/* Close Button */}
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute -top-4 -right-4 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors duration-200 z-10"
              title="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Image */}
            <img
              src={`http://localhost:8000/storage/${user.avatar}`}
              alt={user.name}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              style={{ maxHeight: '80vh', maxWidth: '80vw' }}
            />
            
            {/* User Name Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-lg">
              <h3 className="text-white text-xl font-semibold">{user.name}</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;