import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section with improved image and height */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="/src/assets/architecture-art-bridge-cliff-459203.jpg" 
            alt="Luxury Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              <span className="block mb-2">EXQUISITE</span>
              <span className="block text-gold mb-2">LUXURY</span>
              <span className="block">REDEFINED</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed font-light">
              Discover our exclusive collection of premium products crafted for the discerning individual who demands excellence
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
              <Link to="/shop" className="inline-block bg-gold hover:bg-yellow-600 text-black font-bold py-4 px-8 sm:px-10 rounded-full text-base sm:text-lg transition-all duration-300 transform hover:scale-105 shadow-xl">
                Explore Collection
              </Link>
              <Link to="/about" className="inline-block bg-transparent border-2 border-white text-white hover:bg-white hover:text-black font-bold py-4 px-8 sm:px-10 rounded-full text-base sm:text-lg transition-all duration-300">
                Our Story
              </Link>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-black bg-opacity-30 backdrop-blur-lg rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-700">
                <div className="h-64 bg-gradient-to-r from-gold to-bronze flex items-center justify-center">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Premium Product {item}</h3>
                  <p className="text-gray-600 mb-4">Luxury item description goes here with exquisite details</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-gold">$999.99</span>
                    <button className="bg-gray-800 hover:bg-black text-white font-bold py-2 px-6 rounded-full transition-colors duration-300">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/shop" className="inline-block bg-transparent border-2 border-gold text-gold hover:bg-gold hover:text-black font-bold py-3 px-8 rounded-full text-lg transition-all duration-300">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Jewelry', 'Watches', 'Bags', 'Accessories'].map((category, index) => (
              <Link key={index} to="/shop" className="group">
                <div className="bg-white p-8 rounded-xl text-center cursor-pointer hover:shadow-lg transition-all duration-300 border border-gray-100 group-hover:border-gold">
                  <div className="bg-gray-200 h-24 rounded-full mx-auto mb-6 flex items-center justify-center group-hover:bg-gold transition-colors duration-300">
                    <div className="bg-gray-300 border-2 border-dashed rounded-xl w-12 h-12" />
                  </div>
                  <h3 className="text-xl font-semibold group-hover:text-gold transition-colors duration-300">{category}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Luxury Experience */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">The Luxury Experience</h2>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            We curate only the finest products from around the world, ensuring every item meets our exceptional standards of quality and craftsmanship.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: "Premium Quality", 
                description: "Only the finest materials and craftsmanship",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                )
              },
              { 
                title: "Worldwide Shipping", 
                description: "Delivered to your door with care",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              },
              { 
                title: "24/7 Support", 
                description: "Our dedicated customer service team is available around the clock",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                )
              }
            ].map((item, index) => (
              <div key={index} className="p-6 bg-gray-800 rounded-xl">
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-4 text-gold">{item.title}</h3>
                <p className="text-gray-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;