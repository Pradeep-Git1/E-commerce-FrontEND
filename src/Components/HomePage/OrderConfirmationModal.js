import React, { useState, useEffect } from "react";
import { Modal, Typography, Button, Space, Spin, message, Tag, Divider, Table, Row, Col } from "antd";
import {
    HomeOutlined,
    LoadingOutlined,
    CreditCardOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    TruckOutlined,
    CalendarOutlined,
} from '@ant-design/icons';
import { postRequest } from "../../Services/api";
import PaymentProcessingModal from "./PaymentProcessingModal";
import { useDispatch } from "react-redux";
import { fetchCart } from "../../app/features/cart/cartSlice";
import dayjs from 'dayjs';
import 'dayjs/locale/en'; // Import the English locale (or your desired locale)
import advancedFormat from 'dayjs/plugin/advancedFormat'; // For formatting like "Do MMMM YYYY"
dayjs.extend(advancedFormat);
dayjs.locale('en');

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
    }, [orderId, visible, dispatch]);

    const handleProceedToPayment = async () => {
        setLoading(true);
        try {
            onClose();
            setTimeout(() => setPaymentProcessingVisible(true), 300);
        } catch (error) {
            console.error("Failed to proceed to payment:", error);
            message.error("Failed to proceed to payment. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const getStatusTag = (status) => {
        switch (status) {
            case "Pending":
                return <Tag icon={<ClockCircleOutlined />} color="warning">Pending</Tag>;
            case "Processing":
                return <Tag icon={<LoadingOutlined />} color="processing">Processing</Tag>;
            case "Completed":
                return <Tag icon={<CheckCircleOutlined />} color="success">Completed</Tag>;
            case "Delivered":
                return <Tag icon={<TruckOutlined />} color="success">Delivered</Tag>;
            case "Cancelled":
                return <Tag icon={<CloseCircleOutlined />} color="error">Cancelled</Tag>;
            default:
                return <Tag>{status}</Tag>;
        }
    };

    const getPaymentStatusTag = (paymentStatus) => {
        switch (paymentStatus) {
            case "Pending":
                return <Tag icon={<ClockCircleOutlined />} color="warning">Payment Pending</Tag>;
            case "Completed":
                return <Tag icon={<CreditCardOutlined />} color="success">Paid</Tag>;
            case "Refunded":
                return <Tag icon={<CheckCircleOutlined />} color="default">Refunded</Tag>;
            default:
                return <Tag>{paymentStatus}</Tag>;
        }
    };

    useEffect(() => {
        if (!visible) {
            setPaymentProcessingVisible(false);
            setOrderDetails(null);
        }
    }, [visible]);

    const itemColumns = [
        {
            title: 'Product',
            dataIndex: 'product_name',
            key: 'product_name',
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            align: 'center',
        },
        {
            title: 'Price',
            dataIndex: 'price_at_purchase',
            key: 'price_at_purchase',
            align: 'right',
            render: (price) => `₹${parseFloat(price).toFixed(2)}`,
        },
        {
            title: 'Subtotal',
            dataIndex: 'subtotal',
            key: 'subtotal',
            align: 'right',
            render: (subtotal) => <Text strong>₹{parseFloat(subtotal).toFixed(2)}</Text>,
        },
    ];

    const itemDataSource = orderDetails?.items.map(item => ({
        key: item.id,
        ...item,
        price_at_purchase: orderDetails?.payment_status === 'Completed' ? item.price_at_purchase : item.price_at_purchase,
    })) || [];

    const renderETD = () => {
        if (orderDetails?.status === 'Pending' && orderDetails?.etd) {
            const deliveryDate = dayjs().add(orderDetails.etd, 'day');
            return (
                <div style={{ marginTop: 16 }}>
                    <Divider style={{ marginBottom: 8 }} />
                    <Title level={6}>Estimated Delivery</Title>
                    <Space align="center">
                        <CalendarOutlined />
                        <Text>Approximately {deliveryDate.format('Do MMMM YYYY')}</Text>
                        <Text type="secondary">(if order is confirmed now)</Text>
                    </Space>
                </div>
            );
        }
        return null;
    };

    return (
        <>
            <Modal
                title={<Title level={4}>Order Details</Title>}
                open={visible}
                onCancel={onClose}
                footer={[
                    <Button key="back" onClick={onClose}>
                        Close
                    </Button>,
                    orderDetails?.payment_status === "Pending" && (
                        <Button
                            key="pay"
                            type="primary"
                            onClick={handleProceedToPayment}
                            loading={loading}
                        >
                            Proceed to Payment
                        </Button>
                    ),
                ].filter(Boolean)}
                width="90%"
                style={{ maxWidth: '500px' }}
            >
                {loading || !orderDetails ? (
                    <div style={{ textAlign: "center", padding: "30px 0" }}>
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                        <p style={{ marginTop: 10 }}>Loading Order Details...</p>
                    </div>
                ) : (
                    <div style={{ lineHeight: 1.5 }}>
                        <Row justify="space-between" align="middle" style={{ marginBottom: 12 }}>
                            <Col>
                                <Text strong>Order #</Text> <Text>{orderDetails.order_number}</Text>
                            </Col>
                            <Col>
                                {getStatusTag(orderDetails.status)}
                            </Col>
                        </Row>
                        <Row justify="space-between" align="middle" style={{ marginBottom: 12 }}>
                            <Col>
                                <Text strong>Payment:</Text>
                            </Col>
                            <Col>
                                {getPaymentStatusTag(orderDetails.payment_status)}
                            </Col>
                        </Row>

                        <Divider style={{ margin: "16px 0" }} />

                        <Title level={6}>Order Items</Title>
                        <Table
                            dataSource={itemDataSource}
                            columns={itemColumns}
                            pagination={false}
                            size="small"
                            bordered={true}
                            rowKey="key"
                            style={{ marginBottom: 16 }}
                            showHeader={true}
                        />

                        <div style={{ marginBottom: 16 }}>
                            <Row justify="space-between">
                                <Col>
                                    <Text strong>Shipping & Handling:</Text>
                                </Col>
                                <Col>
                                    <Text>₹{parseFloat(orderDetails.shipping_handling_charge).toFixed(2)}</Text>
                                </Col>
                            </Row>
                            <Row justify="space-between" style={{ marginTop: 8 }}>
                                <Col>
                                    <Text strong>Total:</Text>
                                </Col>
                                <Col>
                                    <Title level={5} style={{ margin: 0 }}>₹{parseFloat(orderDetails.total_amount).toFixed(2)}</Title>
                                </Col>
                            </Row>
                        </div>

                        <Divider style={{ margin: "16px 0" }} />

                        <Title level={6}>Shipping To</Title>
                        <Space align="start">
                            <HomeOutlined />
                            <Text>{orderDetails.shipping_address || 'Not provided'}</Text>
                        </Space>

                        {renderETD()}

                        {orderDetails.order_notes && (
                            <div style={{ marginTop: 16 }}>
                                <Divider style={{ marginBottom: 8 }} />
                                <Title level={6}>Notes</Title>
                                <Text type="secondary">{orderDetails.order_notes}</Text>
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