import React, { useState, useEffect } from "react";
import {
  Modal,
  Typography,
  Button,
  Space,
  Spin,
  message,
  Tag,
  Divider,
  Row,
  Col,
  Card,
  Statistic,
} from "antd";
import {
  HomeOutlined,
  LoadingOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  TruckOutlined,
  CalendarOutlined,
  FilePdfOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { postRequest } from "../../Services/api";
import PaymentProcessingModal from "./PaymentProcessingModal";
import { useDispatch } from "react-redux";
import { fetchCart } from "../../app/features/cart/cartSlice";
import dayjs from "dayjs";
import "dayjs/locale/en";
import advancedFormat from "dayjs/plugin/advancedFormat";
dayjs.extend(advancedFormat);
dayjs.locale("en");

const { Title, Text } = Typography;

const OrderConfirmationModal = ({ orderId, visible, onClose }) => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentProcessingVisible, setPaymentProcessingVisible] =
    useState(false);
  const dispatch = useDispatch();
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [feedbackType, setFeedbackType] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId || !visible) return;

      setLoading(true);
      try {
        const data = await postRequest("get-order-details", {
          order_id: orderId,
        });
        setOrderDetails(data);
        setFeedbackMessage(null);
        setFeedbackType(null);
      } catch (error) {
        message.error("Failed to load order details.");
        setFeedbackMessage("Failed to load order details.");
        setFeedbackType("error");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
    dispatch(fetchCart());
  }, [orderId, visible, dispatch]);

  const handleProceedToPayment = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onClose();
      setTimeout(() => setPaymentProcessingVisible(true), 300);
      setFeedbackMessage("Proceeding to payment...");
      setFeedbackType("success");
    } catch (error) {
      console.error("Failed to proceed to payment:", error);
      message.error("Failed to proceed to payment. Please try again.");
      setFeedbackMessage("Failed to proceed to payment. Please try again.");
      setFeedbackType("error");
    } finally {
      setLoading(false);
    }
  };

  const getStatusTag = (status) => {
    switch (status) {
      case "Pending":
        return (
          <Tag icon={<ClockCircleOutlined />} color="warning">
            Pending
          </Tag>
        );
      case "Processing":
        return (
          <Tag icon={<LoadingOutlined />} color="processing">
            Processing
          </Tag>
        );
      case "Shipped":
        return (
          <Tag icon={<TruckOutlined />} color="processing">
            Shipped
          </Tag>
        );
      case "Delivered":
        return (
          <Tag icon={<CheckCircleOutlined />} color="success">
            Delivered
          </Tag>
        );
      case "Completed":
        return (
          <Tag icon={<CheckCircleOutlined />} color="success">
            Completed
          </Tag>
        );
      case "Cancelled":
        return (
          <Tag icon={<CloseCircleOutlined />} color="error">
            Cancelled
          </Tag>
        );
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const getPaymentStatusTag = (paymentStatus) => {
    switch (paymentStatus) {
      case "Pending":
        return (
          <Tag icon={<ClockCircleOutlined />} color="warning">
            Payment Pending
          </Tag>
        );
      case "Completed":
        return (
          <Tag icon={<CreditCardOutlined />} color="success">
            Paid
          </Tag>
        );
      case "Refunded":
        return (
          <Tag icon={<CheckCircleOutlined />} color="default">
            Refunded
          </Tag>
        );
      default:
        return <Tag>{paymentStatus}</Tag>;
    }
  };

  useEffect(() => {
    if (!visible) {
      setPaymentProcessingVisible(false);
      setOrderDetails(null);
      setFeedbackMessage(null);
      setFeedbackType(null);
    }
  }, [visible]);

  const renderETD = () => {
    if (orderDetails?.shipped_at && orderDetails?.etd) {
      const shippedDate = dayjs(orderDetails.shipped_at);
      const deliveryDate = shippedDate.add(orderDetails.etd, "day");
      return (
        <Space align="center">
          <CalendarOutlined />
          <Text strong>Est. Delivery:</Text>
          <Text>{deliveryDate.format("Do MMMM")}</Text>
        </Space>
      );
    } else if (orderDetails?.status === "Pending" && orderDetails?.etd) {
      const deliveryDate = dayjs().add(orderDetails.etd, "day");
      return (
        <Space align="center">
          <CalendarOutlined />
          <Text strong>Est. Delivery:</Text>
          <Text>{deliveryDate.format("Do MMMM")}</Text>
          <Text type="secondary">(if confirmed now)</Text>
        </Space>
      );
    } else if (
      orderDetails?.delivery_within_days !== null &&
      orderDetails.status !== "Pending" &&
      !orderDetails.etd
    ) {
      return (
        <Space align="center">
          <CalendarOutlined />
          <Text strong>Est. Delivery Within:</Text>
          <Text>{orderDetails.delivery_within_days} day(s)</Text>
        </Space>
      );
    } else if (orderDetails?.shipped_at && orderDetails.status !== "Pending") {
      return (
        <Space align="center">
          <CalendarOutlined />
          <Text strong>Shipped On:</Text>
          <Text>
            {dayjs(orderDetails.shipped_at).format("Do MMMM, h:mm A")}
          </Text>
        </Space>
      );
    }
    return null;
  };

  const renderShippingInformationConcise = () => {
    const hasShippingInfo =
      orderDetails?.shipping_company || orderDetails?.shipping_id;
    if (hasShippingInfo) {
      return (
        <Space size="small" align="center">
          {orderDetails.shipping_company && (
            <Text>
              Company: <Text strong>{orderDetails.shipping_company}</Text>
            </Text>
          )}
          {orderDetails.shipping_id && (
            <>
              {orderDetails.shipping_company && <Text>, </Text>}
              <Text>
                ID: <Text strong>{orderDetails.shipping_id}</Text>
              </Text>
            </>
          )}
        </Space>
      );
    }
    return null;
  };

  const renderDeliveryUpdates = () => {
    if (orderDetails?.delivery_update) {
      const updates = orderDetails.delivery_update
        .split("\n")
        .filter((update) => update.trim() !== "");
      if (updates.length > 0) {
        return (
          <div style={{ marginTop: 16 }}>
            <Divider style={{ marginBottom: 8 }} />
            <Title level={5} style={{ color: "#52c41a" }}>
              Delivery Updates
            </Title>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {updates.map((update, index) => (
                <React.Fragment key={index}>
                  <Text style={{ color: "#1890ff", fontSize: "0.9em" }}>
                    {update.trim()}
                  </Text>
                  {index < updates.length - 1 && (
                    <RightOutlined
                      style={{
                        margin: "0 8px",
                        fontSize: "0.8em",
                        color: "#bfbfbf",
                      }}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <>
      <Modal
        title={
          <Title level={3} style={{ color: "#1890ff", marginBottom: 0 }}>
            Order Details
          </Title>
        }
        open={visible}
        onCancel={onClose}
        footer={[
          <Button key="back" onClick={onClose} style={{ fontWeight: 600 }}>
            Close
          </Button>,
          orderDetails?.payment_status === "Pending" && (
            <Button
              key="pay"
              type="primary"
              onClick={handleProceedToPayment}
              loading={loading}
              style={{ fontWeight: 600 }}
            >
              Proceed to Payment
            </Button>
          ),
          orderDetails?.payment_status === "Completed" && (
            <Button
              key="invoice"
              icon={<FilePdfOutlined />}
              onClick={() => console.log("View Invoice")}
              style={{ fontWeight: 600 }}
            >
              View Invoice
            </Button>
          ),
        ].filter(Boolean)}
        width="90%"
        style={{ maxWidth: "700px" }}
        bodyStyle={{ padding: "24px" }}
      >
        {feedbackMessage && (
          <div
            style={{
              marginBottom: 16,
              padding: 12,
              borderRadius: 4,
              backgroundColor:
                feedbackType === "success"
                  ? "#f6ffed"
                  : feedbackType === "error"
                  ? "#fff2f0"
                  : "#e6f7ff",
              border: `1px solid ${
                feedbackType === "success"
                  ? "#b7eb8f"
                  : feedbackType === "error"
                  ? "#ffccc7"
                  : "#91d5ff"
              }`,
              color:
                feedbackType === "success"
                  ? "#389e0d"
                  : feedbackType === "error"
                  ? "#cf1322"
                  : "#177ddc",
              fontWeight: 500,
            }}
          >
            {feedbackMessage}
          </div>
        )}
        {loading || !orderDetails ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 32 }} spin />}
            />
            <p style={{ marginTop: 16, color: "#777" }}>
              Loading Order Details...
            </p>
          </div>
        ) : (
          <div style={{ lineHeight: 1.6 }}>
            
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <Title level={3}>#{orderDetails?.order_number}</Title>
              </Col>
              <Col span={12} style={{ textAlign: "right" }}>
                {getStatusTag(orderDetails.status)}
                <div style={{ marginTop: 4 }}>
                  {getPaymentStatusTag(orderDetails.payment_status)}
                  {orderDetails.payment_method && (
                    <Text type="secondary" style={{ marginLeft: 8 }}>
                      ({orderDetails.payment_method})
                    </Text>
                  )}
                </div>
              </Col>
            </Row>
            <Divider style={{ margin: "20px 0", borderColor: "#e0e0e0" }} />
            <Card
              title={
                <Title level={4} style={{ color: "#13c2c2", marginBottom: 12 }}>
                  Shipping Information
                </Title>
              }
              bordered={false}
            >
              <Space direction="vertical" size="middle">
                <Space align="center">
                  <HomeOutlined
                    style={{ fontSize: "1.1em", color: "#595959" }}
                  />
                  <Text strong style={{ color: "#262626" }}>
                    Ship To:
                  </Text>
                  <Text style={{ color: "#434343" }}>
                    {orderDetails.shipping_address || "Not provided"}
                  </Text>
                </Space>
                {(orderDetails.shipping_company ||
                  orderDetails.shipping_id ||
                  orderDetails.shipped_at) && (
                  <Space direction="vertical" size="small">
                    <Space align="center">
                      <TruckOutlined
                        style={{ fontSize: "1.1em", color: "#595959" }}
                      />
                      <Text strong style={{ color: "#262626" }}>
                        Shipping:
                      </Text>
                      {renderShippingInformationConcise()}
                    </Space>
                    {orderDetails.shipped_at && (
                      <Space align="center">
                        <CalendarOutlined
                          style={{ fontSize: "1.1em", color: "#595959" }}
                        />
                        <Text strong style={{ color: "#262626" }}>
                          Shipped On:
                        </Text>
                        <Text style={{ color: "#434343" }}>
                          {dayjs(orderDetails.shipped_at).format(
                            "Do MMMM, h:mm A"
                          )}
                        </Text>
                      </Space>
                    )}
                    {renderETD()}
                    {renderDeliveryUpdates()}
                  </Space>
                )}
              </Space>
            </Card>
            <Divider style={{ margin: "20px 0", borderColor: "#e0e0e0" }} />
            <Title level={4} style={{ color: "#eb2f96", marginBottom: 12 }}>
              Order Items
            </Title>
            {orderDetails.items &&
              orderDetails.items.map((item) => (
                <Row
                  key={item.id}
                  gutter={16}
                  style={{ marginBottom: 12 }}
                  align="middle"
                >
                  <Col span={12}>
                    <Text style={{ fontSize: "1em", color: "#262626" }}>
                      {item.product_name}
                    </Text>
                  </Col>
                  <Col span={6} style={{ textAlign: "right" }}>
                    <Text style={{ color: "#434343" }}>
                      ₹{parseFloat(item.price_at_purchase).toFixed(2)} x{" "}
                      {item.quantity}
                    </Text>
                  </Col>
                  <Col span={6} style={{ textAlign: "right" }}>
                    <Text strong style={{ fontSize: "1em", color: "#1890ff" }}>
                      ₹{parseFloat(item.subtotal).toFixed(2)}
                    </Text>
                  </Col>
                </Row>
              ))}
            {orderDetails.items && orderDetails.items.length > 0 && (
              <Divider style={{ margin: "16px 0", borderColor: "#e0e0e0" }} />
            )}
            <div style={{ marginBottom: 16 }}>
              <Row justify="space-between">
                <Col>
                  <Text strong style={{ fontSize: "1em", color: "#262626" }}>
                    Shipping & Handling:
                  </Text>
                </Col>
                <Col style={{ textAlign: "right" }}>
                  <Text style={{ color: "#434343" }}>
                    ₹
                    {parseFloat(orderDetails.shipping_handling_charge).toFixed(
                      2
                    )}
                  </Text>
                </Col>
              </Row>
              <Row justify="space-between" style={{ marginTop: 8 }}>
                <Col>
                  <Title level={5} style={{ margin: 0, color: "#262626" }}>
                    Total:
                  </Title>
                </Col>
                <Col style={{ textAlign: "right" }}>
                  <Title level={4} style={{ margin: 0, color: "#fa8c16" }}>
                    ₹{parseFloat(orderDetails.total_amount).toFixed(2)}
                  </Title>
                </Col>
              </Row>
            </div>
            {orderDetails.order_notes && (
              <div style={{ marginTop: 20 }}>
                <Divider style={{ marginBottom: 12, borderColor: "#e0e0e0" }} />
                <Title level={4} style={{ color: "#722ed1", marginBottom: 12 }}>
                  Notes
                </Title>
                <Text
                  type="secondary"
                  style={{ color: "#595959", fontSize: "0.9em" }}
                >
                  {orderDetails.order_notes}
                </Text>
              </div>
            )}
            {orderDetails.status === "Cancelled" &&
              orderDetails.order_notes && (
                <div style={{ marginTop: 20 }}>
                  <Divider
                    style={{ marginBottom: 12, borderColor: "#e0e0e0" }}
                  />
                  <Title
                    level={4}
                    style={{ color: "#f5222d", marginBottom: 12 }}
                  >
                    Cancellation Reason
                  </Title>
                  <Text
                    type="secondary"
                    style={{ color: "#595959", fontSize: "0.9em" }}
                  >
                    {orderDetails.order_notes}
                  </Text>
                </div>
              )}
          </div>
        )}
      </Modal>

      <PaymentProcessingModal visible={paymentProcessingVisible} />
    </>
  );
};

export default OrderConfirmationModal;
