import React, { useState, useEffect, useRef } from "react";
import { List, Typography, Button, InputNumber } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  addToCart,
  mergeCarts,
} from "../../app/features/cart/cartSlice";
import { DeleteOutlined } from "@ant-design/icons";
import CheckoutModal from "./CheckoutModal"; // Assuming this path is correct

const { Title, Paragraph, Text } = Typography;

const primaryColor = "#593E2F"; // Consistent with TopNav
const accentColor = "#D2B48C"; // Consistent with TopNav

const CartMenu = ({ setDrawerContent, setDrawerVisible }) => {
  const cart = useSelector((state) => state.cart.items);
  const anonymousCart = useSelector((state) => state.cart.anonymousItems);
  const user = useSelector((state) => state.user.data);
  const dispatch = useDispatch();
  const [checkoutModalVisible, setCheckoutModalVisible] = useState(false);

  const prevCombinedCartLengthRef = useRef(0);
  const isInitialMount = useRef(true);

  const safeAnonymousCart = Array.isArray(anonymousCart) ? anonymousCart : [];

  const combinedCart = user
    ? [...cart, ...safeAnonymousCart]
    : safeAnonymousCart;

  useEffect(() => {
    if (user && safeAnonymousCart.length > 0) {
      dispatch(mergeCarts());
    }
  }, [user, safeAnonymousCart, dispatch]);

  useEffect(() => {
    const currentCartLength = combinedCart.length;

    if (isInitialMount.current) {
      prevCombinedCartLengthRef.current = currentCartLength;
      isInitialMount.current = false;
      return;
    }

    if (currentCartLength > prevCombinedCartLengthRef.current) {
      setDrawerVisible(true);
      const timer = setTimeout(() => {
        setDrawerVisible(false);
      }, 1500);

      return () => clearTimeout(timer);
    }

    prevCombinedCartLengthRef.current = currentCartLength;
  }, [combinedCart.length, setDrawerVisible]);

  const handleRemoveFromCart = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  const handleQuantityChange = (value, item) => {
    if (value < 1) return;

    const productToUpdate =
      safeAnonymousCart.find((cartItem) => cartItem.id === item.id) || item;

    dispatch(addToCart({ product: productToUpdate, quantity: value }));
  };

  const handleCheckout = () => {
    if (user) {
      setCheckoutModalVisible(true);
    } else {
      setDrawerVisible(false);
      setTimeout(() => {
        setDrawerContent("login");
        setDrawerVisible(true);
      }, 300);
    }
  };

  const handleCloseCheckoutModal = () => {
    setCheckoutModalVisible(false);
  };

  const getImageSrc = (imageSrc) => {
    if (imageSrc && Array.isArray(imageSrc) && imageSrc.length > 0) {
      return imageSrc[0];
    }
    return imageSrc;
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
        const price =
          item.price || (item.subtotal && item.quantity ? item.subtotal / item.quantity : 0);
        const itemPrice = parseFloat(formatPrice(price));
        return sum + itemPrice * item.quantity;
      }, 0)
      .toFixed(2);
    return total;
  };

  if (combinedCart.length === 0) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <Title level={5} style={{ color: primaryColor }}>
          Your cart is empty!
        </Title>
        <Paragraph style={{ color: "#888", marginTop: "10px" }}>
          Start adding some amazing products to your cart.
        </Paragraph>
        <Button
          type="primary"
          style={{
            backgroundColor: primaryColor,
            borderColor: primaryColor,
            marginTop: "20px",
          }}
          onClick={() => {
            setDrawerVisible(false); // Close cart drawer
            // You might want to navigate to a shopping page here
            // Example: history.push('/shop');
          }}
        >
          Start Shopping
        </Button>
      </div>
    );
  }

  return (
    <>
      <List
        dataSource={combinedCart}
        renderItem={(item) => (
          <List.Item
            style={{
              padding: "12px 10px",
              display: "flex",
              alignItems: "center",
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            <img
              src={getImageSrc(item.images || item.image_url || item.image)}
              alt={item.name}
              style={{
                width: 70,
                height: 70,
                objectFit: "cover",
                borderRadius: "8px",
                marginRight: "15px",
                border: `1px solid ${accentColor}`,
              }}
            />
            <div
              style={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Text strong style={{ fontSize: "1rem", color: primaryColor }}>
                {item.name}
              </Text>
              {item.variant_name && (
                <Text type="secondary" style={{ fontSize: "0.85rem" }}>
                  {item.variant_name}
                </Text>
              )}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: "8px",
                }}
              >
                <Text style={{ fontSize: "0.95rem", fontWeight: "bold", color: "#333" }}>
                  ₹{formatPrice(item.price || (item.subtotal / item.quantity))}
                </Text>
                <InputNumber
                  min={1}
                  value={item.quantity}
                  onChange={(value) => handleQuantityChange(value, item)}
                  style={{ width: 70, borderRadius: "4px" }}
                  size="small"
                />
              </div>
            </div>
            <Button
              type="text"
              danger
              icon={<DeleteOutlined style={{ fontSize: "18px" }} />}
              onClick={() =>
                handleRemoveFromCart(user ? item.item_id : item.id)
              }
              style={{ marginLeft: "10px" }}
            />
          </List.Item>
        )}
      />
      <div
        style={{
          padding: "18px 20px",
          borderTop: "1px solid #e0e0e0",
          backgroundColor: "#fcfcfc",
          position: "sticky",
          bottom: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "15px",
          }}
        >
          <Title level={4} style={{ margin: 0, fontSize: "1.3rem", color: primaryColor }}>
            Total:
          </Title>
          <Title level={4} style={{ margin: 0, fontSize: "1.3rem", color: primaryColor }}>
            ₹{calculateTotal()}
          </Title>
        </div>
        <Button
          type="primary"
          size="large"
          block
          style={{
            backgroundColor: primaryColor,
            borderColor: primaryColor,
            height: "50px",
            fontSize: "1.1rem",
            fontWeight: "bold",
            borderRadius: "8px",
          }}
          onClick={handleCheckout}
        >
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