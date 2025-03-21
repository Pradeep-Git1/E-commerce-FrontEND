import React, { useState } from "react";
import { Modal, Carousel, Typography, Button, Space, Divider } from "antd";
import { ShoppingCartOutlined, PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from "../../app/features/cart/cartSlice";

const { Title, Paragraph, Text } = Typography;
const BASE_URL = "http://localhost:8000";

const ProductModal = ({ product, visible, onClose }) => {
    const [quantity, setQuantity] = useState(1);
    const [message, setMessage] = useState(null);
    const dispatch = useDispatch();
    const user = useSelector(state => state.user.data);

    const handleIncrement = () => {
        setQuantity(prev => prev + 1);
    };

    const handleDecrement = () => {
        setQuantity(prev => Math.max(1, prev - 1));
    };

    const handleAddToCart = () => {
        if (product) {
            dispatch(addToCart({ product, quantity }, { meta: { arg: { user: user } } }));
            setMessage("Added to cart!");
            setTimeout(() => {
                setMessage(null);
                onClose();
            }, 1500);
        }
    };

    if (!product) return null;

    const formatImageUrl = (img) => img.startsWith("http") ? img : `${BASE_URL}${img}`;

    return (
        <Modal
            visible={visible}
            onCancel={onClose}
            footer={null}
            centered
            width={600}
            bodyStyle={{ padding: 0 }} // Remove padding
        >
            <div style={{ boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)', borderRadius: 8, overflow: 'hidden' }}>
                <Carousel autoplay>
                    {product.images.length > 0 ? (
                        product.images.map((img, index) => (
                            <div key={index}>
                                <img
                                    src={formatImageUrl(img)}
                                    alt={product.name}
                                    style={{ width: "100%", height: 350, objectFit: "cover", borderRadius: 0 }} // No border radius here
                                />
                            </div>
                        ))
                    ) : (
                        <div>
                            <img
                                src={`${BASE_URL}/media/default-placeholder.png`}
                                alt="Placeholder"
                                style={{ width: "100%", height: 350, objectFit: "cover", borderRadius: 0 }}
                            />
                        </div>
                    )}
                </Carousel>

                <div style={{ padding: "20px", textAlign: "center" }}>
                    <Title level={3} style={{ marginBottom: 8 }}>
                        {product.name}
                    </Title>

                    <Space align="center" style={{ marginBottom: 12 }}>
                        <Text strong style={{ fontSize: 24, color: "#8B4513" }}>
                            ₹{product.price}
                        </Text>
                    </Space>

                    <Divider style={{ margin: "12px 0" }} />

                    <Space direction="vertical" align="center" style={{ marginBottom: 15 }}>
                        <Paragraph style={{ margin: 0, textAlign: 'justify', padding: '0 20px', lineHeight: '1.6' }}>
                            {product.description || "No description available."}
                        </Paragraph>
                    </Space>

                    <Space direction="vertical" align="center">
                        <Space align="center" style={{ marginBottom: 15 }}>
                            <Button icon={<MinusOutlined />} size="small" onClick={handleDecrement} />
                            <Text style={{ fontSize: '1.6rem', fontWeight: 'bold', minWidth: '35px', textAlign: 'center' }}>{quantity}</Text>
                            <Button icon={<PlusOutlined />} size="small" onClick={handleIncrement} />
                        </Space>
                        <Button type="primary" icon={<ShoppingCartOutlined />} size="large" onClick={handleAddToCart}>
                            Add to Cart
                        </Button>
                    </Space>

                    {message && (
                        <div style={{ marginTop: 20, color: 'green', fontWeight: 'bold' }}>
                            {message}
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default ProductModal;