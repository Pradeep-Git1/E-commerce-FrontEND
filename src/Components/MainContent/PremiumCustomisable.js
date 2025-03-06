import React, { useState } from "react";
import { Card, Typography, Button, Select, Slider, Radio, Row, Col, Divider, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;
const { Option } = Select;

// Chocolate Types
const chocolateTypes = [
  { value: "Dark", label: "Dark Chocolate", price: 200 },
  { value: "Milk", label: "Milk Chocolate", price: 180 },
  { value: "White", label: "White Chocolate", price: 190 },
];

// Toppings
const toppings = [
  { value: "Almonds", label: "Almonds", price: 50 },
  { value: "Hazelnuts", label: "Hazelnuts", price: 60 },
  { value: "Caramel", label: "Caramel", price: 40 },
  { value: "Sea Salt", label: "Sea Salt", price: 30 },
  { value: "Coconut", label: "Coconut Flakes", price: 45 },
];

// Box Contents
const boxContents = [
  { value: "Assorted", label: "Assorted Chocolates", price: 250 },
  { value: "Truffles", label: "Truffle Collection", price: 300 },
  { value: "Nutty", label: "Nutty Selection", price: 280 },
  { value: "Fruit", label: "Fruit-Infused Chocolates", price: 270 },
];

// Packaging Options
const packagingOptions = [
  { value: "Gold", label: "Gold Foil", price: 100 },
  { value: "LuxuryBox", label: "Luxury Gift Box", price: 150 },
  { value: "ClassicWrap", label: "Classic Wrap", price: 50 },
];

const PremiumCustomisable = () => {
  const [selectedChocolate, setSelectedChocolate] = useState(chocolateTypes[0]);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [selectedContents, setSelectedContents] = useState(boxContents[0]);
  const [selectedPackaging, setSelectedPackaging] = useState(packagingOptions[0]);
  const [quantity, setQuantity] = useState(1);
  const [uploadedImages, setUploadedImages] = useState([]);

  // Calculate Total Price
  const totalPrice =
    selectedChocolate.price +
    selectedToppings.reduce((sum, t) => sum + toppings.find(top => top.value === t).price, 0) +
    selectedContents.price +
    selectedPackaging.price +
    quantity * 50; // Additional cost per unit

  return (
    <div className="container-fluid px-3 mt-4 overflow-hidden">
      <Title level={2} className="text-center text-gold">🍫 Create Your Premium Custom Chocolate</Title>
      <Paragraph className="text-center text-muted">
        Design your perfect chocolate box! Choose your base, toppings, contents, and add a personal touch with a printed image.
      </Paragraph>

      <Row gutter={[16, 16]} justify="center">
        {/* Left Section - Selection */}
        <Col xs={24} md={12}>
          <Card className="shadow-sm p-4 custom-card" style={{ width: "100%" }}>
            <Title level={4} className="text-maroon mb-3">Customize Your Chocolate</Title>

            {/* Select Chocolate Type */}
            <Paragraph className="fw-bold">Select Chocolate Type:</Paragraph>
            <Select
              className="w-100 mb-3"
              value={selectedChocolate.value}
              onChange={(value) => setSelectedChocolate(chocolateTypes.find(c => c.value === value))}
            >
              {chocolateTypes.map((choco) => (
                <Option key={choco.value} value={choco.value}>{choco.label} (+₹{choco.price})</Option>
              ))}
            </Select>

            {/* Select Toppings */}
            <Paragraph className="fw-bold">Choose Toppings:</Paragraph>
            <Select
              mode="multiple"
              className="w-100 mb-3"
              placeholder="Select up to 3 toppings"
              value={selectedToppings}
              onChange={setSelectedToppings}
              maxTagCount={3}
            >
              {toppings.map((top) => (
                <Option key={top.value} value={top.value}>{top.label} (+₹{top.price})</Option>
              ))}
            </Select>

            {/* Select Box Contents */}
            <Paragraph className="fw-bold">Choose Box Contents:</Paragraph>
            <Select
              className="w-100 mb-3"
              value={selectedContents.value}
              onChange={(value) => setSelectedContents(boxContents.find(c => c.value === value))}
            >
              {boxContents.map((content) => (
                <Option key={content.value} value={content.value}>{content.label} (+₹{content.price})</Option>
              ))}
            </Select>

            {/* Select Packaging */}
            <Paragraph className="fw-bold">Choose Packaging:</Paragraph>
            <Radio.Group
              value={selectedPackaging.value}
              onChange={(e) => setSelectedPackaging(packagingOptions.find(p => p.value === e.target.value))}
              className="mb-3"
            >
              {packagingOptions.map((pack) => (
                <Radio key={pack.value} value={pack.value}>{pack.label} (+₹{pack.price})</Radio>
              ))}
            </Radio.Group>

            {/* Upload Custom Image */}
            <Paragraph className="fw-bold">Upload Custom Image for Print:</Paragraph>
            <Upload
              multiple
              beforeUpload={(file) => {
                setUploadedImages([...uploadedImages, file]);
                return false;
              }}
              fileList={uploadedImages}
              className="mb-3"
            >
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>

            {/* Quantity Selection */}
            <Paragraph className="fw-bold">Quantity:</Paragraph>
            <Slider
              min={1}
              max={10}
              value={quantity}
              onChange={setQuantity}
              tooltipVisible
            />
            <Paragraph className="text-muted">Selected: {quantity} Box(es)</Paragraph>
          </Card>
        </Col>

        {/* Right Section - Live Preview */}
        <Col xs={24} md={8}>
          <Card className="shadow-lg p-4 custom-card text-center" style={{ width: "100%" }}>
            <Title level={4} className="text-maroon">Your Selection</Title>

            <Paragraph><strong>Chocolate:</strong> {selectedChocolate.label}</Paragraph>
            <Paragraph><strong>Toppings:</strong> {selectedToppings.length > 0 ? selectedToppings.join(", ") : "None"}</Paragraph>
            <Paragraph><strong>Box Contents:</strong> {selectedContents.label}</Paragraph>
            <Paragraph><strong>Packaging:</strong> {selectedPackaging.label}</Paragraph>
            <Paragraph><strong>Quantity:</strong> {quantity} Box(es)</Paragraph>

            <Divider />
            <Title level={3} className="text-gold">Total: ₹{totalPrice}</Title>

            <Button type="primary" className="custom-btn mt-3">
              Customize Now 🎨
            </Button>
          </Card>
        </Col>
      </Row>

      {/* Custom Styling */}
      <style>
        {`
          .text-gold { color: #b8860b !important; font-weight: bold; }
          .text-maroon { color: #800000 !important; font-weight: bold; }
          .custom-card { border-radius: 12px; }
          .custom-btn { background: linear-gradient(to right, #d4af37, #b8860b); border: none; font-weight: bold; padding: 12px 24px; border-radius: 8px; }
        `}
      </style>
    </div>
  );
};

export default PremiumCustomisable;
