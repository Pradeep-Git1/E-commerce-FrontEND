import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { getRequest } from "../../Services/api";
import {
    Spin,
    Alert,
    Button,
    Row,
    Col,
    Typography,
    Space,
    Skeleton,
    Card,
    Modal,
} from "antd";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal"; // Import ProductModal

const { Title, Paragraph } = Typography;

const CategoryPage = () => {
    const { categoryId } = useParams();
    const [products, setProducts] = useState([]);
    const [categoryName, setCategoryName] = useState("");
    const [subcategories, setSubcategories] = useState([]);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef();
    const productRefs = useRef([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedModalProduct, setSelectedModalProduct] = useState(null);

    const fetchCategoryData = useCallback(async () => {
        try {
            setLoading(true);
            setSelectedSubcategory(null);
            setPage(1);
            setHasMore(true);
            setProducts([]);

            const response = await getRequest(
                `/products/category/${categoryId}/?page=${1}`
            );
            setCategoryName(response.category_name);
            setSubcategories(response.subcategories || []);
            setProducts(response.products);
            setHasMore(response.has_more);
        } catch (err) {
            setError("Failed to load products. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [categoryId]);

    const fetchMoreProducts = useCallback(async () => {
        if (!hasMore || loading) return;
        try {
            setLoading(true);
            const response = await getRequest(
                `/products/category/${categoryId}/?page=${page + 1}`
            );
            setProducts((prevProducts) => [...prevProducts, ...response.products]);
            setHasMore(response.has_more);
            setPage((prevPage) => prevPage + 1);
        } catch (err) {
            setError("Failed to load more products.");
        } finally {
            setLoading(false);
        }
    }, [categoryId, page, hasMore, loading]);

    useEffect(() => {
        fetchCategoryData();
    }, [fetchCategoryData]);

    const filteredProducts = selectedSubcategory
        ? products.filter((p) => p.category_id === selectedSubcategory)
        : products;

    const handleSubcategorySelect = (subcategoryId) => {
        setSelectedSubcategory(subcategoryId);
    };

    const lastProductRef = useCallback(
        (node) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    fetchMoreProducts();
                }
            });
            if (node) observer.current.observe(node);
        },
        [loading, hasMore, fetchMoreProducts]
    );

    const handleProductVisibility = useCallback((index, node) => {
        if (!node) return;
        node.style.transform = "scale(0.8)";
        node.style.opacity = 0;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    node.style.transition =
                        "transform 0.5s ease-in-out, opacity 0.5s ease-in-out";
                    node.style.transform = "scale(1)";
                    node.style.opacity = 1;
                    observer.disconnect();
                }
            });
        });
        observer.observe(node);
    }, []);

    useEffect(() => {
        productRefs.current.forEach((ref, index) => {
            handleProductVisibility(index, ref);
        });
    }, [filteredProducts, handleProductVisibility]);

    const showModal = (product) => {
        setSelectedModalProduct(product);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setSelectedModalProduct(null);
    };

    return (
        <div style={{ padding: "5px", minHeight: "100vh" }}>
            <Title
                level={2}
                style={{ textAlign: "center", color: "#333", marginBottom: "16px" }}
            >
                {categoryName || "Loading..."}
            </Title>

            {subcategories.length > 0 && (
                <Space
                    direction="horizontal"
                    size="middle"
                    style={{
                        justifyContent: "center",
                        marginBottom: "16px",
                        display: "flex",
                        flexWrap: "wrap",
                    }}
                >
                    <Button
                        type={!selectedSubcategory ? "primary" : "default"}
                        onClick={() => setSelectedSubcategory(null)}
                    >
                        All Products
                    </Button>
                    {subcategories.map((sub) => (
                        <Button
                            key={sub.id}
                            type={selectedSubcategory === sub.id ? "primary" : "default"}
                            onClick={() => handleSubcategorySelect(sub.id)}
                        >
                            {sub.name}
                        </Button>
                    ))}
                </Space>
            )}

            {loading && page === 1 ? (
                <Row gutter={[16, 16]} justify="center">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <Col key={index} xs={24} sm={12} md={8} lg={6}>
                            <Card>
                                <Skeleton active />
                            </Card>
                        </Col>
                    ))}
                </Row>
            ) : error ? (
                <Alert
                    message={error}
                    type="error"
                    showIcon
                    style={{ marginBottom: "16px" }}
                />
            ) : (
                <>
                    {filteredProducts.length > 0 ? (
                        <Row gutter={[24, 24]} justify="center">
                            {filteredProducts.map((product, index) => (
                                <Col key={product.id} xs={12} sm={12} md={8} lg={6}>
                                    <div
                                        ref={(node) => {
                                            productRefs.current[index] = node;
                                        }}
                                    >
                                        <ProductCard product={product} onModalOpen={showModal} />
                                    </div>
                                    {index === filteredProducts.length - 1 && hasMore && (
                                        <div ref={lastProductRef} />
                                    )}
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <Paragraph
                            style={{ textAlign: "center", marginTop: "16px", color: "#777" }}
                        >
                            No products available.
                        </Paragraph>
                    )}
                </>
            )}

            {loading && page > 1 && (
                <div style={{ textAlign: "center", marginTop: "16px" }}>
                    <Spin />
                </div>
            )}
            <ProductModal
                product={selectedModalProduct}
                visible={isModalVisible}
                onClose={handleCancel}
            />
        </div>
    );
};

export default CategoryPage;