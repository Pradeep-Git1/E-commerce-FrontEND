import React from "react";
import { Collapse, Typography } from "antd";

const { Title, Paragraph } = Typography;
const { Panel } = Collapse;

const PrivacyPolicy = () => {
  return (
    <div className="container mt-5">
      <Title level={2} className="text-center text-brown">🔒 Privacy Policy</Title>
      <Paragraph className="text-center text-muted">
        Your privacy is important to us. Read below to understand how we handle your data.
      </Paragraph>

      <Collapse accordion className="mt-4 shadow-sm">
        {/* 1. Introduction */}
        <Panel header="1. Introduction" key="1">
          <Paragraph>
            This Privacy Policy explains how we collect, use, and protect your personal information when you use our website.
          </Paragraph>
        </Panel>

        {/* 2. Information Collection */}
        <Panel header="2. What Information Do We Collect?" key="2">
          <Paragraph>
            We collect data including **name, email, phone number, and payment details** when you place an order or sign up for our services.
          </Paragraph>
        </Panel>

        {/* 3. How We Use Your Data */}
        <Panel header="3. How Do We Use Your Information?" key="3">
          <Paragraph>
            We use your data to:
            <ul>
              <li>Process and deliver orders</li>
              <li>Improve customer service</li>
              <li>Send updates and promotional offers</li>
              <li>Enhance website security</li>
            </ul>
          </Paragraph>
        </Panel>

        {/* 4. Data Protection */}
        <Panel header="4. How Do We Protect Your Data?" key="4">
          <Paragraph>
            We use **encryption, secure servers, and restricted access** to protect your personal data from unauthorized access.
          </Paragraph>
        </Panel>

        {/* 5. Cookies */}
        <Panel header="5. Do We Use Cookies?" key="5">
          <Paragraph>
            Yes, we use **cookies to improve your browsing experience** by remembering preferences and tracking website traffic.
          </Paragraph>
        </Panel>

        {/* 6. Third-Party Sharing */}
        <Panel header="6. Do We Share Your Information?" key="6">
          <Paragraph>
            We do not **sell or trade** your personal information. However, we may share data with **trusted partners** for payment processing and delivery.
          </Paragraph>
        </Panel>

        {/* 7. Your Rights */}
        <Panel header="7. Your Rights & Choices" key="7">
          <Paragraph>
            You have the right to **access, update, or delete** your personal data. Contact us if you wish to make any changes.
          </Paragraph>
        </Panel>

        {/* 8. Policy Updates */}
        <Panel header="8. Changes to This Policy" key="8">
          <Paragraph>
            We may update this policy from time to time. We encourage users to review it periodically for any changes.
          </Paragraph>
        </Panel>

        {/* 9. Contact Us */}
        <Panel header="9. Contact Us" key="9">
          <Paragraph>
            If you have any questions regarding this Privacy Policy, please reach out to us at **support@example.com**.
          </Paragraph>
        </Panel>
      </Collapse>

      {/* Custom Styling */}
      <style>{`
        .text-brown {
          color: #8B4513 !important;
          font-weight: bold;
        }

        .ant-collapse > .ant-collapse-item > .ant-collapse-header {
          font-weight: bold;
          font-size: 16px;
          color: #5A2D0C;
        }

        .ant-collapse-content-box {
          font-size: 15px;
          color: #333;
        }
      `}</style>
    </div>
  );
};

export default PrivacyPolicy;
