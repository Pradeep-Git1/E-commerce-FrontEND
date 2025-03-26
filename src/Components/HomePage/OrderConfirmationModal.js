// src/Components/HomePage/OrderConfirmationModal.js

import React, { useState, useEffect } from "react";
import { Modal, Typography, Button, Space, Spin, message } from "antd";
import { HomeOutlined, LoadingOutlined } from '@ant-design/icons';
import { postRequest } from "../../Services/api";
import PaymentProcessingModal from "./PaymentProcessingModal"; // Import the new modal

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
  const [paymentProcessingVisible, setPaymentProcessingVisible] = useState(false); // New state

  const handleConfirmAndPay = async () => {
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

      await postRequest("create-order", orderDetails);
      onClose();  // This should set the visibility of this modal to false
      setTimeout(() => {
        setPaymentProcessingVisible(true);  // Open the payment processing modal after a delay
      }, 300);  // Adjust the delay as needed

    } catch (error) {
      console.error("Failed to create order:", error);
      message.error("Failed to create order. Please try again.");
      setPaymentProcessingVisible(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!visible) {
      setPaymentProcessingVisible(false); // Close payment modal when order modal closes.
    }
  }, [visible]);

  return (
    <>
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
            Confirm & Pay
          </Button>,
        ]}
      >
        <div>
          {loading && (
            <div style={{ textAlign: "center", marginBottom: "16px" }}>
              <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
              <p>Processing...</p>
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

      <PaymentProcessingModal visible={paymentProcessingVisible}/>
    </>
  );
};

export default OrderConfirmationModal;
