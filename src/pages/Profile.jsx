import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { updateProfile, getCurrentUser } from '../services/authService';

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
      const response = await fetch(`http://localhost:8000/api/newsletter/check-subscription?email=${encodeURIComponent(user.email)}`);
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
      const response = await fetch('http://localhost:8000/api/newsletter/unsubscribe', {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        updateAuthProfile(response.user);
        
        // Also update localStorage to persist across page refreshes
        localStorage.setItem('user', JSON.stringify(response.user));
      } else {
        setError('No changes detected');
        setLoading(false);
        return;
      }
      
      setSuccess('Profile updated successfully!');
      setEditing(false);
      setImagePreview(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
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
      
      try {
        // Create preview immediately
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target.result);
        reader.readAsDataURL(file);
        
        // Upload image immediately
        const imageFormData = new FormData();
        imageFormData.append('image', file);
        
        const response = await updateProfile(imageFormData, true);
        updateAuthProfile(response.user);
        
        // Also update localStorage to persist across page refreshes
        localStorage.setItem('user', JSON.stringify(response.user));
        
        setSuccess('Profile image updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError(err.message || 'Failed to update profile image');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-gray-300">Manage your account information and preferences</p>
        </div>

        {/* Profile Card */}
        <div className="bg-black bg-opacity-30 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 border-opacity-50 overflow-hidden">
          {/* Profile Header */}
          <div className="relative bg-gradient-to-r from-gold to-bronze p-8">
            <div className="flex flex-col md:flex-row items-center">
              {/* Avatar */}
              <div className="relative mb-4 md:mb-0 md:mr-6">
                <div className="w-32 h-32 bg-black bg-opacity-20 rounded-full flex items-center justify-center border-4 border-white border-opacity-30 relative">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full rounded-full object-cover" />
                  ) : user.image ? (
                    <img 
                      src={user.image.startsWith('http') ? user.image : `http://localhost:8000/${user.image}`} 
                      alt={user.name} 
                      className="w-full h-full rounded-full object-cover" 
                      onLoad={() => {
                        console.log('✅ Image loaded successfully:', {
                          userImage: user.image,
                          finalUrl: user.image.startsWith('http') ? user.image : `http://localhost:8000/${user.image}`
                        });
                      }}
                      onError={(e) => {
                        console.error('❌ Image failed to load:', {
                          userImage: user.image,
                          attemptedUrl: e.target.src,
                          constructedUrl: user.image.startsWith('http') ? user.image : `http://localhost:8000/${user.image}`,
                          error: 'Image load failed'
                        });
                        
                        // Try alternative URL construction
                        const alternativeUrl = `http://localhost:8000/${user.image.replace('storage/', 'storage/')}`;
                        console.log('🔄 Trying alternative URL:', alternativeUrl);
                        
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <span className="text-4xl font-bold text-white">{user.name?.charAt(0) || 'U'}</span>
                  )}
                  {loading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                      <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  )}
                </div>
                <label className={`absolute bottom-0 right-0 bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-2 text-white hover:bg-opacity-30 transition-all duration-300 cursor-pointer ${loading ? 'pointer-events-none opacity-50' : ''}`}>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={loading}
                  />
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </label>
              </div>
              
              {/* User Info */}
              <div className="text-center md:text-left text-white">
                <h2 className="text-3xl font-bold mb-2">{user.name}</h2>
                <p className="text-xl opacity-90 mb-2">{user.email}</p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {user.profession && (
                    <span className="bg-white bg-opacity-20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                      {user.profession}
                    </span>
                  )}
                  {user.city && (
                    <span className="bg-white bg-opacity-20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                      📍 {user.city}, {user.country}
                    </span>
                  )}
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    user.verified 
                      ? 'bg-green-500 bg-opacity-20 text-green-300' 
                      : 'bg-yellow-500 bg-opacity-20 text-yellow-300'
                  }`}>
                    {user.verified ? '✓ Verified' : '⚠ Unverified'}
                  </span>
                </div>
              </div>
              
              {/* Edit Button */}
              <div className="mt-4 md:mt-0 md:ml-auto">
                <button 
                  onClick={() => setEditing(!editing)}
                  className="bg-white bg-opacity-20 backdrop-blur-sm text-white px-6 py-3 rounded-lg hover:bg-opacity-30 transition-all duration-300 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  {editing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="mx-8 mt-6 bg-red-900 bg-opacity-50 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}
          
          {success && (
            <div className="mx-8 mt-6 bg-green-900 bg-opacity-50 border border-green-700 text-green-200 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {success}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-8">
            {!editing ? (
              /* View Mode */
              <div className="grid md:grid-cols-2 gap-8">
                {/* Basic Information */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Basic Information
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                      <p className="text-white">{user.name || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                      <p className="text-white">{user.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Phone</label>
                      <p className="text-white">{user.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Date of Birth</label>
                      <p className="text-white">{user.date_of_birth || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Gender</label>
                      <p className="text-white capitalize">{user.gender || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Profession</label>
                      <p className="text-white">{user.profession || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                {/* Address & Bio */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Address & Bio
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Bio</label>
                      <p className="text-white">{user.bio || 'No bio available'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Address</label>
                      <p className="text-white">{user.address || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">City</label>
                      <p className="text-white">{user.city || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Country</label>
                      <p className="text-white">{user.country || 'Not provided'}</p>
                    </div>
                  </div>

                  {/* Account Stats */}
                  <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4 mt-6">
                    <h4 className="text-lg font-medium text-white mb-3">Account Statistics</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gold">${user.wallet_balance || '0.00'}</p>
                        <p className="text-sm text-gray-400">Wallet Balance</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gold">{user.verified ? '✓' : '✗'}</p>
                        <p className="text-sm text-gray-400">Verification</p>
                      </div>
                    </div>
                  </div>

                  {/* Newsletter Subscription */}
                  <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4 mt-6">
                    <h4 className="text-lg font-medium text-white mb-3 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Newsletter Subscription
                    </h4>
                    
                    {checkingSubscription ? (
                      <div className="flex items-center text-gray-400">
                        <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Checking subscription status...
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Status:</span>
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            isSubscribed 
                              ? 'bg-green-500 bg-opacity-20 text-green-300' 
                              : 'bg-gray-500 bg-opacity-20 text-gray-400'
                          }`}>
                            {isSubscribed ? '✓ Subscribed' : '✗ Not Subscribed'}
                          </span>
                        </div>
                        
                        {isSubscribed && (
                          <div className="pt-2">
                            <button
                              onClick={handleNewsletterUnsubscribe}
                              disabled={newsletterLoading}
                              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center justify-center"
                            >
                              {newsletterLoading ? (
                                <>
                                  <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Unsubscribing...
                                </>
                              ) : (
                                <>
                                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                  Unsubscribe from Newsletter
                                </>
                              )}
                            </button>
                            <p className="text-xs text-gray-500 mt-2 text-center">
                              You will no longer receive updates and promotional emails
                            </p>
                          </div>
                        )}
                        
                        {!isSubscribed && (
                          <div className="text-center text-gray-400 text-sm">
                            <p>You're not subscribed to our newsletter.</p>
                            <p className="mt-1">Visit our homepage to subscribe for updates!</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Edit Mode */
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Tabs */}
                <div className="flex space-x-1 bg-gray-800 bg-opacity-50 p-1 rounded-lg">
                  {[
                    { id: 'basic', name: 'Basic Info', icon: '👤' },
                    { id: 'contact', name: 'Contact', icon: '📞' },
                    { id: 'personal', name: 'Personal', icon: '🏠' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-gold to-bronze text-black'
                          : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      <span className="mr-2">{tab.icon}</span>
                      {tab.name}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="grid md:grid-cols-2 gap-6">
                  {activeTab === 'basic' && (
                    <>
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
                    </>
                  )}

                  {activeTab === 'contact' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
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
                        <label className="block text-sm font-medium text-gray-300 mb-2">Date of Birth</label>
                        <input
                          type="date"
                          name="date_of_birth"
                          value={formData.date_of_birth}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">LinkedIn</label>
                        <input
                          type="url"
                          name="social_linkedin"
                          value={formData.social_links?.linkedin || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold text-white placeholder-gray-500"
                          placeholder="LinkedIn profile URL"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Twitter</label>
                        <input
                          type="url"
                          name="social_twitter"
                          value={formData.social_links?.twitter || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold text-white placeholder-gray-500"
                          placeholder="Twitter profile URL"
                        />
                      </div>
                    </>
                  )}

                  {activeTab === 'personal' && (
                    <>
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

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold text-white placeholder-gray-500"
                          placeholder="Your city"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Country</label>
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold text-white placeholder-gray-500"
                          placeholder="Your country"
                        />
                      </div>
                    </>
                  )}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;