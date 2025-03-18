import React from "react";
import { List, Typography, Divider } from "antd";

const { Title, Text } = Typography;

const OrderSummary = ({ combinedCart, calculateTotal, getImageSrc }) => {
  return (
    <div style={{
      padding: "24px",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
      backgroundColor: "#fff"
    }}>
      <Title level={4} style={{ textAlign: "center", marginBottom: "24px" }}>Order Summary</Title>
      <List
        dataSource={combinedCart}
        renderItem={(item) => (
          <List.Item style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f0f0f0" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img src={getImageSrc(item.image)} alt={item.name} style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "4px", marginRight: "20px" }} />
              <div>
                <Text strong>{item.name}</Text>
                <div style={{ fontSize: "0.85rem", color: "#8c8c8c" }}>
                  ₹{item.price || item.subtotal / item.quantity} x {item.quantity}
                </div>
              </div>
            </div>
            <Text strong>₹{(item.price || item.subtotal / item.quantity) * item.quantity}</Text>
          </List.Item>
        )}
        style={{ overflow: "auto" }}
      />
      <Divider style={{ margin: "20px 0" }} />
      <div style={{ textAlign: "right" }}>
        <Text strong style={{ fontSize: "1.1rem" }}>Total: ₹{calculateTotal()}</Text>
      </div>
    </div>
  );
};

export default OrderSummary;
