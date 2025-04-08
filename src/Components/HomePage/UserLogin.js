import React, { useState } from "react";
import { Button, Input, Typography, Tabs, Form, Spin, message } from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
  KeyOutlined,
  SendOutlined,
  ReloadOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import {
  login,
  sendOtp,
  resetPassword,
} from "../../app/features/user/userSlice"; // Correct import

const { Title, Text, Link } = Typography;
const { TabPane } = Tabs;

const UserLogin = ({ onLoginSuccess }) => {
  const isLoading = useSelector((state) => state.user.isLoading);
  const dispatch = useDispatch();
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const handleSendOtp = async () => {
    try {
      await dispatch(sendOtp(loginIdentifier)).unwrap();
      setIsOtpSent(true);
      message.success("OTP sent successfully!");
    } catch (error) {
      message.error("Failed to send OTP. Please try again."); // Handle potential errors
    }
  };

  const handleResetPassword = () => {
    dispatch(resetPassword(resetEmail));
  };

  const handleLogin = async () => {
    dispatch(login({ identifier: loginIdentifier, password }))
      .unwrap()
      .then(() => {
        onLoginSuccess();
      })
      .catch(() => {
        message.error("Invalid email/phone or password.");
      });
  };

  const handleOtpLogin = () => {
    dispatch(login({ identifier: loginIdentifier, otp }))
      .unwrap()
      .then(() => {
        onLoginSuccess();
      })
      .catch(() => {
        message.error("Invalid OTP."); // Provide user feedback for OTP login failure
      });
  };

  return (
    <div>
      <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>
        Login
      </Title>

      <Tabs defaultActiveKey="otp">
        <TabPane tab="OTP Login" key="otp">
          <Form layout="vertical">
            <Form.Item label="Email or Phone Number">
              <Input
                placeholder="Email or Phone Number"
                prefix={
                  loginIdentifier.includes("@") ? (
                    <MailOutlined />
                  ) : (
                    <PhoneOutlined />
                  )
                }
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                disabled={isOtpSent} // Disable the input after OTP is sent
              />
            </Form.Item>
            {!isOtpSent ? (
              <Form.Item>
                <Button
                  type="default"
                  block
                  onClick={handleSendOtp}
                  icon={<SendOutlined />}
                  loading={isLoading && !isOtpSent}
                >
                  Send OTP
                </Button>
              </Form.Item>
            ) : (
              <>
                <Form.Item label="OTP">
                  <Input
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    prefix={<ReloadOutlined />}
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    block
                    onClick={handleOtpLogin}
                    icon={<KeyOutlined />}
                    disabled={isLoading}
                  >
                    {isLoading ? <Spin /> : "Login with OTP"}
                  </Button>
                </Form.Item>
              </>
            )}
          </Form>
        </TabPane>

        {/* 🔹 Password Login */}
        <TabPane tab="Password Login" key="password">
          <Form layout="vertical">
            <Form.Item label="Email or Phone Number">
              <Input
                placeholder="Email or Phone Number"
                prefix={
                  loginIdentifier.includes("@") ? (
                    <MailOutlined />
                  ) : (
                    <PhoneOutlined />
                  )
                }
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Password">
              <Input.Password
                placeholder="Password"
                prefix={<LockOutlined />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                block
                onClick={handleLogin}
                icon={<KeyOutlined />}
                disabled={isLoading}
              >
                {isLoading ? <Spin /> : "Login"}
              </Button>
            </Form.Item>
            <Text
              style={{
                textAlign: "center",
                display: "block",
                marginBottom: 10,
              }}
            >
              <Link
                icon={<QuestionCircleOutlined />}
                onClick={() => setResetEmail(loginIdentifier)}
              >
                Forgot Password?
              </Link>
            </Text>
          </Form>
        </TabPane>

        {/* 🔹 OTP Login */}
      </Tabs>
    </div>
  );
};

export default UserLogin;
