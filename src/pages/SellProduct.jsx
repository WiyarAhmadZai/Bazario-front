import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import sellerService from '../services/sellerService';
import { getCategories } from '../services/categoryService';
import Select from 'react-select';

const SellProduct = ({ isModal = false, closeModal }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    discount: '',
    stock: '',
    category_id: '',
    category_enum: '',
    images: [],
    is_featured: false
  });
  
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    fetchCategories();
  }, [user, navigate]);

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data.data || response.data);
    } catch (err) {
      console.error('Failed to fetch categories', err);
      setError('Failed to load categories');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCategoryEnumChange = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      category_enum: selectedOption ? selectedOption.value : ''
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map(file => ({
      url: URL.createObjectURL(file),
      file
    }));
    
    setImagePreviews(prev => [...prev, ...newPreviews]);
    
    // Update form data with new image files
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const removeImage = (index) => {
    const newPreviews = [...imagePreviews];
    const removed = newPreviews.splice(index, 1);
    
    // Revoke object URL to prevent memory leaks
    if (removed[0].url.startsWith('blob:')) {
      URL.revokeObjectURL(removed[0].url);
    }
    
    setImagePreviews(newPreviews);
    
    // Update form data
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Prepare form data for submission
      const submitData = new FormData();
      
      // Add text fields
      Object.keys(formData).forEach(key => {
        if (key !== 'images') {
          submitData.append(key, formData[key]);
        }
      });
      
      // Add image files
      formData.images.forEach((image, index) => {
        // Only append actual File objects, not URLs
        if (image instanceof File) {
          submitData.append(`images[${index}]`, image);
        }
      });
      
      await sellerService.createProduct(submitData);
      
      setSuccess('Product created successfully!');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        price: '',
        discount: '',
        stock: '',
        category_id: '',
        category_enum: '',
        images: [],
        is_featured: false
      });
      setImagePreviews([]);
      
      // Close modal or redirect
      if (isModal) {
        // Close modal after a short delay
        setTimeout(() => {
          if (closeModal) closeModal();
        }, 2000);
      } else {
        // Redirect to shop after 2 seconds
        setTimeout(() => {
          navigate('/shop');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to create product');
      console.error('Failed to create product', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (isModal) {
      if (closeModal) closeModal();
    } else {
      navigate('/shop');
    }
  };

  // Define category enum options for Select2
  const categoryEnumOptions = [
    { value: 'jewelry', label: 'Jewelry' },
    { value: 'watches', label: 'Watches' },
    { value: 'bags', label: 'Bags' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'home_garden', label: 'Home & Garden' },
    { value: 'sports_outdoors', label: 'Sports & Outdoors' },
    { value: 'books', label: 'Books' },
    { value: 'beauty_personal_care', label: 'Beauty & Personal Care' },
    { value: 'automotive', label: 'Automotive' },
    { value: 'health_wellness', label: 'Health & Wellness' }
  ];

  return (
    <>
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <strong>Error:</strong> {error}
          </div>
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-lg">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <strong>Success:</strong> {success}
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="block text-lg font-medium text-white mb-2">
              Product Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-5 py-4 bg-gray-800 border border-gray-700 rounded-xl focus:ring-4 focus:ring-gold focus:border-transparent transition-all shadow-sm text-white"
              placeholder="Enter product title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-lg font-medium text-white mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <Select
              name="category_enum"
              value={categoryEnumOptions.find(option => option.value === formData.category_enum) || null}
              onChange={handleCategoryEnumChange}
              options={categoryEnumOptions}
              className="basic-single"
              classNamePrefix="select"
              placeholder="Select a category"
              isClearable={true}
              isSearchable={true}
              theme={(theme) => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  primary25: '#f59e0b',
                  primary: '#d4af37',
                  neutral0: '#374151',
                  neutral80: '#ffffff',
                  neutral20: '#6b7280',
                },
              })}
              styles={{
                control: (provided) => ({
                  ...provided,
                  backgroundColor: '#374151',
                  borderColor: '#6b7280',
                  borderRadius: '0.75rem',
                  padding: '0.25rem',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                }),
                menu: (provided) => ({
                  ...provided,
                  backgroundColor: '#374151',
                  borderRadius: '0.75rem',
                }),
                option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.isSelected ? '#d4af37' : state.isFocused ? '#4b5563' : '#374151',
                  color: state.isSelected ? '#000000' : '#ffffff',
                }),
                singleValue: (provided) => ({
                  ...provided,
                  color: '#ffffff',
                }),
              }}
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-lg font-medium text-white mb-2">
              Price ($) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              className="w-full px-5 py-4 bg-gray-800 border border-gray-700 rounded-xl focus:ring-4 focus:ring-gold focus:border-transparent transition-all shadow-sm text-white"
              placeholder="0.00"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-lg font-medium text-white mb-2">
              Discount (%)
            </label>
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              max="100"
              className="w-full px-5 py-4 bg-gray-800 border border-gray-700 rounded-xl focus:ring-4 focus:ring-gold focus:border-transparent transition-all shadow-sm text-white"
              placeholder="0"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-lg font-medium text-white mb-2">
              Stock Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              min="0"
              className="w-full px-5 py-4 bg-gray-800 border border-gray-700 rounded-xl focus:ring-4 focus:ring-gold focus:border-transparent transition-all shadow-sm text-white"
              placeholder="0"
              required
            />
          </div>
          
          <div className="space-y-2 flex items-end">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleInputChange}
                className="h-6 w-6 text-gold rounded focus:ring-gold border-gray-600 bg-gray-700"
              />
              <label className="ml-3 block text-lg font-medium text-white">
                Feature this product
              </label>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="block text-lg font-medium text-white mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="6"
            className="w-full px-5 py-4 bg-gray-800 border border-gray-700 rounded-xl focus:ring-4 focus:ring-gold focus:border-transparent transition-all shadow-sm text-white"
            placeholder="Describe your product in detail..."
            required
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-lg font-medium text-white mb-2">
            Product Images
          </label>
          <div className="mb-4">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="w-full px-5 py-4 bg-gray-800 border border-gray-700 rounded-xl focus:ring-4 focus:ring-gold focus:border-transparent transition-all shadow-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gold file:text-black hover:file:bg-yellow-500"
            />
          </div>
          
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview.url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border-2 border-gray-600"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-6 pt-8">
          <button
            type="button"
            onClick={handleClose}
            className="px-8 py-4 border-2 border-gray-600 text-white font-bold rounded-xl hover:bg-gray-800 transition-all duration-300 text-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-4 bg-gradient-to-r from-gold to-yellow-500 text-black font-bold rounded-xl hover:from-yellow-500 hover:to-gold transition-all shadow-xl hover:shadow-2xl disabled:opacity-50 text-lg flex items-center"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </span>
            ) : (
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Product
              </span>
            )}
          </button>
        </div>
      </form>
    </>
  );
};

export default SellProduct;