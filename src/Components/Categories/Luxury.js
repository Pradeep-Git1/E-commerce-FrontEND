import React from "react";
import { Card, Carousel, Typography, Button } from "antd";

const { Title, Paragraph } = Typography;

// Generate 30 luxury chocolate products
const products = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  name: `Luxury Chocolate ${i + 1}`,
  price: (Math.random() * 1000 + 500).toFixed(2), // Premium pricing ₹500-1500
  images: ["/images/image1.jpg", "/images/image2.jpg", "/images/image3.jpg"], // Images from public folder
}));

const LuxuryChocolates = () => {
  return (
    <div className="container mt-5">
      <Title level={2} className="text-center luxury-title">✨ Luxury Chocolates ✨</Title>
      <div className="row">
        {products.map((product) => (
          <div key={product.id} className="col-md-4 col-lg-3 mb-4">
            <Card hoverable className="luxury-card">
              {/* Product Image Carousel */}
              <Carousel autoplay effect="fade">
                {product.images.map((image, index) => (
                  <div key={index}>
                    <img src={image} alt={product.name} className="luxury-image" />
                  </div>
                ))}
              </Carousel>

              {/* Product Info */}
              <div className="text-center mt-3">
                <Title level={5} className="luxury-product-title">{product.name}</Title>
                <Paragraph className="luxury-price">₹{product.price}</Paragraph>
                <Button type="primary" size="large" className="luxury-btn">
                  Add to Cart 🛒
                </Button>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* Luxury Styling */}
      <style>{`
        .luxury-title {
          color: #d4af37;
          font-weight: bold;
          text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
        }

        .luxury-card {
          background: linear-gradient(to bottom, #fffdf2, #f6e58d);
          border: 1px solid #d4af37;
          border-radius: 12px;
          box-shadow: 0px 10px 20px rgba(212, 175, 55, 0.3);
          transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
        }

        .luxury-card:hover {
          transform: scale(1.05);
          box-shadow: 0px 15px 30px rgba(212, 175, 55, 0.5);
        }

        .luxury-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 10px;
        }

        .luxury-product-title {
          color: #8b6508;
          font-weight: bold;
        }

        .luxury-price {
          color: #d4af37;
          font-size: 18px;
          font-weight: bold;
        }

        .luxury-btn {
          background: linear-gradient(to right, #d4af37, #b8860b);
          border: none;
          font-size: 16px;
          font-weight: bold;
          padding: 10px 20px;
          border-radius: 8px;
          transition: all 0.3s ease-in-out;
        }

        .luxury-btn:hover {
          background: linear-gradient(to right, #b8860b, #8b6508);
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
};

export default LuxuryChocolates;
