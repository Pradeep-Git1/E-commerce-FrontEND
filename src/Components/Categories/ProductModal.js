import React, { useState, useRef, useEffect } from "react";
import { Modal, Carousel, Typography, Button, Space, Divider, InputNumber } from "antd";
import { ShoppingCartOutlined, DollarCircleOutlined, InfoCircleOutlined, PlusOutlined, MinusOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const BASE_URL = "http://localhost:8000";

const ProductModal = ({ product, visible, onClose }) => {
  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  if (!product) return null;

  const formatImageUrl = (img) => (img.startsWith("http") ? img : `${BASE_URL}${img}`);

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={600}
      bodyStyle={{ padding: "10px" }}
    >
      <Carousel autoplay>
        {product.images.length > 0 ? (
          product.images.map((img, index) => (
            <div key={index}>
              <img
                src={formatImageUrl(img)}
                alt={product.name}
                style={{ width: "100%", height: 300, objectFit: "cover", borderRadius: 4 }}
              />
            </div>
          ))
        ) : (
          <div>
            <img
              src={`${BASE_URL}/media/default-placeholder.png`}
              alt="Placeholder"
              style={{ width: "100%", height: 300, objectFit: "cover", borderRadius: 4 }}
            />
          </div>
        )}
      </Carousel>

      <div style={{ padding: "10px 0", textAlign: "center" }}>
        <Title level={3} style={{ marginBottom: 4 }}>
          {product.name}
        </Title>

        <Space align="center" style={{ marginBottom: 8 }}>
          <DollarCircleOutlined style={{ fontSize: 20, color: "#8B4513" }} />
          <Text strong style={{ fontSize: 22, color: "#8B4513" }}>
            ₹{product.price}
          </Text>
        </Space>

        <Divider style={{ margin: "8px 0" }} />

        <Space direction="vertical" align="center" style={{ marginBottom: 10 }}>
          <InfoCircleOutlined style={{ fontSize: 18, color: "#555" }} />
          <Paragraph style={{ margin: 0, textAlign: 'justify', padding: '0 10px', lineHeight: '1.5' }}>
            {product.description || "No description available."}
          </Paragraph>
        </Space>

        <Space direction="vertical" align="center">
          <Space align="center">
            <Button icon={<MinusOutlined />} size="small" onClick={handleDecrement} />
            <Text style={{ fontSize: '1.5rem', fontWeight: 'bold', minWidth: '30px', textAlign: 'center' }}>{quantity}</Text>
            <Button icon={<PlusOutlined />} size="small" onClick={handleIncrement} />
          </Space>
          <Button type="primary" icon={<ShoppingCartOutlined />} size="large">
            Add to Cart
          </Button>
        </Space>
      </div>
    </Modal>
  );
};

export default ProductModal;