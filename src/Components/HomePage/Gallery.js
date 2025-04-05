import React, { useState, useEffect, useRef } from 'react';
import { getRequest } from '../../Services/api';
import { Typography, Spin } from 'antd';

const { Title } = Typography;

function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const data = await getRequest('/gallery-images/');
        setImages(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching images:", err);
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    if (images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 3000);
    }
    return () => clearInterval(intervalRef.current);
  }, [images]);

  const getStyle = (index) => {
    const diff = index - currentIndex;
    if (diff === 0) {
      return {
        transform: 'translateX(0) scale(1.1)',
        zIndex: 3,
        opacity: 1,
      };
    } else if (diff === -1 || (currentIndex === 0 && index === images.length - 1)) {
      return {
        transform: 'translateX(-160px) scale(0.9) rotateY(15deg)',
        zIndex: 2,
        opacity: 0.6,
      };
    } else if (diff === 1 || (currentIndex === images.length - 1 && index === 0)) {
      return {
        transform: 'translateX(160px) scale(0.9) rotateY(-15deg)',
        zIndex: 2,
        opacity: 0.6,
      };
    } else {
      return {
        transform: 'scale(0)',
        opacity: 0,
        zIndex: 1,
      };
    }
  };

  if (loading) {
    return (
      <div style={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!images.length) {
    return <></>;
  }

  return (
    <div
      style={{
        padding: '40px 20px',
        background: '#f9f9f9',
        borderRadius: 16,
        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
        maxWidth: '100%',
        margin: '40px auto',
        overflow: 'hidden',
      }}
    >

      <div
        style={{
          position: 'relative',
          height: 320,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          perspective: 1200,
        }}
      >
        {images.map((image, index) => (
          <div
            key={image.id}
            style={{
              position: 'absolute',
              width: 240,
              height: 300,
              borderRadius: 12,
              overflow: 'hidden',
              transition: 'all 0.8s ease-in-out',
              transformStyle: 'preserve-3d',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              ...getStyle(index),
            }}
          >
            <img
              src={image.image}
              alt={image.alt_text || `Image ${index}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            {image.alt_text && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  width: '100%',
                  background: 'rgba(255,255,255,0.85)',
                  padding: '8px 10px',
                  fontSize: 14,
                  fontWeight: '500',
                  textAlign: 'center',
                }}
              >
                {image.alt_text}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Gallery;
