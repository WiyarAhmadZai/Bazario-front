import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import adminService from '../../services/adminService';

const Reports = () => {
  const { user } = useAuth();
  const [salesData, setSalesData] = useState([]);
  const [topSellers, setTopSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('last_30_days');

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchReports();
    }
  }, [user, dateRange]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      // Placeholder for actual implementation
      // const salesResponse = await adminService.getSalesReport({ range: dateRange });
      // const sellersResponse = await adminService.getTopSellers({ range: dateRange });
      
      // Placeholder data for demonstration
      setSalesData([
        { date: '2023-05-01', total_sales: 1200, commission: 24, orders: 12 },
        { date: '2023-05-02', total_sales: 980, commission: 19.6, orders: 8 },
        { date: '2023-05-03', total_sales: 1500, commission: 30, orders: 15 },
        { date: '2023-05-04', total_sales: 750, commission: 15, orders: 6 },
        { date: '2023-05-05', total_sales: 2100, commission: 42, orders: 20 }
      ]);
      
      setTopSellers([
        { id: 1, name: 'Jane Smith', total_sales: 5400, commission: 108 },
        { id: 2, name: 'Bob Wilson', total_sales: 4200, commission: 84 },
        { id: 3, name: 'Alice Johnson', total_sales: 3800, commission: 76 },
        { id: 4, name: 'John Doe', total_sales: 3200, commission: 64 },
        { id: 5, name: 'Sarah Williams', total_sales: 2900, commission: 58 }
      ]);
    } catch (err) {
      setError('Failed to fetch reports');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Calculate totals for summary cards
  const totalSales = salesData.reduce((sum, day) => sum + day.total_sales, 0);
  const totalCommission = salesData.reduce((sum, day) => sum + day.commission, 0);
  const totalOrders = salesData.reduce((sum, day) => sum + day.orders, 0);

  if (loading) {
    return <div className="text-center py-8">Loading reports...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Reports & Analytics</h2>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="last_7_days">Last 7 Days</option>
          <option value="last_30_days">Last 30 Days</option>
          <option value="last_90_days">Last 90 Days</option>
          <option value="this_year">This Year</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-lg">
          <div className="text-gray-500 text-sm mb-2">Total Sales</div>
          <div className="text-3xl font-bold">{formatCurrency(totalSales)}</div>
          <div className="text-green-500 text-sm mt-2">↑ 12.5% from last period</div>
        </div>
        
        <div className="glass p-6 rounded-lg">
          <div className="text-gray-500 text-sm mb-2">Commission Earned</div>
          <div className="text-3xl font-bold">{formatCurrency(totalCommission)}</div>
          <div className="text-green-500 text-sm mt-2">↑ 8.3% from last period</div>
        </div>
        
        <div className="glass p-6 rounded-lg">
          <div className="text-gray-500 text-sm mb-2">Total Orders</div>
          <div className="text-3xl font-bold">{totalOrders}</div>
          <div className="text-green-500 text-sm mt-2">↑ 5.7% from last period</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="glass p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Sales Overview</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {salesData.map((day, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="text-xs text-gray-500 mb-1">
                  {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div 
                  className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors"
                  style={{ height: `${(day.total_sales / Math.max(...salesData.map(d => d.total_sales))) * 200}px` }}
                ></div>
                <div className="text-xs mt-1">
                  {formatCurrency(day.total_sales).replace('$', '')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Commission Chart */}
        <div className="glass p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Commission Overview</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {salesData.map((day, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="text-xs text-gray-500 mb-1">
                  {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div 
                  className="w-full bg-purple-500 rounded-t hover:bg-purple-600 transition-colors"
                  style={{ height: `${(day.commission / Math.max(...salesData.map(d => d.commission))) * 200}px` }}
                ></div>
                <div className="text-xs mt-1">
                  {formatCurrency(day.commission).replace('$', '')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Sellers */}
      <div className="glass p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Top Sellers</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3">Seller</th>
                <th className="text-left py-3">Total Sales</th>
                <th className="text-left py-3">Commission</th>
                <th className="text-left py-3">Performance</th>
              </tr>
            </thead>
            <tbody>
              {topSellers.map((seller, index) => (
                <tr key={seller.id} className="border-b">
                  <td className="py-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-3">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{seller.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">{formatCurrency(seller.total_sales)}</td>
                  <td className="py-3">{formatCurrency(seller.commission)}</td>
                  <td className="py-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${(seller.total_sales / Math.max(...topSellers.map(s => s.total_sales))) * 100}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;