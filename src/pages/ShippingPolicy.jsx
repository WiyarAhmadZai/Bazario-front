import React from 'react';

const ShippingPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Shipping Policy</h1>
          <p className="text-gray-300 text-lg">Fast, secure, and reliable delivery worldwide</p>
        </div>

        {/* Shipping Options */}
        <div className="bg-black bg-opacity-30 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 border-opacity-50 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-gold to-bronze p-6">
            <h2 className="text-2xl font-bold text-black">Shipping Options</h2>
          </div>
          
          <div className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Standard Shipping</h3>
                <p className="text-gray-300 mb-3">3-7 business days</p>
                <p className="text-gold font-semibold">FREE on orders over $100</p>
              </div>

              <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Express Shipping</h3>
                <p className="text-gray-300 mb-3">1-3 business days</p>
                <p className="text-gold font-semibold">$15.99</p>
              </div>

              <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Overnight</h3>
                <p className="text-gray-300 mb-3">Next business day</p>
                <p className="text-gold font-semibold">$29.99</p>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="bg-black bg-opacity-30 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 border-opacity-50 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-gold to-bronze p-6">
            <h2 className="text-2xl font-bold text-black">Shipping Information</h2>
          </div>
          
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-3">Processing Time</h3>
              <p className="text-gray-300 leading-relaxed">
                Orders are processed within 1-2 business days. Custom or personalized items may require additional processing time of 3-5 business days. You will receive a confirmation email once your order has been processed and shipped.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-3">International Shipping</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                We ship worldwide! International shipping times vary by destination:
              </p>
              <ul className="text-gray-300 space-y-2 ml-6">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-gold rounded-full mr-3"></span>
                  Canada: 5-10 business days
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-gold rounded-full mr-3"></span>
                  Europe: 7-14 business days
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-gold rounded-full mr-3"></span>
                  Asia-Pacific: 10-18 business days
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-gold rounded-full mr-3"></span>
                  Rest of World: 14-21 business days
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-3">Shipping Restrictions</h3>
              <p className="text-gray-300 leading-relaxed">
                Some items may have shipping restrictions based on size, weight, or destination. Any restrictions will be noted on the product page. We cannot ship to P.O. boxes for certain high-value items.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-3">Order Tracking</h3>
              <p className="text-gray-300 leading-relaxed">
                Once your order ships, you'll receive a tracking number via email. You can track your package through our website or the carrier's tracking system. For any tracking issues, please contact our customer service team.
              </p>
            </div>
          </div>
        </div>

        {/* Special Services */}
        <div className="bg-black bg-opacity-30 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 border-opacity-50 overflow-hidden">
          <div className="bg-gradient-to-r from-gold to-bronze p-6">
            <h2 className="text-2xl font-bold text-black">Special Services</h2>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-3">Signature Required</h3>
                <p className="text-gray-300">
                  All orders over $500 require signature confirmation for security. This service is complimentary for high-value orders.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-3">Gift Wrapping</h3>
                <p className="text-gray-300">
                  Complimentary luxury gift wrapping available for all orders. Perfect for special occasions and gifts.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-3">White Glove Delivery</h3>
                <p className="text-gray-300">
                  Premium delivery service for large or delicate items. Includes unpacking and setup assistance.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-3">Insurance</h3>
                <p className="text-gray-300">
                  All shipments are automatically insured. Additional insurance is available for high-value items.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;