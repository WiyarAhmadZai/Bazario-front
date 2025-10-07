import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getPosts, getSponsoredPosts } from '../services/postService';
import PostCard from '../components/PostCard';
import Pagination from '../components/Pagination';
import RecordsPerPageSelector from '../components/RecordsPerPageSelector';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    search: '',
    sort_by: 'newest'
  });

  const { user } = useContext(AuthContext);

  // Fetch sponsored posts (products)
  const fetchPosts = async (page = 1) => {
    setLoading(true);
    setError('');

    try {
      const params = {
        page,
        per_page: recordsPerPage,
        ...filters
      };

      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await getSponsoredPosts(params);
      
      if (response && response.data) {
        setPosts(response.data);
        setCurrentPage(response.current_page || 1);
        setTotalPages(response.last_page || 1);
      } else {
        setPosts([]);
        setCurrentPage(1);
        setTotalPages(1);
      }
    } catch (err) {
      console.error('Error fetching sponsored posts:', err);
      setError('Failed to fetch sponsored posts: ' + (err.message || 'Unknown error'));
      setPosts([]);
      setCurrentPage(1);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchPosts(1);
  }, [recordsPerPage, filters]);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchPosts(page);
  };

  // Handle records per page change
  const handleRecordsPerPageChange = (e) => {
    const newRecordsPerPage = parseInt(e.target.value);
    setRecordsPerPage(newRecordsPerPage);
    setCurrentPage(1);
    fetchPosts(1);
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1);
  };


  // Handle post update
  const handlePostUpdated = (updatedPost) => {
    setPosts(prev => prev.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    ));
  };

  // Handle post deletion
  const handlePostDeleted = (postId) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Sponsored Posts</h1>
              <p className="text-gray-400 mt-2">Discover featured products and sponsored content</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-gray-800 rounded-2xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Search
                </label>
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search posts..."
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Sort By
                </label>
                <select
                  name="sort_by"
                  value={filters.sort_by}
                  onChange={handleFilterChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all text-white"
                >
                  <option value="newest" className="bg-gray-700">Newest First</option>
                  <option value="oldest" className="bg-gray-700">Oldest First</option>
                  <option value="price_low" className="bg-gray-700">Price: Low to High</option>
                  <option value="price_high" className="bg-gray-700">Price: High to Low</option>
                  <option value="name_asc" className="bg-gray-700">Name: A to Z</option>
                  <option value="name_desc" className="bg-gray-700">Name: Z to A</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setFilters({
                      search: '',
                      sort_by: 'newest'
                    });
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-xl transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            </div>

            <div className="mt-6">
              <RecordsPerPageSelector
                value={recordsPerPage}
                onChange={handleRecordsPerPageChange}
                label="Posts per Page"
                options={[5, 10, 20, 50]}
              />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="block sm:inline">{error}</span>
            </div>
            <div className="mt-2">
              <button 
                onClick={() => fetchPosts(currentPage)}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
            <p className="text-gray-400 mt-4">Loading posts...</p>
          </div>
        )}

        {/* Posts Grid */}
        {!loading && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* Left Ad Space - Empty for now */}
            <div className="hidden xl:block xl:col-span-2">
              <div className="sticky top-8">
                <div className="bg-gray-800 rounded-2xl p-6 h-96 flex items-center justify-center border-2 border-dashed border-gray-600">
                  <div className="text-center text-gray-400">
                    <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2M9 8h6m-6 4h6m-6 4h4" />
                    </svg>
                    <p className="text-sm">Ad Space</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content - Wider */}
            <div className="xl:col-span-8">
              {posts && posts.length > 0 ? (
                <>
                  <div className="space-y-6">
                    {posts.map((post) => (
                      <PostCard
                        key={post.id}
                        post={post}
                        onUpdate={handlePostUpdated}
                        onDelete={handlePostDeleted}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    totalItems={posts.length}
                    itemsPerPage={recordsPerPage}
                  />
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="bg-gray-800 rounded-2xl p-12">
                    <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-xl font-bold text-white mb-2">No sponsored posts found</h3>
                    <p className="text-gray-400 mb-6">No products are currently being sponsored. Check back later for featured content!</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Ad Space - Empty for now */}
            <div className="hidden xl:block xl:col-span-2">
              <div className="sticky top-8">
                <div className="bg-gray-800 rounded-2xl p-6 h-96 flex items-center justify-center border-2 border-dashed border-gray-600">
                  <div className="text-center text-gray-400">
                    <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2M9 8h6m-6 4h6m-6 4h4" />
                    </svg>
                    <p className="text-sm">Ad Space</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default Posts;
