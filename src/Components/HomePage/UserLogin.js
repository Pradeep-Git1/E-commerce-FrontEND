import React, { useState } from "react";
import { Button, Input, Typography, Tabs, Form, Spin } from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
  KeyOutlined,
  SendOutlined,
  ReloadOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from 'react-redux';
import { login, sendOtp, resetPassword } from '../../app/features/user/userSlice'; // Correct import

const { Title, Text, Link } = Typography;
const { TabPane } = Tabs;

const UserLogin = ({ onLoginSuccess }) => {
  const isLoading = useSelector(state => state.user.isLoading);
  const dispatch = useDispatch();
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [resetEmail, setResetEmail] = useState("");


  const handleSendOtp = () => {
    dispatch(sendOtp(loginIdentifier, () => setIsOtpSent(true)));
  };

  const handleResetPassword = () => {
    dispatch(resetPassword(resetEmail));
  };
  const handleLogin = async () => {
    dispatch(login({ identifier: loginIdentifier, password }))
      .unwrap() // Use unwrap to handle promise results
      .then(() => {
        onLoginSuccess(); // Call onLoginSuccess on successful login
      })
      .catch(() => {
        // Handle login error if needed
      });
  };

  const handleOtpLogin = () => {
    dispatch(login({ identifier: loginIdentifier, otp }))
      .unwrap()
      .then(() => {
        onLoginSuccess();
      })
      .catch(() => {
      });
  };
  return (
    <div>
      <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>
        Login
      </Title>

      <Tabs defaultActiveKey="password">
        {/* 🔹 Password Login */}
        <TabPane tab="Password Login" key="password">
          <Form layout="vertical">
            <Form.Item label="Email or Phone Number">
              <Input
                placeholder="Email or Phone Number"
                prefix={loginIdentifier.includes("@") ? <MailOutlined /> : <PhoneOutlined />}
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
              <Button type="primary" block onClick={handleLogin} icon={<KeyOutlined />} disabled={isLoading}>
                {isLoading ? <Spin /> : "Login"}
              </Button>
            </Form.Item>
            <Text style={{ textAlign: "center", display: "block", marginBottom: 10 }}>
              <Link icon={<QuestionCircleOutlined />} onClick={() => setResetEmail(loginIdentifier)}>
                Forgot Password?
              </Link>
            </Text>
          </Form>
        </TabPane>

        {/* 🔹 OTP Login */}
        <TabPane tab="OTP Login" key="otp">
          <Form layout="vertical">
            <Form.Item label="Email or Phone Number">
              <Input
                placeholder="Email or Phone Number"
                prefix={loginIdentifier.includes("@") ? <MailOutlined /> : <PhoneOutlined />}
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
              />
            </Form.Item>
            {!isOtpSent ? (
              <Form.Item>
                <Button type="default" block onClick={handleSendOtp} icon={<SendOutlined />}>
                  Send OTP
                </Button>
              </Form.Item>
            ) : (
              <>
                <Form.Item label="OTP">
                  <Input placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} prefix={<ReloadOutlined />} />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" block onClick={handleOtpLogin} icon={<KeyOutlined />} disabled={isLoading}>
                    {isLoading ? <Spin /> : "Login with OTP"}
                  </Button>
                </Form.Item>
              </>
            )}
          </Form>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default UserLogin;