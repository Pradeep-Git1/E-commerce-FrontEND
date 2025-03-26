// src/Components/HomePage/OrderConfirmationModal.js

import React, { useState } from "react";
import { Modal, Typography, Button, Space, Spin } from "antd";
import { HomeOutlined, CreditCardOutlined } from '@ant-design/icons';
import { postRequest } from "../../Services/api";
import { message } from "antd";

const { Title, Text } = Typography;

const OrderConfirmationModal = ({
  orderSummary,
  address,
  paymentOption,
  visible,
  onClose,
  onConfirm,
  isGift,
  giftRecipientName,
  combinedCart,
  calculateTotal,
}) => {
  const [loading, setLoading] = useState(false);

  const handleConfirmAndPay = async () => {
    console.log("handleConfirmAndPay called!");
    setLoading(true);
    try {
      const totalAmount = calculateTotal(combinedCart);
      const orderDetails = {
        address: address,
        is_gift: isGift,
        gift_recipient_name: giftRecipientName,
        items: combinedCart.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
        total_amount: totalAmount,
      };

      console.log("Sending order details:", orderDetails);
      await postRequest("/create-order", orderDetails);
      console.log("Order placed successfully!");
      message.success("Order placed successfully!");
      onConfirm();
    } catch (error) {
      console.error("Failed to create order:", error);
      message.error("Failed to create order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={<Title level={4}>Confirm Your Order</Title>}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleConfirmAndPay}
          loading={loading}
        >
          {loading ? "Processing Payment..." : "Confirm & Pay"}
        </Button>,
      ]}
    >
      <div>
        {loading && (
          <div style={{ textAlign: "center", marginBottom: "16px" }}>
            <Spin size="large" />
            <p>Processing your payment...</p>
          </div>
        )}

        <Title level={5}>Order Summary</Title>
        <div style={{ marginBottom: "16px" }}>
          {orderSummary}
        </div>

        <Title level={5}>Shipping Address</Title>
        <div style={{ marginBottom: "16px" }}>
          {address ? (
            <div>
              <Space align="start">
                <HomeOutlined />
                <Text>
                  {address.street_address}, {address.city}, {address.state}, {address.country} - {address.postal_code}
                </Text>
              </Space>
              {isGift && (
                <div style={{ marginTop: '8px' }}>
                  <Text>Gift Recipient: {giftRecipientName}</Text>
                </div>
              )}
            </div>
          ) : (
            <Text>No address selected.</Text>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default OrderConfirmationModal;