// src/Components/HomePage/CheckoutModal.js

import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Input, Checkbox, Radio, message, Typography, Select, Collapse, Space } from "antd";
import { useSelector } from "react-redux";
import { getRequest, postRequest } from "../../Services/api";
import OrderSummary from "./OrderSummary";
import OrderConfirmationModal from "./OrderConfirmationModal";
import { PlusOutlined, GiftOutlined, HomeOutlined, CreditCardOutlined, MoneyCollectOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Panel } = Collapse;
const { Option } = Select;

const appColors = {
  primary: "#1890ff",
  text: "#333",
  lightText: "#666",
  background: "#f8f8f8",
};

const CheckoutModal = ({ combinedCart, checkoutModalVisible, handleCloseCheckoutModal, calculateTotal, getImageSrc }) => {
  const user = useSelector((state) => state.user.data);
  const [isGift, setIsGift] = useState(false);
  const [giftRecipientName, setGiftRecipientName] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddressForm] = Form.useForm();
  const [userAddresses, setUserAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [paymentOption, setPaymentOption] = useState("payNow");
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
  const [selectedAddressDetails, setSelectedAddressDetails] = useState(null);

  useEffect(() => {
    if (checkoutModalVisible) {
      fetchUserAddresses();
    }
  }, [checkoutModalVisible, user]);

  const fetchUserAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const addresses = await getRequest("my-addresses");
      setUserAddresses(addresses);
      if (addresses.length > 0) {
        setSelectedAddress(addresses[0].id);
        setSelectedAddressDetails(addresses[0]);
      } else {
        setSelectedAddress(null);
        setSelectedAddressDetails(null);
      }
    } catch (error) {
      message.error("Failed to fetch addresses.");
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleGiftChange = (e) => setIsGift(e.target.checked);
  const handleAddressChange = (value) => {
    setSelectedAddress(value);
    const selected = userAddresses.find((address) => address.id === value);
    setSelectedAddressDetails(selected || null);
  };
  const handlePaymentOptionChange = (e) => setPaymentOption(e.target.value);

  const handleNewAddressSubmit = async () => {
    try {
      const values = await newAddressForm.validateFields();
      const addressData = { ...values, is_gift: isGift, gift_name: isGift ? giftRecipientName : null };
      await postRequest("/add-new-address", addressData);
      message.success("Address added successfully.");
      newAddressForm.resetFields();
      fetchUserAddresses();
    } catch (error) {
      message.error("Failed to add address.");
    }
  };

  const handleProceedToPayments = () => {
    handleCloseCheckoutModal();
    setConfirmationModalVisible(true);
    
  };

  const handleCloseConfirmationModal = () => {
    setConfirmationModalVisible(false);
  };

  const handleConfirmOrder = () => {
    message.success(`Order confirmed. Payment option: ${paymentOption}`);
    setConfirmationModalVisible(false);
    handleCloseCheckoutModal();
  };

  return (
    <>
      <Modal
        title={<Title level={4} style={{ color: appColors.primary }}>Checkout</Title>}
        open={checkoutModalVisible}
        footer={null}
        closable={true}
        onCancel={handleCloseCheckoutModal}
        width={600}
        bodyStyle={{ padding: '16px' }}
      >
        <div>
          <OrderSummary combinedCart={combinedCart} calculateTotal={calculateTotal} getImageSrc={getImageSrc} />

          <div style={{ marginTop: '16px' }}>
            <Title level={5} style={{ color: appColors.text, marginBottom: '8px' }}>Shipping Details</Title>
            <Form layout="vertical" size="small">
              <Form.Item label={<Text style={{ color: appColors.lightText }}>Select Address</Text>} name="address" icon={<HomeOutlined />} >
                <Select value={selectedAddress} onChange={handleAddressChange} loading={loadingAddresses} disabled={loadingAddresses}>
                  {userAddresses.map((address) => (
                    <Option key={address.id} value={address.id}>
                      {address.street_address}, {address.city}, {address.state}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Collapse size="small">
                <Panel header={<Text style={{ color: appColors.lightText }}>Add New Address</Text>} key="1">
                  <Form form={newAddressForm} layout="vertical" size="small">
                    <Input.Group compact>
                      <Form.Item name="street_address" rules={[{ required: true }]} style={{ width: '70%' }}><Input placeholder="Street Address" /></Form.Item>
                      <Form.Item name="postal_code" rules={[{ required: true }]} style={{ width: '30%' }}><Input placeholder="Postal Code" /></Form.Item>
                    </Input.Group>
                    <Form.Item name="city" rules={[{ required: true }]}><Input placeholder="City" /></Form.Item>
                    <Form.Item name="state" rules={[{ required: true }]}><Input placeholder="State" /></Form.Item>
                    <Form.Item name="country" rules={[{ required: true }]}><Input placeholder="Country" /></Form.Item>
                    <Button type="primary" onClick={handleNewAddressSubmit} block size="small">Save Address</Button>
                  </Form>
                </Panel>
              </Collapse>

              <Form.Item name="isGift" valuePropName="checked">
                <Checkbox onChange={handleGiftChange} icon={<GiftOutlined />}><Text style={{ color: appColors.lightText }}>This is a gift</Text></Checkbox>
              </Form.Item>

              {isGift && (
                <Form.Item label={<Text style={{ color: appColors.lightText }}>Recipient Name</Text>} name="giftRecipientName">
                  <Input value={giftRecipientName} onChange={(e) => setGiftRecipientName(e.target.value)} placeholder="Enter recipient's name" />
                </Form.Item>
              )}

              <Form.Item label={<Text style={{ color: appColors.lightText }}>Payment Option</Text>}>
                <Radio.Group value={paymentOption} onChange={handlePaymentOptionChange}>
                  <Radio value="payNow" style={{ display: 'block', marginBottom: '4px' }}>
                    <Space size="small"><CreditCardOutlined /><Text style={{ color: appColors.text }}>Pay Now</Text></Space>
                  </Radio>
                  <Radio value="payOnDelivery" style={{ display: 'block' }}>
                    <Space size="small"><MoneyCollectOutlined /><Text style={{ color: appColors.text }}>Pay on Delivery</Text></Space>
                  </Radio>
                </Radio.Group>
              </Form.Item>
            </Form>

            <Button type="primary" onClick={handleProceedToPayments} block style={{ marginTop: '12px' }}>Confirm Order</Button>
          </div>
        </div>
      </Modal>

      <OrderConfirmationModal
        visible={confirmationModalVisible}
        onClose={handleCloseConfirmationModal}
        onConfirm={handleConfirmOrder}
        orderSummary={<OrderSummary combinedCart={combinedCart} calculateTotal={calculateTotal} getImageSrc={getImageSrc} />}
        address={selectedAddressDetails}
        paymentOption={paymentOption}
      />
    </>
  );
};

export default CheckoutModal;