import React, { useState } from "react";
import { List, Typography, Button } from "antd";
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart } from "../../app/features/cart/cartSlice";
import { DeleteOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const CartMenu = ({ setDrawerContent, setDrawerVisible }) => {
    const cart = useSelector(state => state.cart.items);
    const anonymousCart = useSelector(state => state.cart.anonymousItems);
    const user = useSelector(state => state.user.data);
    const dispatch = useDispatch();
    const combinedCart = user ? [...cart, ...anonymousCart] : anonymousCart;

    const handleRemoveFromCart = (itemId) => {
        dispatch(removeFromCart(itemId));
    };

    const handleCheckout = () => {
        if (user) {
            alert("Proceeding to Checkout");
        } else {
            setTimeout(() => {
                setDrawerContent("login");
                setDrawerVisible(true);
            }, 2000);
        }
    };

    if (combinedCart.length === 0) {
        return <Paragraph className="text-center text-muted mt-4">Your cart is empty!</Paragraph>;
    }

    return (
        <>
            <List
                dataSource={combinedCart}
                renderItem={(item, index) => (
                    <List.Item className="d-flex align-items-center">
                        <img src={item.image || '/default-product-image.jpg'} alt={item.name} style={{ width: 50, height: 50, objectFit: "cover", borderRadius: "5px" }} />
                        <div className="ms-3">
                            <Title level={5} className="mb-0">{item.name}</Title>
                            <Paragraph className="mb-0 text-muted">₹{item.price || item.subtotal / item.quantity} x {item.quantity}</Paragraph>
                        </div>
                        <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleRemoveFromCart(user ? item.id : index)} />
                    </List.Item>
                )}
            />
            <div className="text-center mt-3">
                <Title level={4} className="fw-bold">Total: ₹{combinedCart.reduce((sum, item) => (item.price || item.subtotal / item.quantity) * item.quantity, 0)}</Title>
                <Button type="primary" className="mt-2 w-100" onClick={handleCheckout}>Proceed to Checkout 🛍️</Button>
            </div>
        </>
    );
};

export default CartMenu;