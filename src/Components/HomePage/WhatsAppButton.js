import React, { useEffect, useState } from "react";

function WhatsAppButton({ phoneNumber }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
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
        whatsappUrl = `https://wa.me/${phoneNumber}`;
      } else {
        whatsappUrl = `https://web.whatsapp.com/send?phone=${phoneNumber}`;
      }
      window.open(whatsappUrl, "_blank");
    }
  };

  const buttonStyle = {
    position: "fixed",
    bottom: "70px",
    right: "15px",
    width: "50px",
    height: "50px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    zIndex: 999,
    boxShadow: "0 0 20px rgba(37, 211, 102, 0.5)", // Subtle glow (WhatsApp green)
    borderRadius: "10%", // Make it round
    transition: "transform 0.2s ease-in-out, background-color 0.2s ease-in-out", // Smooth transition
  };

  const imageStyle = {
    width: "100%",
    height: "100%",
    borderRadius: "10%", 
  };

  return (
    <div
      style={buttonStyle}
      onClick={handleWhatsAppClick}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "scale(1.1)"; // Slightly larger on hover
        e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.6)"; // Slightly more transparent on hover
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
      }}
    >
      <img
        src={`${process.env.PUBLIC_URL}/images/CS.png`}
        alt="WhatsApp Support"
        style={imageStyle}
      />
    </div>
  );
}

export default WhatsAppButton;
