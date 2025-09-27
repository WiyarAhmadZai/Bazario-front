import React from 'react';

const ReturnsExchanges = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Returns & Exchanges</h1>
          <p className="text-gray-300 text-lg">Hassle-free returns and exchanges for your peace of mind</p>
        </div>

        {/* Return Policy Overview */}
        <div className="bg-black bg-opacity-30 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 border-opacity-50 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-gold to-bronze p-6">
            <h2 className="text-2xl font-bold text-black">Return Policy Overview</h2>
          </div>
          
          <div className="p-6">
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">30-Day Window</h3>
                <p className="text-gray-300">Return items within 30 days of delivery</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Original Condition</h3>
                <p className="text-gray-300">Items must be unworn and in original packaging</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Full Refund</h3>
                <p className="text-gray-300">Get your money back or exchange for credit</p>
              </div>
            </div>
          </div>
        </div>

        {/* How to Return */}
        <div className="bg-black bg-opacity-30 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 border-opacity-50 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-gold to-bronze p-6">
            <h2 className="text-2xl font-bold text-black">How to Return an Item</h2>
          </div>
          
          <div className="p-6">
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-black font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Initiate Return</h3>
                  <p className="text-gray-300">
                    Log into your account and go to "My Orders" or contact our customer service team to start the return process.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-black font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Print Return Label</h3>
                  <p className="text-gray-300">
                    We'll email you a prepaid return shipping label. Print it and attach it to your package.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-black font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Package Item</h3>
                  <p className="text-gray-300">
                    Carefully package the item in its original packaging with all tags and accessories included.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-black font-bold">4</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Ship & Track</h3>
                  <p className="text-gray-300">
                    Drop off at any carrier location or schedule a pickup. Track your return through the provided tracking number.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Exchange Policy */}
        <div className="bg-black bg-opacity-30 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 border-opacity-50 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-gold to-bronze p-6">
            <h2 className="text-2xl font-bold text-black">Exchange Policy</h2>
          </div>
          
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-3">Size Exchanges</h3>
              <p className="text-gray-300 leading-relaxed">
                Need a different size? We offer free size exchanges within 30 days. Simply indicate your preferred size when initiating your return, and we'll ship the new size once we receive your original item.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-3">Color/Style Exchanges</h3>
              <p className="text-gray-300 leading-relaxed">
                Want a different color or style? Exchanges are available subject to availability. Price differences may apply for exchanges to higher-priced items.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-3">Store Credit</h3>
              <p className="text-gray-300 leading-relaxed">
                Prefer store credit instead of a refund? Store credit never expires and can be used on any future purchase. You'll receive 110% of your original purchase amount in store credit.
              </p>
            </div>
          </div>
        </div>

        {/* Return Conditions */}
        <div className="bg-black bg-opacity-30 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 border-opacity-50 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-gold to-bronze p-6">
            <h2 className="text-2xl font-bold text-black">Return Conditions</h2>
          </div>
          
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-bold text-green-400 mb-3">✓ Returnable Items</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Unworn items with original tags</li>
                  <li>• Items in original packaging</li>
                  <li>• Accessories and components included</li>
                  <li>• Purchase receipt or order number</li>
                  <li>• Items within 30-day window</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-red-400 mb-3">✗ Non-Returnable Items</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Custom or personalized items</li>
                  <li>• Intimate apparel and swimwear</li>
                  <li>• Items worn or damaged</li>
                  <li>• Items without original tags</li>
                  <li>• Final sale items</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-black bg-opacity-30 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 border-opacity-50 overflow-hidden">
          <div className="bg-gradient-to-r from-gold to-bronze p-6">
            <h2 className="text-2xl font-bold text-black">Need Help?</h2>
          </div>
          
          <div className="p-6 text-center">
            <p className="text-gray-300 mb-6">
              Have questions about returns or exchanges? Our customer service team is here to help make the process as smooth as possible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="px-6 py-3 bg-gradient-to-r from-gold to-bronze text-black font-semibold rounded-lg hover:scale-105 transition-transform duration-300"
              >
                Contact Support
              </a>
              <a
                href="tel:+93776992603"
                className="px-6 py-3 bg-gray-800 bg-opacity-50 text-white font-semibold rounded-lg hover:bg-opacity-70 transition-all duration-300"
              >
                Call: +93 776 992 603
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnsExchanges;