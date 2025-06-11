import React, { useRef } from 'react';
import { Carousel } from 'antd';
import { motion } from 'framer-motion';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const slides = [
  {
    title: "Delicious Homemade Chocolates",
    description: "Crafted with love, no preservatives – just pure indulgence.",
    image: `${process.env.PUBLIC_URL}/images/chocolates.jpg`,
  },
  {
    title: "Soothing Herbal Teas",
    description: "Freshly blended, naturally calming – a cup of health and joy.",
    image: `${process.env.PUBLIC_URL}/images/tea.jpg`,
  },
  {
    title: "Aromatic Essential Oils",
    description: "Cold-pressed, pure extracts to elevate your wellness rituals.",
    image: `${process.env.PUBLIC_URL}/images/oils.jpg`,
  },
  {
    title: "Exotic Indian Spices",
    description: "Handpicked spices for an authentic culinary journey.",
    image: `${process.env.PUBLIC_URL}/images/spices.jpg`,
  },
  {
    title: "Perfect Gifting Combos",
    description: "Elegant, edible gifts that spark joy & taste divine.",
    image: `${process.env.PUBLIC_URL}/images/combos.jpg`,
  },
  {
    title: "Limited Edition Seasonal Packs",
    description: "Celebrate flavors with our handcrafted seasonal delights.",
    image: `${process.env.PUBLIC_URL}/images/seasonal.jpg`,
  },
];

const contentStyle = {
  height: '50vh',
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

const HeroCarousel = () => {
  const carouselRef = useRef(null);

  const next = () => {
    carouselRef.current?.next();
  };

  const prev = () => {
    carouselRef.current?.prev();
  };

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
        {slides.map((slide, index) => (
          <div key={index}>
            <div
              style={{
                ...contentStyle,
                backgroundImage: `url(${slide.image})`,
              }}
            >
              <motion.div
                initial={{ opacity: 0, x: -80 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
              >
                <h1 style={{ fontSize: '3.5rem', color: 'white', fontWeight: 700, textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
                  {slide.title}
                </h1>
                <p style={{ fontSize: '1.5rem', maxWidth: 600, color: 'white', marginBottom: 30, textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)' }}>
                  {slide.description}
                </p>
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