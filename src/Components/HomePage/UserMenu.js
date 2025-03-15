import React from "react";
import { LogoutOutlined } from "@ant-design/icons";
import { List, Divider, Typography, message } from "antd";
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../app/features/user/userSlice'; 

const { Text } = Typography;

const UserMenu = () => {
  const user = useSelector(state => state.user.data);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <List>
      {/* Display User Name */}
      <List.Item>
        <Text strong>{user ? user.full_name || user.email : "Guest"}</Text>
      </List.Item>

      {/* User Menu Options */}
      <List.Item>Addresses</List.Item>
      <List.Item>Orders</List.Item>
      <List.Item>Wishlist</List.Item>
      <List.Item>Talk to Us</List.Item>
      <List.Item>Gift Cards</List.Item>

      <Divider />

      {/* Logout Button */}
      {user && (
        <List.Item className="text-danger fw-bold" onClick={handleLogout} style={{ cursor: "pointer" }}>
          <LogoutOutlined className="me-2" /> Logout
        </List.Item>
      )}
    </List>
  );
};

export default UserMenu;

