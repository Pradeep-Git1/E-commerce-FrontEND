import React, { useState } from "react";
import { Drawer, List, Typography, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import CheckoutModal from "./CheckoutModal"; // Import Checkout Modal

const { Title, Paragraph } = Typography;

const CartDrawer = ({ visible, onClose, cart, removeFromCart }) => {
  const [checkoutVisible, setCheckoutVisible] = useState(false);

  // Calculate Total Price
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <Drawer title="Your Cart" placement="right" onClose={onClose} open={visible} width={350}>
        {cart.length > 0 ? (
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
                    <Paragraph className="mb-0 text-muted">
                      ₹{item.price} x {item.quantity}
                    </Paragraph>
                  </div>
                  <Button type="text" danger icon={<DeleteOutlined />} onClick={() => removeFromCart(item.id)} />
                </List.Item>
              )}
            />

            {/* Cart Total & Checkout */}
            <div className="text-center mt-3">
              <Title level={4} className="fw-bold">Total: ₹{totalPrice}</Title>
              <Button type="primary" className="mt-2 w-100" onClick={() => setCheckoutVisible(true)}>
                Proceed to Checkout 🛍️
              </Button>
            </div>
          </>
        ) : (
          <Paragraph className="text-center text-muted mt-4">Your cart is empty!</Paragraph>
        )}
      </Drawer>

      {/* Checkout Modal */}
      <CheckoutModal
        visible={checkoutVisible}
        onClose={() => setCheckoutVisible(false)}
        cart={cart}
        onProceedToPayment={() => alert("Proceeding to Payment...")}
      />
    </>
  );
};

export default CartDrawer;
