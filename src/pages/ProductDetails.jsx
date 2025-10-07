import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { useNotifications } from '../context/NotificationContext';
import { getProductById, getProducts } from '../services/productService';
import { getProductReviews, addProductReview, addReviewReply, deleteReview, updateReview } from '../services/reviewsService';
import api from '../services/api';
import Swal from 'sweetalert2';

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
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isAddingReply, setIsAddingReply] = useState(false);
  const [showReplies, setShowReplies] = useState({});
  const [editingReview, setEditingReview] = useState(null);
  const [editText, setEditText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const { isAuthenticated, user } = useContext(AuthContext);
  const { addToCart: addToLocalCart } = useContext(CartContext);
  const { addToWishlist, isInWishlist, removeFromWishlist } = useContext(WishlistContext);
  const { addNotification } = useNotifications();

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  useEffect(() => {
    if (product) {
      fetchRelatedProducts(1);
    }
  }, [product]);

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
        category_id: product.category?.id, // Use category ID instead of slug
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

  const fetchReviews = async () => {
    try {
      const response = await getProductReviews(id);
      setReviews(response.reviews || []);
      setAverageRating(response.average_rating || 0);
      setTotalReviews(response.total_reviews || 0);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  const handleQuantityChange = (value) => {
    if (value >= 1 && value <= (product?.stock || 10)) {
      setQuantity(value);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      // Add to local cart for non-authenticated users
      addToLocalCart(product, quantity);
      addNotification({
        type: 'success',
        title: 'Added to Cart',
        message: `${product.name} (${quantity}x) has been added to your cart`
      });
      return;
    }
    
    try {
      // Add to cart API call
      await api.post('/cart', {
        product_id: product.id,
        quantity: quantity
      });
      // Also add to local cart for immediate UI update
      addToLocalCart(product, quantity);
      
      addNotification({
        type: 'success',
        title: 'Added to Cart',
        message: `${product.name} (${quantity}x) has been added to your cart`
      });
      
      // Redirect to cart page
      navigate('/cart');
    } catch (err) {
      setError('Failed to add item to cart');
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to add item to cart. Please try again.'
      });
      console.error('Error adding to cart:', err);
    }
  };

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      // For non-authenticated users, we could show a login prompt
      navigate('/login');
      return;
    }
    
    try {
      if (isInWishlist(product.id)) {
        await api.delete(`/wishlist/${product.id}`);
        await removeFromWishlist(product.id);
        addNotification({
          type: 'info',
          title: 'Removed from Wishlist',
          message: `${product.name} has been removed from your wishlist`
        });
      } else {
        await api.post('/wishlist', { product_id: product.id });
        await addToWishlist(product);
        addNotification({
          type: 'success',
          title: 'Added to Wishlist',
          message: `${product.name} has been added to your wishlist`
        });
      }
    } catch (err) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to update wishlist. Please try again.'
      });
      console.error('Error toggling wishlist:', err);
    }
  };

  const handleRelatedProductsPageChange = (page) => {
    setRelatedProductsPage(page);
    fetchRelatedProducts(page);
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    setIsAddingReview(true);
    try {
      const response = await addProductReview(id, newReview);
      setReviews([response, ...reviews]);
      setNewReview({ rating: 5, comment: '' });
      fetchReviews(); // Refresh to get updated average rating
      
      // Send notification to product owner and admin if user is not admin
      if (user && user.role !== 'admin') {
        // In a real app, this would be handled by the backend
        console.log('Notification sent to product owner and admin');
      }
    } catch (err) {
      console.error('Error adding review:', err);
      setError('Failed to add review. Please try again.');
    } finally {
      setIsAddingReview(false);
    }
  };

  const handleReply = async (reviewId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!replyText.trim()) return;
    
    setIsAddingReply(true);
    try {
      console.log('Posting reply to review:', reviewId, 'with text:', replyText);
      
      const response = await addReviewReply(id, reviewId, { comment: replyText });
      console.log('Reply posted successfully:', response);
      
      // Update the reviews state to include the new reply
      const updateReviewsWithReply = (reviews, targetId, newReply) => {
        return reviews.map(review => {
          if (review.id === targetId) {
            // This is the direct parent
            return {
              ...review,
              replies: [...(review.replies || []), newReply],
              reply_count: (review.reply_count || 0) + 1
            };
          }
          
          // Check if targetId is in the replies
          const updatedReplies = updateRepliesWithReply(review.replies || [], targetId, newReply);
          if (updatedReplies !== review.replies) {
            return {
              ...review,
              replies: updatedReplies
            };
          }
          
          return review;
        });
      };
      
      const updateRepliesWithReply = (replies, targetId, newReply) => {
        return replies.map(reply => {
          if (reply.id === targetId) {
            // This is the direct parent
            return {
              ...reply,
              replies: [...(reply.replies || []), newReply],
              reply_count: (reply.reply_count || 0) + 1
            };
          }
          
          // Check if targetId is in nested replies
          const updatedNestedReplies = updateRepliesWithReply(reply.replies || [], targetId, newReply);
          if (updatedNestedReplies !== reply.replies) {
            return {
              ...reply,
              replies: updatedNestedReplies
            };
          }
          
          return reply;
        });
      };
      
      setReviews(prevReviews => updateReviewsWithReply(prevReviews, reviewId, response));
      
      // Show the replies for this review
      setShowReplies(prev => ({
        ...prev,
        [reviewId]: true
      }));
      
      setReplyText('');
      setReplyingTo(null);
      
      // Only show notification for comment replies (not for the person posting)
      const originalReview = reviews.find(r => r.id === reviewId);
      if (originalReview && originalReview.user_id !== user.id) {
        addNotification({
          type: 'info',
          title: 'New Reply',
          message: `Someone replied to your comment on ${product.name}`
        });
      }
    } catch (err) {
      console.error('Error adding reply:', err);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to post reply. Please try again.'
      });
    } finally {
      setIsAddingReply(false);
    }
  };

  const toggleReply = (reviewId) => {
    setReplyingTo(replyingTo === reviewId ? null : reviewId);
    setReplyText('');
  };

  const toggleReplies = (reviewId) => {
    setShowReplies(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  const canDeleteReview = (review) => {
    if (!user) return false;
    
    // User can delete their own reviews/replies
    if (review.user_id === user.id) return true;
    
    // Admin can delete any review/reply
    if (user.role === 'admin') return true;
    
    // Product owner can delete any review/reply for their product
    if (product && product.seller_id === user.id) return true;
    
    return false;
  };

  const canEditReview = (review) => {
    if (!user) return false;
    
    // User can edit their own reviews/replies
    if (review.user_id === user.id) return true;
    
    return false;
  };

  const handleEditReview = (review) => {
    setEditingReview(review.id);
    setEditText(review.comment);
    setIsEditing(false); // Start in non-editing state
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
    setEditText('');
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    if (!editText.trim()) {
      Swal.fire('Error!', 'Please enter some text.', 'error');
      return;
    }

    setIsEditing(true); // Show "Saving..." state

    try {
      const response = await updateReview(editingReview, { comment: editText });
      
      // Update the review in state
      const updateReviewInState = (reviews, targetId, newText) => {
        return reviews.map(review => {
          if (review.id === targetId) {
            return { ...review, comment: newText };
          }
          if (review.replies && review.replies.length > 0) {
            review.replies = updateReviewInState(review.replies, targetId, newText);
          }
          return review;
        });
      };

      setReviews(prevReviews => updateReviewInState(prevReviews, editingReview, editText));
      
      // Reset editing state
      setEditingReview(null);
      setEditText('');
      setIsEditing(false);
      
      // No success message - just update silently
    } catch (err) {
      console.error('Error updating review:', err);
      
      // Reset editing state even on error
      setEditingReview(null);
      setEditText('');
      setIsEditing(false);
      
      let errorMessage = 'Failed to update review/reply. Please try again.';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        const errorMessages = Object.values(errors).flat();
        errorMessage = errorMessages.join(', ');
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      Swal.fire('Error!', errorMessage, 'error');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await deleteReview(reviewId);
      
      // Remove the review from state
      const removeReviewFromState = (reviews, targetId) => {
        return reviews.filter(review => {
          if (review.id === targetId) {
            return false; // Remove this review
          }
          if (review.replies && review.replies.length > 0) {
            review.replies = removeReviewFromState(review.replies, targetId);
          }
          return true;
        });
      };

      setReviews(prevReviews => removeReviewFromState(prevReviews, reviewId));
      
      // Refresh reviews to get updated average rating
      fetchReviews();
      
      Swal.fire(
        'Deleted!',
        'Review/reply has been deleted.',
        'success'
      );
    } catch (err) {
      console.error('Error deleting review:', err);
      Swal.fire(
        'Error!',
        'Failed to delete review/reply. Please try again.',
        'error'
      );
    }
  };

  // Recursive function to render nested replies
  const renderReplies = (replies, depth = 0) => {
    if (!replies || replies.length === 0) {
      return null;
    }
    
    return replies.map((reply) => (
        <div key={reply.id} className={`${depth > 0 ? 'ml-4 mt-2' : ''} bg-gray-700 rounded-lg p-3`}>
        <div className="flex justify-between mb-2">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-6 w-6 rounded-full flex items-center justify-center mr-2">
              <span className="text-white font-bold text-xs">{reply.user?.name?.charAt(0) || 'U'}</span>
            </div>
            <h5 className="font-medium text-white text-sm">{reply.user?.name || 'Anonymous'}</h5>
          </div>
          <span className="text-gray-400 text-xs">{new Date(reply.created_at).toLocaleDateString()}</span>
        </div>
        {editingReview === reply.id ? (
          <div className="mb-3">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full p-2 bg-gray-600 border border-gray-500 rounded text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none text-xs resize-none"
              rows="2"
              placeholder="Edit your reply..."
            />
                 <div className="flex space-x-2 mt-2">
                   <button 
                     onClick={handleSaveEdit}
                     disabled={!editText.trim()}
                     className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                     Save
                   </button>
                   <button 
                     onClick={handleCancelEdit}
                     className="bg-gray-500 text-white px-2 py-1 rounded text-xs font-semibold hover:bg-gray-600"
                   >
                     Cancel
                   </button>
                 </div>
          </div>
        ) : (
          <p className="text-gray-300 text-sm mb-3">{reply.comment}</p>
        )}
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => toggleReply(reply.id)} 
              className="text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors"
            >
              {replyingTo === reply.id ? 'Cancel Reply' : 'Reply'}
            </button>
            {reply.reply_count > 0 && (
              <button 
                onClick={() => toggleReplies(reply.id)} 
                className="text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors"
              >
                {showReplies[reply.id] ? 'Hide' : 'Show'} {reply.reply_count} {reply.reply_count === 1 ? 'reply' : 'replies'}
              </button>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Edit Button for Reply */}
            {canEditReview(reply) && (
              <button
                onClick={() => handleEditReview(reply)}
                className="text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors flex items-center"
              >
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
            )}
            
            {/* Delete Button for Reply */}
            {canDeleteReview(reply) && (
              <button
                onClick={() => handleDeleteReview(reply.id)}
                className="text-red-400 hover:text-red-300 text-xs font-medium transition-colors flex items-center"
              >
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            )}
          </div>
        </div>

        {replyingTo === reply.id && (
          <div className="mt-3">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your reply..."
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="3"
            />
            <div className="flex space-x-2 mt-2">
              <button
                onClick={() => handleReply(reply.id)}
                disabled={isAddingReply || !replyText.trim()}
                className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAddingReply ? 'Posting...' : 'Post Reply'}
              </button>
              <button
                onClick={() => toggleReply(reply.id)}
                className="bg-gray-500 text-white px-2 py-1 rounded text-xs font-semibold hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {reply.replies && reply.replies.length > 0 && showReplies[reply.id] && (
          <div className="mt-4 pl-4 border-l-2 border-gray-600 space-y-3">
            {renderReplies(reply.replies, depth + 1)}
          </div>
        )}
      </div>
    ));
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://placehold.co/300x300/374151/FFFFFF?text=Product+Image';
    
    // Handle absolute vs relative URLs
    if (imagePath.startsWith('http')) {
      return imagePath;
    } else {
      // Use the correct API base URL for images
      if (imagePath.startsWith('/storage/')) {
        return `http://localhost:8000${imagePath}`;
      } else if (imagePath.startsWith('products/')) {
        return `http://localhost:8000/storage/${imagePath}`;
      } else {
        return `http://localhost:8000/storage/products/${imagePath}`;
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

  const shareProduct = (platform) => {
    const url = window.location.href;
    const title = product?.title || 'Check out this product';
    
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
            <p className="text-gray-400 text-sm mt-1">Posted {formatDate(product.created_at)}</p>
          </div>

          <div className="flex items-center mb-6">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className={`w-5 h-5 fill-current ${i < Math.floor(averageRating) ? 'text-yellow-400' : 'text-gray-600'}`} viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
              ))}
            </div>
            <span className="ml-2 text-gray-400">
              {averageRating > 0 ? `${averageRating.toFixed(1)} (${totalReviews} reviews)` : `(${totalReviews} reviews)`}
            </span>
          </div>

          <p className="text-3xl font-bold text-gold mb-6">${(parseFloat(product.price) * quantity).toFixed(2)}</p>

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
                  disabled={quantity >= (product.stock || 10)}
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

          {/* Product Owner Info */}
          <div className="border-t border-gray-700 pt-6 mb-6">
            <div className="flex items-center justify-between">
              <Link 
                to={`/user/${product.seller?.id}`} 
                className="flex items-center hover:opacity-80 transition-opacity cursor-pointer"
              >
                <div className="bg-gradient-to-r from-gold to-yellow-500 h-12 w-12 rounded-full flex items-center justify-center mr-3">
                  <span className="text-black font-bold">{product.seller?.name?.charAt(0) || 'U'}</span>
                </div>
                <div>
                  <p className="text-white font-semibold">Posted by</p>
                  <p className="text-gold hover:text-yellow-500 transition-colors">
                    {product.seller?.name || 'Unknown User'}
                  </p>
                </div>
              </Link>
              <div className="text-right">
                <p className="text-gray-400 text-sm">Views</p>
                <p className="text-white font-bold">{product.view_count || 0}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-6">
            <div className="flex space-x-6">
              <button 
                onClick={() => setShowShareModal(true)}
                className="flex items-center text-gray-400 hover:text-gold transition-colors"
              >
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

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Share Product</h3>
              <button 
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-white"
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
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                </svg>
                <span className="text-white text-sm">Twitter</span>
              </button>
              <button 
                onClick={() => shareProduct('whatsapp')}
                className="flex flex-col items-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <svg className="w-6 h-6 text-green-500 mb-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.386"/>
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
        
        {/* Add Review Form */}
        {isAuthenticated && (
          <div className="bg-gray-800 rounded-xl shadow-md p-6 mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Add Your Review</h3>
            <form onSubmit={handleAddReview}>
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Rating</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview({...newReview, rating: star})}
                      className={`text-2xl ${star <= newReview.rating ? 'text-yellow-400' : 'text-gray-600'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Comment</label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                  className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:border-gold focus:outline-none"
                  rows="4"
                  placeholder="Share your experience with this product..."
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={isAddingReview}
                className="bg-gradient-to-r from-gold to-yellow-600 hover:from-yellow-600 hover:to-gold text-black font-bold py-2 px-6 rounded-lg transition-all duration-300 disabled:opacity-50"
              >
                {isAddingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        )}
        
        {/* Reviews List */}
        <div className="bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400 mr-4">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i} 
                  className={`w-5 h-5 ${i < Math.floor(averageRating) ? 'fill-current' : 'text-gray-600'}`} 
                  viewBox="0 0 24 24"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
              ))}
            </div>
            <span className="text-gray-400">{totalReviews} reviews</span>
          </div>
          
          <div className="space-y-6">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-700 pb-6 last:border-0 last:pb-0">
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center">
                      <div className="bg-gradient-to-r from-gold to-yellow-500 h-8 w-8 rounded-full flex items-center justify-center mr-3">
                        <span className="text-black font-bold text-sm">{review.user?.name?.charAt(0) || 'U'}</span>
                      </div>
                      <h4 className="font-semibold text-white">{review.user?.name || 'Anonymous'}</h4>
                    </div>
                    <span className="text-gray-500 text-sm">{new Date(review.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex text-yellow-400 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-4 h-4 fill-current ${i < review.rating ? 'text-yellow-400' : 'text-gray-600'}`} viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                      </svg>
                    ))}
                  </div>
                  {editingReview === review.id ? (
                    <div className="mb-3">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent resize-none"
                        rows="3"
                        placeholder="Edit your comment..."
                      />
                      <div className="flex space-x-2 mt-2">
                        <button
                          onClick={handleSaveEdit}
                          disabled={!editText.trim()}
                          className="bg-gold text-black px-3 py-1 rounded text-sm font-semibold hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="bg-gray-600 text-white px-3 py-1 rounded text-sm font-semibold hover:bg-gray-500"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                  <p className="text-gray-300 mb-3">
                    {review.comment}
                  </p>
                  )}
                  
                  {/* Reply Button and Show/Hide Replies */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => toggleReply(review.id)}
                        className="text-gold hover:text-yellow-400 text-sm font-medium transition-colors"
                      >
                        {replyingTo === review.id ? 'Cancel Reply' : 'Reply'}
                      </button>
                      {review.reply_count > 0 && (
                        <button
                          onClick={() => toggleReplies(review.id)}
                          className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                        >
                          {showReplies[review.id] ? 'Hide' : 'Show'} {review.reply_count} {review.reply_count === 1 ? 'reply' : 'replies'}
                        </button>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {/* Edit Button */}
                      {canEditReview(review) && (
                        <button
                          onClick={() => handleEditReview(review)}
                          className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors flex items-center"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                      )}
                      
                      {/* Delete Button */}
                      {canDeleteReview(review) && (
                        <button
                          onClick={() => handleDeleteReview(review.id)}
                          className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors flex items-center"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Reply Form */}
                  {replyingTo === review.id && (
                    <div className="mt-4 pl-4 border-l-2 border-gold">
                      <textarea
                        className="w-full bg-gray-700 text-white rounded-lg p-2 border border-gray-600 focus:border-gold focus:outline-none text-sm"
                        rows="2"
                        placeholder="Write your reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                      ></textarea>
                      <div className="flex space-x-2 mt-2">
                        <button
                          onClick={() => handleReply(review.id)}
                          disabled={isAddingReply || !replyText.trim()}
                          className="bg-gold text-black px-3 py-1 rounded text-sm font-semibold hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isAddingReply ? 'Posting...' : 'Post Reply'}
                        </button>
                        <button
                          onClick={() => toggleReply(review.id)}
                          className="bg-gray-600 text-white px-3 py-1 rounded text-sm font-semibold hover:bg-gray-500"
                        >
                          Cancel
                      </button>
                      </div>
                    </div>
                  )}

                  {/* Display Replies */}
                  {review.replies && review.replies.length > 0 && showReplies[review.id] && (
                    <div className="mt-4 pl-4 border-l-2 border-gray-600 space-y-3">
                      {renderReplies(review.replies)}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                No reviews yet. Be the first to review this product!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;