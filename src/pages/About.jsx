import React, { useState, useEffect } from 'react';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStat, setCurrentStat] = useState(0);

  const [teamMembers] = useState([
    {
      id: 1,
      name: "Alex Morgan",
      position: "Founder & CEO",
      image: "/src/assets/apple-business-computer-connection-392018.jpg",
      bio: "With over 15 years in luxury retail, Alex brings unparalleled expertise and vision to Luxury Store.",
      social: {
        linkedin: "#",
        twitter: "#"
      }
    },
    {
      id: 2,
      name: "Sarah Johnson",
      position: "Creative Director",
      image: "/src/assets/adli-wahid-3-QB-YKxTKY-unsplash.jpg",
      bio: "Sarah's eye for design and detail ensures every product meets our exacting standards.",
      social: {
        linkedin: "#",
        twitter: "#"
      }
    },
    {
      id: 3,
      name: "Michael Chen",
      position: "Head of Operations",
      image: "/src/assets/abundance-bank-banking-banknotes-259027.jpg",
      bio: "Michael's operational excellence drives our commitment to exceptional customer service.",
      social: {
        linkedin: "#",
        twitter: "#"
      }
    }
  ]);

  const [stats] = useState([
    { id: 1, value: "10+", label: "Years Experience", icon: "🏆" },
    { id: 2, value: "50K+", label: "Happy Customers", icon: "😊" },
    { id: 3, value: "100+", label: "Premium Brands", icon: "✨" },
    { id: 4, value: "24/7", label: "Support", icon: "🛡️" }
  ]);

  const [values] = useState([
    {
      id: 1,
      title: "Excellence",
      description: "We pursue perfection in every detail, ensuring our products and services exceed expectations.",
      icon: "⭐"
    },
    {
      id: 2,
      title: "Innovation",
      description: "Continuously evolving to bring you the latest in luxury technology and design.",
      icon: "🚀"
    },
    {
      id: 3,
      title: "Integrity",
      description: "Transparent, honest, and ethical in all our business practices and relationships.",
      icon: "🤝"
    },
    {
      id: 4,
      title: "Sustainability",
      description: "Committed to responsible luxury that respects our planet and future generations.",
      icon: "🌱"
    }
  ]);

  useEffect(() => {
    setIsVisible(true);
    
    // Animate stats counter
    const interval = setInterval(() => {
      setCurrentStat(prev => (prev + 1) % stats.length);
    }, 2000);
    
    return () => clearInterval(interval);
  }, [stats.length]);

  return (
    <div className="about-page min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Enhanced Hero Section with Parallax */}
      <section className="relative w-full h-screen overflow-hidden -mt-20 pt-20">
        {/* Dynamic Background with Multiple Layers */}
        <div className="absolute inset-0">
          {/* Main background image */}
          <div className="absolute inset-0">
          <img 
            src="/src/assets/architecture-art-bridge-cliff-459203.jpg" 
            alt="About Us" 
              className="w-full h-full object-cover transform scale-110"
              style={{
                filter: 'brightness(0.2) contrast(1.3) saturate(1.1)',
                animation: 'parallax 20s ease-in-out infinite'
              }}
            />
          </div>
          
          {/* Animated gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/80 to-black/95"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/50"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40"></div>
          
          {/* Animated geometric patterns */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-32 h-32 border border-gold/30 rotate-45 animate-spin-slow"></div>
            <div className="absolute bottom-20 right-20 w-24 h-24 border border-gold/20 rotate-12 animate-pulse"></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gold/20 rounded-full animate-bounce-slow"></div>
            <div className="absolute top-1/3 right-1/3 w-20 h-20 border-2 border-gold/25 rounded-full animate-ping-slow"></div>
          </div>
          
          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-gold/40 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${3 + Math.random() * 4}s`
                }}
              ></div>
            ))}
          </div>
        </div>
        
        {/* Main Content with Enhanced Animations */}
        <div className="relative z-10 flex items-center justify-center h-full px-4 sm:px-6">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge with enhanced animation */}
            <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <span className="inline-block bg-gradient-to-r from-gold/20 to-yellow-500/20 backdrop-blur-sm text-gold px-6 py-2 rounded-full text-sm font-semibold mb-6 border border-gold/30 shadow-lg">
                ✨ OUR STORY
              </span>
            </div>
            
            {/* Main heading with typewriter effect */}
            <div className={`transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white via-gold to-white bg-clip-text text-transparent animate-gradient-x">
                About Luxury Store
                </span>
              </h1>
            </div>
            
            {/* Subtitle with enhanced styling */}
            <div className={`transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <p className="text-base md:text-lg text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed font-light">
                Crafting exceptional experiences through premium luxury products and unparalleled service
              </p>
            </div>
            
            {/* CTA Buttons with enhanced animations */}
            <div className={`transform transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a 
                  href="#our-story" 
                  className="group relative bg-gradient-to-r from-gold to-yellow-500 text-black px-8 py-4 font-bold text-sm uppercase tracking-wider transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 rounded-full overflow-hidden"
                >
                  <span className="relative z-10">Discover Our Story</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
                
                <a 
                  href="#team" 
                  className="group border-2 border-gold/50 text-gold px-8 py-4 font-semibold text-sm uppercase tracking-wider transition-all duration-300 hover:bg-gold hover:text-black hover:shadow-xl transform hover:-translate-y-2 rounded-full backdrop-blur-sm"
                >
                  Meet Our Team
                </a>
              </div>
            </div>
            
            {/* Scroll indicator */}
            <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <div className="flex flex-col items-center text-gold/60 animate-bounce">
                <span className="text-xs mb-2">Scroll Down</span>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="relative py-20 bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-8 md:px-12 lg:px-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-gold to-yellow-500 bg-clip-text text-transparent">
                Our Impact
              </span>
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Numbers that reflect our commitment to excellence and customer satisfaction
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div 
                key={stat.id} 
                className={`group relative text-center p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-700/50 hover:border-gold/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${
                  currentStat === index ? 'scale-105 border-gold/70' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-yellow-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Icon */}
                <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                
                {/* Value with counter animation */}
                <div className="text-3xl md:text-4xl font-bold text-gold mb-2 group-hover:text-yellow-400 transition-colors duration-300">
                  {stat.value}
                </div>
                
                {/* Label */}
                <div className="text-gray-300 text-sm font-medium group-hover:text-white transition-colors duration-300">
                  {stat.label}
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-2 right-2 w-2 h-2 bg-gold/30 rounded-full animate-pulse"></div>
                <div className="absolute bottom-2 left-2 w-1 h-1 bg-yellow-400/50 rounded-full"></div>
            </div>
          ))}
          </div>
        </div>
      </section>

      {/* Enhanced Our Story Section */}
      <section id="our-story" className="py-20 bg-gradient-to-br from-black/80 to-gray-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-8 md:px-12 lg:px-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                <span className="bg-gradient-to-r from-gold to-yellow-500 bg-clip-text text-transparent">
                  Our Story
                </span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-gold to-yellow-500 mx-auto rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div className="space-y-6">
                <div className="group">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-gold to-yellow-500 rounded-full flex items-center justify-center mr-4">
                      <span className="text-black font-bold text-lg">2025</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white">The Beginning</h3>
                  </div>
                  <p className="text-gray-300 text-lg leading-relaxed">
                Founded in 2025, Luxury Store began with a simple vision: to make premium luxury products accessible to everyone. 
                What started as a small online boutique has grown into a premier destination for discerning customers seeking 
                exceptional quality and timeless design.
              </p>
                </div>
                
                <div className="group">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-gold to-yellow-500 rounded-full flex items-center justify-center mr-4">
                      <span className="text-black font-bold text-lg">✨</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white">Our Mission</h3>
                  </div>
                  <p className="text-gray-300 text-lg leading-relaxed">
                Our carefully curated collection features only the finest products from renowned artisans and emerging designers 
                who share our commitment to craftsmanship, sustainability, and innovation. Each item in our store is selected 
                for its superior quality, unique design, and enduring value.
              </p>
                </div>
                
                <div className="group">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-gold to-yellow-500 rounded-full flex items-center justify-center mr-4">
                      <span className="text-black font-bold text-lg">🚀</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white">The Future</h3>
                  </div>
                  <p className="text-gray-300 text-lg leading-relaxed">
                Today, we continue to honor our founding principles while embracing new technologies and trends that enhance 
                the luxury shopping experience. Our dedicated team works tirelessly to ensure that every interaction with 
                Luxury Store reflects the excellence we expect from ourselves and our partners.
              </p>
            </div>
              </div>
              
              {/* Enhanced Image */}
              <div className="relative group">
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img 
                src="/src/assets/apple-computer-decor-design-326502.jpg" 
                alt="Our Store" 
                    className="w-full h-96 object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  
                  {/* Floating elements */}
                  <div className="absolute top-4 right-4 w-16 h-16 bg-gold/20 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-4 left-4 w-8 h-8 bg-yellow-400/30 rounded-full animate-bounce"></div>
                </div>
                
                {/* Decorative border */}
                <div className="absolute -inset-4 bg-gradient-to-r from-gold/20 to-yellow-500/20 rounded-2xl -z-10 blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
        
      {/* Enhanced Features Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-8 md:px-12 lg:px-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-gold to-yellow-500 bg-clip-text text-transparent">
                Why Choose Us
              </span>
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Experience the difference with our premium services and commitment to excellence
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-gray-700/50 hover:border-gold/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-yellow-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="bg-gradient-to-r from-gold to-yellow-500 h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4 text-white group-hover:text-gold transition-colors duration-300">Authenticity Guaranteed</h3>
                <p className="text-gray-300 leading-relaxed">
                  Every product comes with a certificate of authenticity and our 100% satisfaction guarantee. 
                  We verify each item to ensure you receive only genuine luxury products.
                </p>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-gold/30 rounded-full animate-pulse"></div>
              <div className="absolute bottom-4 left-4 w-1 h-1 bg-yellow-400/50 rounded-full"></div>
            </div>
            
            <div className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-gray-700/50 hover:border-gold/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-yellow-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="bg-gradient-to-r from-gold to-yellow-500 h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4 text-white group-hover:text-gold transition-colors duration-300">Worldwide Shipping</h3>
                <p className="text-gray-300 leading-relaxed">
                  Free express shipping on all orders over $200, with delivery to over 100 countries. 
                  Your luxury items arrive safely and on time, every time.
                </p>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-gold/30 rounded-full animate-pulse"></div>
              <div className="absolute bottom-4 left-4 w-1 h-1 bg-yellow-400/50 rounded-full"></div>
            </div>
            
            <div className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-gray-700/50 hover:border-gold/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-yellow-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="bg-gradient-to-r from-gold to-yellow-500 h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4 text-white group-hover:text-gold transition-colors duration-300">24/7 Support</h3>
                <p className="text-gray-300 leading-relaxed">
                  Our dedicated customer service team is available around the clock to assist you. 
                  Get help whenever you need it with our premium support experience.
                </p>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-gold/30 rounded-full animate-pulse"></div>
              <div className="absolute bottom-4 left-4 w-1 h-1 bg-yellow-400/50 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>
        
      {/* Enhanced Values Section */}
      <section className="py-20 bg-gradient-to-br from-black/80 to-gray-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-8 md:px-12 lg:px-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-gold to-yellow-500 bg-clip-text text-transparent">
                Our Values
              </span>
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              The principles that guide everything we do and shape our commitment to excellence
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div 
                key={value.id} 
                className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-gray-700/50 hover:border-gold/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-yellow-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="flex items-start mb-6">
                    <div className="bg-gradient-to-r from-gold to-yellow-500 h-16 w-16 rounded-2xl flex items-center justify-center mr-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl">{value.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white group-hover:text-gold transition-colors duration-300 mb-2">
                        {value.title}
                      </h3>
                      <div className="w-16 h-1 bg-gradient-to-r from-gold to-yellow-500 rounded-full"></div>
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed text-lg">
                    {value.description}
                  </p>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-gold/30 rounded-full animate-pulse"></div>
                <div className="absolute bottom-4 left-4 w-1 h-1 bg-yellow-400/50 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Team Section */}
      <section id="team" className="py-20 bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-8 md:px-12 lg:px-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-gold to-yellow-500 bg-clip-text text-transparent">
                Our Leadership Team
              </span>
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Meet the passionate individuals who drive our vision and shape the future of luxury retail
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div 
                key={member.id} 
                className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl overflow-hidden shadow-xl border border-gray-700/50 hover:border-gold/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  {/* Social Links Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex space-x-4">
                      <a 
                        href={member.social.linkedin} 
                        className="w-10 h-10 bg-gold rounded-full flex items-center justify-center hover:bg-yellow-400 transition-colors duration-300"
                      >
                        <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </a>
                      <a 
                        href={member.social.twitter} 
                        className="w-10 h-10 bg-gold rounded-full flex items-center justify-center hover:bg-yellow-400 transition-colors duration-300"
                      >
                        <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute top-4 right-4 w-3 h-3 bg-gold/40 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-4 left-4 w-2 h-2 bg-yellow-400/60 rounded-full"></div>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-white group-hover:text-gold transition-colors duration-300">
                    {member.name}
                  </h3>
                  <p className="text-gold text-sm font-semibold mb-3 uppercase tracking-wider">
                    {member.position}
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    {member.bio}
                  </p>
                </div>
                
                {/* Hover effect background */}
                <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-yellow-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;