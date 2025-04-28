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
  const navRef = useRef(null);
  const location = useLocation();
  const dispatch = useDispatch();
  const [badgeJiggle, setBadgeJiggle] = useState(false);
  const previousCartItems = useRef(cartItems);
  const [openSubMenuId, setOpenSubMenuId] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Simulate API response with the provided data
        setCategories([
          {
            id: 44,
            name: "Home Made Chocolates",
            slug: "home-made-chocolates",
            subcategories: [
              { id: 45, name: "Dark", slug: "dark", subcategories: [] },
              { id: 46, name: "White", slug: "white", subcategories: [] },
              { id: 47, name: "Milk", slug: "milk", subcategories: [] },
              {
                id: 48,
                name: "Cream Centres",
                slug: "cream-centres",
                subcategories: [],
              },
              {
                id: 49,
                name: "Personalised Gifts",
                slug: "personalised-gifts",
                subcategories: [],
              },
              {
                id: 51,
                name: "Birthday gifts",
                slug: "birthday-gifts",
                subcategories: [],
              },
            ],
          },
          { id: 15, name: "Oils", slug: "oils", subcategories: [] },
          { id: 50, name: "Perfumes", slug: "perfumes", subcategories: [] },
          { id: 16, name: "Spices", slug: "spices", subcategories: [] },
          {
            id: 14,
            name: "Tea",
            slug: "tea",
            subcategories: [
              {
                id: 30,
                name: "Light Tea",
                slug: "light-tea",
                subcategories: [],
              },
              {
                id: 31,
                name: "Strong Tea",
                slug: "strong-tea",
                subcategories: [
                  {
                    id: 52,
                    name: "Sub Tea",
                    slug: "sub-tea",
                    subcategories: [],
                  },
                ],
              },
              {
                id: 32,
                name: "Medicinal Tea",
                slug: "medicinal-tea",
                subcategories: [],
              },
              {
                id: 33,
                name: "Spice Tea",
                slug: "spice-tea",
                subcategories: [],
              },
              {
                id: 34,
                name: "Orthodox Tea",
                slug: "orthodox-tea",
                subcategories: [],
              },
            ],
          },
        ]);
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
      const foundCategory = findCategoryById(categories, categoryId);
      return foundCategory ? foundCategory.name : null;
    }
    return null;
  };

  const findCategoryById = (items, id) => {
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

  // Recursive function to render subcategories for desktop
  const renderSubcategoriesDesktop = (subcategories) => {
    return (
      <div
        style={{
          position: "absolute",
          top: "100%",
          left: 0,
          background: "#fff",
          border: "1px solid #eee",
          borderRadius: "4px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
          padding: "8px 0",
          zIndex: 10,
          minWidth: "200px",
        }}
      >
        {subcategories.map((sub) => (
          <div key={sub.id} style={{ position: "relative" }}>
            <Link
              to={`/category/${sub.id}`}
              style={{
                display: "block",
                padding: "6px 20px",
                color: primaryColor,
                textDecoration: "none",
                fontSize: "14px",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f9f9f9";
                const nestedMenu = e.currentTarget.querySelector(
                  `.nested-subcategories-${sub.id}`
                );
                if (nestedMenu) {
                  nestedMenu.style.display = "block";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                const nestedMenu = e.currentTarget.querySelector(
                  `.nested-subcategories-${sub.id}`
                );
                if (nestedMenu) {
                  nestedMenu.style.display = "none";
                }
              }}
            >
              {sub.name}
            </Link>
            {sub.subcategories && sub.subcategories.length > 0 && (
              <div
                className={`nested-subcategories-${sub.id}`}
                style={{
                  position: "absolute",
                  left: "100%",
                  top: 0,
                  background: "#fff",
                  border: "1px solid #eee",
                  borderRadius: "4px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                  padding: "8px 0",
                  zIndex: 11,
                  minWidth: "200px",
                  display: "none",
                }}
              >
                {renderSubcategoriesDesktop(sub.subcategories)}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Recursive function to render menu items for mobile
  const renderSubMenuItemsMobile = (subcategories, level = 0) => {
    const paddingLeft = 16 + level * 16;
    return subcategories.map((sub) => (
      <React.Fragment key={sub.id}>
        {sub.subcategories && sub.subcategories.length > 0 ? (
          <SubMenu
            key={sub.id}
            title={
              <span style={{ color: primaryColor, paddingLeft }}>
                {sub.name}
              </span>
            }
          >
            {renderSubMenuItemsMobile(sub.subcategories, level + 1)}
          </SubMenu>
        ) : (
          <Menu.Item key={sub.id}>
            <Link
              to={`/category/${sub.id}`}
              style={{
                color: primaryColor,
                textDecoration: "none",
                paddingLeft,
              }}
            >
              {sub.name}
            </Link>
          </Menu.Item>
        )}
      </React.Fragment>
    ));
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
            src={
              company?.company_logo ||
              `${process.env.PUBLIC_URL}/companylogo.png`
            }
            alt={company?.company_name || "Company Logo"}
            style={{ height: 40, marginRight: 12 }}
          />{" "}
          <Title
            level={4}
            style={{
              margin: 0,
              color: primaryColor,
              fontSize: "20px",
              whiteSpace: "nowrap",
            }}
          >
            {company?.company_name || "Chocolate Factory"}
          </Title>
        </Link>

        {/* Category Links with Sub-expansion (for desktop) */}
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
                style={{ position: "relative" }}
                onMouseEnter={() => setOpenSubMenuId(category.id)}
                onMouseLeave={() => setOpenSubMenuId(null)}
              >
                <Link
                  to={`/category/${category.id}`}
                  style={{
                    padding: "8px 16px",
                    margin: "0 8px",
                    borderRadius: "24px",
                    color: primaryColor,
                    fontWeight:
                      selectedCategoryName === category.name ? "600" : "400",
                    textDecoration: "none",
                    backgroundColor:
                      selectedCategoryName === category.name
                        ? secondaryColor
                        : "transparent",
                    transition:
                      "background-color 0.3s ease, transform 0.2s ease",
                    fontSize: "15px",
                    display: "inline-block",
                  }}
                >
                  {category.name}
                </Link>
                {category.subcategories &&
                  category.subcategories.length > 0 &&
                  openSubMenuId === category.id &&
                  renderSubcategoriesDesktop(category.subcategories)}
              </div>
            ))}
          </div>
        )}

        {loading && <Spin />}
        {error && <Alert message={error} type="error" showIcon />}

        {/* Right side: Cart, Profile, Menu */}
        <Space size="large">
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
              style={{ fontSize: 24, cursor: "pointer", color: primaryColor }}
            />
          </Badge>

          <Avatar
            size="medium"
            icon={<UserOutlined />}
            style={{ cursor: "pointer", backgroundColor: primaryColor }}
            onClick={handleProfileClick}
          />

          {/* Menu Icon (Mobile) */}
          {showMenuIcon && (
            <Button
              type="text"
              icon={
                <MenuOutlined style={{ fontSize: 24, color: primaryColor }} />
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
        width={320}
        headerStyle={{
          backgroundColor: secondaryColor,
          borderBottom: "1px solid #EAEAEA",
          fontSize: "18px",
          fontWeight: 500,
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
          <Menu mode="inline" selectable={false}>
            {/* Recursive function to render menu items for mobile */}
            {categories.map((category) => (
              <React.Fragment key={category.id}>
                {category.subcategories && category.subcategories.length > 0 ? (
                  <SubMenu
                    key={category.id}
                    title={
                      <span style={{ color: primaryColor, fontWeight: 600 }}>
                        {category.name}
                      </span>
                    }
                  >
                    {/* Recursively render subcategories */}
                    {renderSubMenuItemsMobile(category.subcategories)}
                  </SubMenu>
                ) : (
                  <Menu.Item key={category.id}>
                    <Link
                      to={`/category/${category.id}`}
                      style={{
                        color: primaryColor,
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      {category.name}
                    </Link>
                  </Menu.Item>
                )}
              </React.Fragment>
            ))}
          </Menu>
        )}
      </Drawer>
    </>
  );
};

export default TopNav;
