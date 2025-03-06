import React from "react";
import { Collapse, Typography } from "antd";

const { Title, Paragraph } = Typography;
const { Panel } = Collapse;

const RefundPolicy = () => {
  return (
    <div className="container mt-5">
      <Title level={2} className="text-center text-brown">🔄 Refund Policy</Title>
      <Paragraph className="text-center text-muted">
        We aim for 100% customer satisfaction. Read below for our refund & return policy.
      </Paragraph>

      <Collapse accordion className="mt-4 shadow-sm">
        {/* 1. Eligibility for Refund */}
        <Panel header="1. Am I Eligible for a Refund?" key="1">
          <Paragraph>
            Refunds are applicable if:
            <ul>
              <li>You received a damaged or incorrect product.</li>
              <li>Your order was not delivered within the promised timeframe.</li>
              <li>The product does not match the description on our website.</li>
            </ul>
          </Paragraph>
        </Panel>

        {/* 2. Refund Process */}
        <Panel header="2. How Do I Request a Refund?" key="2">
          <Paragraph>
            To request a refund:
            <ul>
              <li>Email us at **support@example.com** with your order details.</li>
              <li>Attach photos if the product is damaged or incorrect.</li>
              <li>We will verify your claim and process the refund within **7 business days**.</li>
            </ul>
          </Paragraph>
        </Panel>

        {/* 3. Refund Timeline */}
        <Panel header="3. When Will I Receive My Refund?" key="3">
          <Paragraph>
            Refunds are processed within **7-10 business days** after approval.
            The time it takes for the funds to reflect depends on your payment method:
            <ul>
              <li>**Credit/Debit Card** – 5-7 business days</li>
              <li>**Bank Transfer** – 7-10 business days</li>
              <li>**Wallet Payment** – 1-2 business days</li>
            </ul>
          </Paragraph>
        </Panel>

        {/* 4. Non-Refundable Cases */}
        <Panel header="4. What Purchases Are Non-Refundable?" key="4">
          <Paragraph>
            Refunds **will not be issued** for:
            <ul>
              <li>Opened or consumed food items.</li>
              <li>Orders where incorrect shipping information was provided.</li>
              <li>Products damaged due to improper storage by the customer.</li>
            </ul>
          </Paragraph>
        </Panel>

        {/* 5. Exchange Policy */}
        <Panel header="5. Can I Exchange Instead of a Refund?" key="5">
          <Paragraph>
            Yes! If you received a defective or incorrect product, you can request an **exchange** instead of a refund.
          </Paragraph>
        </Panel>

        {/* 6. Cancellations */}
        <Panel header="6. Can I Cancel My Order?" key="6">
          <Paragraph>
            Orders can only be canceled within **24 hours of placement**. After this period, cancellations are not possible.
          </Paragraph>
        </Panel>

        {/* 7. Contact for Support */}
        <Panel header="7. How Can I Contact Customer Support?" key="7">
          <Paragraph>
            For any refund or exchange queries, please contact us at:
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

export default RefundPolicy;
