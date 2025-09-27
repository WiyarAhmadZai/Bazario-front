import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-gray-300 text-lg">Your privacy is our priority. Learn how we protect your information.</p>
          <p className="text-gray-400 mt-2">Last updated: January 1, 2024</p>
        </div>

        {/* Introduction */}
        <div className="bg-black bg-opacity-30 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 border-opacity-50 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-gold to-bronze p-6">
            <h2 className="text-2xl font-bold text-black">Introduction</h2>
          </div>
          
          <div className="p-6">
            <p className="text-gray-300 leading-relaxed">
              At Luxury Store, we are committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website 
              or make a purchase from us.
            </p>
          </div>
        </div>

        {/* Information We Collect */}
        <div className="bg-black bg-opacity-30 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 border-opacity-50 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-gold to-bronze p-6">
            <h2 className="text-2xl font-bold text-black">Information We Collect</h2>
          </div>
          
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-3">Personal Information</h3>
              <p className="text-gray-300 leading-relaxed mb-3">
                We may collect personal information that you provide to us, including:
              </p>
              <ul className="text-gray-300 space-y-2 ml-6">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-gold rounded-full mr-3"></span>
                  Name, email address, and phone number
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-gold rounded-full mr-3"></span>
                  Billing and shipping addresses
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-gold rounded-full mr-3"></span>
                  Payment information (processed securely by third parties)
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-gold rounded-full mr-3"></span>
                  Account credentials and preferences
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-gold rounded-full mr-3"></span>
                  Communication history and customer service interactions
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-3">Automatically Collected Information</h3>
              <p className="text-gray-300 leading-relaxed mb-3">
                When you visit our website, we automatically collect certain information:
              </p>
              <ul className="text-gray-300 space-y-2 ml-6">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-gold rounded-full mr-3"></span>
                  IP address and location data
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-gold rounded-full mr-3"></span>
                  Browser type and device information
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-gold rounded-full mr-3"></span>
                  Website usage patterns and navigation data
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-gold rounded-full mr-3"></span>
                  Cookies and similar tracking technologies
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* How We Use Your Information */}
        <div className="bg-black bg-opacity-30 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 border-opacity-50 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-gold to-bronze p-6">
            <h2 className="text-2xl font-bold text-black">How We Use Your Information</h2>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-800 bg-opacity-50 rounded-xl p-4">
                <h3 className="text-lg font-bold text-white mb-3">Order Processing</h3>
                <p className="text-gray-300">
                  Process and fulfill your orders, handle payments, and provide customer support.
                </p>
              </div>

              <div className="bg-gray-800 bg-opacity-50 rounded-xl p-4">
                <h3 className="text-lg font-bold text-white mb-3">Communication</h3>
                <p className="text-gray-300">
                  Send order confirmations, shipping updates, and respond to your inquiries.
                </p>
              </div>

              <div className="bg-gray-800 bg-opacity-50 rounded-xl p-4">
                <h3 className="text-lg font-bold text-white mb-3">Personalization</h3>
                <p className="text-gray-300">
                  Customize your shopping experience and provide personalized recommendations.
                </p>
              </div>

              <div className="bg-gray-800 bg-opacity-50 rounded-xl p-4">
                <h3 className="text-lg font-bold text-white mb-3">Marketing</h3>
                <p className="text-gray-300">
                  Send promotional offers and updates (with your consent and opt-out options).
                </p>
              </div>

              <div className="bg-gray-800 bg-opacity-50 rounded-xl p-4">
                <h3 className="text-lg font-bold text-white mb-3">Security</h3>
                <p className="text-gray-300">
                  Protect against fraud, unauthorized access, and ensure website security.
                </p>
              </div>

              <div className="bg-gray-800 bg-opacity-50 rounded-xl p-4">
                <h3 className="text-lg font-bold text-white mb-3">Analytics</h3>
                <p className="text-gray-300">
                  Analyze website usage to improve our services and user experience.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Information Sharing */}
        <div className="bg-black bg-opacity-30 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 border-opacity-50 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-gold to-bronze p-6">
            <h2 className="text-2xl font-bold text-black">Information Sharing</h2>
          </div>
          
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-3">We Do Not Sell Your Data</h3>
              <p className="text-gray-300 leading-relaxed">
                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following limited circumstances:
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white mb-3">Service Providers</h3>
              <p className="text-gray-300 leading-relaxed">
                We work with trusted third-party service providers who help us operate our business, such as payment processors, shipping companies, and email service providers. These providers are contractually bound to protect your information.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white mb-3">Legal Requirements</h3>
              <p className="text-gray-300 leading-relaxed">
                We may disclose your information if required by law, court order, or government regulation, or to protect our rights, property, or safety.
              </p>
            </div>
          </div>
        </div>

        {/* Data Security */}
        <div className="bg-black bg-opacity-30 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 border-opacity-50 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-gold to-bronze p-6">
            <h2 className="text-2xl font-bold text-black">Data Security</h2>
          </div>
          
          <div className="p-6 space-y-4">
            <p className="text-gray-300 leading-relaxed">
              We implement industry-standard security measures to protect your personal information:
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center p-4 bg-gray-800 bg-opacity-30 rounded-lg">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <span className="text-white font-medium">SSL Encryption</span>
              </div>

              <div className="flex items-center p-4 bg-gray-800 bg-opacity-30 rounded-lg">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="text-white font-medium">Secure Payment Processing</span>
              </div>

              <div className="flex items-center p-4 bg-gray-800 bg-opacity-30 rounded-lg">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <span className="text-white font-medium">Regular Security Audits</span>
              </div>

              <div className="flex items-center p-4 bg-gray-800 bg-opacity-30 rounded-lg">
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <span className="text-white font-medium">Data Minimization</span>
              </div>
            </div>
          </div>
        </div>

        {/* Your Rights */}
        <div className="bg-black bg-opacity-30 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 border-opacity-50 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-gold to-bronze p-6">
            <h2 className="text-2xl font-bold text-black">Your Rights</h2>
          </div>
          
          <div className="p-6 space-y-4">
            <p className="text-gray-300 leading-relaxed mb-4">
              You have the following rights regarding your personal information:
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-gold rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-black text-sm font-bold">✓</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Access and Update</h3>
                  <p className="text-gray-300">View and update your personal information in your account settings.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-6 h-6 bg-gold rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-black text-sm font-bold">✓</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Delete Account</h3>
                  <p className="text-gray-300">Request deletion of your account and associated data.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-6 h-6 bg-gold rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-black text-sm font-bold">✓</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Marketing Preferences</h3>
                  <p className="text-gray-300">Opt out of marketing communications at any time.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-6 h-6 bg-gold rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-black text-sm font-bold">✓</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Data Portability</h3>
                  <p className="text-gray-300">Request a copy of your data in a portable format.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-black bg-opacity-30 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 border-opacity-50 overflow-hidden">
          <div className="bg-gradient-to-r from-gold to-bronze p-6">
            <h2 className="text-2xl font-bold text-black">Contact Us</h2>
          </div>
          
          <div className="p-6 text-center">
            <p className="text-gray-300 mb-6">
              If you have questions about this Privacy Policy or how we handle your information, please contact us:
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="px-6 py-3 bg-gradient-to-r from-gold to-bronze text-black font-semibold rounded-lg hover:scale-105 transition-transform duration-300"
              >
                Contact Us
              </a>
              <a
                href="mailto:privacy@luxurystore.com"
                className="px-6 py-3 bg-gray-800 bg-opacity-50 text-white font-semibold rounded-lg hover:bg-opacity-70 transition-all duration-300"
              >
                privacy@luxurystore.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;