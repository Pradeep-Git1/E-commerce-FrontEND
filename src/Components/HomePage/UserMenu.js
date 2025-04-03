import React, { useState } from "react";
import { LogoutOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { List, Divider, Typography, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../app/features/user/userSlice";
import UserOrders from "./UserOrders";
import UserAddress from "./UserAddress";

const { Text } = Typography;

const UserMenu = ({ onLogout }) => { // Receive the onLogout prop
  const user = useSelector((state) => state.user.data);
  const dispatch = useDispatch();
  const [selectedItem, setSelectedItem] = useState(null);

  const handleLogout = () => {
    dispatch(logout());
    if (onLogout) {
      onLogout(); // Call the prop function to update TopNav's state
    }
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const handleBack = () => {
    setSelectedItem(null);
  };

  const renderContent = () => {
    if (selectedItem) {
      // Render different components based on selectedItem
      switch (selectedItem) {
        case "Orders":
          return (
            <>
              <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
              </Button>
              <UserOrders />
            </>
          );
        case "Addresses":
          return (
            <div>
              <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
              </Button>
              <UserAddress/>
            </div>
          );
        case "Talk to Us":
          return (
            <div>
              <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
                Back
              </Button>
              <h2>Talk to Us Content</h2>
              <p>Display contact form or support information here.</p>
            </div>
          );
        default:
          return null;
      }
    } else {
      return (
        <List>
          {/* Display User Name */}
          <List.Item>
            <Text strong>{user ? user.full_name || user.email : "Guest"}</Text>
          </List.Item>

          {/* User Menu Options */}
          <List.Item
            onClick={() => handleItemClick("Orders")}
            style={{ cursor: "pointer" }}
          >
            Orders
          </List.Item>
          <List.Item
            onClick={() => handleItemClick("Addresses")}
            style={{ cursor: "pointer" }}
          >
            Addresses
          </List.Item>
          <List.Item
            onClick={() => handleItemClick("Talk to Us")}
            style={{ cursor: "pointer" }}
          >
            Talk to Us
          </List.Item>

          <Divider />

          {/* Logout Button */}
          {user && (
            <List.Item
              className="text-danger fw-bold"
              onClick={handleLogout}
              style={{ cursor: "pointer" }}
            >
              <LogoutOutlined className="me-2" /> Logout
            </List.Item>
          )}
        </List>
      );
    }
  };

  return <div>{renderContent()}</div>;
};

export default UserMenu;