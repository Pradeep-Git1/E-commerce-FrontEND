// src/Components/HomePage/CheckoutModal.js

import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Checkbox,
  message,
  Typography,
  Select,
  Collapse,
  DatePicker,
  Space,
  Card,
} from "antd";
import { useSelector } from "react-redux";
import { getRequest, postRequest } from "../../Services/api";
import OrderSummary from "./OrderSummary";
import OrderConfirmationModal from "./OrderConfirmationModal";
import {
  GiftOutlined,
  HomeOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import moment from "moment";

const { Title, Text } = Typography;
const { Panel } = Collapse;
const { Option } = Select;

const appColors = {
  primary: "#1890ff",
  text: "#333",
  lightText: "#666",
  background: "#f8f8f8",
};

const CheckoutModal = ({
  combinedCart,
  checkoutModalVisible,
  handleCloseCheckoutModal,
  calculateTotal,
  getImageSrc,
}) => {
  const user = useSelector((state) => state.user.data);
  const [isGift, setIsGift] = useState(false);
  const [giftRecipientName, setGiftRecipientName] = useState("");
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddressForm] = Form.useForm();
  const [userAddresses, setUserAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [confirmationModalVisible, setConfirmationModalVisible] =
    useState(false);
  const [selectedAddressDetails, setSelectedAddressDetails] = useState(null);
  const [currentOrderId, setCurrentOrderId] = useState(null);

  useEffect(() => {
    if (checkoutModalVisible && user?.id) {
      fetchUserAddresses();
    } else if (!checkoutModalVisible) {
      // Reset state when the modal is closed
      setSelectedAddress(null);
      setSelectedAddressDetails(null);
    }
  }, [checkoutModalVisible, user?.id]);

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

  const handleNewAddressSubmit = async () => {
    try {
      const values = await newAddressForm.validateFields();
      const addressData = {
        ...values,
        is_gift: isGift,
        gift_name: isGift ? giftRecipientName : null,
      };
      await postRequest("/add-new-address", addressData);
      message.success("Address added successfully.");
      newAddressForm.resetFields();
      fetchUserAddresses();
    } catch (error) {
      message.error("Failed to add address.");
    }
  };

  const handleProceedToPayments = async () => {
    if (!selectedAddress) {
      message.error("Please select a shipping address.");
      return;
    }

    try {
      const payload = {
        address_id: selectedAddress,
        is_gift: isGift,
        gift_recipient_name: isGift ? giftRecipientName : null,
        delivery_date: deliveryDate ? deliveryDate.format("YYYY-MM-DD") : null,
        items: combinedCart.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
      };

      const response = await postRequest("/initiate-order", payload);
      if (response && response.order_id) {
        message.success("Order initialized. Review and confirm.");
        setCurrentOrderId(response.order_id);
        setConfirmationModalVisible(true);
      } else {
        message.error("Order initiation failed. Try again.");
      }
    } catch (error) {
      message.error("Server error during order initiation.");
    } finally {
      handleCloseCheckoutModal();
    }
  };

  const handleCloseConfirmationModal = () => {
    setConfirmationModalVisible(false);
  };

  const handleConfirmOrder = () => {
    setConfirmationModalVisible(false);
    handleCloseCheckoutModal();
  };

  return (
    <>
      <Modal
        title={
          <Title level={4} style={{ color: appColors.primary }}>
            Checkout
          </Title>
        }
        open={checkoutModalVisible}
        footer={null}
        closable={true}
        onCancel={handleCloseCheckoutModal}
        width={600}
        bodyStyle={{ padding: "16px" }}
      >
        <div>
          <OrderSummary
            combinedCart={combinedCart}
            calculateTotal={calculateTotal}
            getImageSrc={getImageSrc}
          />

          <div style={{ marginTop: "16px" }}>
            <Title
              level={5}
              style={{ color: appColors.text, marginBottom: "8px" }}
            >
              Shipping Details
            </Title>
            <Form layout="vertical" size="small">
              <Form.Item
                label={
                  <Text style={{ color: appColors.lightText }}>
                    Select Address
                  </Text>
                }
                name="address"
              >
                <Select
                  value={selectedAddress}
                  onChange={handleAddressChange}
                  loading={loadingAddresses}
                  disabled={loadingAddresses}
                  placeholder={
                    loadingAddresses
                      ? "Loading addresses..."
                      : userAddresses.length === 0
                      ? "No addresses available"
                      : "Select an address"
                  }
                >
                  {userAddresses.map((address) => (
                    <Option key={address.id} value={address.id}>
                      {address.street_address}, {address.city}, {address.state}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Collapse size="small">
                <Panel
                  header={
                    <Text style={{ color: appColors.lightText }}>
                      Add New Address
                    </Text>
                  }
                  key="1"
                >
                  <Form form={newAddressForm} layout="vertical" size="small">
                    <Input.Group compact>
                      <Form.Item
                        name="street_address"
                        rules={[{ required: true }]}
                        style={{ width: "70%" }}
                      >
                        <Input placeholder="Street Address" />
                      </Form.Item>
                      <Form.Item
                        name="postal_code"
                        rules={[{ required: true }]}
                        style={{ width: "30%" }}
                      >
                        <Input placeholder="Postal Code" />
                      </Form.Item>
                    </Input.Group>
                    <Form.Item name="city" rules={[{ required: true }]}>
                      <Input placeholder="City" />
                    </Form.Item>
                    <Form.Item name="state" rules={[{ required: true }]}>
                      <Input placeholder="State" />
                    </Form.Item>
                    <Form.Item name="country" rules={[{ required: true }]}>
                      <Input placeholder="Country" />
                    </Form.Item>
                    <Button
                      type="primary"
                      onClick={handleNewAddressSubmit}
                      block
                      size="small"
                    >
                      Save Address
                    </Button>
                  </Form>
                </Panel>
              </Collapse>

              <Form.Item name="isGift" valuePropName="checked">
                <Checkbox onChange={handleGiftChange}>
                  <GiftOutlined />{" "}
                  <Text style={{ color: appColors.lightText }}>
                    This is a gift
                  </Text>
                </Checkbox>
              </Form.Item>

              {isGift && (
                <Card
                  bordered
                  style={{ backgroundColor: "#fffbe6", marginBottom: 12 }}
                >
                  <Form.Item
                    label={
                      <Text style={{ color: appColors.text }}>
                        🎁 Recipient Name
                      </Text>
                    }
                    name="giftRecipientName"
                  >
                    <Input
                      value={giftRecipientName}
                      onChange={(e) => setGiftRecipientName(e.target.value)}
                      placeholder="Enter recipient's name with love 💖"
                    />
                  </Form.Item>

                  <Form.Item
                    label={
                      <Text style={{ color: appColors.text }}>
                        <CalendarOutlined /> Desired Delivery Date
                      </Text>
                    }
                  >
                    <DatePicker
                      style={{ width: "100%" }}
                      value={deliveryDate}
                      onChange={(date) => setDeliveryDate(date)}
                      disabledDate={(current) =>
                        current && current < moment().startOf("day")
                      }
                    />
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      Note: We’ll try our best to deliver close to your selected
                      date, but we cannot guarantee it. This is a token of love,
                      not a promise. ❤️
                    </Text>
                  </Form.Item>
                </Card>
              )}
            </Form>

            <Button
              type="primary"
              onClick={handleProceedToPayments}
              block
              style={{ marginTop: "12px" }}
              disabled={userAddresses.length === 0}
            >
              Confirm Order
            </Button>
            {userAddresses.length === 0 && (
              <Text type="secondary" style={{ display: "block", marginTop: "8px" }}>
                Please add a shipping address to proceed.
              </Text>
            )}
          </div>
        </div>
      </Modal>

      <OrderConfirmationModal
        visible={confirmationModalVisible}
        onClose={handleCloseConfirmationModal}
        orderId={currentOrderId}
      />
    </>
  );
};

export default CheckoutModal;