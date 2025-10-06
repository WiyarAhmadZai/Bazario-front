import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { updateProfile, getCurrentUser } from '../services/authService';
import { getCategories } from '../services/categoryService';
import sellerService from '../services/sellerService';

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

  const [userProducts, setUserProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsPage, setProductsPage] = useState(1);
  const [productsTotalPages, setProductsTotalPages] = useState(1);

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

  // Fetch user's products
  useEffect(() => {
    if (user) {
      fetchUserProducts();
    }
  }, [user, productsPage]);

  const fetchUserProducts = async (page = 1) => {
    setProductsLoading(true);
    try {
      const response = await sellerService.getProducts(page);
      setUserProducts(response.data.data || []);
      setProductsPage(response.data.current_page || 1);
      setProductsTotalPages(response.data.last_page || 1);
    } catch (error) {
      console.error('Error fetching user products:', error);
    } finally {
      setProductsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('basic')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'basic'
                    ? 'border-gold text-gold'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Basic Info
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'products'
                    ? 'border-gold text-gold'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Products
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'settings'
                    ? 'border-gold text-gold'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Settings
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'security'
                    ? 'border-gold text-gold'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Security
              </button>
            </nav>
          </div>
          
          <div className="px-6 py-8">
            {activeTab === 'basic' && (
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
            
            {activeTab === 'products' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">My Products</h3>
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
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {userProducts.map((product) => (
                          <div key={product.id} className="bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                            <div className="relative">
                              <img 
                                src={`/src/assets/${product.image || 'abstract-art-circle-clockwork-414579.jpg'}`} 
                                alt={product.title}
                                className="w-full h-48 object-cover"
                              />
                              {product.is_featured && (
                                <div className="absolute top-2 right-2 bg-gradient-to-r from-gold to-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold">
                                  Featured
                                </div>
                              )}
                            </div>
                            <div className="p-4">
                              <h4 className="font-bold text-gray-900 mb-1 line-clamp-1">{product.title}</h4>
                              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                              <div className="flex justify-between items-center">
                                <span className="text-lg font-bold text-gold">${product.price.toFixed(2)}</span>
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
                              <div className="mt-3 text-sm text-gray-500">
                                Stock: {product.stock} | Sold: {product.sold || 0}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No products listed</h3>
                        <p className="text-gray-500 mb-4">You haven't listed any products yet.</p>
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
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Account Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-700 font-medium">Email Notifications</p>
                        <p className="text-gray-500 text-sm">Receive updates and promotional emails</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isSubscribed}
                          onChange={handleNewsletterUnsubscribe}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gold rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Security Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-700 font-medium">Password</p>
                        <p className="text-gray-500 text-sm">Last changed: Not available</p>
                      </div>
                      <button
                        onClick={() => setShowPasswordModal(true)}
                        className="bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-500 hover:to-gold text-black font-bold py-2 px-4 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        Change Password
                      </button>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-700 font-medium">Email Verification</p>
                          <p className="text-gray-500 text-sm">Your email address verification status</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.email_verified 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.email_verified ? '✓ Verified' : '✗ Not Verified'}
                        </span>
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
    </div>
  );
};

export default Profile;