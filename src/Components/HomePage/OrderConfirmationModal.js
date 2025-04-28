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
    RightOutlined, // Import RightOutlined for arrows
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

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!orderId || !visible) return;

            setLoading(true);
            try {
                const data = await postRequest("get-order-details", {
                    order_id: orderId,
                });
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
        }
    }, [visible]);

    const renderETD = () => {
        if (orderDetails?.shipped_at && orderDetails?.etd) {
            const shippedDate = dayjs(orderDetails.shipped_at);
            const deliveryDate = shippedDate.add(orderDetails.etd, "day");
            return (
                <Space align="center" style={{ marginTop: 8 }}>
                    <CalendarOutlined />
                    <Text className="responsive-text">
                        Est. Delivery: {deliveryDate.format("Do MMMM")}
                    </Text>
                </Space>
            );
        } else if (orderDetails?.status === "Pending" && orderDetails?.etd) {
            const deliveryDate = dayjs().add(orderDetails.etd, "day");
            return (
                <Space align="center" style={{ marginTop: 8 }}>
                    <CalendarOutlined />
                    <Text className="responsive-text">
                        Est. Delivery: {deliveryDate.format("Do MMMM")}
                    </Text>
                    <Text type="secondary" className="responsive-secondary-text">
                        (if confirmed now)
                    </Text>
                </Space>
            );
        } else if (
            orderDetails?.delivery_within_days !== null &&
            orderDetails.status !== "Pending" &&
            !orderDetails.etd
        ) {
            return (
                <Space align="center" style={{ marginTop: 8 }}>
                    <CalendarOutlined />
                    <Text className="responsive-text">
                        Est. Delivery Within: {orderDetails.delivery_within_days} day(s)
                    </Text>
                </Space>
            );
        } else if (orderDetails?.shipped_at && orderDetails.status !== "Pending") {
            return (
                <Space align="center" style={{ marginTop: 8 }}>
                    <CalendarOutlined />
                    <Text className="responsive-text">
                        Shipped On:{" "}
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
                        <Text className="responsive-text">
                            Company: {orderDetails.shipping_company}
                        </Text>
                    )}
                    {orderDetails.shipping_id && (
                        <>
                            {orderDetails.shipping_company && (
                                <Text className="responsive-text">, </Text>
                            )}
                            <Text className="responsive-text">
                                ID: {orderDetails.shipping_id}
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
                        <Title level={5} className="responsive-title">
                            Delivery Updates
                        </Title>
                        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                            {updates.map((update, index) => (
                                <React.Fragment key={index}>
                                    <Text className="responsive-secondary-text delivery-update-text">
                                        {update.trim()}
                                    </Text>
                                    {index < updates.length - 1 && (
                                        <RightOutlined style={{ margin: '0 4px', fontSize: '0.7em', color: 'rgba(0, 0, 0, 0.45)' }} />
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
                    <Title level={4} className="responsive-modal-title">
                        Order Details
                    </Title>
                }
                open={visible}
                onCancel={onClose}
                footer={[
                    <Button key="back" onClick={onClose} className="responsive-button">
                        Close
                    </Button>,
                    orderDetails?.payment_status === "Pending" && (
                        <Button
                            key="pay"
                            type="primary"
                            onClick={handleProceedToPayment}
                            loading={loading}
                            className="responsive-button"
                        >
                            Proceed to Payment
                        </Button>
                    ),
                    orderDetails?.payment_status === "Completed" && (
                        <Button
                            key="invoice"
                            icon={<FilePdfOutlined />}
                            onClick={() => console.log("View Invoice")}
                            className="responsive-button"
                        >
                            View Invoice
                        </Button>
                    ),
                ].filter(Boolean)}
                width="90%"
                style={{ maxWidth: "700px" }}
                bodyStyle={{ padding: "20px" }}
            >
                {loading || !orderDetails ? (
                    <div style={{ textAlign: "center", padding: "30px 0" }}>
                        <Spin
                            indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
                        />
                        <p style={{ marginTop: 10 }} className="responsive-text">
                            Loading Order Details...
                        </p>
                    </div>
                ) : (
                    <div style={{ lineHeight: 1.5 }}>
                        <Row gutter={16} style={{ marginBottom: 12 }}>
                            <Col span={8}>
                                <Text strong className="responsive-text">
                                    #
                                </Text>
                                <Text className="responsive-text">
                                    {orderDetails.order_number}
                                </Text>
                            </Col>
                            <Col span={8}>{getStatusTag(orderDetails.status)}</Col>
                            <Col span={8}>
                                {getPaymentStatusTag(orderDetails.payment_status)}
                                {orderDetails.payment_method && (
                                    <Text type="secondary" className="responsive-secondary-text">
                                        {" "}
                                        ({orderDetails.payment_method})
                                    </Text>
                                )}
                            </Col>
                        </Row>

                        <Divider style={{ margin: "16px 0" }} />

                        <Title level={5} className="responsive-title">
                            Shipping To
                        </Title>
                        <Space align="start" style={{ marginBottom: 12 }}>
                            <HomeOutlined />
                            <Text className="responsive-text">
                                {orderDetails.shipping_address || "Not provided"}
                            </Text>
                        </Space>

                        {(orderDetails.shipping_company || orderDetails.shipping_id || orderDetails.shipped_at) && (
                            <>
                                <Title level={5} className="responsive-title">
                                    Shipping Info
                                </Title>
                                <Space direction="vertical" style={{ marginBottom: 12 }}>
                                    <Space align="center">
                                        <TruckOutlined />
                                        {renderShippingInformationConcise()}
                                    </Space>
                                    {orderDetails.shipped_at && (
                                        <Space align="center">
                                            <CalendarOutlined />
                                            <Text className="responsive-text">
                                                Shipped On:{" "}
                                                {dayjs(orderDetails.shipped_at).format("Do MMMM, h:mm A")}
                                            </Text>
                                        </Space>
                                    )}
                                    <Space align="end" style={{ textAlign: "right", maxWidth: "100%" }}>
                                        {renderETD()}
                                    </Space>
                                    <Space align="end" style={{ textAlign: "right", maxWidth: "100%" }}>
                                        {renderDeliveryUpdates()}
                                    </Space>


                                </Space>
                            </>
                        )}



                        <Title level={5} className="responsive-title">
                            Order Items
                        </Title>
                        {orderDetails.items &&
                            orderDetails.items.map((item) => (
                                <Row key={item.id} gutter={16} style={{ marginBottom: 8 }} align="middle">
                                    <Col span={10}>
                                        <Text className="responsive-text">
                                            {item.product_name}{" "}
                                        </Text>
                                    </Col>
                                    <Col span={7} className="text-end">
                                        <Text className="responsive-text">
                                            ₹{parseFloat(item.price_at_purchase).toFixed(2)} x{" "}
                                            {item.quantity}
                                        </Text>
                                    </Col>{" "}
                                    {/* Subtotal Alignment */}
                                    <Col span={7} style={{ textAlign: 'right' }}>
                                        <Text strong className="responsive-text">
                                            ₹{parseFloat(item.subtotal).toFixed(2)}
                                        </Text>
                                    </Col>
                                </Row>
                            ))}
                        {orderDetails.items && orderDetails.items.length > 0 && (
                            <Divider style={{ margin: "12px 0" }} />
                        )}

                        <div style={{ marginBottom: 12 }}>
                            <Row justify="space-between">
                                <Col>
                                    <Text strong className="responsive-text">
                                        Shipping & Handling:
                                    </Text>
                                </Col>
                                <Col>
                                    <Text className="responsive-text">
                                        ₹
                                        {parseFloat(orderDetails.shipping_handling_charge).toFixed(
                                            2
                                        )}
                                    </Text>
                                </Col>
                            </Row>
                            <Row justify="space-between" style={{ marginTop: 8 }}>
                                <Col>
                                    <Text strong className="responsive-text">
                                        Total:
                                    </Text>
                                </Col>
                                <Col>
                                    <Title
                                        level={5}
                                        style={{ margin: 0, textAlign: "right" }}
                                        className="responsive-total"
                                    >
                                        ₹{parseFloat(orderDetails.total_amount).toFixed(2)}
                                    </Title>
                                </Col>
                            </Row>
                        </div>

                        {orderDetails.order_notes && (
                            <div style={{ marginTop: 16 }}>
                                <Divider style={{ marginBottom: 8 }} />
                                <Title level={5} className="responsive-title">
                                    Notes
                                </Title>
                                <Text type="secondary" className="responsive-secondary-text">
                                    {orderDetails.order_notes}
                                </Text>
                            </div>
                        )}

                        {orderDetails.status === "Cancelled" &&
                            orderDetails.order_notes && (
                                <div style={{ marginTop: 16 }}>
                                    <Divider style={{ marginBottom: 8 }} />
                                    <Title level={5} className="responsive-title">
                                        Cancellation Reason
                                    </Title>
                                    <Text type="secondary" className="responsive-secondary-text">
                                        {orderDetails.order_notes}
                                    </Text>
                                </div>
                            )}
                    </div>
                )}
            </Modal>

            <PaymentProcessingModal visible={paymentProcessingVisible} />

            {/* Global styles for responsiveness */}
            <style type="text/css">
                {`
                    .responsive-modal-title {
                        font-size: 1.1em;
                    }
                    .responsive-title {
                        font-size: 0.95em;
                        margin-bottom: 6px;
                    }
                    .responsive-text {
                        font-size: 0.85em;
                    }
                    .responsive-secondary-text {
                        font-size: 0.75em;
                        color: rgba(0, 0, 0, 0.45); /* Muted color */
                    }
                    .responsive-total {
                        font-size: 1em;
                        margin-top: 0;
                        text-align: right;
                    }
                    .responsive-button {
                        font-size: 0.85em;
                        padding: 6px 12px;
                    }
                    .text-end {
                        text-align: right;
                    }
                    .delivery-update-text {
                        font-size: 0.8em; /* Slightly smaller font size */
                        color: rgba(0, 0, 0, 0.45); /* Muted color */
                    }

                    /* Media query for smaller screens */
                    @media (max-width: 768px) {
                        .responsive-modal-title {
                            font-size: 1em;
                        }
                        .responsive-title {
                            font-size: 0.9em;
                        }
                        .responsive-text {
                            font-size: 0.8em;
                        }
                        .responsive-secondary-text {
                            font-size: 0.7em;
                        }
                        .responsive-total {
                            font-size: 0.95em;
                        }
                        .responsive-button {
                            font-size: 0.8em;
                            padding: 5px 10px;
                        }
                        .delivery-update-text {
                            font-size: 0.75em;
                        }
                    }

                    /* Media query for even smaller screens */
                    @media (max-width: 576px) {
                        .responsive-modal-title {
                            font-size: 0.95em;
                        }
                        .responsive-title {
                            font-size: 0.85em;
                        }
                        .responsive-text {
                            font-size: 0.75em;
                        }
                        .responsive-secondary-text {
                            font-size: 0.65em;
                        }
                        .responsive-total {
                            font-size: 0.9em;
                        }
                        .responsive-button {
                            font-size: 0.75em;
                            padding: 4px 8px;
                        }
                        .delivery-update-text {
                            font-size: 0.7em;
                        }
                    }
                `}
            </style>
        </>
    );
};

export default OrderConfirmationModal;