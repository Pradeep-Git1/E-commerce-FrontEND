import React, { useState } from "react";
import { Avatar, Button, Space, Typography, Badge, Drawer, List, Divider } from "antd";
import { Link } from "react-router-dom"; // Import Link from React Router
import { UserOutlined, MenuOutlined, ShoppingCartOutlined, LogoutOutlined, HeartOutlined, FileTextOutlined, HomeOutlined, MessageOutlined, GiftOutlined } from "@ant-design/icons";
import CartDrawer from "../FunctionalComps/CartDrawer";

const { Title } = Typography;

const categories = [
  { name: "Milk", path: "/category/milk" },
  { name: "Dark", path: "/category/dark" },
  { name: "White", path: "/category/white" },
  { name: "Love", path: "/category/luxury" },
  { name: "Luxury", path: "/category/luxury" },
  { name: "Gifts", path: "/category/gift" },
];

const chocolateColor = "#8B4513";

const TopNav = () => {
  const [visible, setVisible] = useState(false);
  const [userVisible, setUserVisible] = useState(false);
  const [cartVisible, setCartVisible] = useState(false);
  const [cart, setCart] = useState([
    { id: 1, name: "Luxury Truffle Box", price: 1999, quantity: 1, image: "/images/image1.jpg" },
    { id: 2, name: "Swiss Hazelnut Bliss", price: 2499, quantity: 2, image: "/images/image2.jpg" },
  ]);

  // Remove Item from Cart
  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg bg-white sticky-top">
        <div className="container-fluid d-flex align-items-center justify-content-between py-2">
          
          {/* Logo */}
          <Link to="/" className="d-flex align-items-center text-decoration-none">
            <img src="/companylogo.png" alt="Company Logo" style={{ height: 45 }} />
            <Title level={4} className="mb-0 ms-2 text-dark fw-bold">
              Chocolate Factory
            </Title>
          </Link>

          {/* Desktop Navigation */}
          <div className="d-none d-lg-flex flex-grow-1 justify-content-center">
            <ul className="navbar-nav">
              {categories.map((category) => (
                <li key={category.name} className="nav-item mx-3">
                  <Link to={category.path} className="nav-link fw-semibold text-dark">
                    {category.name}
                  </Link>
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
            <li key={category.name} className="my-3">
              <Link to={category.path} className="text-dark fw-semibold fs-5 d-block" onClick={() => setVisible(false)}>
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </Drawer>

      {/* User Profile Drawer */}
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

      {/* Cart Drawer Component */}
      <CartDrawer
        visible={cartVisible}
        onClose={() => setCartVisible(false)}
        cart={cart}
        removeFromCart={removeFromCart}
        onCheckout={() => alert("Proceeding to Checkout")}
      />
    </>
  );
};

export default TopNav;
