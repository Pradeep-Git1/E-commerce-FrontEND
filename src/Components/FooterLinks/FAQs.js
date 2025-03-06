import React from "react";
import { Collapse, Typography } from "antd";

const { Title, Paragraph } = Typography;
const { Panel } = Collapse;

const FAQs = () => {
  return (
    <div className="container mt-5">
      <Title level={2} className="text-center text-brown">🍫 Frequently Asked Questions</Title>
      <Paragraph className="text-center text-muted">
        Have questions? Find answers to the most common queries about our chocolates, customization, and more!
      </Paragraph>

      <Collapse accordion className="mt-4 shadow-sm">
        {/* 1. Chocolate Quality */}
        <Panel header="What makes your chocolates special?" key="1">
          <Paragraph>
            Our chocolates are handcrafted using **the finest cocoa beans** and **premium ingredients**, 
            ensuring a **smooth, rich, and indulgent** taste. Every piece is carefully curated for perfection.
          </Paragraph>
        </Panel>

        {/* 2. Chocolate Ingredients */}
        <Panel header="Do you use preservatives or artificial flavors?" key="2">
          <Paragraph>
            No, we believe in purity. Our chocolates are made with **natural ingredients**, 
            free from artificial flavors, preservatives, or additives. Just pure, delightful chocolate goodness!
          </Paragraph>
        </Panel>

        {/* 3. Customization */}
        <Panel header="Can I customize my chocolate box?" key="3">
          <Paragraph>
            Absolutely! You can choose your favorite chocolates, add **personalized messages**, 
            select custom packaging, and even have an **image printed** on the chocolates!
          </Paragraph>
        </Panel>

        {/* 4. Printed Image on Chocolate */}
        <Panel header="How does the image printing on chocolates work?" key="4">
          <Paragraph>
            You can upload a high-resolution image while ordering, and we **print it directly on the chocolate** 
            using edible food-grade ink, ensuring **aesthetic appeal without compromising taste**.
          </Paragraph>
        </Panel>

        {/* 5. Chocolate Shelf Life */}
        <Panel header="What is the shelf life of your chocolates?" key="5">
          <Paragraph>
            Our chocolates are **best enjoyed within 3 months** of purchase. 
            Store them in a cool, dry place (preferably below 22°C) to maintain their freshness and texture.
          </Paragraph>
        </Panel>

        {/* 6. Storage Instructions */}
        <Panel header="How should I store my chocolates?" key="6">
          <Paragraph>
            Keep chocolates **away from direct sunlight and heat**. For best results, store them in an **airtight container** 
            or a **cool, dark place**. Refrigeration may cause sugar bloom (a white coating) but does not affect taste.
          </Paragraph>
        </Panel>

        {/* 7. Nuts & Allergens */}
        <Panel header="Do your chocolates contain nuts?" key="7">
          <Paragraph>
            Some of our chocolates contain **hazelnuts, almonds, and other nuts**. 
            We take utmost care, but they are processed in the same facility, 
            so traces of nuts may be present in all products.
          </Paragraph>
        </Panel>

        {/* 8. Gift & Bulk Orders */}
        <Panel header="Do you offer bulk or gift packs for special occasions?" key="8">
          <Paragraph>
            Yes! We have beautifully curated **gift boxes** for birthdays, anniversaries, and festive occasions. 
            We also offer **corporate gifting** with customized branding and packaging.
          </Paragraph>
        </Panel>

        {/* 9. Chocolate Intensity */}
        <Panel header="What’s the difference between dark, milk, and white chocolate?" key="9">
          <Paragraph>
            - **Dark Chocolate** – Rich in cocoa, bold, and slightly bitter.  
            - **Milk Chocolate** – Creamy and smooth with a balanced sweetness.  
            - **White Chocolate** – Sweet and velvety, made from cocoa butter.
          </Paragraph>
        </Panel>

        {/* 10. Limited Editions */}
        <Panel header="Do you have seasonal or limited-edition chocolates?" key="10">
          <Paragraph>
            Yes! We launch **exclusive flavors** and **seasonal chocolates** during festivals like **Diwali, Christmas, and Valentine’s Day**. 
            Keep an eye on our collection for limited-time delights!
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

export default FAQs;
