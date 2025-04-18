import React, { useState } from "react";
import { LogoutOutlined, ArrowLeftOutlined, EditOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { List, Divider, Typography, Button, Input, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../app/features/user/userSlice";
import UserOrders from "./UserOrders";
import UserAddress from "./UserAddress";
import { patchRequest } from "../../Services/api";

const { Text, Title } = Typography;

const UserMenu = ({ onLogout }) => {
  const user = useSelector((state) => state.user.data);
  const dispatch = useDispatch();
  const [selectedItem, setSelectedItem] = useState(null);

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [editedName, setEditedName] = useState(user?.full_name || "");
  const [editedPhone, setEditedPhone] = useState(user?.phone_number || "");

  const handleLogout = () => {
    dispatch(logout());
    if (onLogout) onLogout();
  };

  const handleItemClick = (item) => setSelectedItem(item);
  const handleBack = () => setSelectedItem(null);

  const saveName = async () => {
    try {
      await patchRequest("/user-profile/", { full_name: editedName });
      message.success("Name updated!");
      setIsEditingName(false);
    } catch {
      message.error("Oops, couldn't update your name.");
    }
  };

  const savePhone = async () => {
    try {
      await patchRequest("/user-profile/", { phone_number: editedPhone });
      message.success("Phone number updated!");
      setIsEditingPhone(false);
    } catch {
      message.error("Hmm, updating your phone number failed.");
    }
  };

  const renderEditableField = (label, value, isEditing, setEditing, onChange, onSave) => (
    <List.Item>
      <Text strong>{label}:</Text>{" "}
      {isEditing ? (
        <>
          <Input
            size="small"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{ width: "60%", marginLeft: 8 }}
          />
          <CheckOutlined onClick={onSave} style={{ marginLeft: 12, color: "green", cursor: "pointer" }} />
          <CloseOutlined onClick={() => setEditing(false)} style={{ marginLeft: 12, color: "red", cursor: "pointer" }} />
        </>
      ) : (
        <>
          <Text style={{ marginLeft: 8 }}>{value || <Text type="secondary">Not provided</Text>}</Text>
          <EditOutlined
            onClick={() => setEditing(true)}
            style={{ marginLeft: 12, color: "#1890ff", cursor: "pointer" }}
          />
        </>
      )}
    </List.Item>
  );

  const renderContent = () => {
    if (selectedItem) {
      switch (selectedItem) {
        case "Orders":
          return (
            <div>
              <Button icon={<ArrowLeftOutlined />} onClick={handleBack} style={{ marginBottom: 16 }}>
                Back
              </Button>
              <Title level={3}>Your Orders</Title>
              <UserOrders />
            </div>
          );
        case "Addresses":
          return (
            <div>
              <Button icon={<ArrowLeftOutlined />} onClick={handleBack} style={{ marginBottom: 16 }}>
                Back
              </Button>
              <Title level={3}>Your Addresses</Title>
              <UserAddress />
            </div>
          );
        case "Talk to Us":
          return (
            <div>
              <Button icon={<ArrowLeftOutlined />} onClick={handleBack} style={{ marginBottom: 16 }}>
                Back
              </Button>
              <Title level={3}>Let's Chat</Title>
              <Text>Have a question or need assistance? We're here to help!</Text>
              <div style={{ marginTop: 16 }}>
                {/* Add your contact form or support information here */}
                <Text type="secondary">Contact us through our support portal or call us at [Your Phone Number].</Text>
              </div>
            </div>
          );
        default:
          return null;
      }
    }

    return (
      <div>
        <Title level={2} style={{ marginBottom: 16 }}>
          Your Account
        </Title>
        <List>
          {renderEditableField("Name", editedName, isEditingName, setIsEditingName, setEditedName, saveName)}
          {renderEditableField("Phone", editedPhone, isEditingPhone, setIsEditingPhone, setEditedPhone, savePhone)}

          <Divider style={{ margin: "16px 0" }} />

          <List.Item onClick={() => handleItemClick("Orders")} style={{ cursor: "pointer" }}>
            <Text strong>Orders</Text> <Text type="secondary">View your purchase history</Text>
          </List.Item>
          <List.Item onClick={() => handleItemClick("Addresses")} style={{ cursor: "pointer" }}>
            <Text strong>Addresses</Text> <Text type="secondary">Manage your saved delivery locations</Text>
          </List.Item>
          <List.Item onClick={() => handleItemClick("Talk to Us")} style={{ cursor: "pointer" }}>
            <Text strong>Talk to Us</Text> <Text type="secondary">Get in touch with our support team</Text>
          </List.Item>

          <Divider style={{ margin: "16px 0" }} />

          {user && (
            <List.Item
              className="text-danger fw-bold"
              onClick={handleLogout}
              style={{ cursor: "pointer" }}
            >
              <LogoutOutlined className="me-2" /> <Text strong>Logout</Text>
            </List.Item>
          )}
        </List>
      </div>
    );
  };

  return <div>{renderContent()}</div>;
};

export default UserMenu;