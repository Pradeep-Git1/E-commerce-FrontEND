import React, { useContext } from "react";
import {  LogoutOutlined } from "@ant-design/icons";
import { List, Divider } from "antd";
import { AppContext } from "../../AppContext";

const UserMenu = ({ user }) => {
  const { logout } = useContext(AppContext);

  return (
    <List>
      <List.Item>Addresses</List.Item>
      <List.Item>Orders</List.Item>
      <List.Item>Wishlist</List.Item>
      <List.Item>Talk to Us</List.Item>
      <List.Item>Gift Cards</List.Item>
      <Divider />
      <List.Item className="text-danger fw-bold" onClick={logout}>
        <LogoutOutlined className="me-2" /> Logout
      </List.Item>
    </List>
  );
};

export default UserMenu;

