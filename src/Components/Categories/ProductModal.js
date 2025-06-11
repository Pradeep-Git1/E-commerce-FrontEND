import React, { useState, useEffect } from "react";
import { Modal, Typography, Button, Space, Divider, message as AntMessage } from "antd";
import {
  ShoppingCartOutlined,
  PlusOutlined,
  MinusOutlined,
  CloseOutlined
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../app/features/cart/cartSlice";
import { useMediaQuery } from 'react-responsive';

const { Title, Paragraph, Text } = Typography;
const BASE_URL = "https://chocosign.in";

const ProductModal = ({ product, visible, onClose }) => {
  const [quantity, setQuantity] = useState(product?.minimum_order_quantity || 1);
  const [currentImage, setCurrentImage] = useState(0);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.data);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    if (product && visible) {
      setQuantity(product.minimum_order_quantity || 1);
      setCurrentImage(0); 
      window.history.pushState({ modalOpen: true }, '', '#product-modal-open');
      window.addEventListener('popstate', handlePopState);
    } else {
      window.removeEventListener('popstate', handlePopState);
      if (window.history.state && window.history.state.modalOpen) {
        window.history.pushState({ modalOpen: false }, '', '');
      }
    }

    return () => {
      
      window.removeEventListener('popstate', handlePopState);
      
      if (window.history.state && window.history.state.modalOpen) {
          window.history.back();
      }
    };
  }, [product, visible]); 

  
  const handlePopState = (event) => {
    if (event.state && event.state.modalOpen) {
      
      onClose();
    } else if (visible) {
      
      
      
      onClose();
    }
  };

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
      AntMessage.success(`${product.name} added to cart!`);
      setTimeout(() => {
        onClose();
        setQuantity(product?.minimum_order_quantity || 1);
      }, 800);
    }
  };

  if (!product) return null;

  const formatImageUrl = (img) =>
    img.startsWith("http") ? img : `${BASE_URL}${img}`;

  const handleThumbnailClick = (index) => {
    setCurrentImage(index);
  };

  const discountPercentage =
    product.discount_price < product.price
      ? Math.round(((product.price - product.discount_price) / product.price) * 100)
      : null;

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={isMobile ? "95%" : 800}
      className="product-detail-modal"
      closeIcon={<CloseOutlined style={{ color: '#fff', fontSize: '18px' }} />}
    >
      <style>
        {`
          .product-detail-modal .ant-modal-content {
            padding: 0 !important;
            border-radius: 12px !important;
            overflow: hidden;
            background-color: #2c3e50;
            color: #ecf0f1;
          }
          .product-detail-modal .ant-modal-header {
            display: none;
          }
          .product-detail-modal .ant-modal-close-x {
            width: 40px;
            height: 40px;
            line-height: 40px;
            border-radius: 50%;
            background-color: rgba(0, 0, 0, 0.4);
            transition: background-color 0.3s ease;
            position: absolute;
            top: 15px;
            right: 15px;
            z-index: 10;
          }
          .product-detail-modal .ant-modal-close-x:hover {
            background-color: rgba(0, 0, 0, 0.6);
          }
        `}
      </style>

      <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row" }}>
        {/* Left Section: Image Gallery */}
        <div style={{ flex: isMobile ? "none" : 1, position: "relative", backgroundColor: '#1a1a1a' }}>
          <img
            src={formatImageUrl(product.images && product.images.length > 0 ? product.images[currentImage] : "/media/default-placeholder.png")}
            alt={product.name}
            style={{
              width: "100%",
              height: isMobile ? 280 : 400,
              objectFit: "contain",
              padding: isMobile ? '10px' : '20px',
            }}
          />

          {discountPercentage !== null && (
            <div style={{
              position: "absolute",
              top: 15,
              left: 15,
              backgroundColor: "#e74c3c",
              color: "#fff",
              padding: "6px 12px",
              borderRadius: "20px",
              fontSize: "0.9rem",
              fontWeight: "bold",
              zIndex: 1,
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
            }}>
              {discountPercentage}% OFF
            </div>
          )}

          {product.images && product.images.length > 1 && (
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: 'center',
              paddingBottom: isMobile ? 10 : 20,
              flexWrap: 'wrap',
            }}>
              {product.images.map((img, index) => (
                <img
                  key={index}
                  src={formatImageUrl(img)}
                  alt={`Thumbnail ${index}`}
                  style={{
                    width: isMobile ? 60 : 70,
                    height: isMobile ? 60 : 70,
                    objectFit: "cover",
                    margin: isMobile ? 4 : 8,
                    cursor: "pointer",
                    borderRadius: 8,
                    border: currentImage === index ? "3px solid #3498db" : "2px solid transparent",
                    boxShadow: currentImage === index ? "0 0 10px rgba(52, 152, 219, 0.7)" : "none",
                    transition: "all 0.3s ease",
                  }}
                  onClick={() => handleThumbnailClick(index)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Section: Product Details & Actions */}
        <div style={{
          flex: 1,
          padding: isMobile ? "20px 15px" : "30px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}>
          <div>
            <Title level={isMobile ? 3 : 2} style={{
              marginBottom: 8,
              color: "#f39c12",
              fontWeight: 700,
              fontSize: isMobile ? '1.7rem' : '2.2rem',
              lineHeight: 1.2,
            }}>
              {product.name}
            </Title>

            <Space size={isMobile ? 'small' : 'middle'} align="center" style={{ marginBottom: isMobile ? 12 : 20 }}>
              {product.discount_price < product.price && (
                <Text
                  delete
                  style={{
                    fontSize: isMobile ? 16 : 20,
                    color: "rgba(255, 255, 255, 0.6)",
                  }}
                >
                  ₹{product.price}
                </Text>
              )}
              <Text strong style={{
                fontSize: isMobile ? 22 : 30,
                color: "#2ecc71",
                fontWeight: 900,
              }}>
                ₹{product.discount_price < product.price ? product.discount_price : product.price}
              </Text>
            </Space>

            <Divider style={{ margin: isMobile ? "15px 0" : "25px 0", borderColor: 'rgba(255,255,255,0.1)' }} />

            <Paragraph style={{
              margin: 0,
              textAlign: "justify",
              lineHeight: "1.7",
              fontSize: isMobile ? '1rem' : '1.1rem',
              color: "#ecf0f1",
              maxHeight: isMobile ? '100px' : '150px',
              overflowY: 'auto',
              paddingRight: isMobile ? '0' : '10px',
            }}>
              {product.description || "No description available for this product."}
            </Paragraph>
            {product.size && (
              <Text strong style={{ display: 'block', marginTop: 15, fontSize: isMobile ? '0.9rem' : '1rem', color: '#bdc3c7' }}>
                Size: <span style={{ color: '#ecf0f1' }}>{product.size}</span>
              </Text>
            )}
          </div>

          {/* Quantity and Add to Cart */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: isMobile ? "center" : "flex-start",
            marginTop: isMobile ? 25 : 30,
          }}>
            <Space size="middle" style={{ marginBottom: isMobile ? 15 : 20 }}>
              <Button
                icon={<MinusOutlined />}
                size={isMobile ? "middle" : "large"}
                onClick={handleDecrement}
                disabled={quantity <= (product?.minimum_order_quantity || 1)}
                style={{ backgroundColor: '#e74c3c', borderColor: '#e74c3c', color: '#fff' }}
              />
              <Text style={{
                fontSize: isMobile ? '1.5rem' : '1.8rem',
                fontWeight: "bold",
                minWidth: "40px",
                textAlign: "center",
                color: '#ecf0f1',
              }}>
                {quantity}
              </Text>
              <Button
                icon={<PlusOutlined />}
                size={isMobile ? "middle" : "large"}
                onClick={handleIncrement}
                style={{ backgroundColor: '#2ecc71', borderColor: '#2ecc71', color: '#fff' }}
              />
            </Space>
            {quantity < (product?.minimum_order_quantity || 1) && (
              <Text type="warning" style={{ fontSize: '0.85rem', color: '#f1c40f', marginBottom: 10 }}>
                Minimum Order Quantity: {product?.minimum_order_quantity || 1}
              </Text>
            )}

            <Button
              type="primary"
              icon={<ShoppingCartOutlined />}
              size={isMobile ? "large" : "large"}
              onClick={handleAddToCart}
              style={{
                width: isMobile ? '100%' : 220,
                height: isMobile ? 45 : 50,
                borderRadius: 8,
                fontWeight: "bold",
                backgroundColor: "#3498db",
                borderColor: "#3498db",
                boxShadow: "0 4px 10px rgba(52, 152, 219, 0.4)",
                transition: "all 0.3s ease",
                marginBottom: isMobile ? 15 : 20,
              }}
              disabled={quantity < (product?.minimum_order_quantity || 1)}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProductModal;