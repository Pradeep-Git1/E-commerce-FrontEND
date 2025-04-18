import React, { useState, useEffect } from "react";
import { Modal, Typography, Button, Space, Divider } from "antd";
import {
  ShoppingCartOutlined,
  PlusOutlined,
  MinusOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../app/features/cart/cartSlice";
import { useMediaQuery } from 'react-responsive'; // Import hook

const { Title, Paragraph, Text } = Typography;
const BASE_URL = "http://localhost:8000";

const ProductModal = ({ product, visible, onClose }) => {
  const [quantity, setQuantity] = useState(product?.minimum_order_quantity || 1);
  const [message, setMessage] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.data);
  const isMobile = useMediaQuery({ maxWidth: 768 }); // Define mobile breakpoint

  useEffect(() => {
    // Set initial quantity based on minimum order quantity when the product changes or modal opens
    if (product && visible) {
      setQuantity(product.minimum_order_quantity || 1);
    }
  }, [product, visible]);

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(product?.minimum_order_quantity || 1, prev - 1));
  };

  const handleAddToCart = () => {
    if (product) {
      dispatch(
        addToCart({ product, quantity }, { meta: { arg: { user: user } } })
      );
      setMessage("Added to cart!");
      setTimeout(() => {
        setMessage(null);
        onClose();
        setQuantity(product?.minimum_order_quantity || 1); // Reset quantity on close
      }, 1500);
    }
  };

  if (!product) return null;

  const formatImageUrl = (img) =>
    img.startsWith("http") ? img : `${BASE_URL}${img}`;

  const handleThumbnailClick = (index) => {
    setCurrentImage(index);
  };

  // Define dynamic styles based on screen size
  const modalStyle = {
    padding: 0,
    maxHeight: isMobile ? "90vh" : "80vh", // Increased height for mobile
  };

  const imageContainerStyle = {
    borderRadius: 0,
    overflow: "hidden",
  };

  const imageStyle = {
    width: "100%",
    height: isMobile ? 250 : 350, // Adjusted height for mobile
    objectFit: "cover",
    borderRadius: 0,
  };

  const thumbnailContainerStyle = {
    display: "flex",
    justifyContent: "center",
    marginTop: isMobile ? 5 : 10, // Reduced margin for mobile
  };

  const thumbnailStyle = (index) => ({
    width: isMobile ? 50 : 60, // Reduced size for mobile
    height: isMobile ? 50 : 60,
    objectFit: "cover",
    margin: isMobile ? 3 : 5, // Reduced margin
    cursor: "pointer",
    border: currentImage === index ? "2px solid #1890ff" : "none",
  });

  const titleStyle = {
    marginBottom: isMobile ? 4 : 8, // Reduced margin
    fontSize: isMobile ? '1.2rem' : undefined
  };

  const priceStyle = {
    fontSize: isMobile ? 18 : 24, // Reduced size for mobile
    color: product.discount_price < product.price ? "#C27A45" : "#8B4513",
  };

  const descriptionStyle = {
    margin: 0,
    textAlign: "justify",
    padding: isMobile ? "0 10px" : "0 20px", // Reduced horizontal padding
    lineHeight: "1.4", // Reduced line height for mobile
    fontSize: isMobile ? '0.9rem' : undefined
  };

  const quantityButtonStyle = {
    margin: isMobile ? "8px 0" : "15px 0", // Reduced vertical margin
  };

  const quantityTextStyle = {
    fontSize: "1.2rem",
    fontWeight: "bold",
    minWidth: "30px",
    textAlign: "center",
  };

  const addToCartButtonStyle = {
    margin: isMobile ? 10 : 15, // Reduced margin
    backgroundColor: "brown",
  };
  const closeButtonStyle = {
    padding: isMobile ? '4px 8px' : undefined
  };

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      footer={null}
      centered
      style={modalStyle}
      className="product-modal"
    >
      {/* Scoped CSS injected inside the component */}
      <style>
        {`
          .product-modal .ant-modal-content {
            padding: 0 !important;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2) !important;
            border-radius: 12px !important;
            border: 1px solid #e8e8e8;
          }
        `}
      </style>

      <div style={imageContainerStyle}>
        {product.images && product.images.length > 0 ? (
          <img
            src={formatImageUrl(product.images[currentImage])}
            alt={product.name}
            style={imageStyle}
          />
        ) : (
          <img
            src={`${BASE_URL}/media/default-placeholder.png`}
            alt="Placeholder"
            style={imageStyle}
          />
        )}

        {product.images && product.images.length > 1 && (
          <div style={thumbnailContainerStyle}>
            {product.images.map((img, index) => (
              <img
                key={index}
                src={formatImageUrl(img)}
                alt={`Thumbnail ${index}`}
                style={thumbnailStyle(index)}
                onClick={() => handleThumbnailClick(index)}
              />
            ))}
          </div>
        )}
      </div>

      <div style={{ textAlign: "center" }}>
        <Title level={isMobile ? 4 : 3} style={titleStyle}>
          {product.name}
        </Title>
        <Space align="center">
          {product.discount_price < product.price ? (
            <>
              <Text
                delete
                style={{
                  fontSize: isMobile ? 14 : 18,
                  color: "#999",
                  marginRight: 8,
                }}
              >
                ₹{product.price}
              </Text>
              <Text strong style={priceStyle}>
                ₹{product.discount_price}
              </Text>
            </>
          ) : (
            <Text strong style={priceStyle}>
              ₹{product.price}
            </Text>
          )}
        </Space>

        <Divider style={{ margin: isMobile ? "8px 0" : "12px 0" }} />

        <Space direction="vertical" align="center" style={{ marginBottom: isMobile ? 10 : 15 }}>
          <Paragraph style={descriptionStyle}>
            {product.description || "No description available."}
          </Paragraph>
        </Space>

        <Space direction="vertical" align="center" style={quantityButtonStyle}>
          <Space align="center">
            <Button
              icon={<MinusOutlined />}
              size="small"
              onClick={handleDecrement}
              disabled={quantity <= (product?.minimum_order_quantity || 1)}
            />
            <Text style={quantityTextStyle}>
              {quantity}
            </Text>
            <Button
              icon={<PlusOutlined />}
              size="small"
              onClick={handleIncrement}
            />
          </Space>
          <Button
            type="none"
            icon={<ShoppingCartOutlined />}
            size="large"
            onClick={handleAddToCart}
            style={addToCartButtonStyle}
            disabled={quantity < (product?.minimum_order_quantity || 1)}
          >
            Add to Cart
          </Button>
          {quantity < (product?.minimum_order_quantity || 1) && (
            <Text type="warning" style={{ fontSize: '0.8rem' }}>
              Minimum order quantity: {product?.minimum_order_quantity || 1}
            </Text>
          )}
        </Space>

        {message && (
          <div style={{ marginTop: 10, color: "green", fontWeight: "bold" }}>
            {message}
          </div>
        )}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: isMobile ? "5px 10px" : "10px 20px", // Reduced padding
        }}
      >
        <Button onClick={onClose} type="default" style={closeButtonStyle}>
          Close
        </Button>
      </div>
    </Modal>
  );
};

export default ProductModal;