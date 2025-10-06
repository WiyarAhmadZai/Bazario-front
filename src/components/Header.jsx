import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartCount } = useContext(CartContext);
  const { wishlistCount } = useContext(WishlistContext);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  // Show scroll to top button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen && !event.target.closest('.user-menu')) {
        setIsUserMenuOpen(false);
      }
      if (isMobileMenuOpen && !event.target.closest('.mobile-menu')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isUserMenuOpen, isMobileMenuOpen]);

  return (
    <>
    <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-xl py-3 px-4 md:px-6 sticky top-0 z-50 backdrop-blur-lg bg-opacity-90 border-b border-gray-700">
      <div className="container mx-auto flex justify-between items-center px-6">
        <Link to="/" className="text-xl md:text-2xl font-bold text-white flex items-center">
          <span className="text-gold">LUXURY</span>
          <span className="ml-1">STORE</span>
        </Link>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden text-white focus:outline-none z-50"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-2 px-6">
          <Link 
            to="/" 
            className="text-gray-300 hover:text-gold text-sm font-medium transition-all duration-300 flex items-center px-3 py-2 rounded-lg hover:bg-gray-800 hover:bg-opacity-50 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </Link>
          <Link 
            to="/shop" 
            className="text-gray-300 hover:text-gold text-sm font-medium transition-all duration-300 flex items-center px-3 py-2 rounded-lg hover:bg-gray-800 hover:bg-opacity-50 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Shop
          </Link>
          <Link 
            to="/about" 
            className="text-gray-300 hover:text-gold text-sm font-medium transition-all duration-300 flex items-center px-3 py-2 rounded-lg hover:bg-gray-800 hover:bg-opacity-50 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            About
          </Link>
          <Link 
            to="/contact" 
            className="text-gray-300 hover:text-gold text-sm font-medium transition-all duration-300 flex items-center px-3 py-2 rounded-lg hover:bg-gray-800 hover:bg-opacity-50 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contact
          </Link>
        </nav>
        
        <div className="flex items-center space-x-3 px-6">
          <Link to="/search" className="text-gray-300 hover:text-gold transition-all duration-300 p-2 rounded-full hover:bg-gray-800 hover:bg-opacity-50 group">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Link>
          
          <Link to="/wishlist" className="text-gray-300 hover:text-gold transition-all duration-300 p-2 rounded-full hover:bg-gray-800 hover:bg-opacity-50 group relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gold text-black text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold animate-pulse">
                {wishlistCount}
              </span>
            )}
          </Link>
          
          <Link to="/cart" className="text-gray-300 hover:text-gold transition-all duration-300 p-2 rounded-full hover:bg-gray-800 hover:bg-opacity-50 group relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gold text-black text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold animate-pulse">
                {cartCount}
              </span>
            )}
          </Link>
          
          {user ? (
            <div className="relative user-menu">
              <button 
                className="flex items-center text-gray-300 hover:text-gold transition-all duration-300 focus:outline-none p-2 rounded-full hover:bg-gray-800 hover:bg-opacity-50 group"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <div className="bg-gradient-to-r from-gold to-yellow-500 h-7 w-7 rounded-full flex items-center justify-center">
                  <span className="text-black font-bold text-xs">{user.name.charAt(0)}</span>
                </div>
                <span className="ml-2 hidden md:inline font-medium text-sm">{user.name}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 ml-1 hidden md:inline transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-xl shadow-2xl py-2 z-50 border border-gray-700 backdrop-blur-lg bg-opacity-90 transform transition-all duration-300 origin-top-right">
                  <div className="px-4 py-2 border-b border-gray-700">
                    <p className="text-white font-medium truncate text-sm">{user.name}</p>
                    <p className="text-gray-400 text-xs truncate">{user.email}</p>
                  </div>
                  <Link 
                    to="/profile" 
                    className="block px-4 py-2 text-xs text-white hover:bg-gray-700 hover:bg-opacity-50 flex items-center transition-colors duration-200"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile
                  </Link>
                  <Link 
                    to="/dashboard" 
                    className="block px-4 py-2 text-xs text-white hover:bg-gray-700 hover:bg-opacity-50 flex items-center transition-colors duration-200"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2v2zm14 0a2 2 0 012 2v6a2 2 0 01-2 2h-2M7 7V5a2 2 0 012-2h6a2 2 0 012 2v2H7z" />
                    </svg>
                    User Dashboard
                  </Link>
                  {user && user.role === 'admin' && (
                    <Link 
                      to="/admin" 
                      className="block px-4 py-2 text-xs text-white hover:bg-gray-700 hover:bg-opacity-50 flex items-center transition-colors duration-200"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Admin Dashboard
                    </Link>
                  )}
                  <button 
                    onClick={() => {
                      logout();
                      setIsUserMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-xs text-white hover:bg-gray-700 hover:bg-opacity-50 flex items-center transition-colors duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex space-x-2 px-4">
              <Link 
                to="/login" 
                className="text-gray-300 hover:text-gold text-sm font-medium transition-all duration-300 flex items-center px-3 py-2 rounded-lg hover:bg-gray-800 hover:bg-opacity-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Login
              </Link>
              <span className="text-gray-500 flex items-center">|</span>
              <Link 
                to="/register" 
                className="text-gray-300 hover:text-gold text-sm font-medium transition-all duration-300 flex items-center px-3 py-2 rounded-lg hover:bg-gray-800 hover:bg-opacity-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-gray-900 bg-opacity-95 z-40 mobile-menu">
          <div className="flex flex-col items-center justify-center h-full space-y-6 container mx-auto px-6">
            <Link 
              to="/" 
              className="text-white hover:text-gold font-medium text-lg flex items-center py-2 px-4 rounded-lg hover:bg-gray-800 hover:bg-opacity-50 w-full max-w-md text-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </Link>
            <Link 
              to="/shop" 
              className="text-white hover:text-gold font-medium text-lg flex items-center py-2 px-4 rounded-lg hover:bg-gray-800 hover:bg-opacity-50 w-full max-w-md text-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Shop
            </Link>
            <Link 
              to="/about" 
              className="text-white hover:text-gold font-medium text-lg flex items-center py-2 px-4 rounded-lg hover:bg-gray-800 hover:bg-opacity-50 w-full max-w-md text-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              About
            </Link>
            <Link 
              to="/contact" 
              className="text-white hover:text-gold font-medium text-lg flex items-center py-2 px-4 rounded-lg hover:bg-gray-800 hover:bg-opacity-50 w-full max-w-md text-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact
            </Link>
            
            {!user && (
              <div className="flex flex-col space-y-3 w-full max-w-md mt-4">
                <Link 
                  to="/login" 
                  className="text-white hover:text-gold font-medium text-lg flex items-center justify-center py-2 px-4 rounded-lg bg-gray-800 hover:bg-gray-700 w-full"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="text-white hover:text-gold font-medium text-lg flex items-center justify-center py-2 px-4 rounded-lg bg-gold text-black hover:bg-yellow-500 w-full"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
    
    {/* Scroll to Top Button */}
    {showScrollToTop && (
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-500 hover:to-gold text-black p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 hover:shadow-2xl group"
        aria-label="Scroll to top"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 group-hover:translate-y-[-2px] transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>
    )}
    </>
  );
};

export default Header;