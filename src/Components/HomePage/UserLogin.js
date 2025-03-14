import React, { useContext, useState } from "react";
import { Button, Input, Typography, Tabs, Form, message, Space } from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
  KeyOutlined,
  SendOutlined,
  ReloadOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { AppContext } from "../../AppContext";

const { Title, Text, Link } = Typography;
const { TabPane } = Tabs;

const UserLogin = () => {
  const { login, sendOtp, resetPassword } = useContext(AppContext);
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const handleLogin = () => {
    login(loginIdentifier, password);
  };

  const handleSendOtp = async () => {
    try {
      await sendOtp(loginIdentifier);
      setIsOtpSent(true);
      message.success("OTP sent successfully!");
    } catch (error) {
      message.error("Failed to send OTP. Please try again.");
    }
  };

  const handleOtpLogin = async () => {
    try {
      await login(loginIdentifier, otp, true);
    } catch (error) {
      message.error("Invalid OTP or login failed.");
    }
  };

  const handleResetPassword = async () => {
    try {
      await resetPassword(resetEmail);
      message.success("Password reset link sent to your email.");
    } catch (error) {
      message.error("Failed to send reset link. Please try again.");
    }
  };

  return (
    <div>
      <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>
        Login
      </Title>

      <Tabs defaultActiveKey="password">
        <TabPane tab="Password Login" key="password">
          <Form layout="vertical">
            <Form.Item
              label="Email or Phone Number"
              rules={[{ required: true, message: "Please enter your email or phone number" }]}
            >
              <Input
                placeholder="Email or Phone Number"
                prefix={loginIdentifier.includes("@") ? <MailOutlined /> : <PhoneOutlined />}
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Password" rules={[{ required: true, message: "Please enter your password" }]}>
              <Input.Password
                placeholder="Password"
                prefix={<LockOutlined />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" block onClick={handleLogin} icon={<KeyOutlined />}>
                Login
              </Button>
            </Form.Item>
            <Text style={{ textAlign: "center", display: "block", marginBottom: 10 }}>
              <Link onClick={() => {}} icon={<QuestionCircleOutlined />}>
                Forgot Password?
              </Link>
            </Text>
          </Form>
        </TabPane>

        <TabPane tab="OTP Login" key="otp">
          <Form layout="vertical">
            <Form.Item
              label="Email or Phone Number"
              rules={[{ required: true, message: "Please enter your email or phone number" }]}
            >
              <Input
                placeholder="Email or Phone Number"
                prefix={loginIdentifier.includes("@") ? <MailOutlined /> : <PhoneOutlined />}
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
              />
            </Form.Item>
            {!isOtpSent && (
              <Form.Item>
                <Button type="default" block onClick={handleSendOtp} icon={<SendOutlined />}>
                  Send OTP
                </Button>
              </Form.Item>
            )}
            {isOtpSent && (
              <Form.Item label="OTP" rules={[{ required: true, message: "Please enter the OTP" }]}>
                <Input placeholder="OTP" value={otp} onChange={(e) => setOtp(e.target.value)} prefix={<ReloadOutlined />} />
              </Form.Item>
            )}
            {isOtpSent && (
              <Form.Item>
                <Button type="primary" block onClick={handleOtpLogin} icon={<KeyOutlined />}>
                  Login with OTP
                </Button>
              </Form.Item>
            )}
          </Form>
        </TabPane>

        <TabPane tab="Reset Password" key="reset">
          <Form layout="vertical">
            <Form.Item
              label="Email Address"
              rules={[{ required: true, message: "Please enter your email address" }]}
            >
              <Input
                placeholder="Email Address"
                prefix={<MailOutlined />}
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <Button type="default" block onClick={handleResetPassword} icon={<SendOutlined />}>
                Send Reset Link
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default UserLogin;