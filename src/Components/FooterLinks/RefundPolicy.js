import React from "react";
import { Collapse, Typography } from "antd";

const { Title, Paragraph } = Typography;
const { Panel } = Collapse;

const RefundPolicy = () => {
  return (
    <div className="container mt-5">
      <Title level={2} className="text-center text-brown">
        🔄 Refund & Cancellation Policy
      </Title>
      <Paragraph className="text-center text-muted">
        We aim for 100% customer satisfaction. Read below for our refund, return, and cancellation policy.
      </Paragraph>

      <Collapse accordion className="mt-4 shadow-sm">
        {/* Cancellation */}
        <Panel header="1. Order Cancellation Policy" key="1">
          <Paragraph>
            <strong>General Policy:</strong> Once you place an order, we cannot cancel it. However, you can cancel your order within two hours of placing it. Depending on your cancellation history, Chocosing may deny a refund, even if canceled within the two-hour window.
          </Paragraph>
          <Paragraph>
            <strong>Cancellation Process:</strong> You can cancel your order by calling Customer Care or emailing <a href="mailto:contact@chocosing.com">contact@chocosing.com</a>. If you cancel within two hours of placing the order, we will process the cancellation; otherwise, we will consider the order as successful.
          </Paragraph>
          <Paragraph>
            <strong>Chocosing’s Right to Review:</strong> We reserve the right to assess cancellation requests. If your request meets our conditions, we will process the cancellation and issue a refund.
          </Paragraph>
          <Paragraph>
            <strong>Conditions for Chocosing to Cancel Orders:</strong>
            <ul>
              <li>We are unable to contact you at the time of delivery.</li>
              <li>We fail to deliver due to insufficient information or authorization from you.</li>
              <li>You provide an incorrect address or request delivery outside our service area.</li>
            </ul>
          </Paragraph>
        </Panel>

        {/* Refund */}
        <Panel header="2. Refund Policy" key="2">
          <Paragraph>
            <strong>Damaged or Tampered Items:</strong> If we deliver a damaged or tampered item, you can request a refund. Please contact Customer Care or email a photo of the damaged items to <a href="mailto:contact@chocosing.com">contact@chocosing.com</a>.
          </Paragraph>
          <Paragraph>
            <strong>Refund Assessment:</strong> We will review the issue and assess your eligibility based on the conditions mentioned. If we approve your request, you will receive up to 100% of the order value. Our refund decisions are final.
          </Paragraph>
          <Paragraph>
            <strong>Refund Process:</strong> Once we approve your refund request, it may take 7-10 business days for the amount to be credited back to your original payment method. We strive to make your refund process smooth and efficient.
          </Paragraph>
        </Panel>

        {/* 3. Refund Timeline */}
        <Panel header="3. When Will I Receive My Refund?" key="3">
          <Paragraph>
            Refunds are processed within 7-10 business days after approval.
            The time it takes for the funds to reflect depends on your payment method:
            <ul>
              <li><strong>Credit/Debit Card</strong> – 5-7 business days</li>
              <li><strong>Bank Transfer</strong> – 7-10 business days</li>
              <li><strong>Wallet Payment</strong> – 1-2 business days</li>
            </ul>
          </Paragraph>
        </Panel>

        {/* 4. Non-Refundable Cases */}
        <Panel header="4. What Purchases Are Non-Refundable?" key="4">
          <Paragraph>
            Refunds <strong>will not be issued</strong> for:
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
            Yes! If you received a defective or incorrect product, you can request an <strong>exchange</strong> instead of a refund.
          </Paragraph>
        </Panel>

        {/* 6. Contact for Support */}
        <Panel header="6. How Can I Contact Customer Support?" key="6">
          <Paragraph>
            For any refund or exchange queries, please contact us at:
            <br />
            📧 <a href="mailto:contact@chocosing.com">contact@chocosing.com</a>
            <br />
            📞 +1-234-567-8901
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