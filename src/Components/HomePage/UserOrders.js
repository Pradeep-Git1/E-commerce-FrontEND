import React, { useState, useEffect } from "react";
import { Card, Typography, Tag, Row, Col, Divider, List, Collapse } from "antd";
import { getRequest } from "../../Services/api";
import { useSelector } from "react-redux";
import {
  ShoppingOutlined,
  CreditCardOutlined,
  CalendarOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;
const { Panel } = Collapse;

function UserOrdersMobile() {
  const [orders, setOrders] = useState([]);
  const [expandedOrders, setExpandedOrders] = useState([]);
  const user = useSelector((state) => state.user.data);
  const userId = user?.id;

  useEffect(() => {
    if (userId) {
      fetchUserOrders(userId);
    }
  }, [userId]);

  const fetchUserOrders = async (userId) => {
    try {
      const response = await getRequest(`/orders/?user=${userId}`);
      setOrders(response);
    } catch (error) {
      console.error("Error fetching orders:", error);
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

  const toggleOrderExpansion = (orderId) => {
    if (expandedOrders.includes(orderId)) {
      setExpandedOrders(expandedOrders.filter((id) => id !== orderId));
    } else {
      setExpandedOrders([...expandedOrders, orderId]);
    }
  };

  const renderOrderCards = () => {
    return (
      <List
        itemLayout="vertical"
        dataSource={orders}
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
              }}
            >
              <div onClick={() => toggleOrderExpansion(order.id)}>
                <Row justify="space-between" align="middle">
                  <Col>
                    <Title level={5} style={{ margin: 0, fontSize: "14px" }}>
                      <ShoppingOutlined style={{ marginRight: 6 }} /> #
                      {order.order_number}
                    </Title>
                  </Col>
                  <Col>
                    <Text type="secondary" style={{ fontSize: "11px" }}>
                      <CalendarOutlined /> {formatDate(order.created_at)}
                    </Text>
                  </Col>
                </Row>

                <Divider style={{ margin: "8px 0", background: "#e8e8e8" }} />

                <Row justify="space-between" align="middle">
                  <Col>
                    <Text strong style={{ fontSize: "13px" }}>
                      <DollarCircleOutlined style={{ marginRight: 2 }} />{" "}
                      {order.total_amount}
                    </Text>
                  </Col>
                  <Col>
                    <Tag
                      color={getStatusColor(order.status)}
                      style={{ fontSize: "11px" }}
                    >
                      {order.status}
                    </Tag>
                    <Text style={{ fontSize: "11px" }}>
                      <CreditCardOutlined /> {order.payment_method}
                    </Text>
                  </Col>
                </Row>
              </div>

              <Collapse
                activeKey={expandedOrders.includes(order.id) ? ["1"] : []}
                ghost
              >
                <div
                  style={{
                    transition:
                      "max-height 0.3s ease-in-out, opacity 0.2s ease-in-out",
                    overflow: "hidden",
                    maxHeight: expandedOrders.includes(order.id) ? "500px" : "0",
                    opacity: expandedOrders.includes(order.id) ? "1" : "0",
                  }}
                >
                  <Divider style={{ margin: "8px 0", background: "#e8e8e8" }} />
                  {order.items.map((item) => (
                    <Row
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
                </div>
              </Collapse>
            </Card>
          </List.Item>
        )}
      />
    );
  };

  return (
    <div style={{ padding: "8px" }}>
      <Title level={4} style={{ fontSize: "16px", marginBottom: 10 }}>
        My Orders
      </Title>
      {orders.length > 0 ? (
        renderOrderCards()
      ) : (
        <Text type="secondary" style={{ fontSize: "12px" }}>
          No orders yet.
        </Text>
      )}
    </div>
  );
}

export default UserOrdersMobile;