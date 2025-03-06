import React, { useState } from "react";
import { Layout, Row, Col, Typography, Modal } from "antd";
import { MailOutlined, PhoneOutlined, EnvironmentOutlined } from "@ant-design/icons";
import RefundPolicy from "../FooterLinks/RefundPolicy";
import PrivacyPolicy from "../FooterLinks/PrivacyPolicy";
import TermsConditions from "../FooterLinks/TermsConditions";
import FAQs from "../FooterLinks/FAQs";
import ShippingDelivery from "../FooterLinks/ShippingDelivery";

const { Footer } = Layout;
const { Title, Paragraph, Link } = Typography;

const FooterComponent = () => {
  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (component) => {
    setModalContent(component);
    setIsModalOpen(true);
  };

  return (
    <>
      <Footer className="bg-dark text-white pt-5 pb-3">
        <div className="container">
          <Row gutter={[24, 24]} justify="center">
            {/* Column 1: Company Info */}
            <Col xs={24} sm={12} md={6}>
              <Title level={4} className="text-white">🍫 Chocolate Factory</Title>
              <Paragraph className="text-white-50">
                <EnvironmentOutlined /> 123 Chocolate Street, Cocoa City, India
              </Paragraph>
              <Paragraph className="text-white-50">
                <PhoneOutlined /> +91 98765 43210
              </Paragraph>
              <Paragraph className="text-white-50">
                <MailOutlined /> support@chocoweb.com
              </Paragraph>
            </Col>

            {/* Column 2: Quick Links */}
            <Col xs={24} sm={12} md={6}>
              <Title level={4} className="text-white">Quick Links</Title>
              <ul className="list-unstyled">
                <li><Link onClick={() => openModal(<RefundPolicy />)} className="text-white-50">Refund Policy</Link></li>
                <li><Link onClick={() => openModal(<PrivacyPolicy />)} className="text-white-50">Privacy Policy</Link></li>
                <li><Link onClick={() => openModal(<TermsConditions />)} className="text-white-50">Terms & Conditions</Link></li>
                <li><Link onClick={() => openModal(<FAQs />)} className="text-white-50">FAQs</Link></li>
                <li><Link onClick={() => openModal(<ShippingDelivery />)} className="text-white-50">Shipping & Delivery</Link></li>
              </ul>
            </Col>

            {/* Column 3: Google Map */}
            <Col xs={24} sm={12} md={6}>
              <Title level={4} className="text-white">Find Us</Title>
              <iframe
                title="Google Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.825336179889!2d-122.41941548468133!3d37.77492997975821!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809c5f6b4b29%3A0x77f992c39c0f9896!2sSan+Francisco%2C+CA!5e0!3m2!1sen!2sus!4v1615551047123!5m2!1sen!2sus"
                width="100%"
                height="150"
                style={{ border: 0, borderRadius: "8px" }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </Col>
          </Row>

          {/* Footer Bottom Section */}
          <div className="text-center mt-4 text-white-50">
            © {new Date().getFullYear()} Chocolate Factory. All Rights Reserved.
          </div>
        </div>
      </Footer>

      {/* Modal for Quick Links */}
      <Modal
        open={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
        centered
      >
        {modalContent}
      </Modal>
    </>
  );
};

export default FooterComponent;
