import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import adminService from '../../services/adminService';

const UserManagement = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchUsers();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getUsers();
      setUsers(response.data.data || response.data);
    } catch (err) {
      setError('Failed to fetch users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleManageUser = async (userId, action) => {
    try {
      const userData = {
        action: action // 'block', 'unblock', 'make_admin', 'make_seller', 'make_buyer'
      };
      
      await adminService.manageUser(userId, userData);
      fetchUsers(); // Refresh the user list
    } catch (err) {
      console.error('Failed to manage user', err);
    }
  };

  const getRoleBadge = (role) => {
    const roleClasses = {
      admin: 'bg-purple-100 text-purple-800',
      seller: 'bg-green-100 text-green-800',
      buyer: 'bg-blue-100 text-blue-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${roleClasses[role] || 'bg-gray-100 text-gray-800'}`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  const getStatusBadge = (verified) => {
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
        {verified ? 'Verified' : 'Pending'}
      </span>
    );
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-8">Loading users...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="glass p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">User Management</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3">User</th>
              <th className="text-left py-3">Role</th>
              <th className="text-left py-3">Status</th>
              <th className="text-left py-3">Wallet Balance</th>
              <th className="text-left py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} className="border-b">
                <td className="py-3">
                  <div className="flex items-center">
                    {user.avatar && (
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="w-10 h-10 rounded-full mr-3"
                      />
                    )}
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3">{getRoleBadge(user.role)}</td>
                <td className="py-3">{getStatusBadge(user.verified)}</td>
                <td className="py-3">${user.wallet_balance || '0.00'}</td>
                <td className="py-3">
                  <div className="flex flex-wrap gap-2">
                    {!user.verified && (
                      <button
                        onClick={() => handleManageUser(user.id, 'verify')}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm"
                      >
                        Verify
                      </button>
                    )}
                    {user.role !== 'admin' && (
                      <button
                        onClick={() => handleManageUser(user.id, 'make_admin')}
                        className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors text-sm"
                      >
                        Make Admin
                      </button>
                    )}
                    {user.role !== 'seller' && (
                      <button
                        onClick={() => handleManageUser(user.id, 'make_seller')}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm"
                      >
                        Make Seller
                      </button>
                    )}
                    {user.role !== 'buyer' && (
                      <button
                        onClick={() => handleManageUser(user.id, 'make_buyer')}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                      >
                        Make Buyer
                      </button>
                    )}
                    {user.is_blocked ? (
                      <button
                        onClick={() => handleManageUser(user.id, 'unblock')}
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors text-sm"
                      >
                        Unblock
                      </button>
                    ) : (
                      <button
                        onClick={() => handleManageUser(user.id, 'block')}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
                      >
                        Block
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;