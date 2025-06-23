import { lazy, Suspense, useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchCompanyInfo } from "../../../src/app/features/company/companySlice"; // Keep for whatsapp number
import TopNav from "./TopNav";
import MainContent from "./MainContent";
import Footer from "./Footer";
import { UpOutlined } from "@ant-design/icons";
import ChocolateLoader from "./ChocolateLoader";
import WhatsAppButton from "./WhatsAppButton";
import { motion } from "framer-motion";
// getRequest is no longer needed here as fetching is moved to App.js

// Lazy load CategoryPage with webpackPrefetch magic comment
const CategoryPage = lazy(() =>
    import(/* webpackPrefetch: true */ "../Categories/CategoryPage")
);

function ScrollToTopButton() {
    const [isVisible, setIsVisible] = useState(false);

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

// HomePage now accepts categories, categoriesLoading, and categoriesError as props
function HomePage({ categories, categoriesLoading, categoriesError }) {
    const dispatch = useDispatch();
    const companyInfo = useSelector((state) => state.company.data);
    const [whatsappNumber, setWhatsappNumber] = useState("");

    // companyInfo fetch is still here to get whatsapp number, but it's part of a global state.
    // The initial dispatch(fetchCompanyInfo()) from App.js will populate this.
    // The useEffect below is only for setting the local state once companyInfo is available.
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
        overflowX: "hidden",
        backgroundImage: "linear-gradient(2deg, rgb(53 22 3) -37%, rgba(0, 0, 0, 0))",
    };

    return (
        <Router>
            <div style={containerStyle}>
                <TopNav
                    categories={categories}
                    categoriesLoading={categoriesLoading}
                    categoriesError={categoriesError}
                />
                <div style={{ marginTop: 65 }}>
                    <Suspense fallback={<ChocolateLoader />}>
                        <Routes>
                            <Route
                                path="/"
                                element={
                                    <MainContent // Pass props to MainContent
                                        categories={categories}
                                        categoriesLoading={categoriesLoading}
                                        categoriesError={categoriesError}
                                    />
                                }
                            />
                            <Route
                                path="/category/:categoryNameSlug/:categoryId"
                                element={<CategoryPage />}
                            />
                            <Route path="/category/:categoryId" element={<CategoryPage />} />
                            <Route
                                path="*"
                                element={
                                    <MainContent
                                        categories={categories}
                                        categoriesLoading={categoriesLoading}
                                        categoriesError={categoriesError}
                                    />
                                }
                            />
                        </Routes>
                    </Suspense>
                    <Footer />
                    <ScrollToTopButton />
                    {whatsappNumber && <WhatsAppButton phoneNumber={whatsappNumber} />}
                </div>
            </div>
        </Router>
    );
}

export default HomePage;