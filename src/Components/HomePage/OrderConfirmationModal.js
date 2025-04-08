import React, { useState, useEffect } from "react";
import { Modal, Typography, Button, Space, Spin, message } from "antd";
import { HomeOutlined, LoadingOutlined } from '@ant-design/icons';
import { postRequest } from "../../Services/api";
import PaymentProcessingModal from "./PaymentProcessingModal";
import { useDispatch } from "react-redux";
import { fetchCart } from "../../app/features/cart/cartSlice"; 


const { Title, Text } = Typography;

const OrderConfirmationModal = ({
  orderId,
  visible,
  onClose,
}) => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentProcessingVisible, setPaymentProcessingVisible] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId || !visible) return;
      
      setLoading(true);
      try {
        const data = await postRequest("get-order-details", { order_id: orderId });
        setOrderDetails(data);
      } catch (error) {
        message.error("Failed to load order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
    dispatch(fetchCart());
  }, [orderId, visible]);

  const handleConfirmAndPay = async () => {
    setLoading(true);
    try {
      await postRequest("confirm-order", { order_id: orderId }); // Optional step
      onClose();
      setTimeout(() => setPaymentProcessingVisible(true), 300);
    } catch (error) {
      console.error("Failed to confirm order:", error);
      message.error("Failed to confirm order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!visible) {
      setPaymentProcessingVisible(false);
      setOrderDetails(null);
    }
  }, [visible]);

  return (
    <>
      <Modal
        title={<Title level={4}>Confirm Your Order</Title>}
        open={visible}
        onCancel={onClose}
        footer={[
          <Button key="back" onClick={onClose}>Cancel</Button>,
          <Button key="submit" type="primary" onClick={handleConfirmAndPay} loading={loading}>Confirm & Pay</Button>
        ]}
      >
        {loading || !orderDetails ? (
          <div style={{ textAlign: "center" }}>
            <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
            <p>Loading Order...</p>
          </div>
        ) : (
          <>
            <Title level={5}>Order Number: {orderDetails.order_number}</Title>

            <Title level={5}>Items</Title>
            <ul style={{ paddingLeft: "20px" }}>
              {orderDetails.items.map((item, index) => (
                <li key={index}>
                  <Text>
                    {item.product_name} × {item.quantity} — ₹{item.price_at_purchase} each<br />
                    <Text type="secondary">Subtotal: ₹{item.subtotal}</Text>
                  </Text>
                </li>
              ))}
            </ul>

            <Title level={5} style={{ marginTop: 20 }}>Shipping Address</Title>
            <div style={{ marginBottom: "8px" }}>
              <Space align="start">
                <HomeOutlined />
                <Text>{orderDetails.shipping_address}</Text>
              </Space>
            </div>

            <div style={{ marginTop: 12 }}>
              <Text>Shipping & Handling: ₹{orderDetails.shipping_handling_charge}</Text><br />
              <Text strong>Total Payable: ₹{orderDetails.total_amount}</Text>
            </div>

            {orderDetails.order_notes && (
              <div style={{ marginTop: 20 }}>
                <Title level={5}>Order Notes</Title>
                <Text>{orderDetails.order_notes}</Text>
              </div>
            )}
          </>
        )}
      </Modal>

      <PaymentProcessingModal visible={paymentProcessingVisible} />
    </>
  );
};

export default OrderConfirmationModal;
