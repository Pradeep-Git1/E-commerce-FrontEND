import React, { useState } from "react";
import { Button, Input, Typography, Form, Spin, message } from "antd";
import {
  MailOutlined,
  SendOutlined,
  ReloadOutlined,
  KeyOutlined,
  ArrowLeftOutlined, // Import the back arrow icon
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { sendOtp, login } from "../../app/features/user/userSlice"; // Correct import

const { Title } = Typography;
const primaryColor = "#593E2F"; // Consistent with TopNav

const UserLogin = ({ onLoginSuccess }) => {
  const isLoading = useSelector((state) => state.user.isLoading);
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  const handleSendOtp = async () => {
    if (!email) {
      message.error("Please enter your email address.");
      return;
    }
    try {
      await dispatch(sendOtp(email)).unwrap();
      setIsOtpSent(true);
      message.success("OTP sent to your email!");
    } catch (error) {
      message.error("Failed to send OTP. Please try again.");
    }
  };

  const handleOtpLogin = () => {
    dispatch(login({ identifier: email, otp }))
      .unwrap()
      .then(() => {
        onLoginSuccess();
      })
      .catch(() => {
        message.error("Invalid OTP.");
      });
  };

  const handleGoBackToEmail = () => {
    setIsOtpSent(false);
    setOtp("");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column", // Stack elements vertically
        gap: 16, // Add some spacing between elements
        padding: "16px 0", // Add some vertical padding within the drawer
      }}
    >
      <Title level={4} style={{ textAlign: "left", marginBottom: 12, color: primaryColor }}>
        Login with OTP
      </Title>
      <Form layout="vertical" size="large">
        <Form.Item label="Email Address">
          <Input
            placeholder="Enter your email address"
            prefix={<MailOutlined style={{ color: "rgba(0, 0, 0, 0.25)" }} />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isOtpSent}
          />
        </Form.Item>
        {!isOtpSent ? (
          <Form.Item>
            <Button
              type="primary"
              block
              onClick={handleSendOtp}
              icon={<SendOutlined />}
              loading={isLoading && !isOtpSent}
              size="large"
              style={{ backgroundColor: primaryColor, borderColor: primaryColor }}
            >
              Send OTP
            </Button>
          </Form.Item>
        ) : (
          <>
            <Form.Item label="OTP">
              <Input
                placeholder="Enter the OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                prefix={<ReloadOutlined style={{ color: "rgba(0, 0, 0, 0.25)" }} />}
                size="large"
              />
              <Typography.Text type="secondary" style={{ display: "block", marginTop: 8, fontSize: "0.9em" }}>
                Didn't receive it? Please check your spam or junk folder.
              </Typography.Text>
            </Form.Item>
            <Form.Item>
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={handleGoBackToEmail}
                style={{ marginBottom: 16 }}
              >
                Back to Email
              </Button>
              <Button
                type="primary"
                block
                onClick={handleOtpLogin}
                icon={<KeyOutlined />}
                disabled={isLoading}
                size="large"
                style={{ backgroundColor: primaryColor, borderColor: primaryColor }}
              >
                {isLoading ? <Spin size="small" /> : "Login"}
              </Button>
            </Form.Item>
          </>
        )}
      </Form>
    </div>
  );
};

export default UserLogin;