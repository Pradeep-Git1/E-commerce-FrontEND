import React, { useState, useEffect } from "react";
import { Typography, Carousel, Button, Space, Tag } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { Grid } from "antd";

const { useBreakpoint } = Grid;
const { Title, Paragraph, Text } = Typography;

const BASE_URL = "https://chocosign.in";

const ProductGroupCard = ({ productGroup, onVariantSelectForModal }) => {
  const [showAddToCartFloat, setShowAddToCartFloat] = useState(false);
  const [jiggle, setJiggle] = useState(false);
  const screens = useBreakpoint();

  const [cardStyle, setCardStyle] = useState({
    borderRadius: 20, // Slightly reduced border-radius for a tighter look
    overflow: "hidden",
    position: "relative",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)", // Slightly reduced shadow
    minHeight: "100%",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
    backgroundColor: "#1a1a1a",
  });

  const primaryVariant =
    productGroup.variants.find((v) => v.is_active) || productGroup.variants[0];

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (Math.random() < 0.2) {
        setJiggle(true);
        setTimeout(() => setJiggle(false), 300);
      }
    }, Math.floor(Math.random() * 4000) + 6000);

    return () => clearInterval(intervalId);
  }, []);

  if (!primaryVariant) {
    return (
      <div style={{ padding: 8, textAlign: "center", color: "#ff4d4f", fontSize: 12 }}>
        No variants available for this group.
      </div>
    );
  }

  const formatImageUrl = (img) =>
    img.startsWith("http") ? img : `${BASE_URL}${img}`;

  const jiggleStyle = {
    animation: jiggle ? "jiggle 0.3s ease-in-out" : "none",
    transformOrigin: "center",
  };

  const handleMouseEnter = () => {
    setShowAddToCartFloat(true);
    setCardStyle((prevStyle) => ({
      ...prevStyle,
      transform: "scale(1.02)", // Slightly less scale for mobile
      boxShadow: "0 6px 18px rgba(0, 0, 0, 0.25)", // Adjusted shadow
    }));
  };

  const handleMouseLeave = () => {
    setShowAddToCartFloat(false);
    setCardStyle((prevStyle) => ({
      ...prevStyle,
      transform: "scale(1)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
    }));
  };

  const carouselSettings = {
    autoplay: true,
    autoplaySpeed: 3000,
    effect: "fade",
    dots: false,
  };

  const placeholderImage = `${BASE_URL}/media/default-placeholder.png`;

  const maxDiscountPercentage = productGroup.variants.reduce(
    (max, variant) => {
      if (variant.discount_price < variant.price) {
        const discount = Math.round(
          ((variant.price - variant.discount_price) / variant.price) * 100
        );
        return Math.max(max, discount);
      }
      return max;
    },
    0
  );

  const discountBadgeStyle = {
    position: "absolute",
    top: 8, // Reduced top padding
    right: 8, // Reduced right padding
    backgroundColor: "#e74c3c",
    color: "#fff",
    padding: "3px 6px", // Reduced padding
    borderRadius: "3px", // Slightly reduced border-radius
    fontSize: "0.7rem", // Smaller font size for mobile
    fontWeight: "bold",
    zIndex: 2,
    boxShadow: "1px 1px 3px rgba(0, 0, 0, 0.3)", // Smaller shadow
  };

  const addToCartButtonStyle = {
    position: "absolute",
    top: 8, // Reduced top padding
    left: 8, // Reduced left padding
    zIndex: 2,
    width: 36, // Smaller button size
    height: 36, // Smaller button size
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)", // Smaller shadow
    transition: "opacity 0.3s ease-in-out",
    opacity: showAddToCartFloat ? 1 : 0,
    pointerEvents: showAddToCartFloat ? "auto" : "none",
    backgroundColor: "rgba(46, 204, 113, 0.9)",
    border: "none",
  };

  const getUniqueVariantAttributes = (attribute) => {
    const values = new Set();
    productGroup.variants.forEach(variant => {
      if (variant[attribute]) {
        values.add(variant[attribute]);
      }
    });
    return Array.from(values).slice(0, 3);
  };

  const uniqueSizings = getUniqueVariantAttributes("sizing");
  const uniqueColors = getUniqueVariantAttributes("color");
  const uniqueMaterials = getUniqueVariantAttributes("material");

  const handleOpenProductModal = (variantId) => {
    onVariantSelectForModal(productGroup, variantId);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={cardStyle}
      onClick={() => handleOpenProductModal(primaryVariant.id)}
    >
      <div style={{ flex: 1, position: "relative" }}>
        <Button
          type="primary"
          icon={<ShoppingCartOutlined style={{ fontSize: 18, color: '#fff', ...jiggleStyle }} />} // Smaller icon size
          style={addToCartButtonStyle}
          onClick={(e) => {
            e.stopPropagation();
            handleOpenProductModal(primaryVariant.id);
          }}
        />

        <Carousel {...carouselSettings}>
          {primaryVariant.images && primaryVariant.images.length > 0 ? (
            primaryVariant.images.map((img, index) => (
              <div key={index}>
                <img
                  src={formatImageUrl(img)}
                  alt={`${productGroup.name} - Image ${index + 1}`}
                  style={{
                    width: "100%",
                    height: screens.xs ? 100 : 200, // Reduced height for xs, slightly for others
                    objectFit: "cover",
                  }}
                />
              </div>
            ))
          ) : (
            <div>
              <img
                src={placeholderImage}
                alt="Placeholder"
                style={{
                  width: "100%",
                  height: screens.xs ? 100 : 200, // Reduced height for xs, slightly for others
                  objectFit: "cover",
                }}
              />
            </div>
          )}
        </Carousel>
        {maxDiscountPercentage > 0 && (
          <div style={discountBadgeStyle}>
            Up to {maxDiscountPercentage}% off
          </div>
        )}
      </div>

      <div
        style={{
          padding: 8, // Reduced padding for a tighter look
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
              lineHeight: "1.2", // Slightly reduced line height
              fontWeight: 700,
              color: "#aaff00",
              fontSize: screens.xs ? 15 : 18, // Optimized font size for xs, slightly reduced for others
              transition: "font-size 0.3s ease",
            }}
          >
            {productGroup.name}
          </Title>
          {(screens.sm || screens.md || screens.lg || screens.xl) && (
            <Paragraph
              style={{
                fontSize: 12, // Reduced font size for description
                color: "rgba(255, 255, 255, 0.7)",
                marginBottom: 8, // Reduced margin bottom
                maxHeight: "40px", // Reduced max height for description
                overflow: "hidden",
                textOverflow: "ellipsis",
                lineHeight: "1.3", // Reduced line height
              }}
            >
              {primaryVariant.description}
            </Paragraph>
          )}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 6, // Reduced margin top
            flexWrap: 'wrap',
            gap: 2, // Reduced gap between elements
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            {primaryVariant.discount_price < primaryVariant.price ? (
              <>
                <Text
                  delete
                  style={{
                    fontSize: screens.xs ? 11 : 13, // Optimized font size for xs
                    color: "rgba(255, 255, 255, 0.5)",
                    marginBottom: 1, // Reduced margin bottom
                  }}
                >
                  ₹{primaryVariant.price.toFixed(2)}
                </Text>
                <Text
                  strong
                  style={{
                    fontSize: screens.xs ? 16 : 20, // Optimized font size for xs
                    color: "#f39c12",
                    transform: showAddToCartFloat ? "scale(1.1)" : "scale(1)", // Slightly less scale
                    transition: "transform 0.3s ease",
                  }}
                >
                  ₹{primaryVariant.discount_price.toFixed(2)}
                </Text>
              </>
            ) : (
              <Text
                strong
                style={{
                  fontSize: screens.xs ? 16 : 20, // Optimized font size for xs
                  color: "#f39c12",
                  transform: showAddToCartFloat ? "scale(1.1)" : "scale(1)", // Slightly less scale
                  transition: "transform 0.3s ease",
                }}
              >
                ₹{primaryVariant.price.toFixed(2)}
              </Text>
            )}
          </div>
          <Space size={[0, 2]} wrap> {/* Reduced space size */}
            {uniqueSizings.length > 0 && (
              <Tag color="cyan" style={{ fontSize: screens.xs ? 9 : 11, padding: "3px 6px", borderRadius: 3 }}>
                {uniqueSizings.join(", ")}
              </Tag>
            )}
            {uniqueColors.length > 0 && (
              <Tag color="purple" style={{ fontSize: screens.xs ? 9 : 11, padding: "3px 6px", borderRadius: 3 }}>
                {uniqueColors.join(", ")}
              </Tag>
            )}
            {uniqueMaterials.length > 0 && (
              <Tag color="green" style={{ fontSize: screens.xs ? 9 : 11, padding: "3px 6px", borderRadius: 3 }}>
                {uniqueMaterials.join(", ")}
              </Tag>
            )}
            {(uniqueSizings.length > 3 || uniqueColors.length > 3 || uniqueMaterials.length > 3) && (
              <Tag color="grey" style={{ fontSize: screens.xs ? 9 : 11, padding: "3px 6px", borderRadius: 3 }}>
                ...more
              </Tag>
            )}
          </Space>
        </div>
      </div>

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

export default ProductGroupCard;