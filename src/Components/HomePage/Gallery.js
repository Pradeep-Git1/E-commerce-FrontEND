import React, { useState, useEffect } from "react";
import { getRequest } from "../../Services/api";
import { Typography, Spin } from "antd";
import styled, { createGlobalStyle } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronUp,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

const GlobalStyle = createGlobalStyle`
  /* ... your existing GlobalStyle ... */
`;

const { Title, Paragraph } = Typography;

const aboutSections = [
  {
    title: "Our Story",
    content: `Born from a small kitchen and big dreams...`,
    gradient: "linear-gradient(135deg, #FAD961 0%, #F76B1C 100%)",
  },
  {
    title: "What Makes Us Special",
    content: `Every chocolate we make carries a part of our story...`,
    gradient: "linear-gradient(135deg, #FF9A9E 0%, #FAD0C4 100%)",
  },
  {
    title: "Made With Love",
    content: `Our chocolates are more than just sweets...`,
    gradient: "linear-gradient(135deg, #A18CD1 0%, #FBC2EB 100%)",
  },
  // Add more about sections as needed
];

const GalleryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 10px; /* Adjusted padding for mobile */
  background: rgba(244, 244, 244, 0);
  width: 100%;
  box-sizing: border-box;
`;

const CarouselContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column; /* Stack on mobile */
  align-items: center;
  margin-bottom: 20px;
  gap: 20px; /* Add some space between the carousels on mobile */
  box-sizing: border-box;

  @media (min-width: 768px) {
    flex-direction: row; /* Side-by-side on tablets and larger */
    justify-content: space-between; /* Space them out */
    max-width: 90vw;
    gap: 2%; /* Adjust gap for larger screens */
  }
`;

const VerticalCarouselContainer = styled.div`
  position: relative;
  perspective: 1200px;
  transform-style: preserve-3d;
  width: 100%; /* Full width on mobile */
  height: 400px; /* Adjusted height for mobile */
  max-height: 60vh;
  overflow: hidden;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (min-width: 768px) {
    width: 49%; /* Roughly half width for side-by-side */
    height: 600px;
    max-height: 80vh;
  }
`;

const CarouselSlide = styled.div`
  position: absolute;
  width: 80%;
  max-width: 300px;
  height: 80%;
  max-height: 360px;
  transition: transform 500ms ease 0s, opacity 500ms ease 0s, visibility 500ms ease 0s;
  border-radius: 12px;
  overflow: hidden;
  
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  background-color: rgba(0, 0, 0, 0);
  backface-visibility: hidden;

  @media (min-width: 601px) {
    flex-direction: row;
    .about-container {
      min-height: 100%;
      align-items: center;
      text-align: center;
    }
    max-width: 360px;
    max-height: 420px;
  }

  &.current {
    opacity: 1;
    transform: translateY(0) translateZ(50px) rotateX(0deg) scale(1.25);
    padding:0;
    height:100%;
    width:100%;
    z-index: 10;
    border-radius:5%;
  }

  &.prev {
    opacity: 0.7;
    transform: translateY(-50%) translateZ(-100px) rotateX(30deg) scale(0.9);
    z-index: 9;
  }

  &.next {
    opacity: 0.7;
    transform: translateY(50%) translateZ(-100px) rotateX(-30deg) scale(0.9);
    z-index: 9;
  }

  &.prev-far,
  &.next-far {
    opacity: 0.2;
    transform: translateY(calc(var(--direction) * 150%)) translateZ(-200px)
      rotateX(calc(var(--direction) * 60deg)) scale(0.8);
    z-index: 8;
  }

  &.hidden {
    opacity: 0;
    visibility: hidden;
    transform: translateY(200%) translateZ(-300px) rotateX(-70deg) scale(0.7);
    z-index: 7;
  }

  .image-container {
    width: 100%;
    height: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0px; /* Remove padding */

    @media (min-width: 601px) {
      height: 100%;
    }
  }

  .image-container img {
    max-width: 100%;
    width:100%;
    object-fit: cover; /* Change to cover to fill the container */
    border-radius:5%;
    box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.94);     
  }

  .about-container {
    width: 100%;
    height: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 15px; /* Adjusted padding for mobile */
    background: inherit;
    align-items: center;
    text-align: center;
    box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.94);
    border-radius:5%;
    @media (min-width: 601px) {
      height: 100%;
      padding: 20px;
    }
  }
`;

