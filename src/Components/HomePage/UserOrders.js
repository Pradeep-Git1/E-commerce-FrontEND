import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Tag,
  Row,
  Col,
  Divider,
  List,
  Collapse,
  Button,
  Modal,
  message,
} from "antd";
import { getRequest, postRequest } from "../../Services/api";
import { useSelector } from "react-redux";
import {
  ShoppingOutlined,
  CreditCardOutlined,
  CalendarOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";
import OrderConfirmationModal from "./OrderConfirmationModal";

const { Text, Title } = Typography;
const { Panel } = Collapse;

function UserOrdersMobile() {
  const [orders, setOrders] = useState([]);
  const [expandedOrders, setExpandedOrders] = useState([]);
  const [expandedStatusGroups, setExpandedStatusGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user.data);
  const userId = user?.id;
  const [orderConfirmationVisible, setOrderConfirmationVisible] =
    useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [cancelOrderId, setCancelOrderId] = useState(null);
  const [confirmCancelVisible, setConfirmCancelVisible] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUserOrders(userId);
    }
  }, [userId]);

  const fetchUserOrders = async (userId) => {
    try {
      setLoading(true);
      const response = await getRequest(`/orders/?user=${userId}`);
      setOrders(response);
      setExpandedOrders(response.map((o) => o.id));
      setExpandedStatusGroups([]);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const groupOrdersByStatus = (orders) => {
    return orders.reduce((groups, order) => {
      const paymentStatus = order.payment_status || "Payment Unknown";
      const displayStatus =
        paymentStatus === "Completed" ? "Paid Orders" : "Pending Payment";
      if (!groups[displayStatus]) groups[displayStatus] = [];
      groups[displayStatus].push(order);
      return groups;
    }, {});
  };
  const toggleOrderExpansion = (orderId) => {
    if (expandedOrders.includes(orderId)) {
      setExpandedOrders(expandedOrders.filter((id) => id !== orderId));
    } else {
      setExpandedOrders([...expandedOrders, orderId]);
    }
  };

  const toggleStatusGroup = (status) => {
    if (expandedStatusGroups.includes(status)) {
      setExpandedStatusGroups(expandedStatusGroups.filter((s) => s !== status));
    } else {
      setExpandedStatusGroups([...expandedStatusGroups, status]);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const options = { year: "2-digit", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-IN", options);
  };

  const getStatusColor = (status) => {
    if (status === "Completed") return "#52c41a";
    if (status === "Pending") return "#faad14";
    if (status === "Processing") return "#1890ff";
    if (status === "Delivered") return "#27ae60";
    return "#f5222d";
  };

  const handleOrderClick = (orderId) => {
    setSelectedOrderId(orderId);
    setOrderConfirmationVisible(true);
  };

  const handleCloseOrderConfirmationModal = () => {
    setOrderConfirmationVisible(false);
    setSelectedOrderId(null);
  };

  const handleConfirmCancel = async () => {
    if (!cancelOrderId) {
      return;
    }

    setIsCancelling(true);
    try {
      const response = await postRequest(`cancel-order/${cancelOrderId}/`, {
        order_id: cancelOrderId,
      });
      if (response.success) {
        message.success(`Order #${cancelOrderId} has been cancelled.`);
        fetchUserOrders(userId);
      } else {
        message.error(
          `Failed to cancel order #${cancelOrderId}. Please try again.`
        );
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      message.error(
        `Failed to cancel order #${cancelOrderId}. Please try again.`
      );
    } finally {
      setIsCancelling(false);
      setConfirmCancelVisible(false);
      setCancelOrderId(null);
    }
  };

  const renderOrdersGroupedByStatus = () => {
    const grouped = groupOrdersByStatus(orders);
    return Object.entries(grouped).map(([displayStatus, statusOrders]) => (
      <div key={displayStatus} style={{ marginBottom: 16 }}>
        <div
          onClick={() => toggleStatusGroup(displayStatus)}
          style={{
            background: "#f0f0f0",
            padding: "6px 12px",
            borderRadius: "6px",
            marginBottom: 8,
            cursor: "pointer",
          }}
        >
          <Tag
            color={displayStatus === "Paid Orders" ? "#87d068" : "#faad14"}
            style={{ fontSize: 12 }}
          >
            {displayStatus}
          </Tag>{" "}
          <Text type="secondary" style={{ fontSize: 12 }}>
            ({statusOrders.length} orders)
          </Text>
        </div>

        {expandedStatusGroups.includes(displayStatus) && (
          <List
            itemLayout="vertical"
            dataSource={statusOrders}
            renderItem={(order) => (
              <List.Item>
                <Card
                  size="small"
                  bordered
                  style={{
                    borderRadius: "8px",
                    background: "#f9f9f9",
                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                    margin: "8px 0",
                    cursor: "pointer",
                  }}
                >
                  <div onClick={() => handleOrderClick(order.id)}>
                    <Row justify="space-between" align="middle">
                      <Col>
                        <Title
                          level={5}
                          style={{ margin: 0, fontSize: "14px" }}
                        >
                          <ShoppingOutlined style={{ marginRight: 6 }} /> #
                          {order.order_number}
                        </Title>
                        <Tag
                          color={getStatusColor(order.status)}
                          style={{ marginTop: 4, fontSize: "11px" }}
                        >
                          {order.status}
                        </Tag>
                      </Col>
                      <Col>
                        <Text type="secondary" style={{ fontSize: "11px" }}>
                          <CalendarOutlined /> {formatDate(order.created_at)}
                        </Text>
                      </Col>
                    </Row>

                    <Divider
                      style={{ margin: "8px 0", background: "#e8e8e8" }}
                    />

                    <Row justify="space-between" align="middle">
                      <Col>
                        <Text strong style={{ fontSize: "13px" }}>
                          <DollarCircleOutlined style={{ marginRight: 2 }} />
                          {order.total_amount}
                        </Text>
                      </Col>
                      <Col>
                        <Text style={{ fontSize: "11px" }}>
                          <CreditCardOutlined /> {order.payment_method}
                        </Text>
                      </Col>
                    </Row>

                    {order.shipping_address && (
                      <>
                        <Divider
                          style={{ margin: "8px 0", background: "#e8e8e8" }}
                        />
                        <Typography.Text
                          type="secondary"
                          style={{
                            fontSize: "11px",
                            display: "block",
                            marginBottom: 4,
                          }}
                        >
                          Shipping To:
                        </Typography.Text>
                        <Typography.Text style={{ fontSize: "12px" }}>
                          {order.shipping_address}
                        </Typography.Text>
                      </>
                    )}
                  </div>

                  <Collapse
                    activeKey={expandedOrders.includes(order.id) ? ["1"] : []}
                    ghost
                  >
                    <Panel key="1" showArrow={false}>
                      {order.items.map((item) => (
                        <Row
                          onClick={() => handleOrderClick(order.id)}
                          key={item.id}
                          justify="space-between"
                          style={{ marginBottom: 6 }}
                        >
                          <Col span={14}>
                            <Text style={{ fontSize: "12px" }}>
                              {item.product_name} x {item.quantity}
                            </Text>
                          </Col>
                          <Col span={10} style={{ textAlign: "right" }}>
                            <Text type="secondary" style={{ fontSize: "11px" }}>
                              ₹{item.subtotal}
                            </Text>
                          </Col>
                        </Row>
                      ))}
                      {order.status === "Pending" && (
                        <div style={{ marginTop: 12, textAlign: "right" }}>
                          <Button
                            type="default"
                            size="small"
                            icon={<ShoppingOutlined rotate={180} />}
                            onClick={() => {
                              setCancelOrderId(order.id);
                              setConfirmCancelVisible(true);
                            }}
                            style={{ borderColor: "red", color: "red" }}
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </Panel>
                  </Collapse>
                </Card>
              </List.Item>
            )}
          />
        )}
      </div>
    ));
  };
  return (
    <div style={{ padding: "8px" }}>
      <Title level={4} style={{ fontSize: "16px", marginBottom: 10 }}>
        My Orders
      </Title>
      {loading ? (
        <Text type="secondary" style={{ fontSize: 12 }}>
          Loading...
        </Text>
      ) : orders.length > 0 ? (
        <>
          {renderOrdersGroupedByStatus()}
          <OrderConfirmationModal
            visible={orderConfirmationVisible}
            orderId={selectedOrderId}
            onClose={handleCloseOrderConfirmationModal}
          />
          <Modal
            title="Confirm Cancellation"
            visible={confirmCancelVisible}
            onCancel={() => setConfirmCancelVisible(false)}
            footer={[
              <Button key="back" onClick={() => setConfirmCancelVisible(false)}>
                No
              </Button>,
              <Button
                key="submit"
                type="danger"
                loading={isCancelling}
                onClick={handleConfirmCancel}
              >
                Yes, Cancel Order
              </Button>,
            ]}
          >
            <Typography.Paragraph>
              Are you sure you want to cancel order #{cancelOrderId}? This
              action cannot be undone.
            </Typography.Paragraph>
          </Modal>
        </>
      ) : (
        <Text type="secondary" style={{ fontSize: "12px" }}>
          No orders yet.
        </Text>
      )}
    </div>
  );
}

export default UserOrdersMobile;