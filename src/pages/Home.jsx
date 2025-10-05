import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [email, setEmail] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  
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

  // Newsletter subscription handler
  const handleNewsletterSubscription = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setSubscriptionStatus('Please enter a valid email address.');
      return;
    }

    setIsSubscribing(true);
    setSubscriptionStatus('');

    try {
      const response = await fetch('http://localhost:8000/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubscriptionStatus('🎉 Successfully subscribed! Welcome to our luxury community.');
        setEmail('');
      } else {
        // Handle different error types
        if (response.status === 422) {
          setSubscriptionStatus(`⚠️ ${data.message}`);
        } else if (response.status === 409) {
          setSubscriptionStatus(`ℹ️ ${data.message}`);
        } else {
          setSubscriptionStatus(`❌ ${data.message || 'Subscription failed. Please try again.'}`);
        }
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setSubscriptionStatus('Network error. Please check your connection and try again.');
    } finally {
      setIsSubscribing(false);
      // Clear status message after 5 seconds
      setTimeout(() => setSubscriptionStatus(''), 5000);
    }
  };
  return (
    <div className="home-page">
      {/* Modern Hero Section */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Dynamic Background with Parallax Effect */}
        <div className="absolute inset-0">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/90"></div>
              <img 
                src={slide.image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-2 h-2 bg-gold rounded-full animate-pulse opacity-60"></div>
          <div className="absolute top-40 right-20 w-1 h-1 bg-white rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-60 left-20 w-1.5 h-1.5 bg-gold rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-40 right-10 w-1 h-1 bg-white rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
        </div>
        
        {/* Main Content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="text-left">
                <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  <div className="flex items-center mb-8">
                    <div className="w-20 h-px bg-gradient-to-r from-gold to-gold/50 mr-6"></div>
                    <span className="text-gold text-xs uppercase tracking-[0.3em] font-semibold opacity-90">
                      Est. 2025 • Premium Luxury
                    </span>
                  </div>
                </div>
                
                <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                  <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold text-white mb-8 leading-[0.85] tracking-tight">
                    <span className="block font-extralight mb-3 opacity-95">
                      LUXURY
                    </span>
                    <span className="block text-gold font-black italic transform -skew-x-3 drop-shadow-lg">
                      REDEFINED
                    </span>
                  </h1>
                </div>
                
                <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                  <p className="text-lg text-gray-200 mb-10 max-w-md leading-relaxed font-light opacity-90">
                    {slides[currentSlide].subtitle}
                  </p>
                  <div className="w-12 h-px bg-gold mb-8 opacity-70"></div>
                </div>
                
                <div className="animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                  <div className="flex flex-col sm:flex-row gap-6">
                    <Link 
                      to="/shop" 
                      className="group bg-gold text-black px-10 py-5 font-bold text-sm uppercase tracking-[0.1em] transition-all duration-500 hover:bg-white hover:shadow-2xl transform hover:-translate-y-2 flex items-center justify-center border-2 border-gold hover:border-white"
                    >
                      EXPLORE COLLECTION
                      <svg className="w-4 h-4 ml-3 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                    <Link 
                      to="/about" 
                      className="border-2 border-white/50 text-white px-10 py-5 font-bold text-sm uppercase tracking-[0.1em] transition-all duration-500 hover:bg-white/10 hover:border-white backdrop-blur-sm flex items-center justify-center"
                    >
                      DISCOVER STORY
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Right Content - Featured Stats */}
              <div className="hidden lg:block">
                <div className="animate-fade-in-up" style={{ animationDelay: '1s' }}>
                  <div className="bg-black/20 backdrop-blur-xl border border-white/20 p-10 rounded-none shadow-2xl">
                    <div className="flex items-center mb-8">
                      <div className="w-8 h-px bg-gold mr-4"></div>
                      <h3 className="text-xl font-bold text-white uppercase tracking-[0.1em]">Premium Guarantee</h3>
                    </div>
                    <div className="space-y-8">
                      <div className="flex items-start">
                        <div className="w-14 h-14 bg-gold flex items-center justify-center mr-6 flex-shrink-0">
                          <svg className="w-7 h-7 text-black" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                        </div>
                        <div>
                          <p className="text-white font-semibold text-lg mb-1">50,000+ Satisfied Clients</p>
                          <p className="text-gray-400 text-sm uppercase tracking-wide">Global Excellence</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-14 h-14 bg-gold flex items-center justify-center mr-6 flex-shrink-0">
                          <svg className="w-7 h-7 text-black" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                          </svg>
                        </div>
                        <div>
                          <p className="text-white font-semibold text-lg mb-1">Certified Authentic</p>
                          <p className="text-gray-400 text-sm uppercase tracking-wide">Lifetime Guarantee</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-14 h-14 bg-gold flex items-center justify-center mr-6 flex-shrink-0">
                          <svg className="w-7 h-7 text-black" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 7h-1V6a4 4 0 0 0-8 0v1H9a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM10.9 6a2.1 2.1 0 0 1 4.2 0v1h-4.2V6z"/>
                          </svg>
                        </div>
                        <div>
                          <p className="text-white font-semibold text-lg mb-1">Secure & Insured</p>
                          <p className="text-gray-400 text-sm uppercase tracking-wide">Protected Delivery</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Navigation */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex space-x-6">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-16 h-0.5 transition-all duration-500 ${
                  index === currentSlide
                    ? 'bg-gold shadow-lg shadow-gold/50'
                    : 'bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
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
                image: "/src/assets/wp11994780.jpg",
                gradient: "from-purple-400 via-pink-500 to-red-500"
              },
              {
                id: 2,
                name: "Swiss Luxury Timepiece",
                price: "$4,599.99",
                description: "Premium Swiss-made watch with automatic movement",
                image: "/src/assets/ddd.jpg",
                gradient: "from-blue-400 via-purple-500 to-purple-600"
              },
              {
                id: 3,
                name: "Designer Leather Handbag",
                price: "$1,899.99",
                description: "Handcrafted Italian leather bag with gold accents",
                image: "/src/assets/IMG_3623.JPG",
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
                
                {/* Product image area */}
                <div className="h-64 relative overflow-hidden group-hover:bg-gradient-to-br transition-all duration-700">
                  {/* Product Image */}
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      // Fallback to gradient background if image fails to load
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  
                  {/* Fallback gradient background */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${product.gradient} flex items-center justify-center" style={{display: 'none'}}>`}>
                    <div className="text-white text-6xl font-light opacity-50">
                      {product.name.charAt(0)}
                    </div>
                  </div>
                  
                  {/* Animated background elements */}
                  <div className="absolute top-4 right-4 w-3 h-3 bg-white/20 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-6 left-6 w-2 h-2 bg-white/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                  <div className="absolute top-1/2 left-4 w-1.5 h-1.5 bg-white/25 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  
                  {/* Dark overlay on hover */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-500"></div>
                  
                  {/* Price badge */}
                  <div className="absolute top-4 left-4 bg-black bg-opacity-60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold border border-white/20">
                    {product.price}
                  </div>
                  
                  {/* Hover overlay with product info */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                    <div className="text-white">
                      <p className="text-sm font-light opacity-90">Premium Quality</p>
                    </div>
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

      {/* Customer Testimonials */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What Our Clients Say</h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">Trusted by discerning customers worldwide</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Fashion Designer",
                image: "/src/assets/testimonial-1.jpg",
                rating: 5,
                text: "Exceptional quality and service. Every piece I've purchased has exceeded my expectations. Truly luxury redefined."
              },
              {
                name: "Michael Chen",
                role: "Business Executive",
                image: "/src/assets/testimonial-2.jpg",
                rating: 5,
                text: "The attention to detail is remarkable. From packaging to product quality, everything reflects the premium nature of this brand."
              },
              {
                name: "Emma Rodriguez",
                role: "Interior Designer",
                image: "/src/assets/testimonial-3.jpg",
                rating: 5,
                text: "I've never experienced such personalized service. The team goes above and beyond to ensure complete satisfaction."
              }
            ].map((testimonial, index) => (
              <div 
                key={index}
                className="bg-black bg-opacity-30 backdrop-blur-lg p-8 rounded-xl border border-gray-700 hover:border-gold transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 group animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-gold to-yellow-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-black font-bold text-xl">{testimonial.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-lg">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-gold fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                
                <p className="text-gray-300 leading-relaxed group-hover:text-white transition-colors duration-300 italic">
                  "{testimonial.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="py-16 bg-gradient-to-r from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Stay Updated</h2>
            <p className="text-xl text-gray-300 mb-8">
              Subscribe to our newsletter and be the first to know about new arrivals, exclusive offers, and luxury insights.
            </p>
            
            {/* Subscription Status Message */}
            {subscriptionStatus && (
              <div className={`mb-6 p-4 rounded-lg border ${
                subscriptionStatus.includes('Successfully') 
                  ? 'bg-green-900/30 border-green-500 text-green-300' 
                  : subscriptionStatus.includes('already subscribed') || subscriptionStatus.includes('reactivated')
                  ? 'bg-blue-900/30 border-blue-500 text-blue-300'
                  : 'bg-red-900/30 border-red-500 text-red-300'
              } backdrop-blur-lg animate-fade-in-up`}>
                <div className="flex items-start">
                  <div className="flex-1">
                    {subscriptionStatus}
                  </div>
                  <button 
                    onClick={() => setSubscriptionStatus('')}
                    className="ml-2 text-current opacity-70 hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
            
            <form onSubmit={handleNewsletterSubscription} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                disabled={isSubscribing}
                className="flex-1 px-6 py-4 bg-black bg-opacity-30 backdrop-blur-lg border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-all duration-300 disabled:opacity-50"
              />
              <button 
                type="submit"
                disabled={isSubscribing}
                className="bg-gold text-black px-8 py-4 font-bold uppercase tracking-wide hover:bg-white transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center min-w-[120px]"
              >
                {isSubscribing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Subscribing...
                  </>
                ) : (
                  'Subscribe'
                )}
              </button>
            </form>
            
            <p className="text-gray-500 text-sm mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;