import React, { useState, useEffect, lazy, Suspense } from "react";
import { Typography, Spin, Alert, Row, Col } from "antd";
import { getRequest } from "../../Services/api";
import ChocolateLoader from "../HomePage/ChocolateLoader";
import ProductCard from "../Categories/ProductCard";
import ProductModal from "../Categories/ProductModal";

const { Title, Paragraph } = Typography;
const BASE_URL = "";

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
          image.startsWith("/") ? `${image}` : `${image}`
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
      {/* Added container-xxl for a maximum width and mx-auto for centering */}
      <div className="container-xxl mx-auto">
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
                  <Suspense fallback={<ChocolateLoader />}>
                    <ProductCard product={product} onModalOpen={openModal} />
                  </Suspense>
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
          <Suspense fallback={<ChocolateLoader />}>
            <ProductModal
              product={selectedProduct}
              visible={modalVisible}
              onClose={closeModal}
            />
          </Suspense>
        )}
      </div> {/* Closing div for container-xxl */}

      <style>
        {`
          .text-highlight {
            color: #8B4513;
            font-weight: bold;
            text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
          }
          /* Custom utility classes for Bootstrap-like container behavior */
          .container-xxl {
            max-width: 1320px; /* Adjust this value as needed for your desired maximum width */
          }
          .mx-auto {
            margin-right: auto !important;
            margin-left: auto !important;
          }
        `}
      </style>
    </div>
  );
};

export default TopProducts;