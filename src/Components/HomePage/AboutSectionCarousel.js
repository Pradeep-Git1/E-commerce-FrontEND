import React, { useEffect, useState, useMemo } from "react";
import { Typography } from "antd";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";

const { Title, Paragraph, Text } = Typography;

// Styled Components
const VerticalCarouselContainer = styled.div`
  position: relative;
  perspective: 1200px;
  transform-style: preserve-3d;
  width: 100%;
  height: 400px; /* Initial fixed height for small screens */
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (min-width: 768px) {
    height: 600px; /* Fixed height for larger screens for now */
  }
`;

const CarouselSlide = styled.div`
  position: absolute;
  width: 80%;
  max-width: 400px;
  height: 80%; /* Initial fixed height for slides */
  max-height: none;
  transition: transform 500ms ease, opacity 500ms ease, visibility 500ms ease;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  backface-visibility: hidden;
  background-color: rgba(0, 0, 0, 0.1); /* Semi-transparent background for debugging */
  z-index: 1;
  padding: 15px;
  box-sizing: border-box;
  opacity: 0; /* Initially hidden */
  visibility: hidden; /* Initially hidden */

  @media (min-width: 601px) {
    flex-direction: row;
    padding: 20px;
  }

  &.current {
    opacity: 1;
    visibility: visible;
    transform: translateY(0) translateZ(50px) rotateX(0deg) scale(1);
    z-index: 10;
  }

  &.prev {
    opacity: 0.7;
    visibility: visible;
    transform: translateY(-30%) translateZ(-50px) rotateX(15deg) scale(0.9);
    z-index: 9;
  }

  &.next {
    opacity: 0.7;
    visibility: visible;
    transform: translateY(30%) translateZ(-50px) rotateX(-15deg) scale(0.9);
    z-index: 9;
  }

  &.prev-far,
  &.next-far {
    opacity: 0.2;
    visibility: visible;
    transform: translateY(calc(var(--direction) * 100%)) translateZ(-100px)
      rotateX(calc(var(--direction) * 30deg)) scale(0.8);
    z-index: 8;
  }

  &.hidden {
    opacity: 0;
    visibility: hidden;
    transform: translateY(150%) translateZ(-200px) rotateX(-60deg) scale(0.7);
    z-index: 7;
  }

  .about-container {
    width: 100%;
    height: auto;
    align-items: center;
    align-content: center;
    text-align: center;
    border-radius: 5%;
    background: transparent !important;
    padding: 0;
  }
`;

const AboutTitle = styled(Title)`
  font-family: "Playfair Display", serif !important;
  font-weight: 700 !important;
  font-size: 1.2rem !important;
  margin-bottom: 6px !important;
  letter-spacing: 0.05em !important;
  color: ${(props) => props.theme.primaryColor || "#333"} !important;
  text-align: center !important;
  word-break: break-word;

  @media (min-width: 768px) {
    font-size: 1.5rem !important;
    margin-bottom: 8px !important;
  }
`;

const AboutContent = styled(Paragraph)`
  font-family: "Merriweather", serif !important;
  font-size: 0.9rem !important;
  line-height: 1.4 !important;
  font-weight: 400 !important;
  color: ${(props) => props.theme.textColor || "#555"} !important;
  margin-bottom: 0 !important;
  text-align: center !important;
  word-break: break-word;

  @media (min-width: 768px) {
    font-size: 1rem !important;
    line-height: 1.5 !important;
  }
`;

const CarouselButtonsWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 15px;
  pointer-events: none;
`;

const CarouselButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.secondaryColor || "#d4a373"};
  font-size: 1.2rem;
  cursor: pointer;
  outline: none;
  opacity: 0.7;
  pointer-events: auto;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
  }

  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
`;

// Helper: Pastel Gradient Generator
const getRandomGradient = () => {
  const randomHSL = () => {
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 30) + 70;
    const lightness = Math.floor(Math.random() * 30) + 70;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };
  const degree = Math.floor(Math.random() * 360);
  return `linear-gradient(${degree}deg, ${randomHSL()} 0%, ${randomHSL()} 100%)`;
};

// Component
function AboutSectionCarousel({ aboutSections }) {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (!Array.isArray(aboutSections) || aboutSections.length === 0) return;

    const intervalId = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % aboutSections.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [aboutSections]);

  const nextSlide = () =>
    setActiveSlide((prev) => (prev + 1) % aboutSections.length);
  const prevSlide = () =>
    setActiveSlide((prev) => (prev - 1 + aboutSections.length) % aboutSections.length);

  const getSlideClassName = (index) => {
    const total = aboutSections.length;
    const diff = index - activeSlide;

    if (diff === 0) return "current";
    if (diff === -1 || diff === total - 1) return "prev";
    if (diff === 1 || diff === -(total - 1)) return "next";
    if (diff === -2 || diff === total - 2) return "prev-far";
    if (diff === 2 || diff === -(total - 2)) return "next-far";
    return "hidden";
  };

  const gradients = useMemo(
    () => aboutSections.map(() => getRandomGradient()),
    [aboutSections.length]
  );

  if (!Array.isArray(aboutSections)) {
    console.error("Invalid about section data:", aboutSections);
    return <Text type="danger">Error: Invalid about section data</Text>;
  }

  return (
    <VerticalCarouselContainer>
      {aboutSections.map((about, index) => (
        <CarouselSlide
          key={about.id}
          className={getSlideClassName(index)}
          style={{ '--direction': index > activeSlide ? 1 : -1, background: gradients[index] }} // Apply gradient here
        >
          <div className="about-container">
            <div>
            <AboutTitle>{about.title}</AboutTitle>
            <hr style={{ borderTop: '1px dashed rgba(0,0,0,0.2)', marginBottom: '10px', width: '70%' }} />
            <AboutContent>{about.description}</AboutContent>
            </div>
          </div>
        </CarouselSlide>
      ))}

      <CarouselButtonsWrapper>
        <CarouselButton onClick={prevSlide}>
          <FontAwesomeIcon icon={faChevronUp} />
        </CarouselButton>
        <CarouselButton onClick={nextSlide}>
          <FontAwesomeIcon icon={faChevronDown} />
        </CarouselButton>
      </CarouselButtonsWrapper>
    </VerticalCarouselContainer>
  );
}

export default AboutSectionCarousel;