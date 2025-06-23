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
import MegaMenuCategoryColumn from "./MegaMenu";
import UserInfoPromptModal from './UserInfoPromptModal';

const { Title } = Typography;
const primaryColor = "#593E2F";
const secondaryColor = "#D2B48C";

const { SubMenu } = Menu;

// Helper function to create a URL-friendly slug
const createSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

// Accept categories, categoriesLoading, and categoriesError as props
const TopNav = ({ categories, categoriesLoading, categoriesError }) => {
  const user = useSelector((state) => state.user.data);
  const company = useSelector((state) => state.company.data);
  const cartItems = useSelector((state) =>
    user ? state.cart.items : state.cart.anonymousItems
  );

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerContent, setDrawerContent] = useState("menu");
  const [showMenuIcon, setShowMenuIcon] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const [badgeJiggle, setBadgeJiggle] = useState(false);
  const previousCartItems = useRef(cartItems);
  const [hoveredCategoryId, setHoveredCategoryId] = useState(null); // This state will manage which top-level category's mega-menu is open

  const [hasBeenPromptedForInfoThisSession, setHasBeenPromptedForInfoThisSession] = useState(false);
  const [isUserInfoModalOpen, setIsUserInfoModalOpen] = useState(false);

  const [hasPromptedForLoginThisSession, setHasPromptedForLoginThisSession] = useState(false);
  const [canShowLoginPrompt, setCanShowLoginPrompt] = useState(false);

  const [scrolled, setScrolled] = useState(false);

  // --- Initial User Fetch ---
  useEffect(() => {
    if (user === null) {
      console.log("TopNav: user is null, dispatching fetchUser...");
      dispatch(fetchUser());
    } else {
      console.log("TopNav: user data exists on mount or update:", user);
    }
  }, [dispatch, user]);

  // --- Check for Missing User Info and Control Modal Visibility ---
  useEffect(() => {
    const isUserLoggedIn = !!user;
    const isInfoMissing = user && (!user.full_name || !user.phone_number);

    const shouldOpenModalNow =
      isUserLoggedIn &&
      isInfoMissing &&
      !isUserInfoModalOpen &&
      !hasBeenPromptedForInfoThisSession;

    if (shouldOpenModalNow) {
      console.log("TopNav: Opening UserInfoPromptModal due to missing info.");
      setIsUserInfoModalOpen(true);
    } else if (
      user &&
      user.full_name &&
      user.phone_number &&
      isUserInfoModalOpen
    ) {
      console.log("TopNav: User info is complete. Closing UserInfoPromptModal.");
      setIsUserInfoModalOpen(false);
      setHasBeenPromptedForInfoThisSession(true);
    } else if (!user && isUserInfoModalOpen) {
      console.log("TopNav: User logged out and modal is open. Closing UserInfoPromptModal.");
      setIsUserInfoModalOpen(false);
      setHasBeenPromptedForInfoThisSession(false);
    }
  }, [user, isUserInfoModalOpen, hasBeenPromptedForInfoThisSession]);

  const handleCloseUserInfoModal = useCallback(() => {
    console.log("TopNav: handleCloseUserInfoModal called. Setting local state isUserInfoModalOpen to false.");
    setIsUserInfoModalOpen(false);
  }, []);

  const handleInfoSavedInModal = useCallback(() => {
    console.log("TopNav: UserInfoPromptModal reported info saved. Setting hasBeenPromptedForInfoThisSession to TRUE.");
    setHasBeenPromptedForInfoThisSession(true);
    setIsUserInfoModalOpen(false);
  }, []);

  const handleSkipInModal = useCallback(() => {
    console.log("TopNav: UserInfoPromptModal reported skip. Setting hasBeenPromptedForInfoThisSession to TRUE.");
    setHasBeenPromptedForInfoThisSession(true);
    setIsUserInfoModalOpen(false);
  }, []);

  // --- Responsive Menu Icon Visibility & Scroll Effect ---
  useEffect(() => {
    const checkMenuVisibility = () => {
      setShowMenuIcon(window.innerWidth < 992);
    };

    checkMenuVisibility();
    window.addEventListener("resize", checkMenuVisibility);

    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", checkMenuVisibility);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // --- Cart Fetching & Badge Jiggle ---
  useEffect(() => {
    console.log("TopNav: Dispatching fetchCart due to user or dispatch change.");
    dispatch(fetchCart());
  }, [dispatch, user]);

  useEffect(() => {
    const currentSafeCartItems = Array.isArray(cartItems) ? cartItems : [];
    console.log("TopNav: Cart items changed. Current count:", currentSafeCartItems.length, "Previous count:", previousCartItems.current?.length);

    if (previousCartItems.current && previousCartItems.current.length < currentSafeCartItems.length) {
      console.log("TopNav: Cart item added, jiggling badge.");
      setBadgeJiggle(true);
      setTimeout(() => setBadgeJiggle(false), 500);
    }
    previousCartItems.current = currentSafeCartItems;
  }, [cartItems]);

  // --- DELAYED LOGIN PROMPT LOGIC ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setCanShowLoginPrompt(true);
      console.log("TopNav: Login prompt delay finished. canShowLoginPrompt set to true.");
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (user === null && !hasPromptedForLoginThisSession && canShowLoginPrompt) {
      console.log("TopNav: User is not logged in, delay passed, and not prompted yet. Opening login drawer.");
      setDrawerContent("login");
      setDrawerVisible(true);
      setHasPromptedForLoginThisSession(true);
    } else if (user !== null && drawerVisible && drawerContent === "login") {
      setDrawerVisible(false);
    }
  }, [user, hasPromptedForLoginThisSession, drawerVisible, drawerContent, canShowLoginPrompt]);


  // --- History State Management for Drawer ---
  useEffect(() => {
    const handlePopState = (event) => {
      if (drawerVisible) {
        setDrawerVisible(false);
        console.log("TopNav: Popstate event detected, closing drawer.");
      }
    };

    if (drawerVisible) {
      window.history.pushState({ drawerOpen: true, drawerContent: drawerContent }, "", window.location.pathname);
      console.log("TopNav: Pushed new history state for drawer open.");
    }

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [drawerVisible, drawerContent]);

  // --- Helper Functions for Category Path ---
  const findCategoryById = useCallback((items, id) => {
    if (!items) return null;
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

  const pathParts = location.pathname.split("/");
  const currentCategoryId = parseInt(pathParts[pathParts.length - 1]);
  const selectedCategory = findCategoryById(categories, currentCategoryId);

  // --- Drawer Handlers ---
  const handleProfileClick = () => {
    console.log("TopNav: Profile icon clicked. Setting drawer content to:", user ? "profile" : "login");
    setDrawerContent(user ? "profile" : "login");
    setDrawerVisible(true);
    if (!user) {
      setHasPromptedForLoginThisSession(true);
    }
  };

  const handleLoginSuccess = () => {
    console.log("TopNav: handleLoginSuccess called. Dispatching fetchUser and fetchCart. Closing login drawer.");
    dispatch(fetchUser());
    dispatch(fetchCart());
    setDrawerContent("profile");
    setDrawerVisible(false);
    setHasBeenPromptedForInfoThisSession(false);
    setHasPromptedForLoginThisSession(true);
  };

  const handleLogoutFromMenu = () => {
    console.log("TopNav: handleLogoutFromMenu called. Dispatching logout. Changing drawer content to login.");
    dispatch(logout());
    setDrawerContent("login");
    setHasBeenPromptedForInfoThisSession(false);
    setHasPromptedForLoginThisSession(false);
    setCanShowLoginPrompt(false);
  };

  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];

  const badgeStyle = {
    transition: "transform 0.3s ease",
    transform: badgeJiggle ? "scale(1.1)" : "scale(1)",
  };

  // --- Mobile Drawer Menu Renderer ---
  const renderMobileMenuItems = (items) => {
    if (!items) return null;
    return items.map((item) => (
      <React.Fragment key={item.id}>
        {item.subcategories && item.subcategories.length > 0 ? (
          <SubMenu
            key={item.id}
            title={
              <Link
                to={`/category/${createSlug(item.name)}/${item.id}`}
                style={{ color: primaryColor, fontWeight: 600, textDecoration: "none" }}
                onClick={() => {
                  console.log("TopNav: Mobile menu link clicked (SubMenu). Closing drawer.");
                  setDrawerVisible(false);
                }}
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
              to={`/category/${createSlug(item.name)}/${item.id}`}
              style={{ color: primaryColor, fontWeight: 600, textDecoration: "none" }}
              onClick={() => {
                console.log("TopNav: Mobile menu link clicked (MenuItem). Closing drawer.");
                setDrawerVisible(false);
              }}
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
    console.log("TopNav: Mega menu link clicked. Hiding mega menu.");
    setHoveredCategoryId(null); // Close the mega menu after a click
  }, []);

  return (
    <>
      {/* Global Styles for Desktop Hover Menus - IMPORTANT! */}
      <style>
        {`
          /* Top-Level Category Item */
          .top-level-category {
            position: relative; /* Essential for positioning the mega menu relative to it */
          }

          /* Mega Menu Container */
          .mega-menu-container {
            position: absolute;
            top: 100%; /* Positions it directly below the parent category link */
            left: 50%;
            transform: translateX(-50%);
            background: #fff;
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
            padding: 16px 20px;
            min-width: 280px;
            max-width: 800px; /* Adjust as needed for your design */
            z-index: 100;
            opacity: 0;
            visibility: hidden;
            transform: translateY(10px) translateX(-50%); /* Start slightly lower, animate up */
            transition: opacity 0.3s ease-out, visibility 0.3s ease-out, transform 0.3s ease-out;
            display: flex; /* For multi-column layout within the mega menu */
            flex-wrap: wrap; /* Allows columns to wrap if needed */
            pointer-events: none; /* Initially ignore mouse events, enabled on hover */
          }

          /* Show Mega Menu on hover of the top-level category */
          .top-level-category:hover > .mega-menu-container {
            opacity: 1;
            visibility: visible;
            transform: translateY(0) translateX(-50%);
            pointer-events: auto; /* Enable mouse events when visible */
          }

          /* Individual Mega Menu List/Column */
          .mega-menu-list {
            list-style: none;
            padding: 0;
            margin: 0;
            width: 100%; /* Default to full width for a single column */
            /* Add styles here if you want multiple columns, e.g., width: 33%; */
          }

          /* Mega Menu Item (for direct subcategories) */
          .mega-menu-item {
            position: relative;
            margin-bottom: 4px;
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
            background-color: #f5f5f5;
            color: ${primaryColor};
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

          /* Nested Mega Menu - Appears to the right of a subcategory item */
          .nested-mega-menu {
            position: absolute;
            left: 100%; /* Position to the right of the parent item */
            top: 0;
            background: #fff;
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
            padding: 12px 16px;
            min-width: 200px;
            z-index: 101;
            opacity: 0;
            visibility: hidden;
            transform: translateX(0); /* Start in place */
            transition: opacity 0.3s ease-out, visibility 0.3s ease-out, transform 0.3s ease-out;
            pointer-events: none; /* Initially ignore mouse events, enabled on hover */
          }

          /* Show Nested Mega Menu on hover of a mega-menu-item */
          .mega-menu-item:hover > .nested-mega-menu {
            opacity: 1;
            visibility: visible;
            transform: translateX(10px); /* Animate slightly to the right */
            pointer-events: auto; /* Enable mouse events when visible */
          }

          /* Ant Design Menu overrides for mobile drawer for better link styling */
          .ant-drawer-body .ant-menu-item-selected {
            background-color: ${secondaryColor} !important;
            color: ${primaryColor} !important;
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
            color: ${primaryColor} !important;
          }
        `}
      </style>

      <div
        style={{
          position: "fixed",
          top: 0,
          zIndex: 1000,
          width: "100%",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: scrolled ? "rgba(255, 255, 255, 0.95)" : "transparent",
          borderBottom: scrolled ? "1px solid #EAEAEA" : "none",
          boxShadow: scrolled ? "0 4px 12px rgba(0, 0, 0, 0.08)" : "none",
          transition: "background 0.3s ease-in-out, border-bottom 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
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
          />
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
        {!showMenuIcon && !categoriesLoading && !categoriesError && categories.length > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            {categories.map((category) => (
              <div
                key={category.id}
                // Use a className for styling the hover effect
                className="top-level-category"
                // No need for onMouseEnter/Leave here if CSS handles the hover
                // But you can keep hoveredCategoryId if you use it for active styling
                onMouseEnter={() => setHoveredCategoryId(category.id)}
                onMouseLeave={() => setHoveredCategoryId(null)}
              >
                <Link
                  to={`/category/${createSlug(category.name)}/${category.id}`}
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
                  onClick={handleMegaMenuLinkClick} // Still useful to close the menu on click
                >
                  {category.name}
                </Link>
                {/* Render the Mega Menu for the hovered top-level category */}
                {category.subcategories && category.subcategories.length > 0 && (
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

        {categoriesLoading && <Spin />}
        {categoriesError && <Alert message={categoriesError} type="error" showIcon />}

        {/* Right side: Cart, Profile, Menu */}
        <Space size="middle">
          <Badge
            count={safeCartItems.length}
            showZero
            style={badgeStyle}
            offset={[8, -8]}
            onClick={() => {
              console.log("TopNav: Cart icon clicked. Setting drawer content to 'cart'.");
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
                console.log("TopNav: Mobile menu icon clicked. Setting drawer content to 'menu'.");
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
        onClose={() => {
          console.log("TopNav: Drawer onClose called. Setting drawerVisible to false.");
          setDrawerVisible(false);
          if (drawerContent === "login") {
            setHasPromptedForLoginThisSession(true);
          }
          if (window.history.state && window.history.state.drawerOpen) {
              window.history.back();
          }
        }}
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
          <UserLogin
            onLoginSuccess={handleLoginSuccess}
            promptMessage="Log in to enjoy exclusive offers and discounts, manage your orders, and more!"
          />
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
            selectedKeys={currentCategoryId ? [currentCategoryId.toString()] : []}
          >
            {renderMobileMenuItems(categories)}
          </Menu>
        )}
      </Drawer>

      {/* User Info Prompt Modal */}
      <UserInfoPromptModal
        isModalVisible={isUserInfoModalOpen}
        onClose={handleCloseUserInfoModal}
        onInfoSaved={handleInfoSavedInModal}
        onSkip={handleSkipInModal}
      />
    </>
  );
};

export default TopNav;