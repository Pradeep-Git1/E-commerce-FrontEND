import React from "react";
import { Carousel, Typography, Button, Row, Col } from "antd";

const { Title, Paragraph } = Typography;

const carouselItems = [
  {
    gradient: "linear-gradient(135deg, #8e44ad, #c0392b)",
    title: "Indulge in Luxury",
    description: "Experience the finest handcrafted chocolates made with love.",
  },
  {
    gradient: "linear-gradient(135deg, #2c3e50, #3498db)",
    title: "Dark & Decadent",
    description: "Rich dark chocolate for an intense, unforgettable taste.",
  },
  {
    gradient: "linear-gradient(135deg, #f39c12, #e74c3c)",
    title: "Perfect Gift Choice",
    description: "Delight your loved ones with our premium gift boxes.",
  },
];

const HeroCarousel = () => {
  return (
    <div style={{ width: "100%", marginBottom: "40px" }}>
      <Carousel autoplay effect="fade" dots>
        {carouselItems.map((item, index) => (
          <div key={index}>
            <div
              style={{
                height: "60vh",
                minHeight: "400px",
                width: "100%",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: item.gradient,
              }}
            >
              {/* Content Container */}
              <div
                style={{
                  backdropFilter: "blur(8px)",
                  background: "rgba(255, 255, 255, 0.08)",
                  padding: "20px",
                  borderRadius: "20px",
                  maxWidth: "90%",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                <Row justify="center" align="middle">
                  <Col xs={24} sm={20} md={18} lg={14}>
                    <Title
                      level={2}
                      style={{
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: "clamp(24px, 5vw, 36px)",
                        textShadow: "1px 1px 4px rgba(0,0,0,0.5)",
                        marginBottom: 16,
                      }}
                    >
                      {item.title}
                    </Title>
                    <Paragraph
                      style={{
                        color: "#f0f0f0",
                        fontSize: "clamp(14px, 4vw, 18px)",
                        margin: "0 auto 24px",
                        maxWidth: 500,
                        lineHeight: 1.6,
                        textShadow: "1px 1px 3px rgba(0,0,0,0.3)",
                      }}
                    >
                      {item.description}
                    </Paragraph>
                    <Button
                      type="primary"
                      size="large"
                      style={{
                        backgroundColor: "#D4A373",
                        borderColor: "#D4A373",
                        borderRadius: "30px",
                        padding: "10px 28px",
                        fontSize: "clamp(14px, 4vw, 16px)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                      }}
                    >
                      Explore Now
                    </Button>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default HeroCarousel;
