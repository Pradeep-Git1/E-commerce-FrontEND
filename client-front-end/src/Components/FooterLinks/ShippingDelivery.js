import React from "react";
import { Collapse, Typography } from "antd";

const { Title, Paragraph } = Typography;
const { Panel } = Collapse;

const ShippingDelivery = () => {
  return (
    <div className="container mt-5">
      <Title level={2} className="text-center text-brown">🚚 Shipping & Delivery</Title>
      <Paragraph className="text-center text-muted">
        Get all the details about our shipping and delivery policies below.
      </Paragraph>

      <Collapse accordion className="mt-4 shadow-sm">
        {/* 1. Shipping Regions */}
        <Panel header="1. Where Do You Ship?" key="1">
          <Paragraph>
            We currently ship across **India & selected international locations**. Shipping availability depends on your location.
          </Paragraph>
        </Panel>

        {/* 2. Processing Time */}
        <Panel header="2. How Long Does Order Processing Take?" key="2">
          <Paragraph>
            Orders are typically processed within **1-2 business days**. Custom orders may require **extra processing time**.
          </Paragraph>
        </Panel>

        {/* 3. Estimated Delivery Time */}
        <Panel header="3. How Long Will My Order Take to Arrive?" key="3">
          <Paragraph>
            Estimated delivery times:
            <ul>
              <li>📦 **Standard Shipping** – 5-7 business days</li>
              <li>⚡ **Express Shipping** – 2-3 business days</li>
              <li>🌍 **International Shipping** – 7-14 business days</li>
            </ul>
          </Paragraph>
        </Panel>

        {/* 4. Shipping Charges */}
        <Panel header="4. How Much Does Shipping Cost?" key="4">
          <Paragraph>
            Shipping costs are calculated at checkout based on your location and order weight.  
            <ul>
              <li>🚚 **Standard Shipping** – ₹50 (free for orders above ₹999)</li>
              <li>⚡ **Express Shipping** – ₹150</li>
              <li>🌍 **International Shipping** – Varies by location</li>
            </ul>
          </Paragraph>
        </Panel>

        {/* 5. Order Tracking */}
        <Panel header="5. How Can I Track My Order?" key="5">
          <Paragraph>
            Once your order is shipped, you’ll receive a **tracking number via email/SMS**. You can track your order on our website under **Order Tracking**.
          </Paragraph>
        </Panel>

        {/* 6. Delivery Delays */}
        <Panel header="6. What If My Order Is Delayed?" key="6">
          <Paragraph>
            While we aim to deliver on time, delays may occur due to **weather, high demand, or courier issues**. If your order is delayed beyond the estimated time, contact **support@example.com**.
          </Paragraph>
        </Panel>

        {/* 7. Lost or Stolen Packages */}
        <Panel header="7. What If My Package Is Lost or Stolen?" key="7">
          <Paragraph>
            If your package is marked **delivered** but you haven’t received it, check with neighbors or your building’s reception.  
            If still missing, contact our support team within **48 hours**.
          </Paragraph>
        </Panel>

        {/* 8. International Shipping */}
        <Panel header="8. Do You Offer International Shipping?" key="8">
          <Paragraph>
            Yes, we ship internationally to selected countries. Import duties and taxes may apply, which are **not included** in the order total.
          </Paragraph>
        </Panel>

        {/* 9. Order Modifications */}
        <Panel header="9. Can I Change My Shipping Address After Placing an Order?" key="9">
          <Paragraph>
            Address changes are allowed **within 12 hours** of placing the order. Once shipped, modifications are **not possible**.
          </Paragraph>
        </Panel>

        {/* 10. Returns Due to Failed Delivery */}
        <Panel header="10. What Happens If My Order Is Returned Due to Failed Delivery?" key="10">
          <Paragraph>
            If a package is **returned due to an incorrect address or missed deliveries**, we will contact you for re-shipment (extra charges may apply).
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

export default ShippingDelivery;
