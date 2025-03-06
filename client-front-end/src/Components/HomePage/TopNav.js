import React, { useState } from "react";
import { Avatar, Drawer, Button, Space, Typography, Badge, List, Divider } from "antd";
import { UserOutlined, MenuOutlined, ShoppingCartOutlined, DeleteOutlined, LogoutOutlined, HeartOutlined, FileTextOutlined, HomeOutlined, MessageOutlined, GiftOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const categories = ["Milk", "Dark", "White", "Love", "Luxury", "Gifts"];
const chocolateColor = "#8B4513"; // Chocolate brown

const sampleCart = [
  { id: 1, name: "Luxury Truffle Box", price: 1999, quantity: 1, image: "/images/image1.jpg" },
  { id: 2, name: "Swiss Hazelnut Bliss", price: 2499, quantity: 2, image: "/images/image2.jpg" },
  { id: 3, name: "Belgian Dark Chocolate", price: 1799, quantity: 1, image: "/images/image3.jpg" },
];

const TopNav = () => {
  const [visible, setVisible] = useState(false);
  const [cartVisible, setCartVisible] = useState(false);
  const [userVisible, setUserVisible] = useState(false);
  const [cart, setCart] = useState(sampleCart);

  // Calculate Total Price
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Remove Item from Cart
  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg bg-transparent">
        <div className="container-fluid d-flex align-items-center justify-content-between py-2">
          
          {/* Logo */}
          <a href="#" className="d-flex align-items-center text-decoration-none">
            <img src="/companylogo.png" alt="Company Logo" style={{ height: 45 }} />
            <Title level={4} className="mb-0 ms-2 text-dark fw-bold">
              Chocolate Factory
            </Title>
          </a>

          {/* Desktop Navigation */}
          <div className="d-none d-lg-flex flex-grow-1 justify-content-center">
            <ul className="navbar-nav">
              {categories.map((category) => (
                <li key={category} className="nav-item mx-3">
                  <a href="#" className="nav-link fw-semibold text-dark">{category}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Side Icons */}
          <Space size="middle">
            {/* Cart Icon with Badge */}
            <Badge count={cart.length} showZero>
              <ShoppingCartOutlined 
                style={{ fontSize: 24, cursor: "pointer", color: chocolateColor }} 
                onClick={() => setCartVisible(true)} 
              />
            </Badge>

            {/* User Avatar (Click to Open User Drawer) */}
            <Avatar 
              size="large" 
              icon={<UserOutlined />} 
              style={{ cursor: "pointer" }} 
              onClick={() => setUserVisible(true)} 
            />

            {/* Mobile Menu Button */}
            <Button
              type="text"
              icon={<MenuOutlined style={{ fontSize: 22 }} />} 
              className="d-lg-none"
              onClick={() => setVisible(true)}
            />
          </Space>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <Drawer title="Menu" placement="right" onClose={() => setVisible(false)} open={visible} width={260}>
        <ul className="list-unstyled text-center">
          {categories.map((category) => (
            <li key={category} className="my-3">
              <a href="#" className="text-dark fw-semibold fs-5 d-block">{category}</a>
            </li>
          ))}
        </ul>
      </Drawer>

      {/* 🛒 Cart Drawer */}
      <Drawer 
        title="Your Cart" 
        placement="right" 
        onClose={() => setCartVisible(false)} 
        open={cartVisible} 
        width={350}
      >
        {cart.length > 0 ? (
          <>
            <List
              dataSource={cart}
              renderItem={(item) => (
                <List.Item className="d-flex align-items-center">
                  <img src={item.image} alt={item.name} className="rounded" style={{ width: 50, height: 50, objectFit: "cover" }} />
                  <div className="ms-3">
                    <Title level={5} className="mb-0">{item.name}</Title>
                    <Paragraph className="mb-0 text-muted">₹{item.price} x {item.quantity}</Paragraph>
                  </div>
                  <Button type="text" danger icon={<DeleteOutlined />} onClick={() => removeFromCart(item.id)} />
                </List.Item>
              )}
            />

            {/* Cart Total & Checkout */}
            <div className="text-center mt-3">
              <Title level={4} className="fw-bold text-gold">Total: ₹{totalPrice}</Title>
              <Button type="primary" className="checkout-btn mt-2 w-100">
                Proceed to Checkout 🛍️
              </Button>
            </div>
          </>
        ) : (
          <Paragraph className="text-center text-muted mt-4">Your cart is empty!</Paragraph>
        )}
      </Drawer>

      {/* 👤 User Profile Drawer */}
      <Drawer 
        title="Your Account" 
        placement="right" 
        onClose={() => setUserVisible(false)} 
        open={userVisible} 
        width={300}
      >
        <List>
          <List.Item>
            <HomeOutlined className="me-2" /> Addresses
          </List.Item>
          <List.Item>
            <FileTextOutlined className="me-2" /> Orders
          </List.Item>
          <List.Item>
            <HeartOutlined className="me-2" /> Wishlist
          </List.Item>
          <List.Item>
            <MessageOutlined className="me-2" /> Talk to Us
          </List.Item>
          <List.Item>
            <GiftOutlined className="me-2" /> Gift Cards
          </List.Item>
          <Divider />
          <List.Item className="text-danger fw-bold" onClick={() => alert("Logging Out")}>
            <LogoutOutlined className="me-2" /> Logout
          </List.Item>
        </List>
      </Drawer>

      {/* Custom Styles */}
      <style>{`
        /* Gold Theme */
        .text-gold {
          color: #d4af37 !important;
          font-weight: bold;
        }

        /* Checkout Button */
        .checkout-btn {
          background: linear-gradient(to right, #d4af37, #b8860b);
          border: none;
          font-weight: bold;
          padding: 12px 20px;
          border-radius: 8px;
        }

        .checkout-btn:hover {
          background: linear-gradient(to right, #b8860b, #d4af37);
          transform: scale(1.05);
        }

        /* Cart Item List */
        .ant-list-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #eee;
          padding: 10px 0;
        }

        /* User Drawer Styling */
        .ant-drawer-title {
          font-weight: bold;
          font-size: 18px;
        }

        .ant-list-item {
          cursor: pointer;
        }

        .ant-list-item:hover {
          background: #f5f5f5;
          border-radius: 6px;
        }
      `}</style>
    </>
  );
};

export default TopNav;
