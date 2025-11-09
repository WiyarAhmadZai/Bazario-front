import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { 
    notifications, 
    unreadCount, 
    loading, 
    handleNotificationClick, 
    markAllAsRead,
    fetchNotifications 
  } = useNotifications();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Refresh notifications when dropdown opens
  useEffect(() => {
    if (isOpen && isAuthenticated && notifications.length === 0) {
      // Fetch only if we have nothing cached to ensure instant open
      fetchNotifications();
    }
  }, [isOpen, isAuthenticated, fetchNotifications, notifications.length]);

  const openAllNotifications = () => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
      navigate('/notifications');
    } else {
      setIsModalOpen(true);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'review':
        return '⭐';
      case 'review_reply':
        return '💬';
      case 'wishlist':
        return '❤️';
      case 'cart':
        return '🛒';
      case 'like':
        return '👍';
      default:
        return '🔔';
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-white transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5-5V7a7 7 0 00-14 0v5l-5 5h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50">
          <div className="p-4 border-b border-gray-700">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-gold hover:text-yellow-400 transition-colors"
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-400">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gold mx-auto"></div>
                <p className="mt-2">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-400">
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 border-b border-gray-700 hover:bg-gray-700 cursor-pointer transition-colors ${
                    !notification.read_at ? 'bg-gray-750' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-white truncate">
                          {notification.title}
                        </h4>
                        <span className="text-xs text-gray-400">
                          {formatTimeAgo(notification.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      {!notification.read_at && (
                        <div className="w-2 h-2 bg-gold rounded-full mt-2"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-4 border-t border-gray-700">
              <button
                onClick={openAllNotifications}
                className="w-full text-center text-sm text-gold hover:text-yellow-400 transition-colors"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Desktop Modal for All Notifications */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="All Notifications" size="lg">
        <div className="max-h-[70vh] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-400">No notifications</div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => {
                  handleNotificationClick(notification);
                  setIsModalOpen(false);
                }}
                className={`p-4 border-b border-gray-700 hover:bg-gray-700 cursor-pointer transition-colors ${
                  !notification.read_at ? 'bg-gray-750' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">🔔</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-white truncate">{notification.title}</h4>
                      <span className="text-xs text-gray-400">{new Date(notification.created_at).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-gray-300 mt-1 line-clamp-2">{notification.message}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Modal>
    </div>
  );
};

export default NotificationDropdown;
