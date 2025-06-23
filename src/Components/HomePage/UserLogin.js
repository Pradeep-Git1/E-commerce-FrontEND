import React, { useState } from "react";
import { Button, Input, Typography, Form, Spin, message, Space, Divider } from "antd";
import {
  MailOutlined,
  SendOutlined,
  ReloadOutlined,
  KeyOutlined,
  ArrowLeftOutlined,
  UnlockOutlined, // A welcoming icon for the login experience
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { sendOtp, login } from "../../app/features/user/userSlice";
import styled from "styled-components"; // Import styled-components for enhanced styling

const { Title, Text } = Typography;

// --- Define Colors for Consistency ---
const primaryColor = "#593E2F"; // A rich, deep brown
const secondaryColor = "#D2B48C"; // A warm, sandy beige

// --- Styled Components for a Richer and Responsive UI ---

const LoginFormContainer = styled.div`
  padding: 24px;
  background-color: #ffffff; /* Clean white background */
  border-radius: 12px; /* More pronounced rounded corners */
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1); /* Softer, deeper shadow for depth */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px; /* Increased spacing between major elements */
  width: 100%; /* Ensures it fills the parent container */
  max-width: 400px; /* Limits width on larger screens for better readability */
  margin: 0 auto; /* Centers the component horizontally */

  @media (max-width: 768px) {
    padding: 20px; /* Slightly less padding on smaller screens */
    border-radius: 8px; /* Slightly less rounded corners on mobile */
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08); /* Lighter shadow on mobile */
  }
`;

const StyledTitle = styled(Title)`
  color: ${primaryColor} !important;
  margin-bottom: 8px !important;
  font-size: 28px !important; /* Larger title for emphasis */
  text-align: center;
  font-weight: 700 !important; /* Bold for prominence */

  @media (max-width: 768px) {
    font-size: 24px !important; /* Adjust for mobile */
  }
`;

const PromptMessageContainer = styled.div`
  background-color: ${secondaryColor}1A; /* Light transparent overlay of secondary color */
  border-left: 5px solid ${primaryColor}; /* A strong accent border */
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 24px; /* More space below the message */
  text-align: center;
  width: 100%;
  box-sizing: border-box; /* Include padding in the width calculation */

  @media (max-width: 768px) {
    padding: 12px 15px; /* Adjust for mobile */
    border-left-width: 4px;
    margin-bottom: 20px;
  }
`;

const PromptMessageText = styled(Text)`
  color: ${primaryColor}; /* Text color consistent with brand */
  font-size: 15px; /* Optimal size for readability */
  line-height: 1.6; /* Good line height for text flow */
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 14px; /* Slightly smaller for mobile */
  }
`;

const StyledInput = styled(Input)`
  border-radius: 8px !important;
  height: 48px; /* Taller input fields for easier tapping */
  font-size: 16px !important;

  .ant-input-prefix {
    color: ${primaryColor} !important; /* Icon color matches brand */
    font-size: 18px; /* Larger icons */
    margin-right: 8px;
  }

  @media (max-width: 768px) {
    height: 44px;
    font-size: 15px !important;
    .ant-input-prefix {
      font-size: 16px;
    }
  }
`;

const StyledButton = styled(Button)`
  width: 100%;
  background-color: ${primaryColor} !important;
  border-color: ${primaryColor} !important;
  color: white !important;
  height: 52px; /* Taller buttons for prominence and tapability */
  font-size: 18px !important; /* Larger font for call to action */
  font-weight: 600 !important; /* Bolder text */
  border-radius: 8px; /* Consistent rounded corners */
  transition: background-color 0.3s ease, border-color 0.3s ease, transform 0.2s ease; /* Smooth hover effects */

  &:hover, &:focus {
    background-color: #7a5a47 !important; /* Darker shade on hover */
    border-color: #7a5a47 !important;
    transform: translateY(-2px); /* Subtle lift effect */
  }

  /* Specific styles for secondary buttons (like "Back to Email") */
  &.ant-btn-default {
    background-color: transparent !important;
    border: 1px solid ${primaryColor} !important;
    color: ${primaryColor} !important;
    height: 48px; /* Slightly smaller than primary button */
    font-size: 16px !important;
    font-weight: 500 !important;

    &:hover {
      background-color: ${secondaryColor}33 !important; /* Light highlight on hover */
      border-color: ${primaryColor} !important;
      transform: translateY(-2px);
    }
  }

  @media (max-width: 768px) {
    height: 48px;
    font-size: 16px !important;
    &.ant-btn-default {
        height: 44px;
        font-size: 15px !important;
    }
  }
`;

const SmallText = styled(Text)`
  color: #666;
  font-size: 13px;
  text-align: center;
  margin-top: 10px;
  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const StyledLink = styled.span`
  color: ${primaryColor};
  cursor: pointer;
  font-weight: 500;
  &:hover {
    text-decoration: underline;
  }
`;

const StyledDivider = styled(Divider)`
  margin: 24px 0 !important;
  .ant-divider-inner-text {
    color: ${primaryColor} !important;
    font-weight: 600;
  }
`;

// --- UserLogin Component ---

const UserLogin = ({ onLoginSuccess, promptMessage }) => {
  const isLoading = useSelector((state) => state.user.isLoading);
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  // Handler to send OTP
  const handleSendOtp = async () => {
    if (!email) {
      message.error("Please enter your email address.");
      return;
    }
    try {
      await dispatch(sendOtp(email)).unwrap(); // `unwrap()` handles rejections
      setIsOtpSent(true);
      message.success("A one-time password has been sent to your email!");
    } catch (error) {
      console.error("Failed to send OTP:", error);
      message.error(error.message || "Failed to send OTP. Please try again.");
    }
  };

  // Handler to log in with OTP
  const handleOtpLogin = async () => {
    if (!otp) {
        message.error("Please enter the OTP.");
        return;
    }
    try {
      await dispatch(login({ identifier: email, otp })).unwrap();
      onLoginSuccess(); // Trigger success callback for TopNav
      message.success("Login successful! Welcome back.");
    } catch (error) {
      console.error("Login failed:", error);
      message.error(error.message || "Invalid OTP. Please try again.");
    }
  };

  // Handler to go back to email input
  const handleGoBackToEmail = () => {
    setIsOtpSent(false);
    setOtp("");
  };

  return (
    <LoginFormContainer>
      <UnlockOutlined style={{ fontSize: '48px', color: primaryColor, marginBottom: '10px' }} />
      <StyledTitle level={3}>Log In to Your Account</StyledTitle>

      {/* Enhanced Prompt Message */}
      <PromptMessageContainer>
        <PromptMessageText>
          {/* Default message if `promptMessage` prop is not provided */}
          {promptMessage ||
            "Log in to enjoy exclusive offers and discounts, manage your orders, track shipments, and much more!"}
        </PromptMessageText>
      </PromptMessageContainer>

      <Form layout="vertical" size="large" style={{ width: "100%" }}>
        <Form.Item label="Email Address">
          <StyledInput
            placeholder="your.email@example.com"
            prefix={<MailOutlined />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isOtpSent || isLoading} // Disable input while loading or OTP sent
          />
        </Form.Item>

        {!isOtpSent ? (
          <Form.Item>
            <StyledButton
              type="primary"
              block
              onClick={handleSendOtp}
              icon={<SendOutlined />}
              loading={isLoading}
            >
              Send OTP
            </StyledButton>
          </Form.Item>
        ) : (
          <>
            <Form.Item label="Enter OTP">
              <StyledInput
                placeholder="Enter the 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                prefix={<KeyOutlined />}
              />
              <SmallText style={{ display: "block", marginTop: 8 }}>
                Didn't receive it? Please check your spam or junk folder.
                {/* You could add a "Resend OTP" button here */}
              </SmallText>
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <StyledButton
                  block
                  onClick={handleGoBackToEmail}
                  icon={<ArrowLeftOutlined />}
                  type="default" // Use default type for a secondary button style
                >
                  Back to Email
                </StyledButton>
                <StyledButton
                  type="primary"
                  block
                  onClick={handleOtpLogin}
                  icon={<UnlockOutlined />}
                  loading={isLoading}
                >
                  {isLoading ? <Spin size="small" /> : "Login"}
                </StyledButton>
              </Space>
            </Form.Item>
          </>
        )}
      </Form>

    </LoginFormContainer>
  );
};

export default UserLogin;