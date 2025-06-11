import React, { useState, useEffect, useRef } from "react";
import { List, Typography, Button, InputNumber } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
    removeFromCart,
    addToCart,
    mergeCarts,
} from "../../app/features/cart/cartSlice";
import { DeleteOutlined } from "@ant-design/icons";
import CheckoutModal from "./CheckoutModal";

const { Title, Paragraph } = Typography;

const CartMenu = ({ setDrawerContent, setDrawerVisible }) => {
    const cart = useSelector((state) => state.cart.items);
    const anonymousCart = useSelector((state) => state.cart.anonymousItems);
    const user = useSelector((state) => state.user.data);
    const dispatch = useDispatch();
    const [checkoutModalVisible, setCheckoutModalVisible] = useState(false);

    // Ref to store the *previous* cart length for comparison
    const prevCombinedCartLengthRef = useRef(0);
    // Ref to track if it's the very first render (to avoid opening on initial load)
    const isInitialMount = useRef(true);


    const safeAnonymousCart = Array.isArray(anonymousCart) ? anonymousCart : [];

    const combinedCart = user
        ? [...cart, ...safeAnonymousCart]
        : safeAnonymousCart;

    // Effect to merge anonymous cart if user logs in
    useEffect(() => {
        if (user && safeAnonymousCart.length > 0) {
            dispatch(mergeCarts());
        }
    }, [user, safeAnonymousCart, dispatch]);

    // Effect to handle drawer visibility based on cart changes (THE CORE FIX IS HERE)
    useEffect(() => {
        const currentCartLength = combinedCart.length;

        // On initial mount, just set the ref and skip opening the drawer
        if (isInitialMount.current) {
            prevCombinedCartLengthRef.current = currentCartLength;
            isInitialMount.current = false;
            return;
        }

        // Only proceed if the cart length has increased
        if (currentCartLength > prevCombinedCartLengthRef.current) {
            console.log("Cart length increased. Opening drawer...");
            setDrawerVisible(true); // Open the drawer

            // Close the drawer after 1 second
            const timer = setTimeout(() => {
                setDrawerVisible(false);
            }, 1500);

            // Cleanup the timer if the component unmounts or cart changes again
            return () => clearTimeout(timer);
        }

        // Always update the ref with the current length after the check
        // This ensures prevCombinedCartLengthRef.current is always the length from the *previous* render
        prevCombinedCartLengthRef.current = currentCartLength;

    }, [combinedCart.length, setDrawerVisible]); // Depend on combinedCart.length

    const handleRemoveFromCart = (itemId) => {
        dispatch(removeFromCart(itemId));
    };

    const handleQuantityChange = (value, item) => {
        if (value < 1) return; // Prevent setting quantity to less than 1

        // Find the actual product object based on item.id in anonymousCart or use item itself
        const productToUpdate = safeAnonymousCart.find((cartItem) => cartItem.id === item.id) || item;

        // Pass the product object and the new quantity
        dispatch(addToCart({ product: productToUpdate, quantity: value }));
    };

    const handleCheckout = () => {
        if (user) {
            setCheckoutModalVisible(true);
        } else {
            // Close the cart drawer first before opening login
            setDrawerVisible(false);
            setTimeout(() => {
                setDrawerContent("login");
                setDrawerVisible(true);
            }, 300); // Short delay for smoother transition
        }
    };

    const handleCloseCheckoutModal = () => {
        setCheckoutModalVisible(false);
    };

    if (combinedCart.length === 0) {
        return (
            <Paragraph className="text-center text-muted mt-4">
                Your cart is empty!
            </Paragraph>
        );
    }

    const getImageSrc = (imageSrc) => {
        if (imageSrc && Array.isArray(imageSrc) && imageSrc.length > 0) {
            const firstImage = imageSrc[0];
            if (firstImage) {
                return firstImage;
            }
        }
        return imageSrc; // Fallback if no valid image or not an array
    };

    const formatPrice = (price) => {
        if (typeof price === "number") {
            return price.toFixed(2);
        } else if (typeof price === "string" && !isNaN(Number(price))) {
            return Number(price).toFixed(2);
        }
        return "0.00";
    };

    const calculateTotal = () => {
        const total = combinedCart
            .reduce((sum, item) => {
                const price = item.price || (item.subtotal && item.quantity ? item.subtotal / item.quantity : 0);
                const itemPrice = parseFloat(formatPrice(price));
                return sum + itemPrice * item.quantity;
            }, 0)
            .toFixed(2);
        return total;
    };

    return (
        <>
            <List
                dataSource={combinedCart}
                renderItem={(item) => (
                    <List.Item
                        className="d-flex align-items-center"
                        style={{ padding: '12px 0' }}
                    >
                        <img
                            src={getImageSrc(item.images || item.image_url || item.image)}
                            alt={item.name}
                            style={{
                                width: 60,
                                height: 60,
                                objectFit: "cover",
                                borderRadius: "8px",
                                marginRight: '12px',
                            }}
                        />
                        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                            <Title level={5} style={{ margin: 0, fontSize: '1rem' }}>
                                {item.name}
                            </Title>
                            {item.variant_name && (
                                <Paragraph style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#888' }}>
                                    {item.variant_name}
                                </Paragraph>
                            )}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginTop: '8px'
                            }}>
                                <Paragraph style={{ margin: 0, fontSize: '0.9rem', fontWeight: 'bold', color: '#333' }}>
                                    ₹{formatPrice(item.price || (item.subtotal / item.quantity))}
                                </Paragraph>
                                <InputNumber
                                    min={1}
                                    value={item.quantity}
                                    onChange={(value) => handleQuantityChange(value, item)}
                                    style={{ width: 70 }}
                                    size="small"
                                />
                            </div>
                        </div>
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() =>
                                handleRemoveFromCart(user ? item.item_id : item.id)
                            }
                            style={{ marginLeft: '8px' }}
                        />
                    </List.Item>
                )}
            />
            <div style={{ textAlign: 'center', padding: '16px 0', borderTop: '1px solid #f0f0f0' }}>
                <Title level={4} style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>
                    Total: ₹{calculateTotal()}
                </Title>
                <Button type="primary" size="large" style={{ marginTop: '16px', width: '90%' }} onClick={handleCheckout}>
                    Proceed to Checkout 🛍️
                </Button>
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