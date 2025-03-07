import React, { useState } from "react";
import { Modal, List, Typography, Button, Radio, Input } from "antd";

const { Title, Paragraph } = Typography;

const CheckoutModal = ({ visible, onClose, cart, onProceedToPayment }) => {
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState("");
  const [addingNew, setAddingNew] = useState(false);

  // Simulated saved addresses
  const savedAddresses = [
    "123, Green Street, New Delhi, India",
    "Flat 202, Blue Towers, Bangalore, India",
    "House 10, Park Avenue, Mumbai, India",
  ];

  // Handle Address Selection
  const handleAddressChange = (e) => {
    setSelectedAddress(e.target.value);
    setAddingNew(false); // Reset if user switches back to a saved address
  };

  // Handle New Address Input
  const handleNewAddressChange = (e) => {
    setNewAddress(e.target.value);
  };

  return (
    <Modal
      title="🛍️ Review Your Order"
      visible={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={400}
    >
      {cart.length > 0 ? (
        <>
          <List
            dataSource={cart}
            renderItem={(item) => (
              <List.Item>
                <div>
                  <Title level={5} className="mb-0">{item.name}</Title>
                  <Paragraph className="mb-0 text-muted">
                    ₹{item.price} x {item.quantity} = ₹{item.price * item.quantity}
                  </Paragraph>
                </div>
              </List.Item>
            )}
          />

          {/* Address Selection */}
          <div className="mt-4">
            <Title level={5}>Select a Delivery Address</Title>
            <Radio.Group onChange={handleAddressChange} value={selectedAddress} className="w-100">
              {savedAddresses.map((address, index) => (
                <Radio key={index} value={address} className="d-block my-2">
                  {address}
                </Radio>
              ))}
              <Radio value="new" onClick={() => setAddingNew(true)} className="d-block my-2">
                Add a New Address
              </Radio>
            </Radio.Group>

            {addingNew && (
              <Input
                placeholder="Enter new address"
                value={newAddress}
                onChange={handleNewAddressChange}
                className="mt-2"
              />
            )}
          </div>

          <div className="text-center mt-3">
            <Title level={4} className="fw-bold">Total: ₹{cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}</Title>
            <Button
              type="primary"
              block
              className="mt-3"
              onClick={() => onProceedToPayment(addingNew ? newAddress : selectedAddress)}
              disabled={!selectedAddress && !newAddress}
            >
              Proceed to Payment 💳
            </Button>
            <Button type="default" block className="mt-2" onClick={onClose}>
              Back to Cart
            </Button>
          </div>
        </>
      ) : (
        <Paragraph className="text-center text-muted mt-4">Your cart is empty!</Paragraph>
      )}
    </Modal>
  );
};

export default CheckoutModal;
