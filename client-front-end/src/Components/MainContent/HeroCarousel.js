import React from "react";
import { Carousel, Typography, Button, Row, Col } from "antd";

const { Title, Paragraph } = Typography;

const carouselItems = [
  {
    gradient: "linear-gradient(135deg, #8e44ad, #c0392b)", // Purple to Red
    title: "Indulge in Luxury",
    description: "Experience the finest handcrafted chocolates made with love.",
  },
  {
    gradient: "linear-gradient(135deg, #2c3e50, #3498db)", // Dark Blue to Light Blue
    title: "Dark & Decadent",
    description: "Rich dark chocolate for an intense, unforgettable taste.",
  },
  {
    gradient: "linear-gradient(135deg, #f39c12, #e74c3c)", // Orange to Red
    title: "Perfect Gift Choice",
    description: "Delight your loved ones with our premium gift boxes.",
  },
];

const HeroCarousel = () => {
  return (
    <div className="container mt-4 mb-5" >
      <Carousel autoplay effect="fade">
        {carouselItems.map((item, index) => (
          <div key={index} style={{ position: "relative", height: "85vh", borderRadius: "25px", overflow: "hidden" }}>
            {/* Gradient Background Overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: item.gradient, // Ensures gradient is applied correctly
                zIndex: -1, // Places it behind content
                borderRadius: "25px",
              }}
            />
            {/* Centered Content */}
            <Row
              justify="center"
              align="middle"
              style={{
                height: "100%",
                backdropFilter: "blur(10px)", // Glassmorphism effect
                background: "rgba(255, 255, 255, 0.1)", // Subtle transparency
                borderRadius: "25px",
                padding: "20px",
                boxShadow: "0px 10px 30px rgba(0,0,0,0.2)", // Soft shadow effect
              }}
            >
              <Col xs={22} sm={20} md={16} lg={12} xl={10} style={{ textAlign: "center", color: "#fff" }}>
                <Title level={2} style={{ fontWeight: "bold", textShadow: "3px 3px 8px rgba(0,0,0,0.4)" }}>
                  {item.title}
                </Title>
                <Paragraph style={{ fontSize: "18px", textShadow: "2px 2px 5px rgba(0,0,0,0.3)" }}>
                  {item.description}
                </Paragraph>
                <Button
                  type="primary"
                  size="large"
                  style={{
                    marginTop: "15px",
                    background: "#D4A373",
                    borderColor: "#D4A373",
                    borderRadius: "30px",
                    padding: "10px 30px",
                    fontSize: "18px",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                  }}
                >
                  Explore Now
                </Button>
              </Col>
            </Row>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default HeroCarousel;
