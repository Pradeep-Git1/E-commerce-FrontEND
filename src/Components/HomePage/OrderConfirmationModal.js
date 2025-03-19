// src/Components/HomePage/OrderConfirmationModal.js

import React from "react";
import { Modal, Typography, Button, Space } from "antd";
import { HomeOutlined, CreditCardOutlined, MoneyCollectOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const OrderConfirmationModal = ({
  orderSummary,
  address,
  paymentOption,
  visible,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal
      title={<Title level={4}>Confirm Your Order</Title>}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={onConfirm}>
          {paymentOption === "payNow" ? "Confirm & Pay" : "Confirm"}
        </Button>,
      ]}
    >
      <div>
        <Title level={5}>Order Summary</Title>
        <div style={{ marginBottom: "16px" }}>
          {orderSummary}
        </div>

        <Title level={5}>Shipping Address</Title>
        <div style={{ marginBottom: "16px" }}>
          {address ? (
            <Space align="start">
              <HomeOutlined />
              <Text>
                {address.street_address}, {address.city}, {address.state}, {address.country} - {address.postal_code}
              </Text>
            </Space>
          ) : (
            <Text>No address selected.</Text>
          )}
        </div>

        <Title level={5}>Payment Option</Title>
        <div>
          {paymentOption === "payNow" ? (
            <Space align="start">
              <CreditCardOutlined />
              <Text>Pay Now</Text>
            </Space>
          ) : (
            <Space align="start">
              <MoneyCollectOutlined />
              <Text>Pay on Delivery</Text>
            </Space>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default OrderConfirmationModal;