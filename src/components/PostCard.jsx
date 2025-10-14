import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { WishlistContext } from '../context/WishlistContext';
import { likePost, deletePost, getPostComments, addPostComment } from '../services/postService';
import { addToFavorites, removeFromFavorites } from '../services/favoriteService';
import { followUser, toggleNotification } from '../services/followService';
import Swal from 'sweetalert2';

const PostCard = ({ post, onUpdate, onDelete }) => {
  const [isLiked, setIsLiked] = useState(post.is_liked || false);
  const [isFavorited, setIsFavorited] = useState(post.is_favorited || false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [favoritesCount, setFavoritesCount] = useState(post.favorites_count || 0);
  const [isFollowing, setIsFollowing] = useState(post.is_following || false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(post.notifications_enabled || false);

  const [showComments, setShowComments] = useState(false);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [newReply, setNewReply] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);

  const { user } = useContext(AuthContext);
  const { addToWishlist, isInWishlist, removeFromWishlist } = useContext(WishlistContext);
  const navigate = useNavigate();

  // Handle profile navigation
  const handleProfileClick = () => {
    navigate(`/user/${post.user.id}`);
  };

  // Handle like/unlike
  const handleLike = async () => {
    if (!user) {
      Swal.fire({
        title: 'Login Required',
        text: 'Please login to like posts',
        icon: 'info',
        confirmButtonText: 'OK'
      });
      return;
    }

    try {
      setLoading(true);
      const response = await likePost(post.id);
      setIsLiked(response.is_liked);
      setLikesCount(response.likes_count);
    } catch (error) {
      console.error('Error liking post:', error);
      if (error.response?.status === 401) {
        Swal.fire({
          title: 'Login Required',
          text: 'Please login to like posts',
          icon: 'info',
          confirmButtonText: 'OK'
        });
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Failed to like post',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle favorite/unfavorite (add to wishlist for products)
  const handleFavorite = async () => {
    if (!user) {
      Swal.fire({
        title: 'Login Required',
        text: 'Please login to add products to wishlist',
        icon: 'info',
        confirmButtonText: 'OK'
      });
      return;
    }

    try {
      setLoading(true);
      
      // Check if this is a product (sponsored post)
      if (post.product_id || post.price) {
        // This is a product, add to wishlist
        const isInWishlistNow = isInWishlist(post.id);
        
        if (isInWishlistNow) {
          await removeFromWishlist(post.id);
          Swal.fire({
            title: 'Removed!',
            text: 'Product removed from wishlist',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          });
        } else {
          // Convert post to product format for wishlist
          const productData = {
            id: post.id,
            title: post.title || post.content,
            price: post.price || 0,
            description: post.content,
            images: post.images || [],
            seller: post.user,
            category: post.category
          };
          
          await addToWishlist(productData);
          Swal.fire({
            title: 'Added!',
            text: 'Product added to wishlist',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          });
        }
      } else {
        // This is a regular post, use the original favorite functionality
        const newFavoritedState = !isFavorited;
        setIsFavorited(newFavoritedState);
        setFavoritesCount(prev => newFavoritedState ? prev + 1 : Math.max(0, prev - 1));

        let response;
        if (newFavoritedState) {
          response = await addToFavorites(post.id);
        } else {
          response = await removeFromFavorites(post.id);
        }
        
        // Update with server response
        setIsFavorited(response.is_favorited);
        setFavoritesCount(response.favorites_count);
      }
    } catch (error) {
      console.error('Error favoriting post:', error);
      
      if (error.response?.status === 401) {
        Swal.fire({
          title: 'Login Required',
          text: 'Please login to add products to wishlist',
          icon: 'info',
          confirmButtonText: 'OK'
        });
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Failed to add product to wishlist',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle follow/unfollow
  const handleFollow = async () => {
    if (!user) {
      Swal.fire({
        title: 'Login Required',
        text: 'Please login to follow users',
        icon: 'info',
        confirmButtonText: 'OK'
      });
      return;
    }

    try {
      setLoading(true);
      const response = await followUser(post.user.id);
      setIsFollowing(response.is_following);
    } catch (error) {
      console.error('Error following user:', error);
      // Revert the state on error
      setIsFollowing(!isFollowing);
    } finally {
      setLoading(false);
    }
  };

  // Handle notification toggle
  const handleNotificationToggle = async () => {
    if (!user || !isFollowing) return;

    try {
      setLoading(true);
      const response = await toggleNotification(post.user.id, 'post', !notificationsEnabled);
      setNotificationsEnabled(response.notify_on_post);
    } catch (error) {
      console.error('Error toggling notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load comments when comments section is opened
  const loadComments = async () => {
    try {
      const response = await getPostComments(post.id);
      setComments(response.data || []);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  // Handle adding a comment
  const handleAddComment = async () => {
    if (!user) {
      Swal.fire({
        title: 'Login Required',
        text: 'Please login to comment',
        icon: 'info',
        confirmButtonText: 'OK'
      });
      return;
    }

    if (!newComment.trim()) return;

    try {
      setLoading(true);
      const response = await addPostComment(post.id, { content: newComment.trim() });
      setComments(prev => [response.comment, ...prev]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to add comment',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle adding a reply
  const handleAddReply = async (parentId) => {
    if (!user) {
      Swal.fire({
        title: 'Login Required',
        text: 'Please login to reply',
        icon: 'info',
        confirmButtonText: 'OK'
      });
      return;
    }

    if (!newReply.trim()) return;

    try {
      setLoading(true);
      const response = await addPostComment(post.id, { 
        content: newReply.trim(), 
        parent_id: parentId 
      });
      
      // Update comments with the new reply
      setComments(prev => prev.map(comment => 
        comment.id === parentId 
          ? { ...comment, replies: [...(comment.replies || []), response.comment] }
          : comment
      ));
      
      setNewReply('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Error adding reply:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to add reply',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setLoading(false);
    }
  };

  // Toggle comments section
  const toggleComments = () => {
    if (!showComments) {
      loadComments();
    }
    setShowComments(!showComments);
  };

  // Handle delete post
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Delete Post',
      text: 'Are you sure you want to delete this post? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        await deletePost(post.id);
        onDelete(post.id);
        
        Swal.fire({
          title: 'Deleted!',
          text: 'Your post has been deleted.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      } catch (error) {
        console.error('Error deleting post:', error);
        Swal.fire({
          title: 'Error',
          text: 'Failed to delete post',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle share
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Post by ${post.user.name}`,
        text: post.content,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      Swal.fire({
        title: 'Link Copied!',
        text: 'Post link has been copied to clipboard',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    }
  };

  // Get image layout class based on number of images
  const getImageLayoutClass = (imageCount) => {
    if (imageCount === 1) return 'grid-cols-1';
    if (imageCount === 2) return 'grid-cols-2';
    if (imageCount === 3) return 'grid-cols-2';
    if (imageCount === 4) return 'grid-cols-2';
    return 'grid-cols-2';
  };

  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleProfileClick}
              className="flex-shrink-0 hover:opacity-80 transition-opacity"
            >
              <img
                src={post.user.avatar || 'https://placehold.co/48x48/374151/FFFFFF?text=' + post.user.name.charAt(0)}
                alt={post.user.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-600 hover:border-gold transition-colors"
              />
            </button>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-1">
                <button
                  onClick={handleProfileClick}
                  className="text-white font-semibold text-lg hover:text-gold transition-colors"
                >
                  {post.user.name}
                </button>
                {post.is_sponsored && (
                  <span className="px-2 py-1 bg-gradient-to-r from-gold to-yellow-400 text-black text-xs font-medium rounded-full">
                    SPONSORED
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Follow Button */}
            {user && user.id !== post.user.id && (
              <button
                onClick={handleFollow}
                disabled={loading}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isFollowing
                    ? 'bg-gray-600 text-white hover:bg-gray-500'
                    : 'bg-gold text-black hover:bg-yellow-500'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            )}

            {/* Notification Bell */}
            {user && user.id !== post.user.id && isFollowing && (
              <button
                onClick={handleNotificationToggle}
                disabled={loading}
                className={`p-2 rounded-lg transition-all ${
                  notificationsEnabled
                    ? 'text-gold hover:bg-gray-700'
                    : 'text-gray-400 hover:bg-gray-700'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                title={notificationsEnabled ? 'Notifications enabled' : 'Notifications disabled'}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                </svg>
              </button>
            )}

            {/* Three-dot Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-lg shadow-lg z-10">
                  <div className="py-1">
                    {user && user.id === post.user.id ? (
                      <>
                        <button className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600">
                          Edit
                        </button>
                        <button
                          onClick={handleDelete}
                          className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-600"
                        >
                          Delete
                        </button>
                        <button className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600">
                          Forward
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={handleFavorite}
                        className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600"
                      >
                        {(post.product_id || post.price) ? 
                          (isInWishlist(post.id) ? 'Remove from Wishlist' : 'Add to Wishlist') : 
                          (isFavorited ? 'Remove from Favorites' : 'Save to Favorites')
                        }
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-white text-lg leading-relaxed mb-4">{post.content}</p>

        {/* Images - Show only one image */}
        {((post.image_urls && post.image_urls.length > 0) || (post.images && post.images.length > 0)) && (
          <div className="mb-6">
            <div className="relative group">
              <img
                src={(post.image_urls || post.images || [])[0]}
                alt="Post image"
                className="w-full h-64 object-cover rounded-xl cursor-pointer hover:opacity-90 transition-all duration-300 hover:scale-105"
                onClick={() => navigate(`/product/${post.id}`)}
              />
              {/* Hover overlay for click indication */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center rounded-xl">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Interactions */}
      <div className="px-6 py-5 border-t border-gray-700 bg-gray-750">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <button
              onClick={handleLike}
              disabled={loading}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                isLiked 
                  ? 'text-red-500 bg-red-500 bg-opacity-10' 
                  : 'text-gray-400 hover:text-red-500 hover:bg-red-500 hover:bg-opacity-10'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <svg className="w-6 h-6" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="text-sm font-medium">{likesCount}</span>
            </button>

                            <button
                              onClick={toggleComments}
                              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-500 hover:bg-opacity-10 transition-all"
                            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="text-sm font-medium">{post.comments_count}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-400 hover:text-green-500 hover:bg-green-500 hover:bg-opacity-10 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              <span className="text-sm font-medium">Share</span>
            </button>
          </div>

          <button
            onClick={handleFavorite}
            disabled={loading}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
              (post.product_id || post.price) ? 
                (isInWishlist(post.id) ? 'text-red-500 bg-red-500 bg-opacity-10' : 'text-gray-400 hover:text-red-500 hover:bg-red-500 hover:bg-opacity-10') :
                (isFavorited ? 'text-gold bg-gold bg-opacity-10' : 'text-gray-400 hover:text-gold hover:bg-gold hover:bg-opacity-10')
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <svg className="w-6 h-6" fill={(post.product_id || post.price) ? (isInWishlist(post.id) ? 'currentColor' : 'none') : (isFavorited ? 'currentColor' : 'none')} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-sm font-medium">
              {(post.product_id || post.price) ? 
                (isInWishlist(post.id) ? 'In Wishlist' : 'Add to Wishlist') : 
                favoritesCount
              }
            </span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-6 py-4 border-t border-gray-700 bg-gray-750">
          <div className="text-center text-gray-400 text-sm">
            Comments feature coming soon...
          </div>
        </div>
      )}

      {/* Image Gallery Modal */}
      {/* Comments Section */}
      {showComments && (
        <div className="px-6 py-4 border-t border-gray-700 bg-gray-750">
          <div className="space-y-4">
            {/* Add Comment Form */}
            {user && (
              <div className="flex space-x-3">
                <img
                  src={user.avatar || 'https://placehold.co/32x32/374151/FFFFFF?text=' + user.name.charAt(0)}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1">
                  <textarea
                    placeholder="Write a comment..."
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-gold focus:outline-none resize-none"
                    rows="2"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={handleAddComment}
                      disabled={!newComment.trim() || loading}
                      className="px-4 py-2 bg-gold text-black font-medium rounded-lg hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Comment
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-3">
              {comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  <img
                    src={comment.user.avatar || 'https://placehold.co/32x32/374151/FFFFFF?text=' + comment.user.name.charAt(0)}
                    alt={comment.user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="bg-gray-700 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-white text-sm">{comment.user.name}</span>
                        <span className="text-gray-400 text-xs">{comment.time_ago}</span>
                      </div>
                      <p className="text-gray-300 text-sm">{comment.content}</p>
                    </div>
                    
                    {/* Reply Button */}
                    <button
                      onClick={() => setReplyingTo(comment.id)}
                      className="text-xs text-gray-400 hover:text-gold mt-1 ml-3"
                    >
                      Reply
                    </button>

                    {/* Reply Form */}
                    {replyingTo === comment.id && (
                      <div className="mt-2 ml-4">
                        <div className="flex space-x-2">
                          <img
                            src={user?.avatar || 'https://placehold.co/24x24/374151/FFFFFF?text=' + (user?.name?.charAt(0) || 'U')}
                            alt={user?.name || 'User'}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <textarea
                              placeholder="Write a reply..."
                              className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg border border-gray-500 focus:border-gold focus:outline-none resize-none text-sm"
                              rows="1"
                              value={newReply}
                              onChange={(e) => setNewReply(e.target.value)}
                            />
                            <div className="flex justify-end space-x-2 mt-1">
                              <button
                                onClick={() => {
                                  setReplyingTo(null);
                                  setNewReply('');
                                }}
                                className="px-3 py-1 text-xs text-gray-400 hover:text-white"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleAddReply(comment.id)}
                                disabled={!newReply.trim() || loading}
                                className="px-3 py-1 bg-gold text-black text-xs font-medium rounded hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Reply
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-2 ml-4 space-y-2">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex space-x-2">
                            <img
                              src={reply.user.avatar || 'https://placehold.co/24x24/374151/FFFFFF?text=' + reply.user.name.charAt(0)}
                              alt={reply.user.name}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <div className="bg-gray-600 rounded-lg p-2">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="font-medium text-white text-xs">{reply.user.name}</span>
                                  <span className="text-gray-400 text-xs">{reply.time_ago}</span>
                                </div>
                                <p className="text-gray-300 text-xs">{reply.content}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showImageGallery && post.image_urls && post.image_urls.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="max-w-4xl max-h-full p-4">
            <div className="relative">
              <button
                onClick={() => setShowImageGallery(false)}
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <img
                src={post.image_urls[0]}
                alt="Post image"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
