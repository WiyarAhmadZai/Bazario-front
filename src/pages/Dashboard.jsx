import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { cartCount } = useContext(CartContext);
  const { wishlistCount } = useContext(WishlistContext);

  // Redirect admin users to admin dashboard
  if (user && user.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">User Dashboard</h1>
          <p className="text-gray-300">Welcome back, <span className="text-gold">{user?.name}</span>!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-black bg-opacity-30 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 border-opacity-50 p-6 hover:transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-gold to-bronze rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Cart Items</p>
                <p className="text-3xl font-bold text-white">{cartCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-black bg-opacity-30 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 border-opacity-50 p-6 hover:transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Wishlist Items</p>
                <p className="text-3xl font-bold text-white">{wishlistCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-black bg-opacity-30 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 border-opacity-50 p-6 hover:transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Account Status</p>
                <p className="text-3xl font-bold text-green-400">Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <div className="bg-black bg-opacity-30 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 border-opacity-50 overflow-hidden">
            <div className="bg-gradient-to-r from-gold to-bronze p-6">
              <h2 className="text-xl font-bold text-black">Quick Actions</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <Link
                  to="/profile"
                  className="group flex flex-col items-center p-6 bg-gray-800 bg-opacity-50 rounded-xl hover:bg-gradient-to-r hover:from-gold hover:to-bronze transition-all duration-300 hover:scale-105"
                >
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-3 group-hover:bg-black group-hover:bg-opacity-30 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white group-hover:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-white group-hover:text-black transition-colors duration-300">Edit Profile</span>
                </Link>

                <Link
                  to="/orders"
                  className="group flex flex-col items-center p-6 bg-gray-800 bg-opacity-50 rounded-xl hover:bg-gradient-to-r hover:from-gold hover:to-bronze transition-all duration-300 hover:scale-105"
                >
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-3 group-hover:bg-black group-hover:bg-opacity-30 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white group-hover:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-white group-hover:text-black transition-colors duration-300">View Orders</span>
                </Link>

                <Link
                  to="/cart"
                  className="group flex flex-col items-center p-6 bg-gray-800 bg-opacity-50 rounded-xl hover:bg-gradient-to-r hover:from-gold hover:to-bronze transition-all duration-300 hover:scale-105"
                >
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mb-3 group-hover:bg-black group-hover:bg-opacity-30 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white group-hover:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-white group-hover:text-black transition-colors duration-300">View Cart</span>
                </Link>

                <Link
                  to="/wishlist"
                  className="group flex flex-col items-center p-6 bg-gray-800 bg-opacity-50 rounded-xl hover:bg-gradient-to-r hover:from-gold hover:to-bronze transition-all duration-300 hover:scale-105"
                >
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mb-3 group-hover:bg-black group-hover:bg-opacity-30 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white group-hover:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-white group-hover:text-black transition-colors duration-300">Wishlist</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-black bg-opacity-30 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 border-opacity-50 overflow-hidden">
            <div className="bg-gradient-to-r from-gold to-bronze p-6">
              <h2 className="text-xl font-bold text-black">Account Information</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-700 border-opacity-30">
                <span className="text-gray-400 font-medium">Name:</span>
                <span className="text-white font-semibold">{user?.name}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-700 border-opacity-30">
                <span className="text-gray-400 font-medium">Email:</span>
                <span className="text-white font-semibold">{user?.email}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-700 border-opacity-30">
                <span className="text-gray-400 font-medium">Role:</span>
                <span className="text-gold font-semibold capitalize">{user?.role}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-700 border-opacity-30">
                <span className="text-gray-400 font-medium">Member Since:</span>
                <span className="text-white font-semibold">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              {user?.city && (
                <div className="flex justify-between items-center py-2 border-b border-gray-700 border-opacity-30">
                  <span className="text-gray-400 font-medium">City:</span>
                  <span className="text-white font-semibold">{user.city}</span>
                </div>
              )}
              {user?.country && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400 font-medium">Country:</span>
                  <span className="text-white font-semibold">{user.country}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="mt-8 bg-black bg-opacity-30 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 border-opacity-50 overflow-hidden">
          <div className="bg-gradient-to-r from-gold to-bronze p-6">
            <h2 className="text-xl font-bold text-black">Recent Activity</h2>
          </div>
          <div className="p-8">
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-700 bg-opacity-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-gray-300 text-lg font-medium mb-2">No recent activity to display</p>
              <p className="text-gray-500">Start shopping to see your activity here!</p>
              <Link to="/shop" className="inline-block mt-6 px-6 py-3 bg-gradient-to-r from-gold to-bronze text-black font-semibold rounded-lg hover:scale-105 transition-transform duration-300">
                Start Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;