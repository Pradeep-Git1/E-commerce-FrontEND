import React, { useState } from "react";
import { List, Typography, Button, Badge } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const CartMenu = () => {
  const [cart, setCart] = useState([]);

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  return cart.length > 0 ? (
    <>
      <List
        dataSource={cart}
        renderItem={(item) => (
          <List.Item className="d-flex align-items-center">
            <img
              src={item.image}
              alt={item.name}
              style={{ width: 50, height: 50, objectFit: "cover", borderRadius: "5px" }}
            />
            <div className="ms-3">
              <Title level={5} className="mb-0">{item.name}</Title>
              <Paragraph className="mb-0 text-muted">₹{item.price} x {item.quantity}</Paragraph>
            </div>
            <Button type="text" danger icon={<DeleteOutlined />} onClick={() => removeFromCart(item.id)} />
          </List.Item>
        )}
      />
      <div className="text-center mt-3">
        <Title level={4} className="fw-bold">Total: ₹{cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}</Title>
        <Button type="primary" className="mt-2 w-100" onClick={() => alert("Proceeding to Checkout")}>Proceed to Checkout 🛍️</Button>
      </div>
    </>
  ) : (
    <Paragraph className="text-center text-muted mt-4">Your cart is empty!</Paragraph>
  );
};

export default CartMenu;
