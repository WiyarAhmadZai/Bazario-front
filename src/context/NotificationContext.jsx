import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/notifications');
      setNotifications(response.data.data || []);
      setUnreadCount(response.data.data?.filter(n => !n.read_at).length || 0);
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

  // Handle notification click - navigate to relevant page
  const handleNotificationClick = (notification) => {
    // Mark as read first
    if (!notification.read_at) {
      markAsRead(notification.id);
    }
    
    // Navigate to the action URL
    if (notification.data?.action_url) {
      navigate(notification.data.action_url);
    }
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
