import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, Modal, Form, Input, message, List, Space } from 'antd';
import { postRequest, deleteRequest, getRequest } from '../../Services/api';
import { useSelector } from 'react-redux';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';

const { Text } = Typography;

function UserAddress() {
  const [addresses, setAddresses] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editAddress, setEditAddress] = useState(null);
  const [form] = Form.useForm();
  const user = useSelector((state) => state.user.data);
  const userId = user?.id;

  useEffect(() => {
    if (userId) {
      fetchUserAddresses(userId);
    }
  }, [userId]);

  const fetchUserAddresses = async (userId) => {
    try {
      const response = await getRequest(`/user-address/`);
      setAddresses(response);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const handleEdit = (address) => {
    setEditAddress(address);
    form.setFieldsValue(address);
    setEditModalVisible(true);
  };

  const handleUpdate = async (values) => {
    try {
      await postRequest(`/user-address/${editAddress.id}/`, values);
      message.success('Address updated successfully');
      setEditModalVisible(false);
      fetchUserAddresses(userId);
    } catch (error) {
      console.error('Error updating address:', error);
      message.error('Failed to update address');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteRequest(`/user-address/${id}/`);
      message.success('Address deleted successfully');
      setAddresses(addresses.filter((address) => address.id !== id));
    } catch (error) {
      console.error('Error deleting address:', error);
      message.error('Failed to delete address');
    }
  };

  const handleCreate = async (values) => {
    try {
      await postRequest('/user-address/', values);
      message.success('Address created successfully');
      setEditModalVisible(false);
      fetchUserAddresses(userId);
    } catch (error) {
      console.error('Error creating address:', error);
      message.error('Failed to create address');
    }
  };

  const handleAddAddress = () => {
    setEditAddress(null);
    form.resetFields();
    setEditModalVisible(true);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
        <Button
          type="primary"
          shape="circle"
          icon={<PlusOutlined />}
          onClick={handleAddAddress}
          size="small"
          style={{
            background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
            border: 'none',
          }}
        />
      </div>

      <AnimatePresence>
        <List
          dataSource={addresses}
          renderItem={(address) => (
            <motion.div
              key={address.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Card
                size="small"
                style={{
                  margin: '6px 0',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
                  position: 'relative',
                }}
              >
                <div style={{ padding: '10px' }}>
                  <Text strong style={{ fontSize: '14px', marginBottom: '4px', textAlign: 'center' }}>
                    {address.address_type}
                  </Text>
                  <Typography.Paragraph style={{ marginBottom: '0' }}>
                    {address.street_address}, {address.city}, {address.state}, {address.postal_code}, {address.country}
                  </Typography.Paragraph>
                </div>
                <Space size="small" style={{ position: 'absolute', top: '8px', right: '8px' }}>
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<EditOutlined />}
                    onClick={() => handleEdit(address)}
                    size="small"
                    style={{ background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)', border: 'none' }}
                  />
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(address.id)}
                    size="small"
                    style={{ background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)', border: 'none' }}
                  />
                </Space>
              </Card>
            </motion.div>
          )}
        />
      </AnimatePresence>

      <Modal
        title={editAddress ? "Edit Address" : "Add Address"}
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={editAddress ? handleUpdate : handleCreate}>
          <Form.Item name="street_address" label="Street Address">
            <Input />
          </Form.Item>
          <Form.Item name="city" label="City">
            <Input />
          </Form.Item>
          <Form.Item name="state" label="State">
            <Input />
          </Form.Item>
          <Form.Item name="postal_code" label="Postal Code">
            <Input />
          </Form.Item>
          <Form.Item name="country" label="Country">
            <Input />
          </Form.Item>
          <Form.Item name="address_type" label="Address Type">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default UserAddress;