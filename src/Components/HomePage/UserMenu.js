import React, { useState, useEffect } from "react";
import {
  LogoutOutlined,
  ArrowLeftOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  HomeOutlined,
  PhoneOutlined,
  MessageOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { List, Divider, Typography, Button, Input, message, Space } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../app/features/user/userSlice";
import UserOrders from "./UserOrders";
import UserAddress from "./UserAddress";
import { patchRequest } from "../../Services/api";
import { fetchCompanyInfo } from "../../../src/app/features/company/companySlice";
import WhatsAppButton from "./WhatsAppButton";

const { Text, Title } = Typography;

const UserMenu = ({ onLogout }) => {
  const user = useSelector((state) => state.user.data);
  const companyInfo = useSelector((state) => state.company.data);
  const dispatch = useDispatch();
  const [selectedItem, setSelectedItem] = useState(null);

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);

  // Helper function to check if a value should be considered "not provided"
  // This helps in initializing the state as well as rendering
  const isNotProvidedValue = (value) => {
    return value === null || value === undefined || (typeof value === 'string' && (value.trim() === '' || value.trim().toLowerCase() === 'none'));
  };

  // Initialize editedName: If user?.full_name is not "None" (or null/undefined/empty), use it; otherwise, use an empty string.
  const [editedName, setEditedName] = useState(
    isNotProvidedValue(user?.full_name) ? "" : user.full_name
  );

  // Initialize editedPhone: Same logic as editedName
  const [editedPhone, setEditedPhone] = useState(
    isNotProvidedValue(user?.phone_number) ? "" : user.phone_number
  );

  useEffect(() => {
    dispatch(fetchCompanyInfo());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    if (onLogout) onLogout();
  };

  const handleItemClick = (item) => setSelectedItem(item);
  const handleBack = () => setSelectedItem(null);

  const saveName = async () => {
    try {
      await patchRequest("/user-profile/", { full_name: editedName });
      message.success("Name updated successfully!");
      setIsEditingName(false);
    } catch {
      message.error("Failed to update name. Please try again.");
    }
  };

  const savePhone = async () => {
    try {
      await patchRequest("/user-profile/", { phone_number: editedPhone });
      message.success("Phone number updated successfully!");
      setIsEditingPhone(false);
    } catch {
      message.error("Failed to update phone number. Please try again.");
    }
  };


  const renderEditableField = (label, value, isEditing, setEditing, onChange, onSave) => (
    <List.Item>
      <Space>
        <Text strong>{label}:</Text>
        {isEditing ? (
          <Space>
            <Input
              size="small"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              style={{ width: "150px" }}
            />
            <CheckOutlined onClick={onSave} style={{ color: "green", cursor: "pointer" }} />
            <CloseOutlined onClick={() => setEditing(false)} style={{ color: "red", cursor: "pointer" }} />
          </Space>
        ) : (
          <Space>
            {/* Display "Not provided" if the value is considered missing */}
            {isNotProvidedValue(value) ? ( // Using the same helper for consistent display
              <Text type="secondary">Not provided</Text>
            ) : (
              <Text>{value}</Text>
            )}
            <EditOutlined onClick={() => setEditing(true)} style={{ color: "#1890ff", cursor: "pointer" }} />
          </Space>
        )}
      </Space>
    </List.Item>
  );

  const renderContent = () => {
    if (selectedItem) {
      switch (selectedItem) {
        case "Orders":
          return (
            <div style={contentContainer}>
              <Button icon={<ArrowLeftOutlined />} onClick={handleBack} style={backButton}>
                Back
              </Button>
              <Title level={3} style={titleStyle}>
                Your Orders
              </Title>
              <UserOrders />
            </div>
          );
        case "Addresses":
          return (
            <div style={contentContainer}>
              <Button icon={<ArrowLeftOutlined />} onClick={handleBack} style={backButton}>
                Back
              </Button>
              <Title level={3} style={titleStyle}>
                Your Addresses
              </Title>
              <UserAddress />
            </div>
          );
        case "Talk to Us":
          return (
            <div style={contentContainer}>
              <Button icon={<ArrowLeftOutlined />} onClick={handleBack} style={backButton}>
                Back
              </Button>
              <Title level={3} style={titleStyle}>
                Let's Chat
              </Title>
              <Text style={paragraphStyle}>Have a question or need assistance? Contact us directly:</Text>
              <div style={{ marginTop: 24 }}>
                <Space direction="vertical">
                  {companyInfo?.public_contact_number && (
                    <Button
                      type="link"
                      icon={<PhoneOutlined />}
                      href={`tel:${companyInfo.public_contact_number}`}
                      style={contactButtonStyle}
                    >
                      Call us
                    </Button>
                  )}
                  {companyInfo?.public_email && (
                    <Button
                      type="link"
                      icon={<MailOutlined />}
                      href={`mailto:${companyInfo.public_email}`}
                      style={contactButtonStyle}
                    >
                      Email us
                    </Button>
                  )}
                  {companyInfo?.whatsapp_number && (
                    <WhatsAppButton phoneNumber={companyInfo.whatsapp_number} />
                  )}
                </Space>
              </div>
            </div>
          );
        default:
          return null;
      }
    }

    // Determine the display name for the header using the same helper
    const displayName = isNotProvidedValue(user?.full_name) ? "Guest User" : user.full_name;

    return (
      <div style={menuContainer}>
        <div style={headerContainer}>
          <Title level={3} style={userName}>
            {displayName} {/* Use the calculated display name */}
          </Title>
          {user?.email && <Text type="secondary">{user.email}</Text>}
        </div>
        <Divider style={dividerStyle} />
        <List>
          {/* Pass the edited values to renderEditableField */}
          {renderEditableField("Name", editedName, isEditingName, setIsEditingName, setEditedName, saveName)}
          {renderEditableField("Phone", editedPhone, isEditingPhone, setIsEditingPhone, setEditedPhone, savePhone)}
        </List>
        <Divider style={dividerStyle} />
        <List>
          <List.Item onClick={() => handleItemClick("Orders")} style={listItem}>
            <Space>
              <HomeOutlined />
              <Text strong>Orders</Text>
            </Space>
          </List.Item>
          <List.Item onClick={() => handleItemClick("Addresses")} style={listItem}>
            <Space>
              <HomeOutlined />
              <Text strong>Addresses</Text>
            </Space>
          </List.Item>
          <List.Item onClick={() => handleItemClick("Talk to Us")} style={listItem}>
            <Space>
              <MessageOutlined />
              <Text strong>Talk to Us</Text>
            </Space>
          </List.Item>
        </List>
        <Divider style={dividerStyle} />
        {user && (
          <List.Item onClick={handleLogout} style={logoutItem}>
            <Space>
              <LogoutOutlined />
              <Text strong>Logout</Text>
            </Space>
          </List.Item>
        )}
      </div>
    );
  };

  // --- Styles ---
  const menuContainer = {
    padding: 20,
  };

  const headerContainer = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    marginBottom: 24,
  };

  const userName = {
    margin: "8px 0 0",
  };

  const dividerStyle = {
    margin: "16px 0",
    borderColor: "#d9d9d9",
  };

  const listItem = {
    cursor: "pointer",
    padding: "12px 0",
  };

  const logoutItem = {
    cursor: "pointer",
    padding: "12px 0",
    color: "#ff4d4f",
  };

  const contentContainer = {
    padding: 20,
  };

  const backButton = {
    marginBottom: 16,
  };

  const titleStyle = {
    marginBottom: 16,
  };

  const paragraphStyle = {
    lineHeight: 1.6,
    marginBottom: 16,
  };

  const contactButtonStyle = {
    padding: 0,
    marginBottom: 8,
    display: "flex",
    alignItems: "center",
  };

  return <div>{renderContent()}</div>;
};

export default UserMenu;