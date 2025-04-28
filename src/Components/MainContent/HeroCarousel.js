import React from 'react';
import { Carousel, Button } from 'antd';
import { motion } from 'framer-motion';

const slides = [
  {
    title: "Delicious Homemade Chocolates",
    description: "Crafted with love, no preservatives – just pure indulgence.",
    image: `${process.env.PUBLIC_URL}/images/chocolates.jpg`,
    gradient: "linear-gradient(to right, #3a1c71cc, #d76d77cc, #ffaf7bcc)", // Purple-pink
  },
  {
    title: "Soothing Herbal Teas",
    description: "Freshly blended, naturally calming – a cup of health and joy.",
    image: `${process.env.PUBLIC_URL}/images/tea.jpg`,
    gradient: "linear-gradient(to right, #0f2027cc, #203a43cc, #2c5364cc)", // Herbal deep greens
  },
  {
    title: "Aromatic Essential Oils",
    description: "Cold-pressed, pure extracts to elevate your wellness rituals.",
    image: `${process.env.PUBLIC_URL}/images/oils.jpg`,
    gradient: "linear-gradient(to right, #355c7dcc, #6c5b7bcc, #c06c84cc)", // Lavender-green blend
  },
  {
    title: "Exotic Indian Spices",
    description: "Handpicked spices for an authentic culinary journey.",
    image: `${process.env.PUBLIC_URL}/images/spices.jpg`,
    gradient: "linear-gradient(to right, #8e0e00cc, #1f1c18cc)", // Spicy red-black
  },
  {
    title: "Perfect Gifting Combos",
    description: "Elegant, edible gifts that spark joy & taste divine.",
    image: `${process.env.PUBLIC_URL}/images/combos.jpg`,
    gradient: "linear-gradient(to right, #8360c3cc, #2ebf91cc)", // Teal-purple
  },
  {
    title: "Limited Edition Seasonal Packs",
    description: "Celebrate flavors with our handcrafted seasonal delights.",
    image: `${process.env.PUBLIC_URL}/images/seasonal.jpg`,
    gradient: "linear-gradient(to right, #fc5c7dcc, #6a82fbcc)", // Warm pink-blue
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
};

const HeroCarousel = () => {
  return (
    <Carousel autoplay speed={1000} autoplaySpeed={6000} effect="fade">
      {slides.map((slide, index) => (
        <div key={index}>
          <div
            style={{
              ...contentStyle,
              backgroundImage: `${slide.gradient}, url(${slide.image})`,
            }}
          >
            <motion.div
              initial={{ opacity: 0, x: -80 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
            >
              <h1 style={{ fontSize: '3.5rem', color: 'white', fontWeight: 700 }}>{slide.title}</h1>
              <p style={{ fontSize: '1.5rem', maxWidth: 600, color: 'white', marginBottom: 30 }}>{slide.description}</p>
            </motion.div>
          </div>
        </div>
      ))}
    </Carousel>
  );
};

export default HeroCarousel;