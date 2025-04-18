import React, { useState, useEffect, useRef, useCallback } from "react";
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
  const productRefs = useRef([]);

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

  const handleProductVisibility = useCallback((index, node) => {
    if (!node) return;
    node.style.transform = "scale(0.9)";
    node.style.opacity = 0;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          node.style.transition = "transform 0.4s ease, opacity 0.4s ease";
          node.style.transform = "scale(1)";
          node.style.opacity = 1;
          observer.disconnect();
        }
      });
    });

    observer.observe(node);
  }, []);

  useEffect(() => {
    productRefs.current.forEach((ref, index) => {
      handleProductVisibility(index, ref);
    });
  }, [products, handleProductVisibility]);

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
        <div className="scroll-container">
          <Row gutter={[16, 16]} className="product-scroll flex-nowrap" wrap={false}>
            {products.length > 0 ? (
              products.map((product, index) => (
                <Col
                  key={product.id}
                  xs={24}
                  sm={24}
                  md={8}
                  lg={8}
                  xl={6}
                  ref={(node) => (productRefs.current[index] = node)}
                  style={{ flex: "0 0 auto" }}
                >
                  <ProductCard product={product} onModalOpen={openModal} />
                </Col>
              ))
            ) : (
              <Paragraph className="text-center text-muted">No products available.</Paragraph>
            )}
          </Row>
        </div>
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
          .scroll-container {
            width: 100%;
            overflow-x: auto;
            padding: 10px;
          }
          .product-scroll {
            display: flex;
          }
        `}
      </style>
    </div>
  );
};

export default TopProducts;
