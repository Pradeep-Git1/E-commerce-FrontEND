import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { Input, Typography, List, Spin, Alert, Empty, Modal, Row, Col, Card } from 'antd';
import { SearchOutlined, LoadingOutlined } from '@ant-design/icons'; // Import LoadingOutlined
import { motion } from 'framer-motion';
import { getRequest } from '../../Services/api';

// Import ProductGroupCard and lazy load ProductGroupModal
import ProductGroupCard from '../Categories/ProductGroupCard';
const ProductGroupModal = lazy(() => import('../Categories/ProductGroupModal'));

const { Title, Text } = Typography;
const { Search } = Input;

// Animation variants for Framer Motion
const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const SearchComponent = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    // Modal State
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedModalProductGroup, setSelectedModalProductGroup] = useState(null);
    const [initialModalVariantId, setInitialModalVariantId] = useState(null);

    // Debounce effect: update debouncedSearchTerm after a delay
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500); // 500ms debounce delay

        // Cleanup: clear the timeout if searchTerm changes before the delay
        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    // Effect to fetch data when debouncedSearchTerm changes
    const fetchSearchResults = useCallback(async () => {
        if (!debouncedSearchTerm.trim()) {
            setSearchResults([]);
            setError(null);
            return; // Don't search for empty queries
        }

        setLoading(true);
        setError(null); // Clear previous errors

        try {
            const response = await getRequest(`/products/search/?q=${encodeURIComponent(debouncedSearchTerm)}`);
            setSearchResults(response || []);
        } catch (err) {
            console.error("Error fetching search results:", err);
            setError(err.message || "Failed to fetch search results. Please try again.");
            setSearchResults([]); // Clear results on error
        } finally {
            setLoading(false);
        }
    }, [debouncedSearchTerm]);

    // Trigger fetch when debouncedSearchTerm changes
    useEffect(() => {
        fetchSearchResults();
    }, [fetchSearchResults]);

    // Handler for Ant Design Search component.
    const handleSearch = (value) => {
        setSearchTerm(value); // This will trigger the debounce
    };

    // Function to show the ProductGroupModal
    const showModal = useCallback((productGroup, variantId) => {
        setSelectedModalProductGroup(productGroup);
        setInitialModalVariantId(variantId);
        setIsModalVisible(true);
    }, []);

    // Function to close the ProductGroupModal
    const handleCancel = useCallback(() => {
        setIsModalVisible(false);
        setSelectedModalProductGroup(null);
        setInitialModalVariantId(null);
    }, []);

    // Determine suffix for the search bar
    const searchSuffix = loading ? <LoadingOutlined spin /> : null;
    const searchEnterButton = loading ? null : <SearchOutlined />;


    return (
        <div style={{
            padding: '10px', // Minimal padding
            maxWidth: '1200px',
            margin: '20px auto', // Reduced vertical margin
            // Removed background color and shadow to make it blend more with parent
        }}>
            <Search
                placeholder="Search for products, groups, colors, materials..." // Clear placeholder
                allowClear
                enterButton={searchEnterButton} // Use custom enter button to show loading
                size="large"
                onSearch={handleSearch}
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
                suffix={searchSuffix} // Integrated loading spinner
                style={{
                    marginBottom: '15px', // Reduced margin below search
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)', // Subtle shadow for the search bar itself
                    transition: 'box-shadow 0.3s ease-in-out', // Smooth transition for focus
                }}
            />

            {error && (
                <Alert
                    message="Error"
                    description={error}
                    type="error"
                    showIcon
                    style={{ marginBottom: '15px', borderRadius: '8px' }}
                />
            )}


            {/* Product Grid */}
            {!loading && !error && searchResults.length > 0 && (
                <Row gutter={[16, 16]} justify="center"> {/* Keep consistent gutter */}
                    {searchResults.map((productGroup) => (
                        <Col
                            key={productGroup.id}
                            xs={24}
                            sm={12}
                            md={8}
                            lg={6}
                        >
                            <motion.div
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                style={{ width: '100%', height: '100%' }}
                            >
                                <Suspense fallback={<Card loading style={{ borderRadius: '8px' }} />}>
                                    <ProductGroupCard
                                        productGroup={productGroup}
                                        onVariantSelectForModal={showModal}
                                        style={{ borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' }} // Sleeker card shadow
                                    />
                                </Suspense>
                            </motion.div>
                        </Col>
                    ))}
                </Row>
            )}

            {/* Product Modal */}
            <Suspense
                fallback={
                    <Modal visible={isModalVisible} footer={null} onCancel={handleCancel} centered>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '150px' }}>
                            <Spin size="large" tip="Loading Product Details..." />
                        </div>
                    </Modal>
                }
            >
                {isModalVisible && (
                    <ProductGroupModal
                        productGroup={selectedModalProductGroup}
                        initialSelectedVariantId={initialModalVariantId}
                        visible={isModalVisible}
                        onClose={handleCancel}
                    />
                )}
            </Suspense>
        </div>
    );
};

export default SearchComponent;