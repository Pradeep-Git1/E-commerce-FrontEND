import React, { useState, useEffect, useRef } from 'react';
import { Carousel } from 'antd'; // Re-import Carousel
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { getRequest } from '../../Services/api'; // Assuming api.js is in the same directory

// --- Inline Styles (simplified for basic Ant Design Carousel) ---
const contentStyle = {
    height: '70vw',
    maxHeight: '50vh',
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
    borderRadius: "50px"
};

const textContainerStyle = {
    position: 'relative', // Ensure text is positioned correctly within its flex container
    zIndex: 1, // Ensure text is above any potential background overlays
    maxWidth: '700px', // Limit text width for better readability on large screens
};

// --- UPDATED: Responsive Title Style ---
const titleStyle = {
    fontSize: '3.5rem', // Default for larger screens
    color: 'white',
    fontWeight: 700,
    textShadow: '2px 2px 5px rgba(0, 0, 0, 0.8), 0 0 10px rgba(0, 0, 0, 0.4)',
    marginBottom: '1rem',
    '@media (max-width: 1200px)': {
        fontSize: '3rem',
    },
    '@media (max-width: 992px)': {
        fontSize: '2.5rem',
    },
    '@media (max-width: 768px)': {
        fontSize: '2rem',
    },
    '@media (max-width: 576px)': {
        fontSize: '1.7rem',
        marginBottom: '0.8rem',
    },
    '@media (max-width: 480px)': {
        fontSize: '1.5rem',
    },
};

// --- UPDATED: Responsive Description Style ---
const descriptionStyle = {
    fontSize: '1.5rem', // Default for larger screens
    maxWidth: 600,
    color: 'white',
    marginBottom: 30,
    textShadow: '1px 1px 3px rgba(0, 0, 0, 0.7)',
    lineHeight: 1.5,
    '@media (max-width: 1200px)': {
        fontSize: '1.3rem',
    },
    '@media (max-width: 992px)': {
        fontSize: '1.1rem',
    },
    '@media (max-width: 768px)': {
        fontSize: '1rem',
        marginBottom: 20,
    },
    '@media (max-width: 576px)': {
        fontSize: '0.9rem',
    },
    '@media (max-width: 480px)': {
        fontSize: '0.8rem',
        maxWidth: '90%', // Allow description to take more width on small screens
    },
};

const buttonStyle = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'rgba(0, 0, 0, 0.4)',
    color: 'white',
    border: 'none',
    padding: '12px',
    borderRadius: '50%',
    cursor: 'pointer',
    zIndex: 2, // Ensure buttons are above carousel content
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.3s ease',
    '&:hover': { // Hover effect for buttons
        background: 'rgba(0, 0, 0, 0.6)',
    },
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
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const carouselRef = useRef(null);

    // Initial fetch of carousel slides
    useEffect(() => {
        const fetchSlides = async () => {
            try {
                const data = await getRequest('carousel-slides/');
                if (Array.isArray(data)) {
                    const updatedSlides = data.map(slide => ({
                        ...slide,
                        // Ensure the image URL is correctly formed if it's relative
                        image: slide.image ? `${slide.image}` : null,
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
    }, []); // Empty dependency array means this runs once on mount

    // Handlers for carousel navigation
    const next = () => {
        carouselRef.current?.next();
    };

    const prev = () => {
        carouselRef.current?.prev();
    };

    // --- Loading and Error States ---
    if (loading) {
        return (
            <div style={{ height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: '#333' }}>
                Loading carousel slides...
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: 'red' }}>
                Error loading carousel slides: {error}
            </div>
        );
    }

    if (slides.length === 0) {
        return (
            <div style={{ height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: '#555' }}>
                No carousel slides available.
            </div>
        );
    }

    // --- Main Carousel Render ---
    return (
        <div style={{ position: 'relative', padding: 10 }}>
            <Carousel
                ref={carouselRef}
                autoplay
                speed={1000} // Speed of the transition animation
                autoplaySpeed={6000} // Time between slides
                effect="fade" // Default Ant Design effects: "scrollx" | "fade"
                dots={true} // Show navigation dots
            >
                {slides.map((slide) => (
                    <div key={slide.id}>
                        <div
                            className="carousel-slide-content"
                            style={{
                                ...contentStyle,
                                backgroundImage: slide.image ? `url(${slide.image})` : 'none',
                                backgroundColor: slide.image ? 'transparent' : '#ccc', // Fallback background
                            }}
                        >
                            <div style={textContainerStyle}>
                                {slide.title && (
                                    <h1 className="hero-title" style={titleStyle}>
                                        {slide.title}
                                    </h1>
                                )}
                                {slide.description && (
                                    <p className="hero-description" style={descriptionStyle}>
                                        {slide.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </Carousel>
            {/* Navigation buttons */}
            <button onClick={prev} style={prevButtonStyle} className="button-nav left">
                <LeftOutlined />
            </button>
            <button onClick={next} style={nextButtonStyle} className="button-nav right">
                <RightOutlined />
            </button>
        </div>
    );
};

export default HeroCarousel;