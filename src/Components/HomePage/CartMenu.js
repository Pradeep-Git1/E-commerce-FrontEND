import React, { useState, useEffect } from "react";
import { List, Typography, Button, Modal, InputNumber } from "antd";
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, addToCart, mergeCarts } from "../../app/features/cart/cartSlice";
import { DeleteOutlined } from "@ant-design/icons";
import CheckoutModal from "./CheckoutModal";

const { Title, Paragraph } = Typography;

const CartMenu = ({ setDrawerContent, setDrawerVisible }) => {
    const cart = useSelector(state => state.cart.items);
    const anonymousCart = useSelector(state => state.cart.anonymousItems);
    const user = useSelector(state => state.user.data);
    const dispatch = useDispatch();
    const [checkoutModalVisible, setCheckoutModalVisible] = useState(false);

    const safeAnonymousCart = Array.isArray(anonymousCart) ? anonymousCart : [];

    const combinedCart = user ? [...cart, ...safeAnonymousCart] : safeAnonymousCart;

    useEffect(() => {
        if (user && safeAnonymousCart.length > 0) {
            dispatch(mergeCarts());
        }
    }, [user, safeAnonymousCart, dispatch]);

    const handleRemoveFromCart = (itemId) => {
        dispatch(removeFromCart(itemId));
    };

    const handleQuantityChange = (value, item) => {
        const product = safeAnonymousCart.find(cartItem => cartItem.id === item.id) || item;
        dispatch(addToCart({ product: product, quantity: value }));
    };

    const handleCheckout = () => {
        if (user) {
            setCheckoutModalVisible(true);
        } else {
            setTimeout(() => {
                setDrawerContent("login");
                setDrawerVisible(true);
            }, 2000);
        }
    };

    const handleCloseCheckoutModal = () => {
        setCheckoutModalVisible(false);
    };

    if (combinedCart.length === 0) {
        return <Paragraph className="text-center text-muted mt-4">Your cart is empty!</Paragraph>;
    }

    const getImageSrc = (imageSrc) => {
        if (imageSrc && !imageSrc.startsWith('http')) {
            return `http://localhost:8000${imageSrc}`;
        }
        return imageSrc || '/default-product-image.jpg';
    };

    const formatPrice = (price) => {
        if (typeof price === 'number') {
            return price.toFixed(2);
        } else if (typeof price === 'string' && !isNaN(Number(price))) {
            return Number(price).toFixed(2);
        }
        return '0.00';
    };

    const calculateTotal = () => {
        return combinedCart.reduce((sum, item) => {
            const price = item.price || item.subtotal / item.quantity;
            return sum + (parseFloat(formatPrice(price)) * item.quantity);
        }, 0).toFixed(2);
    };

    return (
        <>
            <List
                dataSource={combinedCart}
                renderItem={(item) => (
                    <List.Item className="d-flex align-items-center">
                        <img src={getImageSrc(item.image)} alt={item.name} style={{ width: 50, height: 50, objectFit: "cover", borderRadius: "5px" }} />
                        <div className="ms-3 flex-grow-1">
                            <Title level={5} className="mb-0">{item.name}</Title>
                            <div className="d-flex align-items-center justify-content-between">
                                <Paragraph className="mb-0 text-muted">₹{formatPrice(item.price || item.subtotal / item.quantity)}</Paragraph>
                                <InputNumber
                                    min={1}
                                    value={item.quantity}
                                    onChange={(value) => handleQuantityChange(value, item)}
                                    style={{ width: 80 }}
                                />
                            </div>
                        </div>
                        <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleRemoveFromCart(user ? item.item_id : item.id)} />
                    </List.Item>
                )}
            />
            <div className="text-center mt-3">
                <Title level={4} className="fw-bold">Total: ₹{calculateTotal()}</Title>
                <Button type="primary" className="mt-2 w-100" onClick={handleCheckout}>Proceed to Checkout 🛍️</Button>
            </div>

            <CheckoutModal
                combinedCart={combinedCart}
                checkoutModalVisible={checkoutModalVisible}
                handleCloseCheckoutModal={handleCloseCheckoutModal}
                calculateTotal={calculateTotal}
                getImageSrc={getImageSrc}
            />
        </>
    );
};

export default CartMenu;