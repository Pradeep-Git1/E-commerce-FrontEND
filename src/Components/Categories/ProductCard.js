import React, { useState, useEffect } from "react";
import { Typography, Carousel, Button, Tag } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;
const BASE_URL = "http://localhost:8000"; // Replace with your actual base URL

const ProductCard = ({ product, onModalOpen }) => {
  const [showCart, setShowCart] = useState(false);
  const [jiggle, setJiggle] = useState(false);
  const formatImageUrl = (img) =>
    img.startsWith("http") ? img : `${BASE_URL}${img}`;
  const transitionTime = Math.floor(Math.random() * (7000 - 4000 + 1)) + 4000;

  useEffect(() => {
    const jiggleInterval = setInterval(() => {
      if (Math.random() < 0.3) {
        setJiggle(true);
        setTimeout(() => setJiggle(false), 300);
      }
    }, Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000);

    return () => clearInterval(jiggleInterval);
  }, []);

  const jiggleStyle = {
    animation: jiggle ? "jiggle 0.3s ease-in-out, pulse 1.5s infinite" : "none",
    transformOrigin: "center",
  };

  const cardStyle = {
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.18)",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.3s ease-in-out",
  };

  const handleMouseEnter = () => {
    setShowCart(true);
    const newStyle = { ...cardStyle, transform: "scale(1.03)" };
    setCardStyle(newStyle);
  };

  const handleMouseLeave = () => {
    setShowCart(false);
    const newStyle = { ...cardStyle, transform: "scale(1)" };
    setCardStyle(newStyle);
  };

  const [currentCardStyle, setCardStyle] = useState(cardStyle);

  return (
    <>
      <style>
        {`
                    @keyframes gradientAnimation {
                        0% {
                            background-position: 0% 50%;
                        }
                        50% {
                            background-position: 100% 50%;
                        }
                        100% {
                            background-position: 0% 50%;
                        }
                    }
                `}
      </style>
      <div
        hoverable
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={currentCardStyle}
        onClick={() => onModalOpen(product)} // Pass product data to modal
      >
        <div style={{ flex: 1 }}>
          <Carousel autoplay autoplaySpeed={transitionTime} effect="fade">
            {product.images && product.images.length > 0 ? (
              product.images.map((img, index) => (
                <div key={index}>
                  <img
                    src={formatImageUrl(img)}
                    alt={product.name}
                    style={{ width: "100%", height: 200, objectFit: "cover" }}
                  />
                </div>
              ))
            ) : (
              <div>
                <img
                  src={`${BASE_URL}/media/default-placeholder.png`}
                  alt="Placeholder"
                  style={{ width: "100%", height: 200, objectFit: "cover" }}
                />
              </div>
            )}
          </Carousel>
        </div>

        <div style={{ padding: "20px", textAlign: "left" }}>
          <Title
            level={4}
            style={{ marginBottom: 8, lineHeight: "1.2", fontWeight: 600 }}
          >
            {product.name}
          </Title>
          <Paragraph
            style={{
              fontSize: 14,
              color: "#666",
              marginBottom: 12,
              maxHeight: "60px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              lineHeight: "1.5",
            }}
          >
            {product.description}
          </Paragraph>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              {product.discount_price < product.price ? (
                <>
                  <Typography.Text
                    delete
                    style={{ fontSize: 14, color: "#888", marginBottom: 2 }}
                  >
                    ₹{product.price}
                  </Typography.Text>
                  <Typography.Text
                    strong
                    style={{
                      fontSize: 18,
                      color: "#C27A45",
                      transition: "transform 0.3s ease",
                      transform: showCart ? "scale(1.15)" : "scale(1)",
                    }}
                  >
                    ₹{product.discount_price}
                  </Typography.Text>
                </>
              ) : (
                <Typography.Text
                  strong
                  style={{
                    fontSize: 18,
                    color: "#C27A45",
                    transition: "transform 0.3s ease",
                    transform: showCart ? "scale(1.15)" : "scale(1)",
                  }}
                >
                  ₹{product.price}
                </Typography.Text>
              )}
            </div>
            {product.size && (
              <Tag
                color="geekblue"
                style={{ fontSize: 12, padding: "5px 10px" }}
              >
                Size: {product.size}
              </Tag>
            )}
          </div>
        </div>

        {showCart && (
          <Button
            type="primary"
            shape="circle"
            icon={<ShoppingCartOutlined style={jiggleStyle} />}
            size="large"
            onClick={() => onModalOpen(product)} // Pass product data to modal
            style={{
              position: "absolute",
              bottom: 16,
              right: 16,
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
              background:
                "linear-gradient(75deg,rgb(154, 255, 107),hsl(189, 97.10%, 59.40%))",
              backgroundSize: "10000% 1000%",
              animation: "gradientAnimation 4s ease infinite",
              border: "none",
            }}
          />
        )}
      </div>
    </>
  );
};

export default ProductCard;
