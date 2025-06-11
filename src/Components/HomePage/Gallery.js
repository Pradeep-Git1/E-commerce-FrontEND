import React, { useState, useEffect } from "react";
import { getRequest } from "../../Services/api";
import { Typography, Spin } from "antd";
import styled, { createGlobalStyle } from "styled-components";
import ImageGallery from "./ImageGallery"; // Import the ImageGallery component
import AboutSectionCarousel from "./AboutSectionCarousel"; // Import the AboutSectionCarousel component

const GlobalStyle = createGlobalStyle`
  /* ... your existing GlobalStyle ... */
`;

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

function Gallery() {
  const [images, setImages] = useState([]);
  const [aboutSectionsData, setAboutSectionsData] = useState([]); // New state for about sections
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Optional: state for errors
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const fetchGalleryData = async () => {
      setLoading(true);
      try {
        const imagesData = await getRequest("/gallery-images/");
        const aboutData = await getRequest("/about-sections/"); // Fetch about sections
        setImages(imagesData);
        setAboutSectionsData(aboutData); // Set the fetched about sections
        setLoading(false);
        setInitialized(true);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err); // Set the error state
        setLoading(false);
        setInitialized(true);
      }
    };

    fetchGalleryData();
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

  if (error) {
    return <Typography.Text type="danger">Error loading data.</Typography.Text>;
  }

  return (
    <GalleryWrapper>
      <GlobalStyle />
      <CarouselContainer>
        <ImageGallery images={images} />
        {aboutSectionsData && aboutSectionsData.length > 0 ? ( // Conditionally render
          <AboutSectionCarousel aboutSections={aboutSectionsData} />
        ) : initialized ? (
          <Typography.Text>No about section content available.</Typography.Text>
        ) : null}
      </CarouselContainer>
    </GalleryWrapper>
  );
}

export default Gallery;