import React from "react";
import { Carousel, Card, Typography, Button } from "antd";

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
  return (
    <div className="container-fluid mt-5 mb-5">
      <Title level={2} className="text-center mt-5 text-highlight">🔥 Top Products</Title>

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
                >
                  Add to Cart 🛒
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Custom Styles */}
      <style>
        {`
          /* Section Highlight */
          .text-highlight {
            color: #8B4513;
            font-weight: bold;
            text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
          }

          /* Horizontal Scrolling Effect */
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

          .scroll-container::-webkit-scrollbar {
            height: 8px;
          }

          .scroll-container::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 5px;
          }

          .scroll-container::-webkit-scrollbar-thumb {
            background: #D4A373;
            border-radius: 5px;
          }

          /* Product Cards */
          .product-card {
            width: 260px;
            min-height: 380px;
            transition: transform 0.3s ease-in-out;
          }

          .product-card:hover {
            transform: scale(1.05);
            box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2);
          }

          /* Button Styling */
          .product-btn {
            background: linear-gradient(to right, #D4A373, #b07b53);
            border: none;
            border-radius: 6px;
            transition: all 0.3s ease-in-out;
          }

          .product-btn:hover {
            background: linear-gradient(to right, #b07b53, #8B4513);
            transform: scale(1.05);
          }
        `}
      </style>
    </div>
  );
};

export default TopProducts;
