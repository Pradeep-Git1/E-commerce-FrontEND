import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Typography } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";

// --- Styled Components ---

const VerticalCarouselContainer = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  max-height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 1200px;
  overflow: hidden;

  @media (min-width: 768px) {
    height: 600px;
  }
`;

const Slide = styled.div`
  position: absolute;
  width: 80%;
  height: 80%;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.5s ease;
  transform-style: preserve-3d;
  display: flex;
  justify-content: center;
  align-items: center;

  &.current {
    z-index: 3;
    opacity: 1;
    transform: translateY(0%) translateZ(40px) scale(1.1);
  }

  &.prev,
  &.next {
    z-index: 2;
    opacity: 0.7;
    transform: translateY(var(--offset)) translateZ(-30px) scale(0.9);
  }

  &.hidden {
    z-index: 1;
    opacity: 0;
    transform: translateY(150%) scale(0.8);
  }

  .image-container {
    width: 100%;
    height: 100%;
    background: #000;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: inherit;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
  }
`;

const NavButtons = styled.div`
  position: absolute;
  width: 100%;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  pointer-events: none;
`;

const NavButton = styled.button`
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
  border: none;
  font-size: 1.5rem;
  margin: 0.5rem auto;
  padding: 0.75rem;
  cursor: pointer;
  pointer-events: auto;
  border-radius: 50%;
  transition: background 0.3s ease;
  backdrop-filter: blur(3px);

  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }

  @media (min-width: 768px) {
    font-size: 2rem;
    padding: 1rem;
  }
`;

// --- Component ---

const ImageGallery = ({ images = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const next = () => setActiveIndex((prev) => (prev + 1) % images.length);
  const prev = () => setActiveIndex((prev) => (prev - 1 + images.length) % images.length);

  useEffect(() => {
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  const getClass = (index) => {
    if (index === activeIndex) return "current";
    if (index === (activeIndex - 1 + images.length) % images.length) return "prev";
    if (index === (activeIndex + 1) % images.length) return "next";
    return "hidden";
  };

  const getOffset = (index) => {
    if (index === (activeIndex - 1 + images.length) % images.length) return "-50%";
    if (index === (activeIndex + 1) % images.length) return "50%";
    return "0%";
  };

  return (
    <VerticalCarouselContainer>
      {images.map((img, i) => (
        <Slide
          key={img.id || i}
          className={getClass(i)}
          style={{ "--offset": getOffset(i) }}
        >
          <div className="image-container">
            {img.image ? (
              <img src={img.image} alt={img.alt_text || `Slide ${i + 1}`} />
            ) : (
              <Typography.Text>No Image</Typography.Text>
            )}
          </div>
        </Slide>
      ))}

      <NavButtons>
        <NavButton onClick={prev}>
          <FontAwesomeIcon icon={faChevronUp} />
        </NavButton>
        <NavButton onClick={next}>
          <FontAwesomeIcon icon={faChevronDown} />
        </NavButton>
      </NavButtons>
    </VerticalCarouselContainer>
  );
};

export default ImageGallery;
