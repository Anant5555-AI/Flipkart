import React, { useState, useEffect } from 'react';
import flip1 from '../assets/flip1.webp';
import flip2 from '../assets/flip2.webp';
import flip3 from '../assets/flip3.webp';
import flip4 from '../assets/flip4.webp';
import defaultBanner from '../assets/flip1.webp'; // Default banner image

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const banners = [
    {
      id: 1,
      title: "The Big Billion Days",
      subtitle: "Electronics & Gadgets",
      description: "Up to 80% OFF on Smartphones, Laptops & More",
      gradient: "from-blue-600 to-purple-700",
      icon: "📱",
      offers: ["Up to 80% OFF", "Free Delivery", "No Cost EMI"],
      type: "gradient"
    },
    {
      id: 2,
      title: "Special Offers",
      subtitle: "Limited Time Deal",
      description: "Don't Miss Out on These Amazing Deals",
      image: flip1,
      offers: ["Mega Sale", "Best Prices", "Free Shipping"],
      type: "image"
    },
    {
      id: 3,
      title: "Trending Now",
      subtitle: "Popular Products",
      description: "Shop the Most Popular Items",
      image: flip2,
      offers: ["Hot Deals", "Limited Stock", "Fast Delivery"],
      type: "image"
    },
    {
      id: 4,
      title: "Exclusive Collection",
      subtitle: "Premium Quality",
      description: "Discover Our Premium Range",
      image: flip3,
      offers: ["Premium Quality", "Best Brands", "Easy Returns"],
      type: "image"
    },
    {
      id: 5,
      title: "Flash Sale",
      subtitle: "24 Hours Only",
      description: "Grab These Deals Before They're Gone",
      image: flip4,
      offers: ["Flash Sale", "24hrs Only", "Huge Savings"],
      type: "image"
    }
  ];

  // Auto-rotate carousel every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [banners.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const currentBanner = banners[currentSlide];

  return (
    <div 
      className={`${currentBanner.type === 'gradient' ? `bg-gradient-to-r ${currentBanner.gradient}` : 'bg-gray-900'} text-white py-12 relative overflow-hidden transition-all duration-500`}
      aria-label="Promotional banner carousel"
    >
      {/* Background Image or Pattern */}
      {currentBanner.type === 'image' ? (
        <div className="absolute inset-0">
          <img 
            src={currentBanner.image || defaultBanner} 
            alt={currentBanner.title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultBanner;
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-40" aria-hidden="true"></div>
        </div>
      ) : (
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="text-9xl opacity-20 absolute top-4 right-8">{currentBanner.icon}</div>
            <div className="text-6xl opacity-10 absolute bottom-8 left-8">{currentBanner.icon}</div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
          <h2 className="text-2xl md:text-4xl font-bold mb-2">{currentBanner.title}</h2>
          <p className="text-yellow-300 text-lg md:text-xl mb-4">{currentBanner.subtitle}</p>
          <p className="text-lg mb-6">{currentBanner.description}</p>
          
          <div className="flex flex-wrap gap-3 mb-6 justify-center md:justify-start">
            {currentBanner.offers.map((offer, index) => (
              <span 
                key={index} 
                className="bg-yellow-400 text-gray-900 font-medium px-4 py-1.5 rounded-full text-sm shadow-md hover:scale-105 transition-transform duration-200"
              >
                {offer}
              </span>
            ))}
          </div>
          
          <button 
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-6 rounded-full transition-colors duration-300"
            aria-label={`Shop ${currentBanner.title}`}
          >
            Shop Now
          </button>
        </div>
        
        <div className="md:w-1/2 flex justify-center">
          {currentBanner.type === 'gradient' && (
            <div className="text-6xl md:text-9xl" aria-hidden="true">
              {currentBanner.icon}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition-all duration-300 z-20"
        aria-label="Previous slide"
      >
        ❮
      </button>
      <button 
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition-all duration-300 z-20"
        aria-label="Next slide"
      >
        ❯
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-white w-6' : 'bg-white bg-opacity-50'}`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={currentSlide === index ? 'true' : 'false'}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;