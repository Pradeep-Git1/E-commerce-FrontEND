import React, { useState, useEffect } from "react";
import { Typography, Carousel, Button, Tag } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { Grid } from "antd";
const { useBreakpoint } = Grid;

const { Title, Paragraph } = Typography;


const ProductCard = ({ product, onModalOpen }) => {
  const [showCart, setShowCart] = useState(false);
  const [jiggle, setJiggle] = useState(false);
  const screens = useBreakpoint();

  const [cardStyle, setCardStyle] = useState({
    borderRadius: 12, 
    overflow: "hidden",
    position: "relative",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)", 
    minHeight: "100%",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out", 
    backgroundColor: "#1a1a1a", 
  });
  const formatImageUrl = (img) =>
    img.startsWith("http") ? img : ``;

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (Math.random() < 0.2) { 
        setJiggle(true);
        setTimeout(() => setJiggle(false), 300);
      }
    }, Math.floor(Math.random() * 4000) + 6000); 

    return () => clearInterval(intervalId);
  }, []);

  const jiggleStyle = {
    animation: jiggle ? "jiggle 0.3s ease-in-out" : "none", 
    transformOrigin: "center",
  };

  const handleMouseEnter = () => {
    setShowCart(true);
    setCardStyle((prevStyle) => ({
      ...prevStyle,
      transform: "scale(1.03)",
      boxShadow: "0 12px 24px rgba(0, 0, 0, 0.3)", 
    }));
  };

  const handleMouseLeave = () => {
    setShowCart(false);
    setCardStyle((prevStyle) => ({
      ...prevStyle,
      transform: "scale(1)",
      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
    }));
  };

  const carouselSettings = {
    autoplay: true,
    autoplaySpeed: 3000, 
    effect: "fade",
    dots: false, 
  };

  const placeholderImage = `/media/default-placeholder.png`;

  const discountPercentage =
    product.discount_price < product.price
      ? Math.round(((product.price - product.discount_price) / product.price) * 100)
      : null;

  const discountBadgeStyle = {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#e74c3c", 
    color: "#fff",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "0.8rem",
    fontWeight: "bold",
    zIndex: 2,
    boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.4)",
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={cardStyle}
      onClick={() => onModalOpen(product)}
    >
      <div style={{ flex: 1, position: "relative" }}>
        <Carousel {...carouselSettings}>
          {product.images && product.images.length > 0 ? (
            product.images.map((img, index) => (
              <div key={index}>
                <img
                  src={formatImageUrl(img)}
                  alt={product.name}
                  style={{ width: "100%", height: screens.xs ? 120 : 220, objectFit: "cover" }} 
                />
              </div>
            ))
          ) : (
            <div>
              <img
                src={placeholderImage}
                alt="Placeholder"
                style={{ width: "100%", height: screens.xs ? 120 : 220, objectFit: "cover" }}
              />
            </div>
          )}
        </Carousel>
        {discountPercentage !== null && (
          <div style={discountBadgeStyle}>{discountPercentage}% off</div>
        )}
      </div>

      <div
        style={{
          padding: "12px", 
          textAlign: "center",
          backgroundColor: "#2c3e50", 
          flexGrow: "1",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between", 
        }}
      >
        <div>
          <Title
            level={4}
            style={{
              marginBottom: 4, 
              lineHeight: "1.3",
              fontWeight: 700,
              color: "#aaff00", 
              fontSize: screens.xs ? 16 : 20, 
              transition: "font-size 0.3s ease",
            }}
          >
            {product.name}
          </Title>
          {(screens.sm || screens.md || screens.lg || screens.xl) && (
            <Paragraph
              style={{
                fontSize: 13, 
                color: "rgba(255, 255, 255, 0.7)", 
                marginBottom: 12,
                maxHeight: "50px", 
                overflow: "hidden",
                textOverflow: "ellipsis",
                lineHeight: "1.4",
              }}
            >
              {product.description}
            </Paragraph>
          )}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 8, 
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            {product.discount_price < product.price ? (
              <>
                <Typography.Text
                  delete
                  style={{ fontSize: screens.xs ? 12 : 14, color: "rgba(255, 255, 255, 0.5)", marginBottom: 2 }} 
                >
                  ₹{product.price}
                </Typography.Text>
                <Typography.Text
                  strong
                  style={{
                    fontSize: screens.xs ? 18 : 22, 
                    color: "#f39c12", 
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
                  fontSize: screens.xs ? 18 : 22, 
                  color: "#f39c12", 
                  transform: showCart ? "scale(1.15)" : "scale(1)",
                  transition: "transform 0.3s ease",
                }}
              >
                ₹{product.price}
              </Typography.Text>
            )}
          </div>
          {product.size && (
            <Tag color="cyan" style={{ fontSize: screens.xs ? 10 : 12, padding: "4px 8px", borderRadius: 4 }}> {/* Responsive tag */}
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
          onClick={(e) => {
            e.stopPropagation(); 
            onModalOpen(product);
          }}
          style={{
            position: "absolute",
            bottom: 16,
            right: 16,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
            background:
              "linear-gradient(75deg, #2ecc71, #3498db)", 
            backgroundSize: "200% 200%", 
            animation: "gradientAnimation 3s ease infinite", 
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
          @keyframes jiggle {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(-5deg); }
            75% { transform: rotate(5deg); }
          }
        `}
      </style>
    </div>
  );
};

export default ProductCard;