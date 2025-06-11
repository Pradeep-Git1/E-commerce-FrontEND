import React, { useState, useEffect, useRef, useCallback } from "react";
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
import MegaMenuCategoryColumn from "./MegaMenu"; // Import the new MegaMenu component

const { Title } = Typography;
const primaryColor = "#593E2F";
const secondaryColor = "#D2B48C";

const { SubMenu } = Menu;

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
  const location = useLocation();
  const dispatch = useDispatch();
  const [badgeJiggle, setBadgeJiggle] = useState(false);
  const previousCartItems = useRef(cartItems);
  const [hoveredCategoryId, setHoveredCategoryId] = useState(null); // State to manage hovered top-level category

  // --- Category Data Fetching ---
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getRequest("top-categories/");
        if (response) {
          setCategories(response);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();

    // --- Responsive Menu Icon Visibility ---
    const checkMenuVisibility = () => {
      setShowMenuIcon(window.innerWidth < 992);
    };

    checkMenuVisibility();
    window.addEventListener("resize", checkMenuVisibility);

    return () => {
      window.removeEventListener("resize", checkMenuVisibility);
    };
  }, []);

  // --- Cart Fetching & Badge Jiggle ---
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch, user]);

  useEffect(() => {
    if (previousCartItems.current && previousCartItems.current.length < safeCartItems.length) {
      setBadgeJiggle(true);
      setTimeout(() => setBadgeJiggle(false), 500);
    }
    previousCartItems.current = safeCartItems;
  }, [cartItems]);

  // --- Helper Functions for Category Path ---
  const findCategoryById = useCallback((items, id) => {
    for (const item of items) {
      if (item.id === id) {
        return item;
      }
      if (item.subcategories) {
        const found = findCategoryById(item.subcategories, id);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }, []);

  const selectedCategory = findCategoryById(categories, parseInt(location.pathname.split("/")[2]));

  // --- Drawer Handlers ---
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

  // --- Mobile Drawer Menu Renderer ---
  const renderMobileMenuItems = (items) => {
    return items.map((item) => (
      <React.Fragment key={item.id}>
        {item.subcategories && item.subcategories.length > 0 ? (
          <SubMenu
            key={item.id}
            title={
              <Link
                to={`/category/${item.id}`}
                style={{ color: primaryColor, fontWeight: 600, textDecoration: "none" }}
                onClick={() => setDrawerVisible(false)}
              >
                {item.name}
              </Link>
            }
          >
            {renderMobileMenuItems(item.subcategories)}
          </SubMenu>
        ) : (
          <Menu.Item key={item.id}>
            <Link
              to={`/category/${item.id}`}
              style={{ color: primaryColor, fontWeight: 600, textDecoration: "none" }}
              onClick={() => setDrawerVisible(false)}
            >
              {item.name}
            </Link>
          </Menu.Item>
        )}
      </React.Fragment>
    ));
  };

  // Callback to close mega menu when a link inside it is clicked
  const handleMegaMenuLinkClick = useCallback(() => {
    setHoveredCategoryId(null);
  }, []);

  return (
    <>
      {/* Global Styles for Desktop Hover Menus - IMPORTANT! */}
      <style>
        {`
          /* Top-Level Category Item */
          .top-level-category {
            position: relative;
            /* Ensures the dropdown positions relative to this parent */
          }

          /* Mega Menu Container */
          .mega-menu-container {
            position: absolute;
            top: 100%; /* Position right below the nav item */
            left: 50%;
            transform: translateX(-50%); /* Center horizontally */
            background: #fff;
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
            padding: 16px 20px;
            min-width: 280px; /* Adjust as needed for multi-column */
            max-width: 800px; /* Prevent it from getting too wide */
            z-index: 100; /* Ensure it's above other content */
            opacity: 0;
            visibility: hidden;
            transform: translateY(10px) translateX(-50%); /* Start slightly below for slide effect */
            transition: opacity 0.3s ease-out, visibility 0.3s ease-out, transform 0.3s ease-out;
            display: flex; /* Allow for multiple columns if needed */
            flex-wrap: wrap; /* Wrap columns if content is wide */
          }

          /* Show Mega Menu on hover */
          .top-level-category:hover > .mega-menu-container {
            opacity: 1;
            visibility: visible;
            transform: translateY(0) translateX(-50%); /* Slide up to final position */
          }

          /* Individual Mega Menu List/Column */
          .mega-menu-list {
            list-style: none;
            padding: 0;
            margin: 0;
            width: 100%; /* Default to single column */
            /* For multi-column: flex: 1 1 auto; min-width: 180px; margin-right: 20px; */
          }

          /* Mega Menu Item */
          .mega-menu-item {
            position: relative; /* For nested submenus */
            margin-bottom: 4px; /* Spacing between items */
          }

          .mega-menu-item:last-child {
            margin-bottom: 0;
          }

          /* Mega Menu Link */
          .mega-menu-link {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 12px;
            color: ${primaryColor};
            text-decoration: none;
            font-size: 14px;
            white-space: nowrap;
            border-radius: 4px;
            transition: background-color 0.2s ease, color 0.2s ease;
          }

          .mega-menu-link:hover {
            background-color: #f5f5f5; /* Light hover background */
            color: ${primaryColor}; /* Keep color on hover */
          }

          .mega-menu-link.active-link {
            background-color: ${secondaryColor} !important;
            font-weight: 600;
          }

          .mega-menu-arrow {
            font-size: 10px;
            margin-left: 10px;
            transition: transform 0.2s ease;
          }

          /* Nested Mega Menu - Appears to the right */
          .mega-menu-item:hover > .nested-mega-menu {
            opacity: 1;
            visibility: visible;
            transform: translateX(0); /* Slide left to final position */
          }

          .nested-mega-menu {
            position: absolute;
            left: 100%; /* Appears to the right of the parent */
            top: 0;
            background: #fff;
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
            padding: 12px 16px;
            min-width: 200px;
            z-index: 101; /* Higher than parent mega menu */
            opacity: 0;
            visibility: hidden;
            transform: translateX(10px); /* Start slightly to the right */
            transition: opacity 0.3s ease-out, visibility 0.3s ease-out, transform 0.3s ease-out;
          }

          /* Ant Design Menu overrides for mobile drawer for better link styling */
          .ant-drawer-body .ant-menu-item-selected {
            background-color: ${secondaryColor} !important;
            color: ${primaryColor} !important; /* Ensure text color is primary */
          }
          .ant-drawer-body .ant-menu-item-selected .ant-menu-title-content a {
            color: ${primaryColor} !important;
            font-weight: 600;
          }
          /* For SubMenu titles when they are active/selected */
          .ant-drawer-body .ant-menu-submenu-selected > .ant-menu-submenu-title {
            background-color: ${secondaryColor} !important;
            color: ${primaryColor} !important;
          }
          .ant-drawer-body .ant-menu-submenu-title a {
            color: ${primaryColor} !important; /* Ensure submenu title links have primary color */
          }
        `}
      </style>

      <div
        style={{
          position: "fixed",
          top: 0,
          zIndex: 1000,
          width: "100%",
          background: "#fff",
          padding: "12px 24px",
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
            flexWrap: "nowrap",
          }}
        >
          <img
            src={company?.company_logo || ""}
            alt={company?.company_name || "Company Logo"}
            style={{ height: 30, marginRight: 8 }}
          />{" "}
          <Title
            level={5}
            style={{
              margin: 0,
              color: primaryColor,
              fontSize: "16px",
              whiteSpace: "nowrap",
            }}
          >
            {company?.company_name || ""}
          </Title>
        </Link>

        {/* Category Links with Mega Menu (for desktop) */}
        {!showMenuIcon && !loading && !error && categories.length > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            {categories.map((category) => (
              <div
                key={category.id}
                className="top-level-category"
                onMouseEnter={() => setHoveredCategoryId(category.id)}
                onMouseLeave={() => setHoveredCategoryId(null)}
              >
                <Link
                  to={`/category/${category.id}`}
                  style={{
                    padding: "8px 16px",
                    margin: "0 8px",
                    borderRadius: "24px",
                    color: primaryColor,
                    fontWeight:
                      selectedCategory && selectedCategory.id === category.id
                        ? "600"
                        : "400",
                    textDecoration: "none",
                    backgroundColor:
                      selectedCategory && selectedCategory.id === category.id
                        ? secondaryColor
                        : "transparent",
                    transition:
                      "background-color 0.3s ease, transform 0.2s ease",
                    fontSize: "15px",
                    display: "inline-block",
                    cursor: "pointer",
                  }}
                  onClick={handleMegaMenuLinkClick} // Close mega menu if top-level link is clicked
                >
                  {category.name}
                </Link>
                {/* Render the Mega Menu for the hovered top-level category */}
                {category.subcategories &&
                  category.subcategories.length > 0 &&
                  hoveredCategoryId === category.id && (
                    <div className="mega-menu-container">
                      <MegaMenuCategoryColumn
                        categories={category.subcategories}
                        selectedCategory={selectedCategory}
                        onLinkClick={handleMegaMenuLinkClick}
                      />
                    </div>
                  )}
              </div>
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
            offset={[8, -8]}
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

          {/* Menu Icon (Mobile) */}
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
        width={300}
        headerStyle={{
          backgroundColor: secondaryColor,
          borderBottom: "1px solid #EAEAEA",
          fontSize: "16px",
          fontWeight: 500,
          color: primaryColor,
        }}
        bodyStyle={{ padding: 3 }}
      >
        {drawerContent === "profile" && (
          <UserMenu onLogout={handleLogoutFromMenu} />
        )}
        {drawerContent === "login" && (
          <UserLogin onLoginSuccess={handleLoginSuccess} />
        )}
        {drawerContent === "cart" && (
          <CartMenu
            setDrawerContent={setDrawerContent}
            setDrawerVisible={setDrawerVisible}
          />
        )}
        {drawerContent === "menu" && (
          <Menu
            mode="inline"
            selectable={false}
            selectedKeys={selectedCategory ? [selectedCategory.id.toString()] : []}
          >
            {renderMobileMenuItems(categories)}
          </Menu>
        )}
      </Drawer>
    </>
  );
};

export default TopNav;