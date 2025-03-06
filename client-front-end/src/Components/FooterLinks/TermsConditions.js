import React from "react";
import { Collapse, Typography } from "antd";

const { Title, Paragraph } = Typography;
const { Panel } = Collapse;

const TermsConditions = () => {
  return (
    <div className="container mt-5">
      <Title level={2} className="text-center text-brown">📜 Terms & Conditions</Title>
      <Paragraph className="text-center text-muted">
        Please read our terms and conditions carefully before using our website or purchasing our products.
      </Paragraph>

      <Collapse accordion className="mt-4 shadow-sm">
        {/* 1. Introduction */}
        <Panel header="1. Introduction" key="1">
          <Paragraph>
            These Terms & Conditions govern your use of our website and the purchase of our products. By accessing this website, you agree to comply with these terms.
          </Paragraph>
        </Panel>

        {/* 2. User Eligibility */}
        <Panel header="2. Who Can Use Our Website?" key="2">
          <Paragraph>
            By using our website, you confirm that you are **at least 18 years old** or using it under the supervision of a guardian.
          </Paragraph>
        </Panel>

        {/* 3. Account Registration */}
        <Panel header="3. Do I Need an Account to Purchase?" key="3">
          <Paragraph>
            You can browse our website without an account, but registration is required for order tracking, faster checkout, and exclusive offers.
          </Paragraph>
        </Panel>

        {/* 4. Order & Payment */}
        <Panel header="4. How Do Orders & Payments Work?" key="4">
          <Paragraph>
            - Orders are processed once payment is received.  
            - We accept **credit/debit cards, UPI, wallets, and net banking**.  
            - Any fraudulent transactions may lead to order cancellation.  
          </Paragraph>
        </Panel>

        {/* 5. Pricing & Availability */}
        <Panel header="5. Pricing & Product Availability" key="5">
          <Paragraph>
            Prices and availability are subject to change without notice. If a product is out of stock after purchase, we will issue a **full refund**.
          </Paragraph>
        </Panel>

        {/* 6. Shipping & Delivery */}
        <Panel header="6. Shipping & Delivery Policy" key="6">
          <Paragraph>
            Orders are shipped within the estimated time. Delays due to **weather, customs, or third-party logistics** are beyond our control.
          </Paragraph>
        </Panel>

        {/* 7. Return & Refund Policy */}
        <Panel header="7. What Is Your Refund Policy?" key="7">
          <Paragraph>
            Please refer to our <a href="/refund-policy">Refund Policy</a> for details on eligible returns, exchanges, and refunds.
          </Paragraph>
        </Panel>

        {/* 8. Intellectual Property */}
        <Panel header="8. Copyright & Intellectual Property" key="8">
          <Paragraph>
            All content on this site, including **logos, images, and text**, is owned by us. Unauthorized use is strictly prohibited.
          </Paragraph>
        </Panel>

        {/* 9. Limitation of Liability */}
        <Panel header="9. Limitation of Liability" key="9">
          <Paragraph>
            We are not responsible for **indirect, incidental, or consequential damages** arising from your use of our products or website.
          </Paragraph>
        </Panel>

        {/* 10. Updates to Terms */}
        <Panel header="10. Can These Terms Change?" key="10">
          <Paragraph>
            We may update these Terms & Conditions from time to time. Your continued use of the website implies acceptance of any changes.
          </Paragraph>
        </Panel>

        {/* 11. Contact Us */}
        <Panel header="11. How to Contact Us?" key="11">
          <Paragraph>
            If you have any questions, reach out to us at:
            <br />
            📧 **support@example.com**  
            📞 **+1-234-567-8901**
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

export default TermsConditions;
