import React, { useState, useEffect } from "react";
import { Carousel, Card, Typography, Button, Spin, Alert } from "antd";
import CartItemModal from "../FunctionalComps/CartItemModal";
import { getRequest } from "../../Services/api"; 

const { Title, Paragraph } = Typography;

const TopProducts = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BASE_URL = "http://localhost:8000"; // Ensure images load properly

  // Fetch Products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getRequest("/top-products/");
        // Ensure image URLs always start with '/'
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

    fetchProducts();
  }, []);

  // Open Modal
  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  // Close Modal
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  // Add to Cart
  const handleAddToCart = (product, quantity) => {
    setCart([...cart, { ...product, quantity }]);
    setModalVisible(false);
    console.log("Cart Updated:", [...cart, { ...product, quantity }]);
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
          <div className="d-flex product-scroll">
            {products.length > 0 ? (
              products.map((product) => (
                <Card
                  key={product.id}
                  hoverable
                  className="rounded-3 shadow-sm p-0 border-0 product-card"
                >
                  {/* Image Carousel */}
                  <Carousel autoplay effect="fade" className="rounded-3">
                    {product.images.map((image, index) => (
                      <div key={index}>
                        <img
                          src={image}
                          alt={product.name}
                          className="w-100 rounded-3"
                          style={{ height: "180px", objectFit: "cover" }}
                        />
                      </div>
                    ))}
                  </Carousel>

                  {/* Product Info */}
                  <div className="text-center mt-2 p-2">
                    <Title level={5} className="mb-1">{product.name}</Title>
                    <Paragraph className="mb-1 text-muted small">
                      <strong>Price:</strong> ₹{product.price}
                    </Paragraph>
                    <Paragraph className="mb-1 text-muted small">
                      <strong>Quantity:</strong> {product.quantity} pcs
                    </Paragraph>
                    <Button 
                      type="primary" 
                      size="small" 
                      className="mt-2 product-btn"
                      onClick={() => handleOpenModal(product)}
                    >
                      Add to Cart 🛒
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <Paragraph className="text-center text-muted">
                No products available.
              </Paragraph>
            )}
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {selectedProduct && (
        <CartItemModal
          visible={modalVisible}
          product={selectedProduct}
          onClose={handleCloseModal}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Custom Styles */}
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
            white-space: nowrap;
            padding: 10px;
          }
          .product-scroll {
            display: flex;
            gap: 16px;
          }
          .product-card {
            width: 260px;
            min-height: 380px;
            transition: transform 0.3s ease-in-out;
          }
          .product-card:hover {
            transform: scale(1.05);
          }
        `}
      </style>
    </div>
  );
};

export default TopProducts;
