import React from "react";
import { Card, Carousel, Typography, Button } from "antd";

const { Title, Paragraph } = Typography;

// Generate 30 dark chocolate products
const products = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  name: `Dark Chocolate ${i + 1}`,
  price: (Math.random() * 500 + 200).toFixed(2),
  images: ["/images/image1.jpg", "/images/image2.jpg", "/images/image3.jpg"],
}));

const DarkChocolates = () => {
  return (
    <div className="container mt-5">
      <Title level={2} className="text-center text-dark">🍫 Dark Chocolates</Title>
      <div className="row">
        {products.map((product) => (
          <div key={product.id} className="col-md-4 col-lg-3 mb-4">
            <Card hoverable className="rounded shadow-sm border-0">
              <Carousel autoplay effect="fade" className="rounded">
                {product.images.map((image, index) => (
                  <div key={index}>
                    <img src={image} alt={product.name} className="w-100 rounded" style={{ height: "180px", objectFit: "cover" }} />
                  </div>
                ))}
              </Carousel>
              <div className="text-center mt-2">
                <Title level={5} className="mb-1">{product.name}</Title>
                <Paragraph className="mb-1 text-muted"><strong>Price:</strong> ₹{product.price}</Paragraph>
                <Button type="primary" size="small" className="mt-2 w-100">Add to Cart 🛒</Button>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DarkChocolates;
