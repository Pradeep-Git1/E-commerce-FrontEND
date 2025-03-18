import React, { useState } from "react";
import { List, Typography, Button, Modal } from "antd";
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart } from "../../app/features/cart/cartSlice";
import { DeleteOutlined } from "@ant-design/icons";
import CheckoutModal from "./CheckoutModal";

const { Title, Paragraph } = Typography;

const CartMenu = ({ setDrawerContent, setDrawerVisible }) => {
    const cart = useSelector(state => state.cart.items);
    const anonymousCart = useSelector(state => state.cart.anonymousItems);
    const user = useSelector(state => state.user.data);
    const dispatch = useDispatch();
    const [checkoutModalVisible, setCheckoutModalVisible] = useState(false);

    // Safety check to ensure anonymousCart is always an array
    const safeAnonymousCart = Array.isArray(anonymousCart) ? anonymousCart : [];

    const combinedCart = user ? [...cart, ...safeAnonymousCart] : safeAnonymousCart;
    console.log(combinedCart);
    const handleRemoveFromCart = (itemId) => {
        dispatch(removeFromCart(itemId));
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

    const calculateTotal = () => {
        return combinedCart.reduce((sum, item) => (item.price || item.subtotal / item.quantity) * item.quantity, 0);
    };

    return (
        <>
            <List
                dataSource={combinedCart}
                renderItem={(item, index) => (
                    <List.Item className="d-flex align-items-center">
                        <img src={getImageSrc(item.image)} alt={item.name} style={{ width: 50, height: 50, objectFit: "cover", borderRadius: "5px" }} />
                        <div className="ms-3">
                            <Title level={5} className="mb-0">{item.name}</Title>
                            <Paragraph className="mb-0 text-muted">₹{item.price || item.subtotal / item.quantity} x {item.quantity}</Paragraph>
                        </div>
                        <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleRemoveFromCart(user ? item.item_id : index)} />
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