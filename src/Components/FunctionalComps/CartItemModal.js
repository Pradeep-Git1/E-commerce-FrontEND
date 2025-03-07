import React, { useState } from "react";
import { Modal, Button, Carousel, Typography, InputNumber, message } from "antd";

const { Title, Paragraph } = Typography;

const CartItemModal = ({ visible, product, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);

  // Handle Quantity Change
  const handleQuantityChange = (value) => {
    if (value >= 1) {
      setQuantity(value);
    }
  };

  // Handle Add to Cart Click
  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    message.success(`${product.name} added to cart!`);
    onClose(); // Close modal after adding
  };

  return (
    <Modal visible={visible} onCancel={onClose} footer={null} centered width={400}>
      {/* Product Images Carousel */}
      <Carousel autoplay effect="fade">
        {product?.images.map((image, index) => (
          <div key={index}>
            <img
              src={image}
              alt={product?.name}
              style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "5px" }}
            />
          </div>
        ))}
      </Carousel>

      {/* Product Details */}
      <div style={{ textAlign: "center", marginTop: "15px" }}>
        <Title level={4}>{product?.name}</Title>
        <Paragraph>
          <strong>Price:</strong> ₹{product?.price}
        </Paragraph>

        {/* Quantity Selector */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", marginTop: "10px" }}>
          <Button type="primary" shape="circle" onClick={() => handleQuantityChange(quantity - 1)} disabled={quantity <= 1}>
            -
          </Button>
          <InputNumber min={1} max={10} value={quantity} onChange={handleQuantityChange} style={{ width: "60px", textAlign: "center" }} />
          <Button type="primary" shape="circle" onClick={() => handleQuantityChange(quantity + 1)}>
            +
          </Button>
        </div>

        {/* Add to Cart Button */}
        <Button type="primary" block style={{ marginTop: "15px" }} onClick={handleAddToCart}>
          Add to Cart 🛒
        </Button>
      </div>
    </Modal>
  );
};

export default CartItemModal;
