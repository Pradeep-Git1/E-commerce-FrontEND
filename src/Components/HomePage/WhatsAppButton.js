import React, { useEffect, useState } from "react";
import { WhatsAppOutlined } from "@ant-design/icons";

function WhatsAppButton({ phoneNumber }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Basic mobile detection
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleWhatsAppClick = () => {
    const isConfirmed = window.confirm(
      "You will be redirected to WhatsApp. Continue?"
    );

    if (isConfirmed) {
      let whatsappUrl = "";
      if (isMobile) {
        // Assume WhatsApp might be installed on mobile
        whatsappUrl = `https://wa.me/${phoneNumber}`;
      } else {
        // Assume WhatsApp Web is the better option for desktop
        whatsappUrl = `https://web.whatsapp.com/send?phone=${phoneNumber}`;
      }
      window.open(whatsappUrl, "_blank");
    }
  };

  const buttonStyle = {
    position: "fixed",
    bottom: "70px",
    right: "20px",
    backgroundColor: "#25D366",
    color: "white",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    zIndex: 999,
    fontSize: "1.5em",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
  };

  return (
    <div style={buttonStyle} onClick={handleWhatsAppClick}>
      <WhatsAppOutlined />
    </div>
  );
}

export default WhatsAppButton;