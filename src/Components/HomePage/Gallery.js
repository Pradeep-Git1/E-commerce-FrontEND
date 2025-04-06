import React, { useState, useEffect, useRef } from "react";
import { getRequest } from "../../Services/api";
import { Typography, Spin } from "antd";
import styled, { keyframes } from "styled-components";

const { Title, Paragraph } = Typography;

// About Us carousel content (same as before)
const aboutSections = [
  {
    title: "Our Story",
    content: `Born from a small kitchen and big dreams, our journey began as a family’s weekend hobby and grew into a heart-led chocolate brand. What started as gifts for friends became an expression of love shared through handcrafted treats. Today, we continue to create magic in every bite, just like we did from day one.`,
    gradient: "linear-gradient(135deg, #FAD961 0%, #F76B1C 100%)",
  },
  {
    title: "What Makes Us Special",
    content: `Every chocolate we make carries a part of our story — handpicked ingredients, time-tested family recipes, and a commitment to genuine quality. We don't mass-produce. We pour our time, care, and passion into each creation, ensuring every piece you enjoy feels like it came straight from home.`,
    gradient: "linear-gradient(135deg, #FF9A9E 0%, #FAD0C4 100%)",
  },
  {
    title: "Made With Love",
    content: `Our chocolates are more than just sweets — they’re handmade bundles of joy crafted with heart and heritage. From melting and molding to wrapping and delivering, everything is done with a personal touch that machines can’t replicate. It’s not just chocolate, it’s love in edible form.`,
    gradient: "linear-gradient(135deg, #A18CD1 0%, #FBC2EB 100%)",
  },
  {
    title: "Rooted in Family",
    content: `We’re not a company — we’re a family. And every order you place supports a family tradition, passed down through generations. From grandma’s secret caramel swirl to our youngest one packing boxes with a smile, it’s all in the family — and you're a part of it too.`,
    gradient: "linear-gradient(135deg, #FDCB82 0%, #F8B195 100%)",
  },
  {
    title: "Why Choose Us",
    content: `Because we believe the world needs more warmth. And what better way to spread it than through chocolates that feel homemade — because they are. Whether it’s a festive gift, a comfort bite, or a surprise for someone special, we’re here to sweeten your moments with authenticity.`,
    gradient: "linear-gradient(135deg, #89F7FE 0%, #66A6FF 100%)",
  },
];

const GalleryWrapper = styled.div`
  display: flex;
  justify-content: space-around; /* Spread the inner containers */
  padding: 60px 30px;
  background: #f4f4f4;
  width: 100%; /* Occupy the full width */
  box-sizing: border-box; /* Ensure padding doesn't add to the width */

  @media (max-width: 900px) {
    flex-direction: column; /* Stack on smaller screens */
    align-items: center;
    gap: 40px;
  }
`;

const CarouselContainer = styled.div`
  display: flex;
  flex-direction: column; /* Stack image and about carousels vertically */
  align-items: center; /* Center them */
  width: 100%; /* Take up most of the screen width for content */
  max-width: 1200px; /* Still maintain a maximum width for readability */

  @media (min-width: 901px) {
    flex-direction: row; /* Arrange side-by-side on larger screens */
    justify-content: space-around;
  }
`;

const ImageCarouselWrapper = styled.div`
  position: relative;
  height: 400px;
  width: 45%; /* Take up a portion of the container */
  min-width: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1200px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 40px; /* Add some space below the image carousel */

  @media (max-width: 900px) {
    width: 100%; /* Take up more width on smaller screens */
    margin-bottom: 30px;

  }
`;

const rotateIn = keyframes`
  from {
    transform: translateX(-20px) rotateY(20deg) scale(0.95);
    opacity: 0;
  }
  to {
    transform: translateX(0) rotateY(0deg) scale(1);
    opacity: 1;
  }
`;

const rotateOutLeft = keyframes`
  to {
    transform: translateX(-180px) rotateY(25deg) scale(0.8);
    opacity: 0.5;
  }
`;

const rotateOutRight = keyframes`
  to {
    transform: translateX(180px) rotateY(-25deg) scale(0.8);
    opacity: 0.5;
  }
`;

