import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SalesAnalytics = ({ orders = [] }) => {
  const [timeRange, setTimeRange] = useState('last_30_days');
  
  // Generate sample sales data for demonstration
  const generateSalesData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Generate random sales data
      const sales = Math.floor(Math.random() * 5000) + 1000;
      const ordersCount = Math.floor(Math.random() * 20) + 5;
      
      data.push({
        date: date.toISOString().split('T')[0],
        sales: sales,
        orders: ordersCount
      });
    }
    
    return data;
  };
  
  const [salesData, setSalesData] = useState(generateSalesData());
  
  // Calculate summary statistics
  const totalSales = salesData.reduce((sum, day) => sum + day.sales, 0);
  const totalOrders = salesData.reduce((sum, day) => sum + day.orders, 0);
  const avgOrderValue = totalOrders > 0 ? (totalSales / totalOrders).toFixed(2) : 0;
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-lg">
          <div className="text-gray-500 text-sm mb-2">Total Sales</div>
          <div className="text-3xl font-bold">{formatCurrency(totalSales)}</div>
          <div className="text-green-500 text-sm mt-2">↑ 12.5% from last period</div>
        </div>
        
        <div className="glass p-6 rounded-lg">
          <div className="text-gray-500 text-sm mb-2">Total Orders</div>
          <div className="text-3xl font-bold">{totalOrders}</div>
          <div className="text-green-500 text-sm mt-2">↑ 8.3% from last period</div>
        </div>
        
        <div className="glass p-6 rounded-lg">
          <div className="text-gray-500 text-sm mb-2">Avg. Order Value</div>
          <div className="text-3xl font-bold">{formatCurrency(avgOrderValue)}</div>
          <div className="text-green-500 text-sm mt-2">↑ 5.7% from last period</div>
        </div>
      </div>
      
      {/* Chart */}
      <div className="glass p-6 rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Sales Trend</h3>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="last_7_days">Last 7 Days</option>
            <option value="last_30_days">Last 30 Days</option>
            <option value="last_90_days">Last 90 Days</option>
          </select>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={salesData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis 
                tickFormatter={(value) => `$${value/1000}k`}
              />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'sales') {
                    return [formatCurrency(value), 'Sales'];
                  }
                  return [value, 'Orders'];
                }}
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke="#3b82f6" 
                activeDot={{ r: 8 }} 
                strokeWidth={2}
                name="Sales"
              />
              <Line 
                type="monotone" 
                dataKey="orders" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Orders"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SalesAnalytics;