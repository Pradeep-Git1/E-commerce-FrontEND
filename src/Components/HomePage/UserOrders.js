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
} from "antd";
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
  const [expandedStatusGroups, setExpandedStatusGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user.data);
  const userId = user?.id;

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
      setExpandedOrders(response.map((o) => o.id)); // expand all orders
      setExpandedStatusGroups([]); // collapse all groups initially
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const groupOrdersByStatus = (orders) => {
    return orders.reduce((groups, order) => {
      const status = order.status || "Unknown";
      if (!groups[status]) groups[status] = [];
      groups[status].push(order);
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

  const renderOrdersGroupedByStatus = () => {
    const grouped = groupOrdersByStatus(orders);
    return Object.entries(grouped).map(([status, statusOrders]) => (
      <div key={status} style={{ marginBottom: 16 }}>
        <div
          onClick={() => toggleStatusGroup(status)}
          style={{
            background: "#f0f0f0",
            padding: "6px 12px",
            borderRadius: "6px",
            marginBottom: 8,
            cursor: "pointer",
          }}
        >
          <Tag color={getStatusColor(status)} style={{ fontSize: 12 }}>
            {status}
          </Tag>{" "}
          <Text type="secondary" style={{ fontSize: 12 }}>
            ({statusOrders.length} orders)
          </Text>
        </div>

        {expandedStatusGroups.includes(status) && (
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
                    <Panel key="1" showArrow={false}>
                      {order.items.map((item) => (
                        <Row key={item.id} justify="space-between" style={{ marginBottom: 6 }}>
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
        renderOrdersGroupedByStatus()
      ) : (
        <Text type="secondary" style={{ fontSize: "12px" }}>
          No orders yet.
        </Text>
      )}
    </div>
  );
}

export default UserOrdersMobile;
