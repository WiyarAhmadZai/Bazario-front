import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Helper: normalize backend notification to UI shape
  const normalizeNotification = (n) => {
    const rawType = n.type || n.data?.type || '';
    const simplifiedType = String(rawType)
      .split('\\').pop() // strip namespace if present
      .replace(/Notification$/i, '')
      .toLowerCase();

    const title = n.title || n.data?.title || n.data?.subject || n.data?.heading || 'Notification';
    const message = n.message || n.data?.message || n.data?.body || n.data?.text || '';
    const action_url = n.action_url || n.data?.action_url || n.data?.url || null;

    return {
      id: n.id,
      type: simplifiedType || 'info',
      title,
      message,
      created_at: n.created_at || n.timestamp || new Date().toISOString(),
      read_at: n.read_at || (n.read === true ? new Date().toISOString() : null),
      data: { action_url },
    };
  };

  // Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/notifications');
      const list = Array.isArray(response.data?.data) ? response.data.data : (Array.isArray(response.data) ? response.data : []);
      const normalized = list.map(normalizeNotification);
      setNotifications(normalized);
      const unread = typeof response.data?.unread_count === 'number'
        ? response.data.unread_count
        : normalized.filter(n => !n.read_at).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch unread count
  const fetchUnreadCount = async () => {
    try {
      const response = await api.get('/notifications/unread-count');
      setUnreadCount(response.data.unread_count || 0);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await api.post(`/notifications/${notificationId}/read`);
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read_at: new Date().toISOString() }
            : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await api.post('/notifications/read-all');
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read_at: new Date().toISOString() }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Handle notification click - navigate to relevant page with smooth animation
  const handleNotificationClick = (notification) => {
    // Mark as read first
    if (!notification.read_at) {
      markAsRead(notification.id);
    }
    
    // Navigate to the action URL
    if (notification.data?.action_url) {
      navigate(notification.data.action_url);
      
      // Add smooth scroll animation after navigation
      setTimeout(() => {
        const targetElement = getTargetElement(notification);
        if (targetElement) {
          smoothScrollToElement(targetElement);
        }
      }, 100);
    }
  };

  // Get target element based on notification type
  const getTargetElement = (notification) => {
    const { type, data } = notification;
    
    switch (type) {
      case 'review':
      case 'review_reply':
        return document.getElementById('reviews-section') || document.querySelector('[id*="review"]');
      case 'like':
        return document.querySelector('[data-like-section]') || document.querySelector('.like-button');
      case 'wishlist':
        return document.querySelector('[data-wishlist-section]') || document.querySelector('.wishlist-button');
      case 'cart':
        return document.querySelector('[data-cart-section]') || document.querySelector('.add-to-cart-button');
      case 'product_status':
        return document.getElementById('product-status') || document.querySelector('.product-status');
      default:
        return null;
    }
  };

  // Smooth scroll to element with highlight animation
  const smoothScrollToElement = (element) => {
    if (!element) return;
    
    // Scroll to element
    element.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    });
    
    // Add highlight animation
    element.style.transition = 'all 0.3s ease';
    element.style.backgroundColor = '#fbbf24'; // Gold color
    element.style.boxShadow = '0 0 20px rgba(251, 191, 36, 0.5)';
    
    // Remove highlight after animation
    setTimeout(() => {
      element.style.backgroundColor = '';
      element.style.boxShadow = '';
    }, 2000);
  };

  // Add local notification (for immediate feedback)
  const addLocalNotification = (notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: notification.type || 'info',
      title: notification.title || 'Notification',
      message: notification.message || '',
      timestamp: new Date(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Auto remove after 5 seconds for success/info notifications
    if (['success', 'info'].includes(newNotification.type)) {
      setTimeout(() => {
        removeNotification(id);
      }, 5000);
    }
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // Auto-fetch notifications when component mounts
  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  const value = {
    notifications,
    unreadCount,
    loading,
    addNotification: addLocalNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    handleNotificationClick,
    fetchNotifications,
    fetchUnreadCount
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
