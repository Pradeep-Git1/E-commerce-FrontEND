import React, { useState } from "react";
import { Avatar, Drawer, Button, Space, Typography } from "antd";
import { UserOutlined, MenuOutlined } from "@ant-design/icons";

const { Title } = Typography;

const categories = ["Milk", "Dark", "White", "Love", "Luxury", "Gifts"];
const chocolateColor = "#8B4513"; // Chocolate brown

const TopNav = () => {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState("Milk");

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg bg-transparent">
        <div className="container-fluid d-flex align-items-center justify-content-between py-2">
          
          {/* Logo */}
          <a href="#" className="d-flex align-items-center text-decoration-none">
            <img src="/companylogo.png" alt="Company Logo" style={{ height: 45 }} />
            <Title level={4} className="mb-0 ms-2 text-dark fw-bold">
              Chocolate Factory
            </Title>
          </a>

          {/* Desktop Navigation */}
          <div className="d-none d-lg-flex flex-grow-1 justify-content-center">
            <ul className="navbar-nav">
              {categories.map((category) => (
                <li key={category} className="nav-item mx-3">
                  <a
                    href="#"
                    onClick={() => setActive(category)}
                    className={`nav-link fw-semibold position-relative ${active === category ? "active-choco" : "text-dark"}`}
                  >
                    {category}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Side Icons */}
          <Space size="middle">
            <Avatar size="large" icon={<UserOutlined />} />
            {/* Mobile Menu Button */}
            <Button
              type="text"
              icon={<MenuOutlined style={{ fontSize: 22 }} />}
              className="d-lg-none"
              onClick={() => setVisible(true)}
            />
          </Space>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <Drawer title="Menu" placement="right" onClose={() => setVisible(false)} open={visible} width={260}>
        <ul className="list-unstyled text-center">
          {categories.map((category) => (
            <li key={category} className="my-3">
              <a
                href="#"
                onClick={() => setActive(category)}
                className={`text-dark fw-semibold fs-5 d-block position-relative ${active === category ? "active-choco" : ""}`}
              >
                {category}
              </a>
            </li>
          ))}
        </ul>
      </Drawer>

      {/* Styles for Melting Chocolate Effect */}
      <style>{`
        .active-choco {
          color: ${chocolateColor} !important;
          font-weight: bold;
        }
        
        .active-choco::after {
          content: "";
          position: absolute;
          bottom: -5px;
          left: 50%;
          width: 80%;
          height: 4px;
          background: linear-gradient(to right, #5a2d0c, #8B4513, #b36b3c);
          transform: translateX(-50%);
          border-radius: 10px;
          transition: all 0.3s ease-in-out;
        }

        .active-choco:hover::after {
          height: 6px;
          bottom: -6px;
        }
      `}</style>
    </>
  );
};

export default TopNav;
