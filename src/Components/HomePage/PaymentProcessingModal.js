// src/Components/HomePage/PaymentProcessingModal.js

import React from "react";
import { Modal, Spin, Typography } from "antd";
import { LoadingOutlined } from '@ant-design/icons';

const { Title } = Typography;

const PaymentProcessingModal = ({ visible }) => {
  return (
    <Modal
      title={<Title level={4}>Processing Payment</Title>}
      footer={null}
      closable={false}
      maskClosable={false}
      open={visible}
    >
      <div style={{ textAlign: "center", padding: "24px 0" }}>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        <p style={{ marginTop: "16px" }}>Redirecting you to the payment gateway...</p>
      </div>
    </Modal>
  );
};

export default PaymentProcessingModal;
