import React from "react";
import { Modal, Carousel, Typography, Button, Space } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;
const BASE_URL = "http://localhost:8000";

const ProductModal = ({ product, visible, onClose }) => {
  if (!product) return null;

  const formatImageUrl = (img) => (img.startsWith("http") ? img : `${BASE_URL}${img}`);

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={600}
      bodyStyle={{ padding: "24px" }} // Added body padding
    >
      <Carousel autoplay>
        {product.images.length > 0 ? (
          product.images.map((img, index) => (
            <div key={index}>
              <img
                src={formatImageUrl(img)}
                alt={product.name}
                style={{ width: "100%", height: 300, objectFit: "cover", borderRadius: 12 }} // Adjusted radius
              />
            </div>
          ))
        ) : (
          <div>
            <img
              src={`${BASE_URL}/media/default-placeholder.png`}
              alt="Placeholder"
              style={{ width: "100%", height: 300, objectFit: "cover", borderRadius: 12 }} // Adjusted radius
            />
          </div>
        )}
      </Carousel>

      <div style={{ padding: "20px 0", textAlign: "center" }}> {/* Adjusted padding */}
        <Title level={4} style={{ marginBottom: 12 }}> {/* Adjusted margin */}
          {product.name}
        </Title>
        <Paragraph strong style={{ fontSize: 20, color: "#8B4513" }}> {/* Adjusted font size */}
          ₹{product.price}
        </Paragraph>
        <Paragraph type="secondary" style={{ marginTop: 8 }}> {/* Added margin */}
          {product.description || "No description available."}
        </Paragraph>

        <Space style={{ marginTop: 24 }}> {/* Adjusted margin */}
          <Button type="primary" icon={<ShoppingCartOutlined />} size="large">
            Add to Cart
          </Button>
        </Space>
      </div>
    </Modal>
  );
};

export default ProductModal;