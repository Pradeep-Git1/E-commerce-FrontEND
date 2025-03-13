import React from "react";
import { List, Divider } from "antd";
import {
  HomeOutlined,
  FileTextOutlined,
  HeartOutlined,
  MessageOutlined,
  GiftOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

const UserMenu = ({ user }) => {
  if (!user) return null;

  return (
    <List>
      <List.Item>
        <HomeOutlined className="me-2" /> Addresses
      </List.Item>
      <List.Item>
        <FileTextOutlined className="me-2" /> Orders
      </List.Item>
      <List.Item>
        <HeartOutlined className="me-2" /> Wishlist
      </List.Item>
      <List.Item>
        <MessageOutlined className="me-2" /> Talk to Us
      </List.Item>
      <List.Item>
        <GiftOutlined className="me-2" /> Gift Cards
      </List.Item>
      <Divider />
      <List.Item className="text-danger fw-bold" onClick={() => alert("Logging Out")}>
        <LogoutOutlined className="me-2" /> Logout
      </List.Item>
    </List>
  );
};

export default UserMenu;
