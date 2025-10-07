import React from 'react';

const RecordsPerPageSelector = ({ 
  value, 
  onChange, 
  options = [10, 25, 50, 100, 150],
  label = "Records per Page"
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-white mb-2">
        {label}
        <span className="ml-2 px-2 py-1 bg-gold text-black text-xs rounded-full font-medium">
          {value}
        </span>
      </label>
      <select
        name="records_per_page"
        value={value}
        onChange={onChange}
        className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all text-white"
      >
        {options.map(option => (
          <option key={option} value={option} className="bg-gray-700">
            {option} per page
          </option>
        ))}
      </select>
    </div>
  );
};

export default RecordsPerPageSelector;
