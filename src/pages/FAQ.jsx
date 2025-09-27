import React, { useState } from 'react';

const FAQ = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "How do I place an order?",
      answer: "Simply browse our collection, add items to your cart, and proceed to checkout. You'll need to create an account or sign in to complete your purchase."
    },
    {
      id: 2,
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for your convenience."
    },
    {
      id: 3,
      question: "How long does shipping take?",
      answer: "Standard shipping takes 3-7 business days. Express shipping (1-3 business days) and overnight shipping options are also available."
    },
    {
      id: 4,
      question: "Can I track my order?",
      answer: "Yes! Once your order ships, you'll receive a tracking number via email. You can also track your order in your account dashboard."
    },
    {
      id: 5,
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for unworn items in original condition. Custom or personalized items are not eligible for returns."
    },
    {
      id: 6,
      question: "Do you offer international shipping?",
      answer: "Yes, we ship worldwide. Shipping costs and delivery times vary by location. Please check our shipping policy for more details."
    },
    {
      id: 7,
      question: "How do I care for my luxury items?",
      answer: "Each item comes with specific care instructions. Generally, we recommend professional cleaning for delicate items and proper storage to maintain quality."
    },
    {
      id: 8,
      question: "Are your products authentic?",
      answer: "Absolutely! All our products are 100% authentic and sourced directly from authorized dealers and luxury brands."
    },
    {
      id: 9,
      question: "Do you offer gift wrapping?",
      answer: "Yes, we offer complimentary luxury gift wrapping for all orders. You can select this option during checkout."
    },
    {
      id: 10,
      question: "How can I contact customer service?",
      answer: "You can reach us via email, phone, or live chat. Our customer service team is available 24/7 to assist you with any questions."
    }
  ];

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h1>
          <p className="text-gray-300 text-lg">Find answers to common questions about our luxury store</p>
        </div>

        {/* FAQ Section */}
        <div className="bg-black bg-opacity-30 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 border-opacity-50 overflow-hidden">
          <div className="bg-gradient-to-r from-gold to-bronze p-6">
            <h2 className="text-2xl font-bold text-black">How can we help you?</h2>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div key={faq.id} className="bg-gray-800 bg-opacity-50 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-700 hover:bg-opacity-30 transition-all duration-300"
                  >
                    <span className="text-white font-semibold text-lg">{faq.question}</span>
                    <svg
                      className={`w-6 h-6 text-gold transform transition-transform duration-300 ${
                        openFAQ === faq.id ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {openFAQ === faq.id && (
                    <div className="px-6 pb-4">
                      <div className="border-t border-gray-700 border-opacity-30 pt-4">
                        <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-8 bg-black bg-opacity-30 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 border-opacity-50 overflow-hidden">
          <div className="bg-gradient-to-r from-gold to-bronze p-6">
            <h3 className="text-xl font-bold text-black">Still have questions?</h3>
          </div>
          <div className="p-6 text-center">
            <p className="text-gray-300 mb-6">Can't find what you're looking for? Our customer service team is here to help.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="px-6 py-3 bg-gradient-to-r from-gold to-bronze text-black font-semibold rounded-lg hover:scale-105 transition-transform duration-300"
              >
                Contact Us
              </a>
              <a
                href="mailto:mrwiyarahmadzai@gmail.com"
                className="px-6 py-3 bg-gray-800 bg-opacity-50 text-white font-semibold rounded-lg hover:bg-opacity-70 transition-all duration-300"
              >
                Email Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;