import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import sellerService from '../services/sellerService';
import Select from 'react-select';
import Swal from 'sweetalert2'; // Add SweetAlert2 import

const SellProduct = ({ isModal = false, closeModal }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeView, setActiveView] = useState('list'); // 'list' or 'form'
  const [editingProduct, setEditingProduct] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    discount: '',
    stock: '',
    category_enum: '',
    images: []
  });
  
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    fetchProducts();
    
    // Check if we're in edit mode
    const editId = searchParams.get('edit');
    const view = searchParams.get('view');
    
    if (editId) {
      setLoading(true);
      handleEdit(parseInt(editId)).finally(() => {
        setLoading(false);
      });
    }
    
    // If view=form is specified, switch to form view
    if (view === 'form') {
      setActiveView('form');
    }
  }, [user, navigate, searchParams]);

  const fetchProducts = async () => {
    try {
      const response = await sellerService.getProducts();
      console.log('Products API response:', response);
      const productsData = response.data.data || response.data;
      console.log('Products data:', productsData);
      
      // Log the structure of the first few products to understand the image data format
      if (productsData && Array.isArray(productsData) && productsData.length > 0) {
        console.log('First product structure:', productsData[0]);
        if (productsData[0].images) {
          console.log('First product images type:', typeof productsData[0].images);
          console.log('First product images value:', productsData[0].images);
        }
      }
      
      setProducts(productsData);
    } catch (err) {
      console.error('Failed to fetch products', err);
      setError('Failed to load products');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
      
      // Add image files correctly as an array
      if (formData.images.length > 0) {
        for (let i = 0; i < formData.images.length; i++) {
          const image = formData.images[i];
          // Only append actual File objects
          if (image instanceof File) {
            submitData.append('images[]', image);
          }
        }
      }
      
      // Log FormData for debugging
      console.log('FormData contents:');
      for (let [key, value] of submitData.entries()) {
        console.log(key, value);
      }
      
      if (editingProduct) {
        // Update existing product
        console.log('Updating product with ID:', editingProduct.id);
        await sellerService.updateProduct(editingProduct.id, submitData);
        setSuccess('Product updated successfully!');
      } else {
        // Create new product
        console.log('Creating new product');
        await sellerService.createProduct(submitData);
        setSuccess('Product created successfully!');
      }
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        price: '',
        discount: '',
        stock: '',
        category_enum: '',
        images: []
      });
      setImagePreviews([]);
      
      // Refresh products list
      await fetchProducts();
      
      // Switch back to list view
      setActiveView('list');
      setEditingProduct(null);
    } catch (err) {
      console.error('Failed to save product', err);
      
      // More detailed error handling
      let errorMessage = 'Failed to save product';
      
      if (err.response) {
        console.error('Response data:', err.response.data);
        console.error('Response status:', err.response.status);
        console.error('Response headers:', err.response.headers);
        
        if (err.response.data) {
          if (err.response.data.message) {
            errorMessage = err.response.data.message;
          } else if (err.response.data.error) {
            errorMessage = err.response.data.error;
          } else if (err.response.data.errors) {
            // Handle validation errors
            const errorMessages = Object.values(err.response.data.errors).flat();
            errorMessage = errorMessages.join(', ') || 'Validation failed';
            console.error('Validation errors:', err.response.data.errors);
          }
        }
      } else if (err.request) {
        console.error('Request data:', err.request);
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        console.error('Error message:', err.message);
        errorMessage = err.message || 'An unexpected error occurred';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (productOrId) => {
    let product;
    
    // If it's an ID, find the product in the products array or fetch it
    if (typeof productOrId === 'number') {
      product = products.find(p => p.id === productOrId);
      
      // If product not found in local array, fetch it from API
      if (!product) {
        try {
          console.log('Product not found locally, fetching from API...');
          const response = await sellerService.getProduct(productOrId);
          product = response.data.data || response.data;
          console.log('Fetched product:', product);
        } catch (error) {
          console.error('Failed to fetch product:', error);
          setError('Failed to load product for editing');
          return;
        }
      }
    } else {
      product = productOrId;
    }
    
    setEditingProduct(product);
    setFormData({
      title: product.title || '',
      description: product.description || '',
      price: product.price || '',
      discount: product.discount || '',
      stock: product.stock || '',
      category_enum: product.category_enum || product.category?.name || '',
      images: []
    });
    
    // Set image previews if product has images
    if (product.images && product.images.length > 0) {
      // Parse images if they're stored as a JSON string
      let imagesArray = product.images;
      if (typeof product.images === 'string') {
        try {
          imagesArray = JSON.parse(product.images);
        } catch (e) {
          // If parsing fails, treat as a single image path
          imagesArray = [product.images];
        }
      }
      
      const previews = Array.isArray(imagesArray) 
        ? imagesArray.map(url => ({ 
            url: getImageUrl(url),
            file: null 
          }))
        : [{ url: getImageUrl(imagesArray), file: null }];
      
      setImagePreviews(previews);
    } else {
      setImagePreviews([]);
    }
    
    setActiveView('form');
  };

  const handleDelete = async (productId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this! This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        await sellerService.deleteProduct(productId);
        Swal.fire(
          'Deleted!',
          'Your product has been deleted.',
          'success'
        );
        setSuccess('Product deleted successfully!');
        await fetchProducts(); // Refresh the list
      } catch (err) {
        console.error('Failed to delete product', err);
        let errorMessage = 'Failed to delete product. ';
        
        if (err.response) {
          if (err.response.data && err.response.data.message) {
            errorMessage += err.response.data.message;
          } else {
            errorMessage += 'Please try again later.';
          }
        } else {
          errorMessage += 'Please check your connection and try again.';
        }
        
        Swal.fire(
          'Error!',
          errorMessage,
          'error'
        );
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClose = () => {
    if (isModal) {
      if (closeModal) closeModal();
    } else {
      navigate('/shop');
    }
  };

  const handleCancel = () => {
    setActiveView('list');
    setEditingProduct(null);
    setFormData({
      title: '',
      description: '',
      price: '',
      discount: '',
      stock: '',
      category_enum: '',
      images: []
    });
    setImagePreviews([]);
  };

  // Define category enum options for Select
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

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get image URL helper function
  const getImageUrl = (imagePath) => {
    // Handle null, undefined, or empty paths
    if (!imagePath || imagePath === '' || imagePath === '[]' || imagePath === 'null' || imagePath === 'undefined') {
      return 'https://placehold.co/300x300/374151/FFFFFF?text=No+Image';
    }
    
    // Handle string representations of arrays (JSON) - this is the main fix
    if (typeof imagePath === 'string' && imagePath.startsWith('[')) {
      try {
        const parsed = JSON.parse(imagePath);
        if (Array.isArray(parsed) && parsed.length > 0) {
          imagePath = parsed[0]; // Get the first image from the parsed array
        } else {
          return 'https://placehold.co/300x300/374151/FFFFFF?text=No+Image';
        }
      } catch (e) {
        console.error('Error parsing image array:', e);
        return 'https://placehold.co/300x300/374151/FFFFFF?text=No+Image';
      }
    }
    
    // Handle direct arrays
    if (Array.isArray(imagePath)) {
      if (imagePath.length === 0) {
        return 'https://placehold.co/300x300/374151/FFFFFF?text=No+Image';
      }
      imagePath = imagePath[0]; // Use the first image
    }
    
    // Additional check for empty or whitespace-only strings
    if (typeof imagePath === 'string' && imagePath.trim() === '') {
      return 'https://placehold.co/300x300/374151/FFFFFF?text=No+Image';
    }
    
    // Handle absolute URLs (including placeholder URLs)
    if (typeof imagePath === 'string' && imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Handle relative paths - use the same logic as Shop.jsx
    if (typeof imagePath === 'string') {
      if (imagePath.startsWith('/storage/')) {
        return imagePath;
      } else if (imagePath.startsWith('products/')) {
        return `/storage/${imagePath}`;
      } else {
        return `/storage/products/${imagePath}`;
      }
    }
    
    // Fallback for any other cases
    return 'https://placehold.co/300x300/374151/FFFFFF?text=No+Image';
  };

  // Render product list view
  const renderProductList = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">My Products</h2>
          <button
            onClick={() => setActiveView('form')}
            className="px-6 py-3 bg-gradient-to-r from-gold to-yellow-500 text-black font-bold rounded-xl hover:from-yellow-500 hover:to-gold transition-all shadow-xl hover:shadow-2xl text-lg flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Product
          </button>
        </div>
        
        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-800 bg-opacity-50 rounded-2xl p-8 border border-gray-700">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <h3 className="mt-4 text-xl font-medium text-white">No products yet</h3>
              <p className="mt-2 text-gray-400">Get started by creating your first product.</p>
              <div className="mt-6">
                <button
                  onClick={() => setActiveView('form')}
                  className="px-6 py-3 bg-gradient-to-r from-gold to-yellow-500 text-black font-bold rounded-xl hover:from-yellow-500 hover:to-gold transition-all shadow-xl hover:shadow-2xl text-lg"
                >
                  Create Your First Product
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl shadow-xl border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-800 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {product.images && product.images.length > 0 ? (
                            (() => {
                              // Get the first image properly
                              let firstImage = product.images[0];
                              
                              // If product.images is a string that represents an array, we need to parse the whole array first
                              if (typeof product.images === 'string' && product.images.startsWith('[')) {
                                try {
                                  const parsedArray = JSON.parse(product.images);
                                  if (Array.isArray(parsedArray) && parsedArray.length > 0) {
                                    firstImage = parsedArray[0];
                                  }
                                } catch (e) {
                                  console.error('Error parsing product images array for product', product.id, e);
                                }
                              }
                              // If product.images is already an array, firstImage is already correct
                              
                              const imageUrl = getImageUrl(firstImage);
                              return (
                                <img 
                                  src={imageUrl}
                                  alt={product.title} 
                                  className="w-12 h-12 object-cover rounded-lg mr-4"
                                  onError={(e) => {
                                    console.log('Image load error for product', product.id, ':', e.target.src);
                                    e.target.src = 'https://placehold.co/300x300/374151/FFFFFF?text=Error';
                                  }}
                                />
                              );
                            })()
                          ) : (
                            <div className="w-12 h-12 bg-gray-700 rounded-lg mr-4 flex items-center justify-center">
                              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium text-white">{product.title}</div>
                            <div className="text-sm text-gray-400">{product.category?.name || product.category_enum || 'Uncategorized'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        ${product.price}
                        {product.discount > 0 && (
                          <div className="text-xs text-gray-400 line-through">${(product.price * 100 / (100 - product.discount)).toFixed(2)}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{product.stock}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(product.status)}`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              // View product details
                              navigate(`/product/${product.id}`);
                            }}
                            className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleEdit(product)}
                            className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render product form view
  const renderProductForm = () => {
    // Show loading state when fetching product for editing
    if (editingProduct && loading) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mb-4"></div>
          <p className="text-white text-lg">Loading product data...</p>
        </div>
      );
    }

    return (
      <>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-600 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Back to Products
          </button>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-900 bg-opacity-50 border border-red-700 text-red-200 rounded-lg relative" role="alert">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="block sm:inline">{error}</span>
            </div>
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-green-900 bg-opacity-50 border border-green-700 text-green-200 rounded-lg relative" role="alert">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="block sm:inline">{success}</span>
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
              onClick={handleCancel}
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
                  {editingProduct ? 'Updating...' : 'Creating...'}
                </span>
              ) : (
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </span>
              )}
            </button>
          </div>
        </form>
      </>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl border border-gray-800 p-8">
        {activeView === 'list' ? renderProductList() : renderProductForm()}
      </div>
    </div>
  );
};

export default SellProduct;