import React, { useState, useEffect } from "react";
import { Typography, Carousel, Button, Tag } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { Grid } from "antd";
const { useBreakpoint } = Grid;

const { Title, Paragraph } = Typography;
const BASE_URL = "http://localhost:8000"; // Replace with your actual base URL

const ProductCard = ({ product, onModalOpen }) => {
  const [showCart, setShowCart] = useState(false);
  const [jiggle, setJiggle] = useState(false);
  const screens = useBreakpoint();

  const [cardStyle, setCardStyle] = useState({
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
    boxShadow: "12px 12px 12px rgba(51, 17, 17, 0.84)",
    minHeight: "100%",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.3s ease-in-out",
  });
  const formatImageUrl = (img) =>
    img.startsWith("http") ? img : `${BASE_URL}${img}`;

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (Math.random() < 0.3) {
        setJiggle(true);
        setTimeout(() => setJiggle(false), 300);
      }
    }, Math.floor(Math.random() * 5000) + 5000); // Reduced range for efficiency

    return () => clearInterval(intervalId);
  }, []);

  const jiggleStyle = {
    animation: jiggle ? "jiggle 0.3s ease-in-out, pulse 1.5s infinite" : "none",
    transformOrigin: "center",
  };

  const handleMouseEnter = () => {
    setShowCart(true);
    setCardStyle((prevStyle) => ({ ...prevStyle, transform: "scale(1.03)" }));
  };

  const handleMouseLeave = () => {
    setShowCart(false);
    setCardStyle((prevStyle) => ({ ...prevStyle, transform: "scale(1)" }));
  };

  const carouselSettings = {
    autoplay: true,
    autoplaySpeed: Math.floor(Math.random() * 1000) + 2000, // Reduced range
    effect: "fade",
  };

  const placeholderImage = `${BASE_URL}/media/default-placeholder.png`;

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={cardStyle}
      onClick={() => onModalOpen(product)}
    >
      <div style={{ flex: 1 }}>
        <Carousel {...carouselSettings}>
          {product.images && product.images.length > 0 ? (
            product.images.map((img, index) => (
              <div key={index}>
                <img
                  src={formatImageUrl(img)}
                  alt={product.name}
                  style={{ width: "100%", height: screens.xs ? 100 : 200, objectFit: "cover" }}
                />
              </div>
            ))
          ) : (
            <div>
              <img
                src={placeholderImage}
                alt="Placeholder"
                style={{ width: "100%", height: screens.xs ? 100 : 200, objectFit: "cover" }}
              />
            </div>
          )}
        </Carousel>
      </div>

      <div
        style={{
          padding: "7px",
          textAlign: "center",
          backgroundColor: "rgba(0, 0, 0, 0.81)",
          flexGrow: "1",
        }}
      >
        <Title
          level={4}
          style={{
            marginBottom: 8,
            lineHeight: "1.2",
            fontWeight: 700,
            color: "rgb(81, 255, 0)",
            fontSize: screens.xs ? 14 : 18, // adjust size based on screen
            transition: "font-size 0.3s ease",
          }}
        >
          {product.name}
        </Title>
        {(screens.sm || screens.md || screens.lg || screens.xl) && (
          <Paragraph
            style={{
              fontSize: 14,
              color: "rgba(240, 253, 54, 0.66)",
              marginBottom: 12,
              maxHeight: "60px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              lineHeight: "1.5",
            }}
          >
            {product.description}
          </Paragraph>
        )}

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
                    transform: showCart ? "scale(1.15)" : "scale(1)",
                    transition: "transform 0.3s ease",
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
                  transform: showCart ? "scale(1.15)" : "scale(1)",
                  transition: "transform 0.3s ease",
                }}
              >
                ₹{product.price}
              </Typography.Text>
            )}
          </div>
          {product.size && (
            <Tag color="geekblue" style={{ fontSize: 12, padding: "5px 10px" }}>
              {product.size}
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
          onClick={() => onModalOpen(product)}
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
      <style>
        {`
          @keyframes gradientAnimation {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
    </div>
  );
};

export default ProductCard;
