import React, { useState, useEffect } from 'react';

const About = () => {
  const [teamMembers] = useState([
    {
      id: 1,
      name: "Alex Morgan",
      position: "Founder & CEO",
      image: "/src/assets/apple-business-computer-connection-392018.jpg",
      bio: "With over 15 years in luxury retail, Alex brings unparalleled expertise and vision to Luxury Store."
    },
    {
      id: 2,
      name: "Sarah Johnson",
      position: "Creative Director",
      image: "/src/assets/adli-wahid-3-QB-YKxTKY-unsplash.jpg",
      bio: "Sarah's eye for design and detail ensures every product meets our exacting standards."
    },
    {
      id: 3,
      name: "Michael Chen",
      position: "Head of Operations",
      image: "/src/assets/abundance-bank-banking-banknotes-259027.jpg",
      bio: "Michael's operational excellence drives our commitment to exceptional customer service."
    }
  ]);

  const [stats] = useState([
    { id: 1, value: "10+", label: "Years Experience" },
    { id: 2, value: "50K+", label: "Happy Customers" },
    { id: 3, value: "100+", label: "Premium Brands" },
    { id: 4, value: "24/7", label: "Support" }
  ]);

  return (
    <div className="about-page">
      {/* Modern Hero Section */}
      <section className="relative w-full h-[70vh] overflow-hidden -mt-20 pt-20">
        {/* Background with Overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/90"></div>
          <img 
            src="/src/assets/architecture-art-bridge-cliff-459203.jpg" 
            alt="About Us" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Main Content - Centered */}
        <div className="relative z-10 flex items-center justify-center h-full px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <span className="inline-block bg-gold/10 text-gold px-3 py-1 rounded-full text-xs font-medium mb-4">
                OUR STORY
              </span>
            </div>
            
            <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                About Luxury Store
              </h1>
            </div>
            
            <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <p className="text-base md:text-lg text-gray-200 mb-6 max-w-xl mx-auto leading-relaxed">
                Crafting exceptional experiences through premium luxury products
              </p>
            </div>
            
            <div className="animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
              <div className="flex justify-center">
                <a 
                  href="#our-story" 
                  className="group bg-gold text-black px-6 py-3 font-bold text-xs uppercase tracking-wider transition-all duration-300 hover:bg-white hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
                >
                  Discover Our Story
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat) => (
            <div key={stat.id} className="text-center p-4 bg-black bg-opacity-30 backdrop-blur-lg rounded-lg shadow border border-gray-700">
              <div className="text-2xl font-bold text-gold mb-1">{stat.value}</div>
              <div className="text-gray-300 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        <div id="our-story" className="bg-black bg-opacity-30 backdrop-blur-lg p-6 rounded-lg mb-10 shadow border border-gray-700">
          <h2 className="text-2xl font-bold mb-5 text-white">Our Story</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <p className="text-gray-300 mb-3 text-base leading-relaxed">
                Founded in 2025, Luxury Store began with a simple vision: to make premium luxury products accessible to everyone. 
                What started as a small online boutique has grown into a premier destination for discerning customers seeking 
                exceptional quality and timeless design.
              </p>
              <p className="text-gray-300 mb-3 text-base leading-relaxed">
                Our carefully curated collection features only the finest products from renowned artisans and emerging designers 
                who share our commitment to craftsmanship, sustainability, and innovation. Each item in our store is selected 
                for its superior quality, unique design, and enduring value.
              </p>
              <p className="text-gray-300 text-base leading-relaxed">
                Today, we continue to honor our founding principles while embracing new technologies and trends that enhance 
                the luxury shopping experience. Our dedicated team works tirelessly to ensure that every interaction with 
                Luxury Store reflects the excellence we expect from ourselves and our partners.
              </p>
            </div>
            <div className="bg-gray-200 h-60 rounded-lg flex items-center justify-center">
              <img 
                src="/src/assets/apple-computer-decor-design-326502.jpg" 
                alt="Our Store" 
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          <div className="bg-black bg-opacity-30 backdrop-blur-lg p-5 rounded-lg text-center shadow border border-gray-700 hover:shadow-lg transition-shadow duration-300">
            <div className="bg-gold h-14 w-14 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2 text-white">Authenticity Guaranteed</h3>
            <p className="text-gray-300 text-sm">
              Every product comes with a certificate of authenticity and our 100% satisfaction guarantee.
            </p>
          </div>
          
          <div className="bg-black bg-opacity-30 backdrop-blur-lg p-5 rounded-lg text-center shadow border border-gray-700 hover:shadow-lg transition-shadow duration-300">
            <div className="bg-gold h-14 w-14 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2 text-white">Worldwide Shipping</h3>
            <p className="text-gray-300 text-sm">
              Free express shipping on all orders over $200, with delivery to over 100 countries.
            </p>
          </div>
          
          <div className="bg-black bg-opacity-30 backdrop-blur-lg p-5 rounded-lg text-center shadow border border-gray-700 hover:shadow-lg transition-shadow duration-300">
            <div className="bg-gold h-14 w-14 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2 text-white">24/7 Support</h3>
            <p className="text-gray-300 text-sm">
              Our dedicated customer service team is available around the clock to assist you.
            </p>
          </div>
        </div>
        
        <div className="bg-black bg-opacity-30 backdrop-blur-lg p-6 rounded-lg shadow mb-10 border border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-white">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="p-4 bg-gray-900 bg-opacity-50 rounded shadow border border-gray-700">
              <div className="flex items-start mb-3">
                <div className="bg-gold h-10 w-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">Quality First</h3>
              </div>
              <p className="text-gray-300 text-sm">
                We never compromise on quality. Every product undergoes rigorous testing and inspection 
                to ensure it meets our exacting standards.
              </p>
            </div>
            
            <div className="p-4 bg-gray-900 bg-opacity-50 rounded shadow border border-gray-700">
              <div className="flex items-start mb-3">
                <div className="bg-gold h-10 w-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">Sustainability</h3>
              </div>
              <p className="text-gray-300 text-sm">
                We're committed to reducing our environmental impact through responsible sourcing, 
                eco-friendly packaging, and supporting sustainable brands.
              </p>
            </div>
            
            <div className="p-4 bg-gray-900 bg-opacity-50 rounded shadow border border-gray-700">
              <div className="flex items-start mb-3">
                <div className="bg-gold h-10 w-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">Customer Focus</h3>
              </div>
              <p className="text-gray-300 text-sm">
                Your satisfaction is our priority. We go above and beyond to ensure every customer 
                has an exceptional shopping experience.
              </p>
            </div>
            
            <div className="p-4 bg-gray-900 bg-opacity-50 rounded shadow border border-gray-700">
              <div className="flex items-start mb-3">
                <div className="bg-gold h-10 w-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">Innovation</h3>
              </div>
              <p className="text-gray-300 text-sm">
                We constantly seek new ways to enhance your shopping experience through technology 
                and thoughtful design.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-white text-center">Our Leadership Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {teamMembers.map((member) => (
              <div 
                key={member.id} 
                className="bg-black bg-opacity-30 backdrop-blur-lg rounded-lg overflow-hidden shadow border border-gray-700 hover:shadow-lg transition-all duration-300 hover:border-gold"
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-1 text-white">{member.name}</h3>
                  <p className="text-gold text-sm mb-2">{member.position}</p>
                  <p className="text-gray-300 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;