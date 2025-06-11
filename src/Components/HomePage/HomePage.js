import { lazy, Suspense, useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { fetchCompanyInfo } from '../../../src/app/features/company/companySlice';
import TopNav from "./TopNav";
import MainContent from "./MainContent";
import Footer from "./Footer";
import { UpOutlined } from "@ant-design/icons";
import ChocolateLoader from "./ChocolateLoader";
import WhatsAppButton from "./WhatsAppButton"; 
import { motion } from 'framer-motion';

import CategoryPage from "../Categories/CategoryPage";

function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const buttonStyle = {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    color: "white",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    opacity: isVisible ? 1 : 0,
    visibility: isVisible ? "visible" : "hidden",
    transition: "opacity 0.3s ease-in-out, visibility 0.3s ease-in-out",
    zIndex: 1000,
  };

  const iconStyle = {
    fontSize: "1.5em",
  };

  return (
    <motion.div
      style={buttonStyle}
      onClick={scrollToTop}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <UpOutlined style={iconStyle} />
    </motion.div>
  );
}

function HomePage() {
  const dispatch = useDispatch();
  const companyInfo = useSelector((state) => state.company.data);
  const [whatsappNumber, setWhatsappNumber] = useState("");

  useEffect(() => {
    dispatch(fetchCompanyInfo());
  }, [dispatch]);

  useEffect(() => {
    if (companyInfo && companyInfo.whatsapp_number) {
      setWhatsappNumber(companyInfo.whatsapp_number);
    }
  }, [companyInfo]);

  const containerStyle = {
    width: "100%", 
    minHeight: "100vh", 
    display: "flex",
    flexDirection: "column",
    overflowX: 'hidden', 
  };
  return (
    <Router>
      <div style={containerStyle}>
        <TopNav />
        <div style={{ marginTop : 65}}>
        <Suspense fallback={<ChocolateLoader />}>
          <Routes>
            <Route path="/" element={<MainContent />} />
            <Route path="/category/:categoryId" element={<CategoryPage />} />
            <Route path="*" element={<MainContent />} />
          </Routes>
        </Suspense>
        <Footer />
        <ScrollToTopButton />
        {whatsappNumber && <WhatsAppButton phoneNumber={whatsappNumber} />}
      </div></div>
    </Router>
  );
}

export default HomePage;
