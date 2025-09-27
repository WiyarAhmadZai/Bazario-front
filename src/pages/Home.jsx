import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      image: "/src/assets/architecture-art-bridge-cliff-459203.jpg",
      title: "EXQUISITE LUXURY REDEFINED",
      subtitle: "Discover our exclusive collection of premium products",
      description: "Crafted for the discerning individual who demands excellence"
    },
    {
      image: "/src/assets/abstract-architecture-background-brick-194096.jpg",
      title: "TIMELESS ELEGANCE",
      subtitle: "Where sophistication meets innovation",
      description: "Experience the pinnacle of luxury and craftsmanship"
    },
    {
      image: "/src/assets/apple-computer-decor-design-326502.jpg",
      title: "PREMIUM COLLECTION",
      subtitle: "Curated for those who appreciate perfection",
      description: "Each piece tells a story of exceptional quality and design"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };
  return (
    <div className="home-page">
      {/* Hero Slider Section */}
      <section className="relative h-screen overflow-hidden">
        {/* Background Slides */}
        <div className="absolute inset-0">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img 
                src={slide.image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-70"></div>
            </div>
          ))}
        </div>
        
        {/* Content */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white mb-8 leading-[1.1] tracking-[-0.02em]">
                  <span className="block mb-2 transform transition-all duration-700 hover:scale-105 font-thin">
                    {slides[currentSlide].title.split(' ')[0]}
                  </span>
                  <span className="block text-gold mb-2 transform transition-all duration-700 hover:scale-105 font-semibold">
                    {slides[currentSlide].title.split(' ')[1]}
                  </span>
                  <span className="block transform transition-all duration-700 hover:scale-105 font-thin tracking-wide">
                    {slides[currentSlide].title.split(' ').slice(2).join(' ')}
                  </span>
                </h1>
              </div>
              
              <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                <p className="text-xl sm:text-2xl md:text-3xl text-gray-100 mb-10 leading-relaxed font-light tracking-wide max-w-4xl mx-auto">
                  {slides[currentSlide].subtitle}
                </p>
              </div>
              
              <div className="animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
                  <Link 
                    to="/shop" 
                    className="inline-block bg-gold hover:bg-yellow-600 text-black font-bold py-4 px-8 sm:px-10 rounded-full text-base sm:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-xl"
                  >
                    Explore Collection
                  </Link>
                  <Link 
                    to="/about" 
                    className="inline-block bg-transparent border-2 border-white text-white hover:bg-white hover:text-black font-bold py-4 px-8 sm:px-10 rounded-full text-base sm:text-lg transition-all duration-300 hover:shadow-xl"
                  >
                    Our Story
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex space-x-3 mb-4">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-4 h-4 rounded-full border-2 transition-all duration-300 hover:scale-125 ${
                  index === currentSlide
                    ? 'bg-gold border-gold shadow-lg'
                    : 'bg-transparent border-white hover:border-gold'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          
          {/* Scroll indicator */}
          <div className="text-white animate-bounce">
            <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Featured Products</h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">Discover our handpicked selection of premium luxury items</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                id: 1,
                name: "Diamond Elegance Ring",
                price: "$2,999.99",
                description: "Exquisite handcrafted diamond ring with platinum setting",
                image: "/src/assets/jewelry-ring.jpg",
                gradient: "from-purple-400 via-pink-500 to-red-500"
              },
              {
                id: 2,
                name: "Swiss Luxury Timepiece",
                price: "$4,599.99",
                description: "Premium Swiss-made watch with automatic movement",
                image: "/src/assets/luxury-watch.jpg",
                gradient: "from-blue-400 via-purple-500 to-purple-600"
              },
              {
                id: 3,
                name: "Designer Leather Handbag",
                price: "$1,899.99",
                description: "Handcrafted Italian leather bag with gold accents",
                image: "/src/assets/designer-bag.jpg",
                gradient: "from-amber-400 via-orange-500 to-yellow-500"
              }
            ].map((product, index) => (
              <div 
                key={product.id} 
                className="bg-black bg-opacity-30 backdrop-blur-lg rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:scale-105 hover:-translate-y-3 border border-gray-700 hover:border-gold group animate-fade-in-up relative"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* Background glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                {/* Product image/icon area */}
                <div className={`h-64 bg-gradient-to-r ${product.gradient} flex items-center justify-center relative overflow-hidden group-hover:bg-gradient-to-br transition-all duration-700`}>
                  {/* Animated background elements */}
                  <div className="absolute top-4 right-4 w-3 h-3 bg-white/20 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-6 left-6 w-2 h-2 bg-white/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                  <div className="absolute top-1/2 left-4 w-1.5 h-1.5 bg-white/25 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  
                  {/* Main icon */}
                  <div className="text-white transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 relative z-10">
                    {product.icon}
                  </div>
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-0 transition-all duration-500"></div>
                  
                  {/* Price badge */}
                  <div className="absolute top-4 left-4 bg-black bg-opacity-50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold border border-white/20">
                    {product.price}
                  </div>
                </div>
                
                {/* Product details */}
                <div className="p-6 relative z-10">
                  <h3 className="text-xl font-bold mb-2 text-white group-hover:text-gold transition-colors duration-300">
                    {product.name}
                  </h3>
                  <p className="text-gray-300 mb-4 group-hover:text-white transition-colors duration-300 leading-relaxed">
                    {product.description}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg key={star} className="w-4 h-4 text-gold fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-gray-400 text-sm">(4.9)</span>
                    </div>
                    
                    <button className="bg-gray-800 hover:bg-gold hover:text-black text-white font-semibold py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center space-x-2 group">
                      <span>View Details</span>
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Bottom accent line */}
                  <div className="w-0 h-0.5 bg-gold mx-auto mt-4 group-hover:w-full transition-all duration-700 ease-out"></div>
                </div>
              </div>
            ))}"
          </div>
          <div className="text-center mt-12 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
            <Link 
              to="/shop" 
              className="inline-block bg-transparent border-2 border-gold text-gold hover:bg-gold hover:text-black font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Shop by Category</h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">Explore our carefully curated categories</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { 
                name: 'Jewelry', 
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v-4a2 2 0 011-1.732l4-2.732a2 2 0 011 1.732V16a2 2 0 01-1 1.732l-4 2.732A2 2 0 017 18.732V16z" />
                  </svg>
                )
              },
              { 
                name: 'Watches', 
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              },
              { 
                name: 'Bags', 
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
                  </svg>
                )
              },
              { 
                name: 'Accessories', 
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                )
              }
            ].map((category, index) => (
              <Link key={index} to="/shop" className="group">
                <div 
                  className="bg-black bg-opacity-30 backdrop-blur-lg p-8 rounded-xl text-center cursor-pointer hover:shadow-2xl transition-all duration-500 border border-gray-700 group-hover:border-gold transform hover:scale-105 hover:-translate-y-3 animate-fade-in-up group relative overflow-hidden"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Background glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Icon container */}
                  <div className="relative z-10 bg-gray-700 h-24 w-24 rounded-full mx-auto mb-6 flex items-center justify-center group-hover:bg-gold transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-12 shadow-lg group-hover:shadow-2xl">
                    <div className="text-gray-300 group-hover:text-black transition-colors duration-300 transform group-hover:scale-110">
                      {category.icon}
                    </div>
                  </div>
                  
                  {/* Category name */}
                  <h3 className="text-xl font-semibold text-white group-hover:text-gold transition-all duration-300 transform group-hover:scale-105">
                    {category.name}
                  </h3>
                  
                  {/* Hover effect line */}
                  <div className="w-0 h-0.5 bg-gold mx-auto mt-3 group-hover:w-16 transition-all duration-500 ease-out"></div>
                  
                  {/* Floating particles effect */}
                  <div className="absolute top-4 right-4 w-2 h-2 bg-gold rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 transform group-hover:translate-x-2 group-hover:-translate-y-2"></div>
                  <div className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-gold rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100 transform group-hover:-translate-x-1 group-hover:translate-y-1"></div>
                </div>
              </Link>
            ))}"
          </div>
        </div>
      </section>

      {/* Luxury Experience */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-gold rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-gold rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="animate-fade-in-up mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">The Luxury Experience</h2>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
              We curate only the finest products from around the world, ensuring every item meets our exceptional standards of quality and craftsmanship.
            </p>
          </div>
          
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
              <div 
                key={index} 
                className="p-6 bg-black bg-opacity-30 backdrop-blur-lg rounded-xl border border-gray-700 hover:border-gold transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 group animate-fade-in-up"
                style={{ animationDelay: `${index * 200 + 400}ms` }}
              >
                <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                <h3 className="text-xl font-bold mb-4 text-gold group-hover:text-yellow-400 transition-colors duration-300">{item.title}</h3>
                <p className="text-gray-300 group-hover:text-white transition-colors duration-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;