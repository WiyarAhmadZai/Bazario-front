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
    <div className="about-page py-12">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center mb-16">
        <div className="absolute inset-0 z-0">
          <img 
            src="/src/assets/architecture-art-bridge-cliff-459203.jpg" 
            alt="About Us" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">About Luxury Store</h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Crafting exceptional experiences through premium luxury products
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4">
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat) => (
            <div key={stat.id} className="text-center p-6 bg-black bg-opacity-30 backdrop-blur-lg rounded-xl shadow-lg border border-gray-700">
              <div className="text-3xl md:text-4xl font-bold text-gold mb-2">{stat.value}</div>
              <div className="text-gray-300">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="glass p-8 rounded-xl mb-12 shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Our Story</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-gray-700 mb-4 text-lg leading-relaxed">
                Founded in 2025, Luxury Store began with a simple vision: to make premium luxury products accessible to everyone. 
                What started as a small online boutique has grown into a premier destination for discerning customers seeking 
                exceptional quality and timeless design.
              </p>
              <p className="text-gray-700 mb-4 text-lg leading-relaxed">
                Our carefully curated collection features only the finest products from renowned artisans and emerging designers 
                who share our commitment to craftsmanship, sustainability, and innovation. Each item in our store is selected 
                for its superior quality, unique design, and enduring value.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                Today, we continue to honor our founding principles while embracing new technologies and trends that enhance 
                the luxury shopping experience. Our dedicated team works tirelessly to ensure that every interaction with 
                Luxury Store reflects the excellence we expect from ourselves and our partners.
              </p>
            </div>
            <div className="bg-gray-200 h-80 rounded-xl flex items-center justify-center">
              <img 
                src="/src/assets/apple-computer-decor-design-326502.jpg" 
                alt="Our Store" 
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="glass p-8 rounded-xl text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="bg-gold h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Authenticity Guaranteed</h3>
            <p className="text-gray-300">
              Every product comes with a certificate of authenticity and our 100% satisfaction guarantee.
            </p>
          </div>
          
          <div className="glass p-8 rounded-xl text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="bg-gold h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Worldwide Shipping</h3>
            <p className="text-gray-300">
              Free express shipping on all orders over $200, with delivery to over 100 countries.
            </p>
          </div>
          
          <div className="glass p-8 rounded-xl text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="bg-gold h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">24/7 Support</h3>
            <p className="text-gray-300">
              Our dedicated customer service team is available around the clock to assist you.
            </p>
          </div>
        </div>
        
        <div className="glass p-8 rounded-xl shadow-lg mb-12">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-black bg-opacity-30 backdrop-blur-lg rounded-lg shadow border border-gray-700">
              <div className="flex items-start mb-4">
                <div className="bg-gold h-12 w-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">Quality First</h3>
              </div>
              <p className="text-gray-300">
                We never compromise on quality. Every product undergoes rigorous testing and inspection 
                to ensure it meets our exacting standards.
              </p>
            </div>
            
            <div className="p-6 bg-black bg-opacity-30 backdrop-blur-lg rounded-lg shadow border border-gray-700">
              <div className="flex items-start mb-4">
                <div className="bg-gold h-12 w-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">Sustainability</h3>
              </div>
              <p className="text-gray-300">
                We're committed to reducing our environmental impact through responsible sourcing, 
                eco-friendly packaging, and supporting sustainable brands.
              </p>
            </div>
            
            <div className="p-6 bg-black bg-opacity-30 backdrop-blur-lg rounded-lg shadow border border-gray-700">
              <div className="flex items-start mb-4">
                <div className="bg-gold h-12 w-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">Customer Focus</h3>
              </div>
              <p className="text-gray-300">
                Your satisfaction is our priority. We go above and beyond to ensure every customer 
                has an exceptional shopping experience.
              </p>
            </div>
            
            <div className="p-6 bg-black bg-opacity-30 backdrop-blur-lg rounded-lg shadow border border-gray-700">
              <div className="flex items-start mb-4">
                <div className="bg-gold h-12 w-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">Innovation</h3>
              </div>
              <p className="text-gray-300">
                We constantly seek new ways to enhance your shopping experience through technology 
                and thoughtful design.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">Our Leadership Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div key={member.id} className="bg-black bg-opacity-30 backdrop-blur-lg rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-700">
                <div className="h-64 overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-gold mb-3">{member.position}</p>
                  <p className="text-gray-300">{member.bio}</p>
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