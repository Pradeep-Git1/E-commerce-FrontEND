import React, { useState } from "react";
import { Card, Typography, Carousel, Button } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import ProductModal from "./ProductModal";

const { Title, Paragraph } = Typography;
const BASE_URL = "http://localhost:8000";

const ProductCard = ({ product }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const formatImageUrl = (img) => (img.startsWith("http") ? img : `${BASE_URL}${img}`);
  const transitionTime = Math.floor(Math.random() * (7000 - 4000 + 1)) + 4000;

  return (
    <>
      <Card
        hoverable
        onClick={() => setModalVisible(true)}
        style={{
          borderRadius: 12,
          overflow: "hidden",
          position: "relative",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Depth with subtle shadow
        }}
      >
        <Carousel autoplay autoplaySpeed={transitionTime} effect="fade">
          {product.images.length > 0 ? (
            product.images.map((img, index) => (
              <div key={index}>
                <img
                  src={formatImageUrl(img)}
                  alt={product.name}
                  style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 12 }} // Adjusted height
                />
              </div>
            ))
          ) : (
            <div>
              <img
                src={`${BASE_URL}/media/default-placeholder.png`}
                alt="Placeholder"
                style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 12 }} // Adjusted height
              />
            </div>
          )}
        </Carousel>

        <div style={{ textAlign: "center", padding: "12px 0" }}> {/* Reduced padding */}
          <Title level={5} style={{ marginBottom: 4 }}> {/* Reduced margin */}
            {product.name}
          </Title>
          <Paragraph strong style={{ fontSize: 16, color: "#8B4513" }}>
            ₹{product.price}
          </Paragraph>
        </div>

        <Button
          type="primary"
          shape="circle"
          icon={<ShoppingCartOutlined />}
          style={{ position: "absolute", top: 8, right: 8, boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)" }} // Adjusted button style
        />
      </Card>
      <ProductModal product={product} visible={modalVisible} onClose={() => setModalVisible(false)} />
    </>
  );
};

export default ProductCard;