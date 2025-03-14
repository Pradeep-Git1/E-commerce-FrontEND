import React, { useState } from "react";
import { Card, Typography, Carousel, Button, Tag, Space } from "antd";
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
          borderRadius: 16,
          overflow: "hidden",
          position: "relative",
          boxShadow: "0 6px 12px rgba(0, 0, 0, 0.18)",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ flex: 1 }}>
          <Carousel autoplay autoplaySpeed={transitionTime} effect="fade">
            {product.images.length > 0 ? (
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
          <Title level={4} style={{ marginBottom: 8, lineHeight: "1.2", fontWeight: 600 }}>
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

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <Typography.Text strong style={{ fontSize: 18, color: "#C27A45" }}>
              ₹{product.price}
            </Typography.Text>
            {product.size && (
              <Tag color="geekblue" style={{ fontSize: 12, padding: "5px 10px" }}>
                Size: {product.size}
              </Tag>
            )}
          </div>
        </div>

        <Button
          type="primary"
          shape="circle"
          icon={<ShoppingCartOutlined />}
          size="large"
          onClick={(e) => {
            e.stopPropagation();
            console.log("Add to cart clicked");
          }}
          style={{ position: "absolute", bottom: 16, right: 16, boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)" }}
        />
      </Card>
      <ProductModal product={product} visible={modalVisible} onClose={() => setModalVisible(false)} />
    </>
  );
};

export default ProductCard;