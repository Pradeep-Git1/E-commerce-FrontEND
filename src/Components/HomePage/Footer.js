import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Layout, Row, Col, Typography, Modal, Divider, Tooltip } from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  FacebookFilled,
  InstagramFilled,
  LinkedinFilled,
  TwitterSquareFilled,
  YoutubeFilled,
} from "@ant-design/icons";

import RefundPolicy from "../FooterLinks/RefundPolicy";
import PrivacyPolicy from "../FooterLinks/PrivacyPolicy";
import TermsConditions from "../FooterLinks/TermsConditions";
import FAQs from "../FooterLinks/FAQs";
import ShippingDelivery from "../FooterLinks/ShippingDelivery";

const { Footer } = Layout;
const { Title, Paragraph, Link, Text } = Typography;

const FooterComponent = () => {
  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const company = useSelector((state) => state.company.data);

  const openModal = (component) => {
    setModalContent(component);
    setIsModalOpen(true);
  };

  const isValidUrl = (url) => {
    try {
      if (!url || typeof url !== 'string') {
        return false;
      }
      const trimmedUrl = url.trim();
      return trimmedUrl === "" || new URL(trimmedUrl);
    } catch (error) {
      return false;
    }
  };

  const isValidGoogleMapsUrl = (url) =>
    typeof url === "string" && url.includes("https://www.google.com/maps/embed");

  const socialIcons = [
    { icon: <FacebookFilled />, url: company?.facebook_url, label: "Facebook" },
    { icon: <InstagramFilled />, url: company?.instagram_url, label: "Instagram" },
    { icon: <LinkedinFilled />, url: company?.linkedin_url, label: "LinkedIn" },
    { icon: <TwitterSquareFilled />, url: company?.twitter_url, label: "Twitter" },
    { icon: <YoutubeFilled />, url: company?.youtube_url, label: "YouTube" },
  ];

  return (
    <>
      <Footer
        style={{
          backgroundColor: "#1a1a1a",
          color: "#fff",
          padding: "60px 0 30px",
          fontFamily: "'Segoe UI', sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 24px",
          }}
        >
          <Row gutter={[32, 32]} justify="center">
            {/* Column 1: Company Info */}
            <Col xs={24} sm={12} md={8}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
                {company?.favicon_logo && (
                  <img
                    src={company.favicon_logo}
                    alt="favicon"
                    style={{ height: 32, width: 32, marginRight: 8, borderRadius: "6px" }}
                  />
                )}
                <Title level={4} style={{ color: "#fff", margin: 0 }}>
                  {company?.company_name || "Chocolate Factory"}
                </Title>
              </div>

              {company?.public_address && (
                <Paragraph style={infoText}>
                  <EnvironmentOutlined />{" "}
                  <span style={{ marginLeft: 6 }}>{company.public_address}</span>
                </Paragraph>
              )}
              {company?.public_contact_number && (
                <Paragraph style={infoText}>
                  <PhoneOutlined />{" "}
                  <a href={`tel:${company.public_contact_number}`} style={actionLinkStyle}>
                    <span style={{ marginLeft: 6 }}>{company.public_contact_number}</span>
                  </a>
                </Paragraph>
              )}
              {company?.public_email && (
                <Paragraph style={infoText}>
                  <MailOutlined />{" "}
                  <a href={`mailto:${company.public_email}`} style={actionLinkStyle}>
                    <span style={{ marginLeft: 6 }}>{company.public_email}</span>
                  </a>
                </Paragraph>
              )}

              {/* Social Icons */}
              <div style={{ marginTop: 16 }}>
                {socialIcons
                  .filter((item) => isValidUrl(item.url))
                  .map((item, idx) => (
                    <Tooltip title={item.label} key={idx}>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "#ccc",
                          fontSize: 20,
                          marginRight: 12,
                          transition: "color 0.3s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#ccc")}
                      >
                        {item.icon}
                      </a>
                    </Tooltip>
                  ))}
              </div>
            </Col>

            {/* Column 2: Quick Links */}
            <Col xs={24} sm={12} md={8}>
              <Title level={4} style={{ color: "#fff", marginBottom: 16 }}>
                Quick Links
              </Title>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Link onClick={() => openModal(<RefundPolicy />)} style={linkStyle}>
                  Refund Policy
                </Link>
                <Link onClick={() => openModal(<PrivacyPolicy />)} style={linkStyle}>
                  Privacy Policy
                </Link>
                <Link onClick={() => openModal(<TermsConditions />)} style={linkStyle}>
                  Terms & Conditions
                </Link>
                <Link onClick={() => openModal(<FAQs />)} style={linkStyle}>
                  FAQs
                </Link>
                <Link onClick={() => openModal(<ShippingDelivery />)} style={linkStyle}>
                  Shipping & Delivery
                </Link>
              </div>
            </Col>

            {/* Column 3: Google Map */}
            <Col xs={24} sm={24} md={8}>
              <Title level={4} style={{ color: "#fff", marginBottom: 16 }}>
                Find Us
              </Title>

              {isValidGoogleMapsUrl(company?.google_maps_url) ? (
                <iframe
                  title="Google Map"
                  src={company.google_maps_url}
                  width="100%"
                  height="180"
                  style={{ border: 0, borderRadius: "12px" }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              ) : (
                <Text type="secondary" style={{ fontSize: 14 }}>
                  Map location not available.
                </Text>
              )}
            </Col>
          </Row>

          <Divider style={{ backgroundColor: "#333", margin: "40px 0" }} />

          {/* Footer Bottom */}
          <div style={{ textAlign: "center", color: "#777", fontSize: 13 }}>
            © {new Date().getFullYear()} {company?.company_name || "Chocolate Factory"}. All rights reserved.
          </div>
        </div>
      </Footer>

      {/* Modal for Quick Links */}
      <Modal
        open={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
        centered
        bodyStyle={{ padding: 24 }}
      >
        {modalContent}
      </Modal>
    </>
  );
};

// 🔧 Reusable styles
const linkStyle = {
  color: "#bbbbbb",
  fontSize: 14,
  cursor: "pointer",
  textDecoration: "none",
  transition: "color 0.3s",
};

const infoText = {
  color: "#bbbbbb",
  fontSize: 14,
  marginBottom: 6,
};

const actionLinkStyle = {
  color: "#bbbbbb",
  textDecoration: "none",
  transition: "color 0.3s",
};

export default FooterComponent;