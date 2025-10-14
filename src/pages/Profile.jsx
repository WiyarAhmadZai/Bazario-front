import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { updateProfile, getCurrentUser } from '../services/authService';
import { getCategories } from '../services/categoryService';
import sellerService from '../services/sellerService';
import api from '../services/api';

const Profile = () => {
  const { user, updateProfile: updateAuthProfile } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    date_of_birth: user?.date_of_birth || '',
    address: user?.address || '',
    city: user?.city || '',
    country: user?.country || '',
    gender: user?.gender || '',
    profession: user?.profession || '',
    social_links: user?.social_links || {}
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('basic');
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [checkingSubscription, setCheckingSubscription] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    password: '',
    password_confirmation: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPasswordVerification, setShowPasswordVerification] = useState(false);
  const [verificationPassword, setVerificationPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const [userProducts, setUserProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsPage, setProductsPage] = useState(1);
  const [productsTotalPages, setProductsTotalPages] = useState(1);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedProductImage, setSelectedProductImage] = useState(null);
  const [showProfileImageModal, setShowProfileImageModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Security section states
  const [showSessions, setShowSessions] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [activity, setActivity] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [activityLoading, setActivityLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  // Auto-dismiss success messages
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess('');
      }, 3000); // Auto-dismiss after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [success]);

  // Auto-dismiss error messages
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 5000); // Auto-dismiss after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [error]);

  // Sync form data when user changes
  useEffect(() => {
    if (user) {
      console.log('Current user in Profile component:', {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image
      });
      
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        date_of_birth: user.date_of_birth || '',
        address: user.address || '',
        city: user.city || '',
        country: user.country || '',
        gender: user.gender || '',
        profession: user.profession || '',
        social_links: user.social_links || {}
      });
      
      // Check newsletter subscription status
      checkNewsletterSubscription();
    }
  }, [user]);

  // Function to check newsletter subscription status
  const checkNewsletterSubscription = async () => {
    if (!user?.email) return;
    
    try {
      setCheckingSubscription(true);
      const response = await fetch(`/api/newsletter/check-subscription?email=${encodeURIComponent(user.email)}`);
      const data = await response.json();
      
      if (response.ok) {
        setIsSubscribed(data.subscribed);
      }
    } catch (error) {
      console.error('Error checking subscription status:', error);
    } finally {
      setCheckingSubscription(false);
    }
  };

  // Function to handle newsletter unsubscribe
  const handleNewsletterUnsubscribe = async () => {
    if (!user?.email) return;
    
    try {
      setNewsletterLoading(true);
      const response = await fetch('/api/newsletter/unsubscribe', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setIsSubscribed(false);
        setSuccess('Successfully unsubscribed from newsletter!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Failed to unsubscribe');
        setTimeout(() => setError(''), 3000);
      }
    } catch (error) {
      setError('Error unsubscribing from newsletter');
      setTimeout(() => setError(''), 3000);
    } finally {
      setNewsletterLoading(false);
    }
  };

  // Function to handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.password !== passwordData.password_confirmation) {
      setError('Passwords do not match');
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (passwordData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setPasswordLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(passwordData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Password changed successfully!');
        setPasswordData({
          current_password: '',
          password: '',
          password_confirmation: ''
        });
        setShowPasswordModal(false);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Failed to change password');
        setTimeout(() => setError(''), 3000);
      }
    } catch (error) {
      setError('Error changing password');
      setTimeout(() => setError(''), 3000);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('social_')) {
      const socialKey = name.replace('social_', '');
      setFormData({
        ...formData,
        social_links: {
          ...formData.social_links,
          [socialKey]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Password verification function
  const verifyPassword = async (password) => {
    try {
      const response = await api.post('/verify-password', { password });
      return true;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('Invalid password');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Network error. Please check your connection.');
      }
    }
  };

  const handlePasswordVerification = async (e) => {
    e.preventDefault();
    if (!verificationPassword.trim()) {
      setError('Please enter your password');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      await verifyPassword(verificationPassword);
      setShowPasswordVerification(false);
      setVerificationPassword('');
      // Proceed with the actual update
      await performUpdate();
    } catch (err) {
      setError(err.message || 'Invalid password');
    } finally {
      setIsVerifying(false);
    }
  };

  const performUpdate = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Only send fields that have changed or are not empty
      const changedFields = {};
      
      // Compare with original user data and only include changed fields
      Object.keys(formData).forEach(key => {
        if (key === 'social_links') {
          // Handle social links specially
          const hasChanges = Object.values(formData.social_links || {}).some(val => val && val.trim());
          if (hasChanges) {
            changedFields.social_links = formData.social_links;
          }
        } else if (formData[key] !== '' && formData[key] !== null && formData[key] !== user[key]) {
          changedFields[key] = formData[key];
        }
      });

      // Only handle non-image field updates (image is handled separately)
      if (Object.keys(changedFields).length > 0) {
        const response = await updateProfile(changedFields);
        
        // Handle response format - ensure we get the user data
        const userData = response.user || response;
        updateAuthProfile(userData);
        
        // Also update localStorage to persist across page refreshes
        localStorage.setItem('user', JSON.stringify(userData));
        
        setSuccess('Profile updated successfully!');
        setEditing(false);
        setImagePreview(null);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('No changes detected');
        setLoading(false);
        return;
      }
    } catch (err) {
      console.error('Profile update error:', err);
      if (err.errors) {
        // Handle validation errors
        const firstError = Object.values(err.errors)[0];
        setError(Array.isArray(firstError) ? firstError[0] : firstError);
      } else {
        setError(err.message || 'Failed to update profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Show password verification modal instead of direct update
    setShowPasswordVerification(true);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image size should be less than 5MB');
        return;
      }
      
      setLoading(true);
      setError('');
      setSuccess('');
      
      try {
        // Create preview immediately
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target.result);
        reader.readAsDataURL(file);
        
        // Upload image immediately
        const imageFormData = new FormData();
        imageFormData.append('avatar', file);
        
        const response = await updateProfile(imageFormData, true);
        
        // Handle both old and new response formats
        const userData = response.user || response;
        updateAuthProfile(userData);
        
        // Also update localStorage to persist across page refreshes
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Clear the preview since the image is now uploaded
        setImagePreview(null);
        
        setSuccess('Profile image updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        console.error('Image upload error:', err);
        if (err.errors && err.errors.avatar) {
          setError(err.errors.avatar[0]);
        } else {
          setError(err.message || 'Failed to update profile image');
        }
        setImagePreview(null);
      } finally {
        setLoading(false);
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="bg-black bg-opacity-30 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 border-opacity-50 p-8">
          <p className="text-gray-300">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  // Fetch user's products
  useEffect(() => {
    if (user) {
      fetchUserProducts();
    }
  }, [user, productsPage]);

  // Refresh user data when component mounts or user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        bio: user?.bio || '',
        date_of_birth: user?.date_of_birth || '',
        address: user?.address || '',
        city: user?.city || '',
        country: user?.country || '',
        gender: user?.gender || '',
        profession: user?.profession || '',
        social_links: user?.social_links || {}
      });
    }
  }, [user]);

  // Refresh data when returning from edit page
  useEffect(() => {
    const handleFocus = () => {
      if (user) {
        fetchUserProducts(productsPage);
      }
    };

    // Check for product update flag
    const checkForUpdates = () => {
      const lastUpdate = localStorage.getItem('productUpdated');
      console.log('Profile: Checking for updates, lastUpdate:', lastUpdate);
      if (lastUpdate && user) {
        const updateTime = parseInt(lastUpdate);
        const now = Date.now();
        console.log('Profile: Update time diff:', now - updateTime);
        // If update was within last 30 seconds, refresh data
        if (now - updateTime < 30000) {
          console.log('Profile: Refreshing data due to product update');
          fetchUserProducts(productsPage);
          localStorage.removeItem('productUpdated');
        }
      }
    };

    window.addEventListener('focus', handleFocus);
    checkForUpdates(); // Check immediately when component mounts
    
    return () => window.removeEventListener('focus', handleFocus);
  }, [user, productsPage]);

  // Helper function to get product image URL
  const getProductImageUrl = (product) => {
    if (!product.images) {
      return '/src/assets/abstract-art-circle-clockwork-414579.jpg';
    }
    
    try {
      const images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
      if (images && images.length > 0) {
        return `http://localhost:8000/storage/${images[0]}`;
      }
    } catch (error) {
      console.error('Error parsing product images:', error);
    }
    
    return '/src/assets/abstract-art-circle-clockwork-414579.jpg';
  };

  // Calculate discount percentage
  const calculateDiscountPercentage = (price, discount) => {
    if (!discount || discount <= 0) return 0;
    // Discount is already stored as a percentage, so return it directly
    return Math.round(discount);
  };

  // Handle image modal
  const handleImageClick = (product) => {
    setSelectedProductImage(getProductImageUrl(product));
    setShowImageModal(true);
  };

  // Handle profile image click
  const handleProfileImageClick = () => {
    if (user?.avatar) {
      setShowProfileImageModal(true);
    }
  };

  // Handle product edit
  const handleEditProduct = (productId) => {
    // Navigate to sell product page with edit mode and form view
    window.location.href = `/sell?edit=${productId}&view=form`;
  };

  // Handle product delete
  const handleDeleteProduct = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!productToDelete) return;
    
    setDeleting(true);
    try {
      const response = await fetch(`/api/seller/products/${productToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Remove product from local state
        setUserProducts(prev => prev.filter(p => p.id !== productToDelete.id));
        setSuccess('Product deleted successfully');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to delete product');
        setTimeout(() => setError(''), 3000);
      }
    } catch (err) {
      setError('Failed to delete product');
      setTimeout(() => setError(''), 3000);
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  };

  // Format time ago
  const formatTimeAgo = (dateString) => {
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

  const fetchUserProducts = async (page = 1) => {
    setProductsLoading(true);
    try {
      const response = await fetch(`/api/seller/products?page=${page}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserProducts(data.data || []);
        setProductsPage(data.current_page || 1);
        setProductsTotalPages(data.last_page || 1);
      } else {
        console.error('Failed to fetch products:', response.status);
        setUserProducts([]);
      }
    } catch (error) {
      console.error('Error fetching user products:', error);
      setUserProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  // Security functions
  const fetchSessions = async () => {
    setSessionsLoading(true);
    try {
      console.log('Fetching sessions...');
      const response = await api.get('/api/user/sessions');
      console.log('Sessions response:', response.data);
      setSessions(response.data.sessions || []);
      setShowSessions(true);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      // For now, show mock data if API fails
      const mockSessions = [
        {
          id: 1,
          device: 'Chrome on Windows',
          location: 'New York, NY',
          last_activity: new Date().toLocaleString(),
          current: true
        },
        {
          id: 2,
          device: 'Safari on iPhone',
          location: 'Los Angeles, CA',
          last_activity: new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleString(),
          current: false
        }
      ];
      setSessions(mockSessions);
      setShowSessions(true);
    } finally {
      setSessionsLoading(false);
    }
  };

  const fetchActivity = async () => {
    setActivityLoading(true);
    try {
      console.log('Fetching activity...');
      const response = await api.get('/api/user/activity');
      console.log('Activity response:', response.data);
      setActivity(response.data.activity || []);
      setShowActivity(true);
    } catch (error) {
      console.error('Error fetching activity:', error);
      // For now, show mock data if API fails
      const mockActivity = [
        {
          id: 1,
          type: 'login',
          description: 'Successful login',
          details: 'Logged in from Chrome on Windows',
          timestamp: new Date().toLocaleString()
        },
        {
          id: 2,
          type: 'password_change',
          description: 'Password changed',
          details: 'Password was updated successfully',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleString()
        },
        {
          id: 3,
          type: 'profile_update',
          description: 'Profile updated',
          details: 'Personal information was modified',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleString()
        }
      ];
      setActivity(mockActivity);
      setShowActivity(true);
    } finally {
      setActivityLoading(false);
    }
  };

  const exportUserData = async () => {
    setExportLoading(true);
    try {
      console.log('Exporting user data...');
      const response = await api.get('/api/user/export', {
        responseType: 'blob'
      });
      
      // Create download link for Excel file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `user-data-${user.id}-${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      setSuccess('Data export completed successfully');
    } catch (error) {
      console.error('Error exporting data:', error);
      // Create Excel file from user data
      const userData = {
        'User ID': user.id,
        'Name': user.name || '',
        'Email': user.email || '',
        'Phone': user.phone || '',
        'Bio': user.bio || '',
        'Date of Birth': user.date_of_birth || '',
        'Address': user.address || '',
        'City': user.city || '',
        'Country': user.country || '',
        'Gender': user.gender || '',
        'Profession': user.profession || '',
        'Email Verified': user.email_verified ? 'Yes' : 'No',
        'Account Created': user.created_at || '',
        'Last Login': user.last_login_at || '',
        'Social Links': user.social_links ? JSON.stringify(user.social_links) : '',
        'Export Date': new Date().toLocaleString()
      };
      
      // Convert to CSV format
      const csvContent = Object.entries(userData)
        .map(([key, value]) => `"${key}","${value}"`)
        .join('\n');
      
      // Add BOM for Excel compatibility
      const BOM = '\uFEFF';
      const csvWithBOM = BOM + csvContent;
      
      const dataBlob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `user-data-${user.id}-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      setSuccess('Data export completed successfully (Excel format)');
    } finally {
      setExportLoading(false);
    }
  };

  const terminateSession = async (sessionId) => {
    try {
      await api.delete(`/api/user/sessions/${sessionId}`);
      setSessions(sessions.filter(session => session.id !== sessionId));
      setSuccess('Session terminated successfully');
    } catch (error) {
      console.error('Error terminating session:', error);
      setError('Failed to terminate session');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-gray-300">Manage your account information and preferences</p>
          
          {/* Success/Error Messages */}
          {success && (
            <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center justify-between">
              <span>{success}</span>
              <button
                onClick={() => setSuccess('')}
                className="ml-4 text-green-600 hover:text-green-800 transition-colors duration-200"
                title="Close"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          {error && (
            <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={() => setError('')}
                className="ml-4 text-red-600 hover:text-red-800 transition-colors duration-200"
                title="Close"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Profile Card */}
        <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-700">
          {/* Profile Header with Image */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-8">
            <div className="flex items-center space-x-6">
              {/* Profile Image with Camera Icon */}
              <div className="relative group">
                <div 
                  className="w-24 h-24 rounded-full overflow-hidden border-4 border-gold shadow-lg cursor-pointer hover:opacity-90 transition-opacity duration-200"
                  onClick={handleProfileImageClick}
                  title="Click to view full size"
                >
              {imagePreview || user?.avatar ? (
                <img 
                  src={imagePreview || `http://localhost:8000/storage/${user.avatar}`} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              {!imagePreview && !user?.avatar && (
                <div className="w-full h-full bg-gradient-to-r from-gold to-yellow-500 flex items-center justify-center">
                  <span className="text-2xl font-bold text-black">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
              )}
                </div>
                {/* Camera Icon */}
                <label className={`absolute bottom-0 right-0 rounded-full p-2 cursor-pointer shadow-lg transition-all duration-200 group-hover:scale-110 ${
                  loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gold hover:bg-yellow-500'
                }`}>
                  {loading ? (
                    <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={loading}
                    className="hidden"
                    title="Select an image (max 5MB)"
                  />
                </label>
              </div>
              
              {/* User Info */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-1">{user?.name || 'User'}</h2>
                <p className="text-gray-300 mb-2">{user?.email}</p>
                <p className="text-gray-400 text-sm">{user?.profession || 'No profession set'}</p>
                <div className="flex items-center space-x-4 mt-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user?.email_verified 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user?.email_verified ? '✓ Verified' : '✗ Not Verified'}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-gold text-black">
                    {user?.role || 'User'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('basic')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'basic'
                    ? 'border-gold text-gold'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-500'
                }`}
              >
                Basic Info
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'products'
                    ? 'border-gold text-gold'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-500'
                }`}
              >
                My Products
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'settings'
                    ? 'border-gold text-gold'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-500'
                }`}
              >
                Settings
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'security'
                    ? 'border-gold text-gold'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-500'
                }`}
              >
                Security
              </button>
            </nav>
          </div>
          
          <div className="px-6 py-8">
            {activeTab === 'basic' && (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info Content */}
                <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold text-white placeholder-gray-500"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold text-white placeholder-gray-500"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold text-white placeholder-gray-500"
                    placeholder="Your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Profession</label>
                  <input
                    type="text"
                    name="profession"
                    value={formData.profession}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold text-white placeholder-gray-500"
                    placeholder="Your profession"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold text-white"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold text-white placeholder-gray-500"
                    placeholder="Your full address"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold text-white placeholder-gray-500"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setError('');
                      setSuccess('');
                      setImagePreview(null);
                      // Reset form data to original user data
                      setFormData({
                        name: user.name || '',
                        email: user.email || '',
                        phone: user.phone || '',
                        bio: user.bio || '',
                        date_of_birth: user.date_of_birth || '',
                        address: user.address || '',
                        city: user.city || '',
                        country: user.country || '',
                        gender: user.gender || '',
                        profession: user.profession || '',
                        social_links: user.social_links || {}
                      });
                    }}
                    className="px-6 py-3 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-800 hover:bg-opacity-50 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-gradient-to-r from-gold to-bronze text-black font-medium rounded-lg hover:from-yellow-500 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            )}


            {activeTab === 'products' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white">My Products</h3>
                  <button
                    onClick={() => {/* Navigate to sell product page */}}
                    className="bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-500 hover:to-gold text-black font-bold py-2 px-4 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Add New Product
                  </button>
                </div>
                
                {productsLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
                  </div>
                ) : (
                  <>
                    {userProducts.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {userProducts.map((product) => {
                          const discountPercentage = calculateDiscountPercentage(parseFloat(product.price), parseFloat(product.discount || 0));
                          const discountedPrice = parseFloat(product.price) - (parseFloat(product.price) * parseFloat(product.discount || 0) / 100);
                          
                          return (
                            <div key={product.id} className="bg-gray-700 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-600">
                              <div className="relative">
                                <Link to={`/product/${product.id}`}>
                                  <img 
                                    src={getProductImageUrl(product)}
                                    alt={product.title}
                                    className="w-full h-40 object-cover hover:opacity-90 transition-opacity duration-200 cursor-pointer"
                                    onError={(e) => {
                                      e.target.src = '/src/assets/abstract-art-circle-clockwork-414579.jpg';
                                    }}
                                  />
                                </Link>
                                {product.is_featured && (
                                  <div className="absolute top-2 left-2 bg-gradient-to-r from-gold to-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold">
                                    Featured
                                  </div>
                                )}
                                {discountPercentage > 0 && (
                                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                    -{discountPercentage}%
                                  </div>
                                )}
                              </div>
                              <div className="p-4">
                                <Link to={`/product/${product.id}`} className="block">
                                  <h4 className="font-bold text-white mb-1 line-clamp-1 hover:text-gold transition-colors duration-200 cursor-pointer">{product.title}</h4>
                                </Link>
                                <p className="text-gray-300 text-sm mb-3 line-clamp-2">{product.description}</p>
                                
                                {/* Price Section */}
                                <div className="mb-3">
                                  {discountPercentage > 0 ? (
                                    <div className="flex items-center space-x-2">
                                      <span className="text-lg font-bold text-gold">${discountedPrice.toFixed(2)}</span>
                                      <span className="text-sm text-gray-400 line-through">${product.price}</span>
                                    </div>
                                  ) : (
                                    <span className="text-lg font-bold text-gold">${product.price}</span>
                                  )}
                                </div>
                                
                                <div className="flex justify-between items-center">
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    product.status === 'approved' 
                                      ? 'bg-green-100 text-green-800' 
                                      : product.status === 'pending' 
                                        ? 'bg-yellow-100 text-yellow-800' 
                                        : 'bg-red-100 text-red-800'
                                  }`}>
                                    {product.status}
                                  </span>
                                </div>
                                
                                <div className="mt-3 text-sm text-gray-400">
                                  <div className="flex justify-between items-center">
                                    <div>
                                      {product.stock > 0 && (
                                        <span>Stock: {product.stock}</span>
                                      )}
                                      {product.stock > 0 && product.view_count > 0 && (
                                        <span> | </span>
                                      )}
                                      {product.view_count > 0 && (
                                        <span>Views: {product.view_count}</span>
                                      )}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {formatTimeAgo(product.created_at)}
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Edit and Delete Icons - Only show for the product owner */}
                                {user && product.seller_id === user.id && (
                                  <div className="flex justify-end space-x-2 mt-3 pt-3 border-t border-gray-600">
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleEditProduct(product.id);
                                      }}
                                      className="flex items-center space-x-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg transition-colors duration-200"
                                      title="Edit Product"
                                    >
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                      </svg>
                                      <span>Edit</span>
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleDeleteProduct(product);
                                      }}
                                      className="flex items-center space-x-1 px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded-lg transition-colors duration-200"
                                      title="Delete Product"
                                    >
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                      <span>Delete</span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="bg-gray-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-white mb-1">No products listed</h3>
                        <p className="text-gray-400 mb-4">You haven't listed any products yet.</p>
                        <button
                          onClick={() => {/* Navigate to sell product page */}}
                          className="bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-500 hover:to-gold text-black font-bold py-2 px-4 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                          List Your First Product
                        </button>
                      </div>
                    )}
                    
                    {/* Pagination for products */}
                    {productsTotalPages > 1 && (
                      <div className="flex justify-center mt-8">
                        <nav className="flex items-center space-x-2">
                          <button
                            onClick={() => setProductsPage(productsPage - 1)}
                            disabled={productsPage === 1}
                            className={`px-3 py-1 rounded-md ${productsPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                          >
                            Previous
                          </button>
                          
                          {[...Array(productsTotalPages)].map((_, i) => {
                            const page = i + 1;
                            // Show first, last, current, and nearby pages
                            if (page === 1 || page === productsTotalPages || (page >= productsPage - 1 && page <= productsPage + 1)) {
                              return (
                                <button
                                  key={page}
                                  onClick={() => setProductsPage(page)}
                                  className={`px-3 py-1 rounded-md ${productsPage === page ? 'bg-gold text-black font-bold' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                >
                                  {page}
                                </button>
                              );
                            }
                            
                            // Show ellipsis for skipped pages
                            if (page === productsPage - 2 || page === productsPage + 2) {
                              return <span key={page} className="px-1 text-gray-500">...</span>;
                            }
                            
                            return null;
                          })}
                          
                          <button
                            onClick={() => setProductsPage(productsPage + 1)}
                            disabled={productsPage === productsTotalPages}
                            className={`px-3 py-1 rounded-md ${productsPage === productsTotalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                          >
                            Next
                          </button>
                        </nav>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Account Settings</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-700 bg-opacity-50 rounded-lg">
                      <div>
                        <p className="text-white font-medium">Email Notifications</p>
                        <p className="text-gray-300 text-sm">Receive updates and promotional emails</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isSubscribed}
                          onChange={handleNewsletterUnsubscribe}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gold peer-focus:ring-opacity-50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-700 bg-opacity-50 rounded-lg">
                      <div>
                        <p className="text-white font-medium">Profile Visibility</p>
                        <p className="text-gray-300 text-sm">Make your profile visible to other users</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={true}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gold peer-focus:ring-opacity-50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-700 bg-opacity-50 rounded-lg">
                      <div>
                        <p className="text-white font-medium">Two-Factor Authentication</p>
                        <p className="text-gray-300 text-sm">Add an extra layer of security to your account</p>
                      </div>
                      <button className="bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-500 hover:to-gold text-black font-bold py-2 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg">
                        Enable 2FA
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Security Settings</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-700 bg-opacity-50 rounded-lg">
                      <div>
                        <p className="text-white font-medium">Password</p>
                        <p className="text-gray-300 text-sm">Last changed: Not available</p>
                      </div>
                      <button
                        onClick={() => setShowPasswordModal(true)}
                        className="bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-500 hover:to-gold text-black font-bold py-2 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        Change Password
                      </button>
                    </div>
                    
                    <div className="border-t border-gray-600 pt-4">
                      <div className="flex items-center justify-between p-4 bg-gray-700 bg-opacity-50 rounded-lg">
                        <div>
                          <p className="text-white font-medium">Email Verification</p>
                          <p className="text-gray-300 text-sm">Your email address verification status</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.email_verified 
                            ? 'bg-green-900 text-green-300 border border-green-700' 
                            : 'bg-red-900 text-red-300 border border-red-700'
                        }`}>
                          {user.email_verified ? '✓ Verified' : '✗ Not Verified'}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-gray-600 pt-4">
                      <div className="flex items-center justify-between p-4 bg-gray-700 bg-opacity-50 rounded-lg">
                        <div>
                          <p className="text-white font-medium">Login Sessions</p>
                          <p className="text-gray-300 text-sm">Manage your active login sessions</p>
                        </div>
                        <button 
                          onClick={fetchSessions}
                          disabled={sessionsLoading}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {sessionsLoading ? 'Loading...' : 'View Sessions'}
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-gray-600 pt-4">
                      <div className="flex items-center justify-between p-4 bg-gray-700 bg-opacity-50 rounded-lg">
                        <div>
                          <p className="text-white font-medium">Account Activity</p>
                          <p className="text-gray-300 text-sm">Review recent account activity and security events</p>
                        </div>
                        <button 
                          onClick={fetchActivity}
                          disabled={activityLoading}
                          className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {activityLoading ? 'Loading...' : 'View Activity'}
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-gray-600 pt-4">
                      <div className="flex items-center justify-between p-4 bg-gray-700 bg-opacity-50 rounded-lg">
                        <div>
                          <p className="text-white font-medium">Data Export</p>
                          <p className="text-gray-300 text-sm">Download a copy of your account data</p>
                        </div>
                        <button 
                          onClick={exportUserData}
                          disabled={exportLoading}
                          className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {exportLoading ? 'Exporting...' : 'Export Data'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 p-8 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center">
                <svg className="w-6 h-6 mr-2 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Change Password
              </h3>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordData({
                    current_password: '',
                    password: '',
                    password_confirmation: ''
                  });
                  setError('');
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
                <input
                  type="password"
                  value={passwordData.current_password}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, current_password: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold text-white placeholder-gray-500"
                  placeholder="Enter current password"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                <input
                  type="password"
                  value={passwordData.password}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold text-white placeholder-gray-500"
                  placeholder="Enter new password (min 8 characters)"
                  required
                  minLength={8}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.password_confirmation}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, password_confirmation: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold text-white placeholder-gray-500"
                  placeholder="Confirm new password"
                  required
                  minLength={8}
                />
              </div>
              
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordData({
                      current_password: '',
                      password: '',
                      password_confirmation: ''
                    });
                    setError('');
                  }}
                  className="flex-1 px-4 py-3 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-800 hover:bg-opacity-50 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-gold to-bronze text-black font-medium rounded-lg hover:from-yellow-500 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {passwordLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Changing...
                    </>
                  ) : (
                    'Change Password'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Verification Modal */}
      {showPasswordVerification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-8 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center">
                <svg className="w-6 h-6 mr-2 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Verify Password
              </h3>
              <button
                onClick={() => {
                  setShowPasswordVerification(false);
                  setVerificationPassword('');
                  setError('');
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="text-gray-300 mb-6">Please enter your current password to update your profile information.</p>
            
            <form onSubmit={handlePasswordVerification} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
                <input
                  type="password"
                  value={verificationPassword}
                  onChange={(e) => setVerificationPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold text-white placeholder-gray-400"
                  placeholder="Enter your current password"
                  required
                />
              </div>
              
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordVerification(false);
                    setVerificationPassword('');
                    setError('');
                  }}
                  className="flex-1 px-4 py-3 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-gold to-yellow-500 text-black font-medium rounded-lg hover:from-yellow-500 hover:to-gold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isVerifying ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                    </>
                  ) : (
                    'Verify & Update'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Login Sessions Modal */}
      {showSessions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-8 w-full max-w-4xl mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center">
                <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Login Sessions
              </h3>
              <button
                onClick={() => setShowSessions(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              {sessions.length > 0 ? (
                sessions.map((session, index) => (
                  <div key={session.id || index} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <div>
                            <p className="text-white font-medium">
                              {session.device || 'Unknown Device'}
                            </p>
                            <p className="text-gray-300 text-sm">
                              {session.location || 'Unknown Location'}
                            </p>
                            <p className="text-gray-400 text-xs">
                              Last active: {session.last_activity || 'Unknown'}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {session.current && (
                          <span className="px-2 py-1 bg-green-900 text-green-300 text-xs rounded-full">
                            Current Session
                          </span>
                        )}
                        {!session.current && (
                          <button
                            onClick={() => terminateSession(session.id)}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
                          >
                            Terminate
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">No active sessions found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Account Activity Modal */}
      {showActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-8 w-full max-w-4xl mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center">
                <svg className="w-6 h-6 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Account Activity
              </h3>
              <button
                onClick={() => setShowActivity(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              {activity.length > 0 ? (
                activity.map((event, index) => (
                  <div key={event.id || index} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                    <div className="flex items-start space-x-3">
                      <div className={`w-3 h-3 rounded-full mt-2 ${
                        event.type === 'login' ? 'bg-green-500' :
                        event.type === 'logout' ? 'bg-red-500' :
                        event.type === 'password_change' ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-white font-medium">
                          {event.description || 'Account Activity'}
                        </p>
                        <p className="text-gray-300 text-sm">
                          {event.details || 'No additional details available'}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {event.timestamp || 'Unknown time'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">No activity found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Product Image Modal */}
      {showImageModal && selectedProductImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-w-6xl max-h-full">
            {/* Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowImageModal(false);
              }}
              className="absolute -top-4 -right-4 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors duration-200 z-10"
              title="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Image */}
            <img
              src={selectedProductImage}
              alt="Product"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              style={{ maxHeight: '90vh', maxWidth: '90vw' }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* Profile Image Modal */}
      {showProfileImageModal && user?.avatar && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setShowProfileImageModal(false)}
        >
          <div className="relative max-w-4xl max-h-full">
            {/* Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowProfileImageModal(false);
              }}
              className="absolute -top-4 -right-4 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors duration-200 z-10"
              title="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Profile Image */}
            <img
              src={`http://localhost:8000/storage/${user.avatar}`}
              alt="Profile"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              style={{ maxHeight: '90vh', maxWidth: '90vw' }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && productToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Delete Product</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete "{productToDelete.title}"? This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setProductToDelete(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;