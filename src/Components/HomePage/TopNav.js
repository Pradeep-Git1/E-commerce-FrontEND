import React, { useState, useEffect, useRef } from "react";
import {
  Avatar,
  Button,
  Space,
  Typography,
  Badge,
  Drawer,
  Menu,
  Spin,
  Alert,
} from "antd";
import { Link, useLocation } from "react-router-dom";
import {
  UserOutlined,
  MenuOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { fetchUser, logout } from "../../app/features/user/userSlice";
import { fetchCart } from "../../app/features/cart/cartSlice";
import UserMenu from "./UserMenu";
import CartMenu from "./CartMenu";
import UserLogin from "./UserLogin";
import { getRequest } from "../../Services/api";

const { Title } = Typography;
const primaryColor = "#593E2F";
const secondaryColor = "#D2B48C";

const TopNav = () => {
  const user = useSelector((state) => state.user.data);
  const company = useSelector((state) => state.company.data);
  const cartItems = useSelector((state) =>
    user ? state.cart.items : state.cart.anonymousItems
  );

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerContent, setDrawerContent] = useState("menu");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMenuIcon, setShowMenuIcon] = useState(false);
  const navRef = useRef(null);
  const location = useLocation();
  const dispatch = useDispatch();
  const [badgeJiggle, setBadgeJiggle] = useState(false);
  const previousCartItems = useRef(cartItems);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getRequest("/top-categories/");
        setCategories(response);
      } catch (err) {
        setError("Failed to load categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();

    const checkMenuVisibility = () => {
      setShowMenuIcon(window.innerWidth < 992);
    };

    checkMenuVisibility();
    window.addEventListener("resize", checkMenuVisibility);

    return () => {
      window.removeEventListener("resize", checkMenuVisibility);
    };
  }, []);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch, user]);

  useEffect(() => {
    if (previousCartItems.current !== cartItems) {
      setBadgeJiggle(true);
      setTimeout(() => setBadgeJiggle(false), 500);
      previousCartItems.current = cartItems;
    }
  }, [cartItems]);

  const getCategoryNameFromPath = (path) => {
    const parts = path.split("/");
    if (parts[1] === "category" && categories.length > 0) {
      const categoryId = parseInt(parts[2]);
      const foundCategory = categories.find((cat) => cat.id === categoryId);
      return foundCategory ? foundCategory.name : null;
    }
    return null;
  };

  const selectedCategoryName = getCategoryNameFromPath(location.pathname);

  const handleProfileClick = () => {
    setDrawerContent(user ? "profile" : "login");
    setDrawerVisible(true);
  };

  const handleLoginSuccess = () => {
    dispatch(fetchUser());
    dispatch(fetchCart());
    setDrawerContent("profile");
    setDrawerVisible(false);
  };

  const handleLogoutFromMenu = () => {
    dispatch(logout());
    setDrawerContent("login");
  };

  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];

  const badgeStyle = {
    transition: "transform 0.3s ease",
    transform: badgeJiggle ? "scale(1.1)" : "scale(1)",
  };

  return (
    <>
      <div
        ref={navRef}
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          width: "100%",
          background: "#fff",
          padding: "16px",
          borderBottom: "1px solid #EAEAEA",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Brand / Logo */}
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
          }}
        >
          <img
            src={company?.company_logo || "/companylogo.png"}
            alt={company?.company_name || "Company Logo"}
            style={{ height: 40, marginRight: 8 }}
          />
          <Title level={5} style={{ margin: 0, color: primaryColor }}>
            {company?.company_name || "Chocolate Factory"}
          </Title>
        </Link>

        {/* Category links */}
        {!showMenuIcon && !loading && !error && categories.length > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexGrow: 1,
              overflowX: "auto",
              whiteSpace: "nowrap",
            }}
          >
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.id}`}
                style={{
                  padding: "8px 12px",
                  margin: "0 5px",
                  borderRadius: "20px",
                  color: primaryColor,
                  fontWeight:
                    selectedCategoryName === category.name ? "600" : "400",
                  textDecoration: "none",
                  backgroundColor:
                    selectedCategoryName === category.name
                      ? secondaryColor
                      : "transparent",
                  transition: "background-color 0.3s ease, transform 0.2s ease",
                  fontSize: "14px",
                }}
              >
                {category.name}
              </Link>
            ))}
          </div>
        )}

        {loading && <Spin />}
        {error && <Alert message={error} type="error" showIcon />}

        {/* Right side: Cart, Profile, Menu */}
        <Space size="middle">
          <Badge
            count={safeCartItems.length}
            showZero
            style={badgeStyle}
            offset={[10, -10]}
            onClick={() => {
              setDrawerContent("cart");
              setDrawerVisible(true);
            }}
          >
            <ShoppingCartOutlined
              style={{ fontSize: 20, cursor: "pointer", color: primaryColor }}
            />
          </Badge>

          <Avatar
            size="small"
            icon={<UserOutlined />}
            style={{ cursor: "pointer", backgroundColor: primaryColor }}
            onClick={handleProfileClick}
          />

          {showMenuIcon && (
            <Button
              type="text"
              icon={
                <MenuOutlined style={{ fontSize: 20, color: primaryColor }} />
              }
              onClick={() => {
                setDrawerContent("menu");
                setDrawerVisible(true);
              }}
            />
          )}
        </Space>
      </div>

      {/* Drawer */}
      <Drawer
        title={
          drawerContent === "profile"
            ? "Your Account"
            : drawerContent === "cart"
            ? "Your Cart"
            : drawerContent === "login"
            ? "Login"
            : "Menu"
        }
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={280}
        bodyStyle={{ padding: "16px" }}
        headerStyle={{
          backgroundColor: secondaryColor,
          borderBottom: "1px solid #EAEAEA",
        }}
      >
        {drawerContent === "profile" && <UserMenu onLogout={handleLogoutFromMenu} />}
        {drawerContent === "login" && (
          <UserLogin onLoginSuccess={handleLoginSuccess} />
        )}
        {drawerContent === "cart" && <CartMenu />}
        {drawerContent === "menu" && (
          <Menu mode="vertical" selectable={false}>
            {categories.map((category) => (
              <Menu.Item key={category.id}>
                <Link
                  to={`/category/${category.id}`}
                  style={{
                    fontWeight: 600,
                    color: primaryColor,
                    textDecoration: "none",
                  }}
                >
                  {category.name}
                </Link>
              </Menu.Item>
            ))}
          </Menu>
        )}
      </Drawer>
    </>
  );
};

export default TopNav;
