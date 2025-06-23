import React from 'react';
import { Typography, Row, Col, Alert, Spin } from 'antd';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;

// Helper function to create a URL-friendly slug
const createSlug = (name) => {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
};

// Modern Gradient Backgrounds for cards without images
const gradients = [
    'linear-gradient(135deg, #FF6B6B 0%, #FFA500 100%)', // Fiery Sunset (Red-Orange)
    'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)', // Lush Forest (Green)
    'linear-gradient(135deg, #2196F3 0%, #03A9F4 100%)', // Sky Blue Serenity (Blue)
    'linear-gradient(135deg, #9C27B0 0%, #E91E63 100%)', // Royal Bloom (Purple-Pink)
    'linear-gradient(135deg, #FFC107 0%, #FFEB3B 100%)', // Golden Hour (Yellow)
    'linear-gradient(135deg, #607D8B 0%, #90A4AE 100%)', // Steel Grey Mist (Grey)
    'linear-gradient(135deg, #FF5722 0%, #FFAB91 100%)', // Terracotta Warmth (Orange-Peach)
    'linear-gradient(135deg, #00BCD4 0%, #80DEEA 100%)', // Aqua Dream (Cyan)
    'linear-gradient(135deg, #795548 0%, #A1887F 100%)', // Earthy Tone (Brown)
    'linear-gradient(135deg, #E91E63 0%, #F48FB1 100%)', // Raspberry Kiss (Deep Pink)
];

const getGradient = (index) => {
    return gradients[index % gradients.length];
};

// Animation variants for Framer Motion
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08, // Stagger appearance of children
            delayChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 150,
            damping: 20,
        },
    },
    hover: {
        y: -8, // Bounce up effect
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 10,
        },
    },
};

const BrowseByCategories = ({ categories, loading, error }) => {
    // Flatten all categories and subcategories into a single array
    const allCategories = [];
    categories.forEach((mainCategory) => {
        allCategories.push({
            id: mainCategory.id,
            name: mainCategory.name,
            images: mainCategory.images,
            parentName: null,
            isMainCategory: true,
        });

        if (mainCategory.subcategories && mainCategory.subcategories.length > 0) {
            mainCategory.subcategories.forEach((subCategory) => {
                allCategories.push({
                    id: subCategory.id,
                    name: subCategory.name,
                    images: subCategory.images,
                    parentName: mainCategory.name,
                    isMainCategory: false,
                });
            });
        }
    });

    // --- Card-specific styles ---
    const cardContainerStyle = {
        width: '120px', // Fixed width for the card
        height: '140px', // Fixed height for the card
        borderRadius: '8px',
        overflow: 'hidden', // Ensures image/background stays within border-radius
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between', // Distributes space between image and text
        backgroundColor: '#fff', // Card background color
        transition: 'transform 0.3s ease-in-out',
        cursor: 'pointer',
    };

    const imageWrapperStyle = {
        width: '100%',
        height: '90px', // Image takes top part of the card
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px',
        overflow: 'hidden', // Essential for image radius
        flexShrink: 0, // Prevents shrinking
    };

    const imageStyle = {
        width: '100%',
        height: '100%',
        objectFit: 'cover', // Ensures the image covers the area without distortion
    };

    const initialsStyle = {
        fontSize: 36, // Larger font size for initials
        fontWeight: 700,
        color: 'white',
        textShadow: '1px 1px 3px rgba(0,0,0,0.3)',
    };

    const categoryNameStyle = {
        padding: '8px 4px', // Padding around the text
        color: '#333', // Darker font
        fontWeight: 600,
        fontSize: 13,
        textAlign: 'center',
        whiteSpace: 'normal',
        wordBreak: 'break-word',
        lineHeight: 1.3,
        flexGrow: 1, // Allows text to grow and take available space
        display: 'flex', // For vertical centering if needed
        alignItems: 'center',
        justifyContent: 'center',
    };

    if (loading) {
        return (
            <Row justify="center" align="middle" style={{ padding: '20px 0', minHeight: '150px' }}>
                <Col>
                    <Spin size="large" tip={<Text style={{ color: '#593E2F' }}>Loading Categories...</Text>} />
                </Col>
            </Row>
        );
    }

    if (error) {
        return (
            <Row justify="center" align="middle" style={{ padding: '20px', minHeight: '150px' }}>
                <Col span={22}>
                    <Alert message={error} type="error" showIcon />
                </Col>
            </Row>
        );
    }

    if (!allCategories || allCategories.length === 0) {
        return (
            <Row justify="center" align="middle" style={{ padding: '20px', minHeight: '150px' }}>
                <Col>
                    <Text style={{ color: '#cccccc' }}>No categories found.</Text>
                </Col>
            </Row>
        );
    }

    return (
        <div
            style={{
                padding: '20px 0',
                backgroundColor: 'transparent',
                marginBottom: 30,
                width: '100%',
                textAlign: 'center', // Center the title
            }}
        >
            <Title
                level={3}
                style={{
                    color: 'black',
                    marginBottom: 25,
                    fontWeight: 600,
                    padding: '0 16px', // Horizontal padding for title
                }}
            >
                Browse Our Categories
            </Title>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <Row
                    justify="center" // Center items horizontally
                    align="top"    // Align items to the top (important if names wrap)
                    gutter={[16, 24]} // Horizontal and vertical spacing between columns/rows
                    style={{ padding: '0 16px' }} // Padding for the Row itself
                >
                    {allCategories.map((category, index) => {
                        const imageUrl = category.images && category.images.length > 0 ? category.images[0].url : null;
                        const linkTo = `/category/${createSlug(category.name)}/${category.id}`

                        return (
                            <Col
                                key={category.id}
                                xs={8}   // 3 items per row on extra-small screens (e.g., mobile portrait)
                                sm={6}   // 4 items per row on small screens (e.g., mobile landscape, small tablets)
                                md={4}   // 6 items per row on medium screens (e.g., tablets)
                                lg={3}   // 8 items per row on large screens (e.g., desktops)
                                xl={2}   // 12 items per row on extra-large screens (if many categories)
                                style={{ display: 'flex', justifyContent: 'center' }} // Center the card within its column
                            >
                                <motion.div
                                    variants={itemVariants}
                                    whileHover="hover"
                                    style={cardContainerStyle}
                                >
                                    <Link to={linkTo} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%' }}>
                                        {imageUrl ? (
                                            <div style={imageWrapperStyle}>
                                                <img src={imageUrl} alt={category.name} style={imageStyle} />
                                            </div>
                                        ) : (
                                            <div
                                                style={{
                                                    ...imageWrapperStyle,
                                                    background: getGradient(index), // Apply gradient directly here
                                                }}
                                            >
                                                <span style={initialsStyle}>
                                                    {category.name ? category.name.charAt(0).toUpperCase() : ''}
                                                </span>
                                            </div>
                                        )}
                                        <Text ellipsis={{ tooltip: category.name }} style={categoryNameStyle}>{category.name}</Text>
                                    </Link>
                                </motion.div>
                            </Col>
                        );
                    })}
                </Row>
            </motion.div>
        </div>
    );
};

export default BrowseByCategories;