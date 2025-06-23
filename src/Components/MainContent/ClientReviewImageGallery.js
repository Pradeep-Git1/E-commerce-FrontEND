import React, { useState, useEffect, useRef } from 'react';
import { Card, Image } from 'antd';
import { getRequest } from '../../Services/api';
import { HeartFilled } from '@ant-design/icons';

const flyingObjectStyle = {
  position: 'absolute',
  transform: 'translateX(-50%)',
  opacity: 0,
  animation: 'flyOut 2s ease-out forwards',
};

const flyOutKeyframes = `
@keyframes flyOut {
  0% {
    opacity: 1;
    transform: translate(-50%, 0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -80px) scale(0.7);
  }
}
`;

const FlyingObject = ({ isHeart }) => {
  const size = Math.random() * 12 + 16;
  const startX = Math.random() * 60 - 30;
  const startY = Math.random() * 20 + 80; // Start from a little inside the bottom
  const duration = Math.random() * 1.5 + 1.5;
  const delay = Math.random() * 0.75;
  const opacity = Math.random() * 0.6 + 0.4;

  const style = {
    ...flyingObjectStyle,
    fontSize: `${size}px`,
    left: `calc(50% + ${startX}px)`,
    top: `${startY}px`,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`,
    color: isHeart ? 'red' : '#A0522D', // Chocolate color
  };

  return isHeart ? <HeartFilled style={style} /> : <span style={{ ...style, fontFamily: 'Arial' }}>🍫</span>;
};

const AnimatedImageCard = ({ item, index }) => {
  const [flyingObjects, setFlyingObjects] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false); // State to control preview visibility
  const intervalRef = useRef(null);

  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = flyOutKeyframes;
    document.head.appendChild(styleElement);

    intervalRef.current = setInterval(() => {
      const shouldBeHeart = Math.random() > 0.5;
      setFlyingObjects((prevObjects) => [
        ...prevObjects,
        <FlyingObject key={Math.random()} isHeart={shouldBeHeart} />,
      ]);
    }, 150);

    return () => {
      clearInterval(intervalRef.current);
      document.head.removeChild(styleElement);
    };
  }, []);

  useEffect(() => {
    // Effect to handle browser back button
    const handlePopState = () => {
      if (previewVisible) {
        setPreviewVisible(false); // Close the preview if it's open
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [previewVisible]); // Re-run effect if previewVisible changes

  const handlePreviewVisibleChange = (visible) => {
    setPreviewVisible(visible);
    if (visible) {
      // When preview opens, push a new state to history
      // This allows the back button to "pop" this state and trigger popstate
      window.history.pushState({ previewOpen: true }, '', window.location.href);
    } else {
      // When preview closes, go back in history if the state was pushed by us
      if (window.history.state && window.history.state.previewOpen) {
        window.history.back();
      }
    }
  };

  return (
    <div style={{ position: 'relative', width: '200px', padding: "10px" }}>
      <Card
        bordered={false}
        style={{
          marginBottom: 16,
          overflow: 'hidden',
          padding: 0,
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Adding shadow
        }}
        bodyStyle={{ padding: 0 }}
      >
        <Image
          src={item.image}
          alt={`Delightful Moment ${index + 1}`}
          style={{ width: '100%', display: 'block', borderRadius: '8px' }}
          preview={{
            visible: previewVisible, // Control visibility with state
            onVisibleChange: handlePreviewVisibleChange, // Handle visibility changes
          }}
        />
      </Card>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        {flyingObjects}
      </div>
    </div>
  );
};

const CherishedMomentsGallery = () => {
  const [reviewImages, setReviewImages] = useState([]);

  useEffect(() => {
    const fetchReviewImages = async () => {
      try {
        const data = await getRequest('/review-images/');
        setReviewImages(data);
      } catch (error) {
        console.error('Error fetching review images:', error);
      }
    };

    fetchReviewImages();
  }, []);

  return (
    <div>
      <h2>Our Cherished Moments</h2>
      <div style={{ overflowX: 'auto', whiteSpace: 'nowrap', msOverflowStyle: 'none', scrollbarWidth: 'none', paddingBottom: '16px' }}>
        <div style={{ display: 'inline-flex', gap: '24px' }}> {/* Increased gap to 24px */}
          {reviewImages.map((item, index) => (
            <AnimatedImageCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
      {reviewImages.length === 0 && <p>No cherished moments captured yet.</p>}
    </div>
  );
};

export default CherishedMomentsGallery;