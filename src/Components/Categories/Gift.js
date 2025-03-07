import React from "react";
import { Card, Carousel, Typography, Button } from "antd";

const { Title, Paragraph } = Typography;

// Generate 30 luxury gift chocolates
const products = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  name: `Exclusive Gift Chocolate ${i + 1}`,
  price: (Math.random() * 2000 + 1000).toFixed(2), // High-end pricing ₹1000-3000
  images: ["/images/image1.jpg", "/images/image2.jpg", "/images/image3.jpg"],
}));

const GiftsChocolates = () => {
  return (
    <div className="container mt-5">
      <Title level={2} className="text-center gift-title">🎁 Exclusive Gift Collection 🎁</Title>
      <div className="row">
        {products.map((product) => (
          <div key={product.id} className="col-md-4 col-lg-3 mb-4">
            <Card hoverable className="gift-card">
              {/* Product Image Carousel */}
              <Carousel autoplay effect="fade">
                {product.images.map((image, index) => (
                  <div key={index}>
                    <img src={image} alt={product.name} className="gift-image" />
                  </div>
                ))}
              </Carousel>

              {/* Product Info */}
              <div className="text-center mt-3">
                <Title level={4} className="gift-product-title">{product.name}</Title>
                <Paragraph className="gift-price">₹{product.price}</Paragraph>
                <Button type="primary" size="large" className="gift-btn">
                  Add to Cart 🎁
                </Button>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* Ultimate Luxury Styling */}
      <style>{`
        .gift-title {
          color: #f5c518;
          font-weight: 700;
          text-transform: uppercase;
          text-shadow: 3px 3px 10px rgba(245, 197, 24, 0.5);
          background: linear-gradient(to right, #f5c518, #ffcc00);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .gift-card {
          background: linear-gradient(145deg,rgb(238, 229, 103),rgb(99, 167, 245));
          border: 3px solid #f5c518;
          border-radius: 18px;
          box-shadow: 0px 10px 30px rgba(245, 197, 24, 0.4);
          transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
          overflow: hidden;
        }

        .gift-card:hover {
          transform: scale(1.08);
          box-shadow: 0px 20px 50px rgba(245, 197, 24, 0.7);
        }

        .gift-image {
          width: 100%;
          height: 250px;
          object-fit: cover;
          border-radius: 12px;
        }

        .gift-product-title {
          color: #f5c518;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .gift-price {
          color: #f5c518;
          font-size: 22px;
          font-weight: 700;
        }

        .gift-btn {
          background: linear-gradient(to right,rgb(24, 245, 153),rgba(89, 0, 255, 0.31));
          border: none;
          font-size: 18px;
          font-weight: 700;
          padding: 12px 30px;
          border-radius: 10px;
          transition: all 0.3s ease-in-out;
          box-shadow: 0px 5px 15px rgba(245, 197, 24, 0.3);
        }

        .gift-btn:hover {
          background: linear-gradient(to right, #ffcc00, #f5c518);
          transform: scale(1.1);
          box-shadow: 0px 5px 20px rgba(245, 197, 24, 0.8);
        }
      `}</style>
    </div>
  );
};

export default GiftsChocolates;