const ImageSlide = styled.div`
  position: absolute;
  width: 280px;
  height: 360px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.18);
  transition: all 0.6s ease-in-out;
  transform-style: preserve-3d;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  div {
    position: absolute;
    bottom: 0;
    width: 100%;
    background: rgba(255, 255, 255, 0.9);
    padding: 12px 15px;
    font-size: 15px;
    font-weight: 600;
    text-align: center;
    color: #333;
    border-radius: 0 0 16px 16px;
  }

  &.current {
    transform: translateX(0) scale(1.05);
    z-index: 3;
    opacity: 1;
    animation: ${rotateIn} 0.6s ease-out;
  }

  &.prev {
    transform: translateX(-180px) scale(0.9);
    z-index: 2;
    opacity: 0.7;
    animation: ${rotateOutLeft} 0.6s ease-in;
  }

  &.next {
    transform: translateX(180px) scale(0.9);
    z-index: 2;
    opacity: 0.7;
    animation: ${rotateOutRight} 0.6s ease-in;
  }

  &.hidden {
    transform: scale(0.8);
    opacity: 0;
    z-index: 1;
  }
`;

const AboutCarouselWrapper = styled.div`
  flex: 1 1 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px;
  margin: 40px;  
  border-radius: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  color: black;
  transition: background 0.8s ease-in-out, color 0.8s ease-in-out;
  background: ${(props) => props.gradient};

  @media (max-width: 900px) {
    width: 100%; /* Take up more width on smaller screens */
    padding: 10px;
    margin:0;
  }
`;

const AboutTitle = styled(Title)`
  font-family: "Playfair Display", serif !important;
  font-weight: 700 !important;
  font-size: 2.5rem !important;
  margin-bottom: 15px !important;
  letter-spacing: 0.5px !important;
  color: inherit !important;
`;

const AboutContent = styled(Paragraph)`
  font-family: "Merriweather", serif !important;
  font-size: 1.1rem !important;
  line-height: 1.9 !important;
  color: inherit !important;
  font-weight: 400 !important;
  margin-bottom: 0 !important;
`;

function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [aboutIndex, setAboutIndex] = useState(0);
  const imageIntervalRef = useRef(null);
  const aboutIntervalRef = useRef(null);

  // Fetch images from API
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const data = await getRequest("/gallery-images/");
        setImages(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching images:", err);
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  // Image carousel
  useEffect(() => {
    if (images.length > 1) {
      imageIntervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 3000);
    }
    return () => clearInterval(imageIntervalRef.current);
  }, [images]);

  // About content carousel
  useEffect(() => {
    aboutIntervalRef.current = setInterval(() => {
      setAboutIndex((prev) => (prev + 1) % aboutSections.length);
    }, 4000);
    return () => clearInterval(aboutIntervalRef.current);
  }, []);

  const getCurrentImageIndex = () => currentIndex;
  const getPrevImageIndex = () => (currentIndex - 1 + images.length) % images.length;
  const getNextImageIndex = () => (currentIndex + 1) % images.length;

  const about = aboutSections[aboutIndex];

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

  if (!images.length) {
    return <></>;
  }

  return (
    <GalleryWrapper>
      <CarouselContainer>
        {/* Image Carousel */}
        <ImageCarouselWrapper>
          {images.map((image, index) => {
            let className = "hidden";
            if (index === getCurrentImageIndex()) {
              className = "current";
            } else if (index === getPrevImageIndex()) {
              className = "prev";
            } else if (index === getNextImageIndex()) {
              className = "next";
            }

            return (
              <ImageSlide key={image.id} className={className}>
                <img src={image.image} alt={image.alt_text || `Image ${index}`} />
                {image.alt_text && <div>{image.alt_text}</div>}
              </ImageSlide>
            );
          })}
        </ImageCarouselWrapper>

        {/* About Section Carousel */}
        <AboutCarouselWrapper gradient={about.gradient}>
          <AboutTitle>{about.title}</AboutTitle>
          <hr></hr>
          <AboutContent>{about.content}</AboutContent>
        </AboutCarouselWrapper>
      </CarouselContainer>
    </GalleryWrapper>
  );
}

export default Gallery;