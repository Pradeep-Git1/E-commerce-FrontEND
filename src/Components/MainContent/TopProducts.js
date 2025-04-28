import React, { useState, useEffect } from "react";
import { Typography, Spin, Alert, Row, Col } from "antd";
import { getRequest } from "../../Services/api";
import ProductCard from "../Categories/ProductCard";
import ProductModal from "../Categories/ProductModal";

const { Title, Paragraph } = Typography;

const BASE_URL = "http://localhost:8000";

const TopProducts = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await getRequest("/top-products/");
      const updatedProducts = response.map(product => ({
        ...product,
        images: product.images.map(image =>
          image.startsWith("/") ? `${BASE_URL}${image}` : `${BASE_URL}/${image}`
        )
      }));
      setProducts(updatedProducts);
    } catch (err) {
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openModal = (product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedProduct(null);
  };

  return (
    <div className="container-fluid mt-5 mb-5">
      <Title level={2} className="text-center mt-5 text-highlight">
        🔥 Top Products
      </Title>

      {loading ? (
        <div className="text-center">
          <Spin size="large" />
        </div>
      ) : error ? (
        <Alert message={error} type="error" showIcon />
      ) : (
        <Row gutter={[30, 30]} className="mt-4">
          {products.length > 0 ? (
            products.map((product) => (
              <Col
                key={product.id}
                xs={12}
                sm={12}
                md={8}
                lg={8}
                xl={6}
              >
                <ProductCard product={product} onModalOpen={openModal} />
              </Col>
            ))
          ) : (
            <Col span={24}>
              <Paragraph className="text-center text-muted">No products available.</Paragraph>
            </Col>
          )}
        </Row>
      )}

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          visible={modalVisible}
          onClose={closeModal}
        />
      )}

      <style>
        {`
          .text-highlight {
            color: #8B4513;
            font-weight: bold;
            text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
          }
        `}
      </style>
    </div>
  );
};

export default TopProducts;