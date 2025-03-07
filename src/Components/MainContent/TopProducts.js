import React, { useState } from "react";
import { Carousel, Card, Typography, Button } from "antd";
import CartItemModal from "../FunctionalComps/CartItemModal"; 

const { Title, Paragraph } = Typography;

// Simulated Top 10 Products with Dummy Data
const products = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  name: `Premium Chocolate ${i + 1}`,
  price: (Math.random() * 500 + 200).toFixed(2), // Random price between 200-700 INR
  quantity: Math.floor(Math.random() * 10) + 1, // Random quantity between 1-10
  images: ["/images/image1.jpg", "/images/image2.jpg", "/images/image3.jpg"], // Static images for now
}));

const TopProducts = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [cart, setCart] = useState([]);

  // Open Modal
  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  // Close Modal
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  // Simulated Add to Cart
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

      {/* Horizontal Scrollable Container */}
      <div className="scroll-container">
        <div className="d-flex product-scroll">
          {products.map((product) => (
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
          ))}
        </div>
      </div>

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