const AboutTitle = styled(Title)`
  font-family: "Playfair Display", serif !important;
  font-weight: 700 !important;
  font-size: 1.2rem !important; /* Adjusted font size for mobile */
  margin-bottom: 6px !important;
  letter-spacing: 0.5px !important;
  color: ${(props) => props.theme.primaryColor || '#333'} !important;

  @media (min-width: 768px) {
    font-size: 1.5rem !important;
    margin-bottom: 8px !important;
  }
`;

const AboutContent = styled(Paragraph)`
  font-family: "Merriweather", serif !important;
  font-size: 0.8rem !important; /* Adjusted font size for mobile */
  line-height: 1.4 !important;
  color: ${(props) => props.theme.textColor || '#555'} !important;
  font-weight: 400 !important;
  margin-bottom: 0 !important;

  @media (min-width: 768px) {
    font-size: 0.9rem !important;
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
  padding: 0 10px;
  pointer-events: none; /* Allow interaction with the carousel */
`;

const CarouselButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.secondaryColor || '#d4a373'};
  font-size: 1.2rem; /* Adjusted icon size for mobile */
  cursor: pointer;
  outline: none;
  opacity: 0.7;
  transition: opacity 0.3s ease;
  pointer-events: auto; /* Make the button interactive */

  &:hover {
    opacity: 1;
  }

  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
`;

function ImageCarousel({ images }) {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images]);

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  const getSlideClassName = (index) => {
    const totalSlides = images.length;
    const diff = index - activeSlide;

    if (diff === 0) return "current";
    if (diff === -1 || diff === totalSlides - 1) return "prev";
    if (diff === 1 || diff === -(totalSlides - 1)) return "next";
    if (diff === -2 || diff === totalSlides - 2) return "prev-far";
    if (diff === 2 || diff === -(totalSlides - 2)) return "next-far";

    return "hidden";
  };

  return (
    <VerticalCarouselContainer style = {{ backgroundColor:"rgba(0, 0, 0, 0)"}}>
      {images.map((img, index) => (
        <CarouselSlide key={img.id || index} className={getSlideClassName(index)}>
          <div className="image-container">
            {img.image ? (
              <img src={img.image} alt={img.alt_text || `Slide ${index + 1}`} />
            ) : (
              <Typography.Text>No Image</Typography.Text>
            )}
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

function AboutCarousel({ aboutSections }) {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % aboutSections.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [aboutSections]);

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % aboutSections.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + aboutSections.length) % aboutSections.length);
  };

  const getSlideClassName = (index) => {
    const totalSlides = aboutSections.length;
    const diff = index - activeSlide;

    if (diff === 0) return "current";
    if (diff === -1 || diff === totalSlides - 1) return "prev";
    if (diff === 1 || diff === -(totalSlides - 1)) return "next";
    if (diff === -2 || diff === totalSlides - 2) return "prev-far";
    if (diff === 2 || diff === -(totalSlides - 2)) return "next-far";

    return "hidden";
  };

  return (
    <VerticalCarouselContainer>
      {aboutSections.map((about, index) => (
        <CarouselSlide
          key={index}
          className={getSlideClassName(index)}
          
        >
          <div className="about-container" style={{ background: about.gradient || '#f0f0f0' }}>
            <AboutTitle>{about.title}</AboutTitle>
            <hr />
            <AboutContent>{about.content}</AboutContent>
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

function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const data = await getRequest("/gallery-images/");
        setImages(data);
        setLoading(false);
        setInitialized(true);
      } catch (err) {
        console.error("Error fetching images:", err);
        setLoading(false);
        setInitialized(true);
      }
    };
    fetchImages();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          height: 400,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <GalleryWrapper>
      <GlobalStyle />
      <CarouselContainer>
        <ImageCarousel images={images} />
        <AboutCarousel aboutSections={aboutSections} />
      </CarouselContainer>
    </GalleryWrapper>
  );
}

export default Gallery;