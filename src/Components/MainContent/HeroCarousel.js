import React, { useState, useEffect, useRef } from 'react';
import { Carousel } from 'antd';
import { motion } from 'framer-motion';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { getRequest } from '../../Services/api'; // Assuming api.js is in the same directory

const contentStyle = {
  height: '70vh',
  color: '#fff',
  textAlign: 'left',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  paddingLeft: '10%',
  paddingRight: '10%',
  position: 'relative',
};

const buttonStyle = {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  background: 'rgba(0, 0, 0, 0.3)',
  color: 'white',
  border: 'none',
  padding: '12px',
  borderRadius: '5px',
  cursor: 'pointer',
  zIndex: 1,
};

const prevButtonStyle = {
  ...buttonStyle,
  left: '20px',
};

const nextButtonStyle = {
  ...buttonStyle,
  right: '20px',
};

const imagePrefix = ''; // Define the prefix

const HeroCarousel = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const data = await getRequest('carousel-slides/');
        console.log("Data received from API:", data); // Inspect the data
        if (Array.isArray(data)) {
          // Map over the data and prepend the prefix to the image URL
          const updatedSlides = data.map(slide => ({
            ...slide,
            image: slide.image ? `${imagePrefix}${slide.image}` : null,
          }));
          setSlides(updatedSlides);
        } else {
          console.error("Received data is not an array:", data);
          setError("Received data is not in the expected array format.");
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching carousel slides:", err);
        setError(err.message || 'Failed to fetch carousel slides.');
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  const next = () => {
    carouselRef.current?.next();
  };

  const prev = () => {
    carouselRef.current?.prev();
  };

  if (loading) {
    return <div>Loading carousel slides...</div>;
  }

  if (error) {
    return <div>Error loading carousel slides: {error}</div>;
  }

  return (
    <div style={{ position: 'relative' }}>
      <Carousel
        ref={carouselRef}
        autoplay
        speed={1000}
        autoplaySpeed={6000}
        effect="fade"
        dots={false}
      >
        {slides.map((slide) => (
          <div key={slide.id}>
            <div
              style={{
                ...contentStyle,
                backgroundImage: slide.image ? `url(${slide.image})` : 'none',
                backgroundColor: slide.image ? 'transparent' : '#ccc', // Fallback background
              }}
            >
              <motion.div
                initial={{ opacity: 0, x: -80 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
              >
                {slide.title && (
                  <h1 style={{ fontSize: '3.5rem', color: 'white', fontWeight: 700, textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
                    {slide.title}
                  </h1>
                )}
                {slide.description && (
                  <p style={{ fontSize: '1.5rem', maxWidth: 600, color: 'white', marginBottom: 30, textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)' }}>
                    {slide.description}
                  </p>
                )}
              </motion.div>
            </div>
          </div>
        ))}
      </Carousel>
      <button onClick={prev} style={prevButtonStyle}>
        <LeftOutlined />
      </button>
      <button onClick={next} style={nextButtonStyle}>
        <RightOutlined />
      </button>
    </div>
  );
};

export default HeroCarousel;