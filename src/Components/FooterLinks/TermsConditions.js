import React from "react";
import { Collapse, Typography } from "antd";

const { Title, Paragraph } = Typography;
const { Panel } = Collapse;

const TermsConditions = () => {
  return (
    <div className="container mt-5">
      <Title level={2} className="text-center text-brown">
        📜 Terms & Conditions
      </Title>
      <Paragraph className="text-center text-muted">
        Please read our terms and conditions carefully before using our website or purchasing our products.
      </Paragraph>

      <Collapse accordion className="mt-4 shadow-sm">
        {/* 1. Use of the Website */}
        <Panel header="1. Use of the Website" key="1">
          <Paragraph>
            We grant you a limited, non-exclusive, non-transferable, and revocable license to use our website. You agree not to:
            <ul>
              <li>Use the website for any unlawful purpose.</li>
              <li>Copy or distribute any part of the website without prior written consent.</li>
              <li>Interfere with or disrupt the operation of the website.</li>
            </ul>
          </Paragraph>
        </Panel>

        {/* 2. Payment and Refund Policies */}
        <Panel header="2. Payment and Refund Policies" key="2">
          <Paragraph>
            Payment is required at the time of purchase. Refunds are subject to our refund policy, which you can review on our <a href="/refund-policy">Refund Policy</a> page.
          </Paragraph>
        </Panel>

        {/* 3. Privacy and Data Protection */}
        <Panel header="3. Privacy and Data Protection" key="3">
          <Paragraph>
            We value your privacy and are committed to protecting your personal information. To learn more about how we handle your data, please read our <a href="/privacy-policy">Privacy Policy</a>.
          </Paragraph>
        </Panel>

        {/* 4. Limitation of Liability */}
        <Panel header="4. Limitation of Liability" key="4">
          <Paragraph>
            To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, or consequential damages arising from your use of the website or purchase of products.
          </Paragraph>
        </Panel>

        {/* 5. Changes to the Terms of Service */}
        <Panel header="5. Changes to the Terms of Service" key="5">
          <Paragraph>
            We reserve the right to modify this Agreement at any time. Your continued use of the website after such changes constitutes your acceptance of the new terms.
          </Paragraph>
        </Panel>

        {/* 6. Contact Us */}
        <Panel header="6. Contact Us" key="6">
          <Paragraph>
            If you have any questions about these Terms of Service, please contact us at <a href="mailto:sales@chocosign.in">contact@chocosign.in</a>.
          </Paragraph>
        </Panel>

        {/* 7. User Eligibility */}
        <Panel header="7. Who Can Use Our Website?" key="7">
          <Paragraph>
            By using our website, you confirm that you are <strong>at least 18 years old</strong> or using it under the supervision of a guardian.
          </Paragraph>
        </Panel>

        {/* 8. Account Registration */}
        <Panel header="8. Do I Need an Account to Purchase?" key="8">
          <Paragraph>
            You can browse our website without an account, but registration is required for order tracking, faster checkout, and exclusive offers.
          </Paragraph>
        </Panel>

        {/* 9. Order & Payment */}
        <Panel header="9. How Do Orders & Payments Work?" key="9">
          <Paragraph>
            <ul>
              <li>Orders are processed once payment is received.</li>
              <li>We accept <strong>credit/debit cards, UPI, wallets, and net banking</strong>.</li>
              <li>Any fraudulent transactions may lead to order cancellation.</li>
            </ul>
          </Paragraph>
        </Panel>

        {/* 10. Pricing & Availability */}
        <Panel header="10. Pricing & Product Availability" key="10">
          <Paragraph>
            Prices and availability are subject to change without notice. If a product is out of stock after purchase, we will issue a <strong>full refund</strong>.
          </Paragraph>
        </Panel>

        {/* 11. Shipping & Delivery */}
        <Panel header="11. Shipping & Delivery Policy" key="11">
          <Paragraph>
            Orders are shipped within the estimated time. Delays due to <strong>weather, customs, or third-party logistics</strong> are beyond our control.
          </Paragraph>
        </Panel>

        {/* 12. Return & Refund Policy */}
        <Panel header="12. What Is Your Refund Policy?" key="12">
          <Paragraph>
            Please refer to our <a href="/refund-policy">Refund Policy</a> for details on eligible returns, exchanges, and refunds.
          </Paragraph>
        </Panel>

        {/* 13. Intellectual Property */}
        <Panel header="13. Copyright & Intellectual Property" key="13">
          <Paragraph>
            All content on this site, including <strong>logos, images, and text</strong>, is owned by us. Unauthorized use is strictly prohibited.
          </Paragraph>
        </Panel>

        {/* 14. Updates to Terms */}
        <Panel header="14. Can These Terms Change?" key="14">
          <Paragraph>
            We may update these Terms & Conditions from time to time. Your continued use of the website implies acceptance of any changes.
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