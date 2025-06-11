import React from "react";
import { Collapse, Typography } from "antd";

const { Title, Paragraph } = Typography;
const { Panel } = Collapse;

const PrivacyPolicy = () => {
  return (
    <div className="container mt-5">
      <Title level={2} className="text-center text-brown">
        🔒 Privacy Policy
      </Title>
      <Paragraph className="text-center text-muted">
        ChocoSign is committed to safeguarding your personal information. Read below to understand how we handle your data.
      </Paragraph>

      <Collapse accordion className="mt-4 shadow-sm">
        {/* 1. Scope of Definition */}
        <Panel header="1. Scope of Definition" key="1">
          <Paragraph>
            ChocoSign is committed to safeguarding your personal information as you use our website. Before you use the website operated by ChocoSign, please review this Privacy Policy carefully. We prioritize your privacy and value the trust you place in us. By using our website and the services we offer, you consent to the collection, use, and disclosure of your information as described in this Privacy Policy.
          </Paragraph>
        </Panel>

        {/* 2. Information Collection */}
        <Panel header="2. Information Collection" key="2">
          <Paragraph>
            When you use the ChocoSign website, we collect the following information:
            <ul>
              <li><strong>Personal Information:</strong> Name, mobile number, email address, and personal address.</li>
              <li><strong>Billing Details:</strong> Address and payment method. Please note that we do not collect credit/debit card numbers, expiry dates, or other card details. Our online payment partner, CashFree, securely processes this information.</li>
              <li><strong>Automatically Collected Information:</strong> We may collect information through technologies like Internet Protocol (IP) addresses and cookies without your active submission. These methods do not store or collect personal data.</li>
            </ul>
          </Paragraph>
        </Panel>

        {/* 3. Use of Information */}
        <Panel header="3. Use of Information" key="3">
          <Paragraph>
            We use the collected information to:
            <ul>
              <li><strong>Personalize Your Experience:</strong> We tailor the website to your preferences and improve our services based on your feedback.</li>
              <li><strong>Communicate:</strong> We administer contests, promotions, surveys, and other site features. You will also receive periodic emails. You can opt out anytime by updating your preferences.</li>
              <li><strong>Payment Processing:</strong> We handle payments and notify you about changes to our site and services to ensure compliance with our terms and applicable laws.</li>
              <li><strong>No Third-Party Marketing:</strong> We do not sell or share your information for third-party marketing purposes.</li>
            </ul>
          </Paragraph>
        </Panel>

        {/* 4. Third-party services */}
        <Panel header="4. Third-party services" key="4">
          <Paragraph>
            Our website may contain links to third-party websites, applications, and services. Please review the privacy policies of these third parties before engaging with their services. We only disclose your information in the following cases:
            <ul>
              <li><strong>Business Transitions:</strong> If we sell, merge, or restructure our business, we may transfer your information to a third party. We will ensure your privacy rights remain protected.</li>
              <li><strong>Verification:</strong> We may allow third-party service providers to process your data for verification purposes. They must follow our security and data protection standards.</li>
            </ul>
          </Paragraph>
        </Panel>

        {/* 5. Policy Changes */}
        <Panel header="5. Policy Changes" key="5">
          <Paragraph>
            Any changes to our information collection or usage practices will be communicated via Email, SMS, Mobile application, or website notifications.
          </Paragraph>
        </Panel>

        {/* 6. Contact Us */}
        <Panel header="6. Contact Us" key="6">
          <Paragraph>
            For any questions about this privacy statement, please reach out to us at <a href="mailto:sales@chocosign.in">sales@chocosign.in</a>.
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