import React, { useState } from "react";
import { LogoutOutlined, ArrowLeftOutlined, EditOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { List, Divider, Typography, Button, Input, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../app/features/user/userSlice";
import UserOrders from "./UserOrders";
import UserAddress from "./UserAddress";
import { patchRequest } from "../../Services/api"; 

const { Text } = Typography;

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
      message.success("Name updated successfully");
      setIsEditingName(false);
    } catch {
      message.error("Failed to update name");
    }
  };

  const savePhone = async () => {
    try {
      await patchRequest("/user-profile/", { phone_number: editedPhone });
      message.success("Phone number updated");
      setIsEditingPhone(false);
    } catch {
      message.error("Failed to update phone number");
    }
  };

  const renderEditableField = (label, value, isEditing, setEditing, onChange, onSave) => (
    <List.Item>
      <Text strong>{label}:</Text>&nbsp;
      {isEditing ? (
        <>
          <Input
            size="small"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{ width: "60%", marginLeft: 8 }}
          />
          <CheckOutlined onClick={onSave} style={{ marginLeft: 8, color: "green", cursor: "pointer" }} />
          <CloseOutlined onClick={() => setEditing(false)} style={{ marginLeft: 8, color: "red", cursor: "pointer" }} />
        </>
      ) : (
        <>
          <Text style={{ marginLeft: 8 }}>{value || <Text type="secondary">Not Provided</Text>}</Text>
          <EditOutlined
            onClick={() => setEditing(true)}
            style={{ marginLeft: 8, color: "#1890ff", cursor: "pointer" }}
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
            <>
              <Button icon={<ArrowLeftOutlined />} onClick={handleBack} />
              <UserOrders />
            </>
          );
        case "Addresses":
          return (
            <>
              <Button icon={<ArrowLeftOutlined />} onClick={handleBack} />
              <UserAddress />
            </>
          );
        case "Talk to Us":
          return (
            <>
              <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>Back</Button>
              <h2>Talk to Us Content</h2>
              <p>Display contact form or support information here.</p>
            </>
          );
        default:
          return null;
      }
    }

    return (
      <List>
        {renderEditableField("Name", editedName, isEditingName, setIsEditingName, setEditedName, saveName)}
        {renderEditableField("Phone", editedPhone, isEditingPhone, setIsEditingPhone, setEditedPhone, savePhone)}

        <Divider />

        <List.Item onClick={() => handleItemClick("Orders")} style={{ cursor: "pointer" }}>Orders</List.Item>
        <List.Item onClick={() => handleItemClick("Addresses")} style={{ cursor: "pointer" }}>Addresses</List.Item>
        <List.Item onClick={() => handleItemClick("Talk to Us")} style={{ cursor: "pointer" }}>Talk to Us</List.Item>

        <Divider />

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
  };

  return <div>{renderContent()}</div>;
};

export default UserMenu;
