import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, message, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../../app/features/user/userSlice';
import { CloseOutlined } from '@ant-design/icons'; // For the custom close button

const { Text } = Typography;

const UserInfoPromptModal = ({ isModalVisible, onClose, onInfoSaved, onSkip }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.data);
  const isLoading = useSelector((state) => state.user.isLoading);
  const [form] = Form.useForm();

  // Set initial form values if user data is available
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        full_name: user.full_name || '',
        phone_number: user.phone_number || '',
      });
    }
  }, [user, form, isModalVisible]);

  const onFinish = async (values) => {
    try {
      await dispatch(updateProfile(values)).unwrap();
      message.success("Profile updated successfully!");
      if (onInfoSaved) {
        onInfoSaved(); // Inform parent that info was saved
      }
    } catch (error) {
      console.error("UserInfoPromptModal: Error on profile update:", error);
      // Error message already handled by updateProfile thunk by the Redux thunk
    }
  };

  const handleSkip = () => {
    message.info("Profile update skipped for now.");
    if (onSkip) {
      onSkip(); // Inform parent that it was skipped
    }
  };

  return (
    <Modal
      title={null} // Hide default title
      open={isModalVisible}
      onCancel={onClose}
      footer={null} // Hide default footer
      closable={false} // We'll add a custom close button
      maskClosable={false} // Prevent closing by clicking outside to encourage action
      destroyOnClose={true} // Ensures form state is reset each time it opens
      centered // Keeps the modal centered
      width={400} // Set a fixed width for a more controlled look
      bodyStyle={{ padding: 0 }} // Remove default body padding to control internal spacing
      style={{ borderRadius: '12px', overflow: 'hidden' }} // Rounded corners for the modal itself
      wrapClassName="semi-dark-modal-wrap" // For potential global overrides if needed
    >
      <div style={{
        backgroundColor: '#2C3E50', // Dark Slate Gray for background
        padding: '30px',
        position: 'relative', // For absolute positioning of close button
        borderRadius: '12px', // Ensure internal content matches modal border radius
      }}>
        {/* Custom Close Button */}
        <Button
          type="text"
          icon={<CloseOutlined style={{ color: '#BDC3C7' }} />} // Light gray icon
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            fontSize: '18px',
            height: 'auto',
            width: 'auto',
            padding: '5px',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            transition: 'color 0.2s ease',
          }}
          className="modal-close-button"
        />

        {/* Title and Description */}
        <Typography.Title level={4} style={{ color: '#ECF0F1', marginBottom: '10px' }}> {/* Light text */}
          Welcome Back!
        </Typography.Title>
        <Text style={{ color: '#BDC3C7', fontSize: '15px', display: 'block', marginBottom: '25px' }}> {/* Slightly darker light text */}
          Just a couple more details to get you set up.
        </Text>

        {/* Form */}
        <Form
          form={form}
          name="user_info_prompt"
          onFinish={onFinish}
          layout="vertical"
          initialValues={{
            full_name: user?.full_name || '',
            phone_number: user?.phone_number || '',
          }}
        >
          <Form.Item
            name="full_name"
            label={<Text style={{ color: '#BDC3C7', fontWeight: 500 }}>Full Name</Text>}
            rules={[{ required: true, message: 'Please enter your full name!' }]}
          >
            <Input
              placeholder="e.g., Jane Doe"
              style={{
                backgroundColor: '#34495E', // Darker blue-gray for input background
                borderColor: '#4A6178', // Slightly lighter border
                color: '#ECF0F1', // Light text input
                borderRadius: '8px',
                padding: '10px 15px',
                fontSize: '15px',
              }}
            />
          </Form.Item>
          <Form.Item
            name="phone_number"
            label={<Text style={{ color: '#BDC3C7', fontWeight: 500 }}>Phone Number</Text>}
            rules={[
              { required: true, message: 'Please enter your phone number!' },
              { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit number!' },
            ]}
          >
            <Input
              placeholder="e.g., 1234567890"
              style={{
                backgroundColor: '#34495E',
                borderColor: '#4A6178',
                color: '#ECF0F1',
                borderRadius: '8px',
                padding: '10px 15px',
                fontSize: '15px',
              }}
            />
          </Form.Item>

          {/* Action Buttons */}
          <Form.Item style={{ marginTop: '30px', marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              style={{
                backgroundColor: '#593E2F', // Your primary color, slightly muted for semi-dark
                borderColor: '#593E2F',
                color: '#FDFBF6', // Off-white for strong contrast
                borderRadius: '8px',
                padding: '10px 25px',
                height: 'auto', // Allow padding to dictate height
                fontSize: '16px',
                fontWeight: 600,
                marginRight: '15px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Soft shadow
                transition: 'all 0.3s ease',
              }}
              className="save-button-custom"
            >
              Save Details
            </Button>
            <Button
              onClick={handleSkip}
              disabled={isLoading}
              style={{
                backgroundColor: 'transparent',
                borderColor: 'transparent', // No border for a softer look
                color: '#BDC3C7', // Light gray text
                borderRadius: '8px',
                padding: '10px 15px',
                height: 'auto',
                fontSize: '15px',
                transition: 'all 0.3s ease',
              }}
              className="skip-button-custom"
            >
              Skip for now
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default UserInfoPromptModal;