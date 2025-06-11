import React, { useState, useEffect, useCallback, useRef, lazy, Suspense } from "react";
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
import styled from "styled-components"; // For more granular control over responsive styles

import ProductGroupCard from "./ProductGroupCard";
import ProductGroupModal from "./ProductGroupModal";
const { Title, Paragraph } = Typography;

// Styled components for responsive design
const StyledCategoryPageContainer = styled.div`
    padding: 8px; /* Reduced padding for mobile, still provides some space */

    @media (min-width: 576px) { /* sm breakpoint */
        padding: 16px;
    }

    @media (min-width: 768px) { /* md breakpoint */
        padding: 24px;
    }
`;

const StyledTitle = styled(Title)`
    text-align: center;
    color: #333;
    margin-bottom: 12px; /* Reduced margin for mobile */
    font-size: 1.8em !important; /* Base font size for mobile H2 */

    @media (min-width: 576px) {
        font-size: 2em !important;
        margin-bottom: 16px;
    }

    @media (min-width: 768px) {
        font-size: 2.2em !important;
    }
`;

const StyledSubcategorySpace = styled(Space)`
    justify-content: center;
    margin-bottom: 12px;
    display: flex;
    flex-wrap: wrap;
    padding: 0 4px; /* Slightly reduced horizontal padding */

    .ant-btn {
        margin: 4px; /* Space between buttons */
    }

    @media (min-width: 768px) {
        margin-bottom: 16px;
        padding: 0 8px;
    }
`;

const StyledProductGridRow = styled(Row)`
    margin: 0 4px; /* Reduced horizontal margin for the grid */

    @media (min-width: 576px) {
        margin: 0 8px;
    }
`;

const StyledAlert = styled(Alert)`
    margin: 0 8px 12px; /* Consistent margin */
`;

const StyledParagraph = styled(Paragraph)`
    text-align: center;
    margin-top: 12px;
    color: #777;
    font-size: 0.9em; /* Smaller font for message */

    @media (min-width: 576px) {
        font-size: 1em;
    }
`;

// Helper function to map product groups to subcategories based on name/description
const mapProductGroupToSubcategory = (productGroup, subcategories) => {
    const productName = productGroup.name.toLowerCase();
    const productDescription = productGroup.variants[0]?.description?.toLowerCase() || '';

    const subcategoryMap = new Map();
    subcategories.forEach(sub => {
        const normalizedName = sub.name.toLowerCase().replace(/\s*(collections|specials)\s*$/, '');
        subcategoryMap.set(normalizedName, sub.id);
    });

    // --- Prioritized and Specific Rules ---
    if (productName.includes("birthday") || productDescription.includes("birthday")) {
        return subcategoryMap.get("birthday");
    }
    if (productName.includes("truffle") || productDescription.includes("truffle")) {
        return subcategoryMap.get("truffle");
    }
    if (productName.includes("bar") || productDescription.includes("bar")) {
        return subcategoryMap.get("bar");
    }
    if (productName.includes("dark") || productDescription.includes("dark")) {
        return subcategoryMap.get("dark");
    }
    if (productName.includes("milk") || productDescription.includes("milk")) {
        return subcategoryMap.get("milk");
    }
    if (productName.includes("white") || productDescription.includes("white")) {
        return subcategoryMap.get("white");
    }
    if (
        productName.includes("mango") || productDescription.includes("mango") ||
        productName.includes("strawberry") || productDescription.includes("strawberry") ||
        productName.includes("zesty") || productDescription.includes("zesty") ||
        productName.includes("gulkand") || productDescription.includes("gulkand") ||
        productName.includes("almond") || productDescription.includes("almond") ||
        productName.includes("cashew") || productDescription.includes("cashew") ||
        productName.includes("crunch") || productDescription.includes("crunch") ||
        productName.includes("nut") || productDescription.includes("nut") ||
        productName.includes("snuggle") || productDescription.includes("snuggle") ||
        productName.includes("glacé") || productDescription.includes("glacé") ||
        productName.includes("fantasy") || productDescription.includes("fantasy") ||
        productName.includes("dream") || productDescription.includes("dream") ||
        productName.includes("delight") || productDescription.includes("delight") ||
        productName.includes("aura") || productDescription.includes("aura")
    ) {
        return subcategoryMap.get("flavored");
    }

    return null;
};


const CategoryPage = () => {
    const { categoryId } = useParams();
    const [productGroups, setProductGroups] = useState([]);
    const [categoryName, setCategoryName] = useState("");
    const [subcategories, setSubcategories] = useState([]);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedModalProductGroup, setSelectedModalProductGroup] = useState(null);
    const [initialModalVariantId, setInitialModalVariantId] = useState(null);

    const fetchCategoryData = useCallback(async () => {
        try {
            setLoading(true);
            setSelectedSubcategory(null); // Reset subcategory filter when category changes
            setPage(1);
            setHasMore(true);
            setProductGroups([]);

            const response = await getRequest(
                `/products/category/${categoryId}/?page=${1}`
            );

            setCategoryName(response.category_name);
            setSubcategories(response.subcategories || []);
            setProductGroups(response.product_groups || []);
            setHasMore(response.has_more);
        } catch (err) {
            console.error("Failed to load category data:", err);
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
            setProductGroups((prevProductGroups) => [
                ...prevProductGroups,
                ...(response.product_groups || []),
            ]);
            setHasMore(response.has_more);
            setPage((prevPage) => prevPage + 1);
        } catch (err) {
            console.error("Failed to load more products:", err);
            setError("Failed to load more products.");
        } finally {
            setLoading(false);
        }
    }, [categoryId, page, hasMore, loading]);

    useEffect(() => {
        fetchCategoryData();
    }, [fetchCategoryData]);

    const filteredProductGroups = selectedSubcategory
        ? productGroups.filter((group) =>
            mapProductGroupToSubcategory(group, subcategories) === selectedSubcategory
          )
        : productGroups;

    const handleSubcategorySelect = (subcategoryId) => {
        setSelectedSubcategory(subcategoryId);
    };

    const lastProductGroupRef = useCallback(
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

    const showModal = (productGroup, variantId) => {
        setSelectedModalProductGroup(productGroup);
        setInitialModalVariantId(variantId);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setSelectedModalProductGroup(null);
        setInitialModalVariantId(null);
    };

    return (
        <StyledCategoryPageContainer>
            <StyledTitle level={2}>
                {categoryName || "Loading..."}
            </StyledTitle>

            {/* Subcategory Buttons */}
            {subcategories.length > 0 && (
                <StyledSubcategorySpace
                    direction="horizontal"
                    size={[4, 8]} // Smaller gap on mobile, slightly larger for wrap
                >
                    <Button
                        type={!selectedSubcategory ? "primary" : "default"}
                        onClick={() => setSelectedSubcategory(null)}
                        size="small" // Small size for mobile buttons
                    >
                        All Products
                    </Button>
                    {subcategories.map((sub) => (
                        <Button
                            key={sub.id}
                            type={selectedSubcategory === sub.id ? "primary" : "default"}
                            onClick={() => handleSubcategorySelect(sub.id)}
                            size="small" // Small size for mobile buttons
                        >
                            {sub.name}
                        </Button>
                    ))}
                </StyledSubcategorySpace>
            )}

            {/* Loading Skeletons */}
            {loading && page === 1 ? (
                <StyledProductGridRow gutter={[8, 8]} justify="center"> {/* Smaller gutter for mobile */}
                    {Array.from({ length: 8 }).map((_, index) => (
                        <Col key={index} xs={12} sm={12} md={8} lg={6} xl={4}> {/* xs=12 for 2 columns on mobile */}
                            <Card>
                                <Skeleton active />
                            </Card>
                        </Col>
                    ))}
                </StyledProductGridRow>
            ) : error ? (
                <StyledAlert
                    message={error}
                    type="error"
                    showIcon
                />
            ) : (
                <>
                    {/* Product Grid */}
                    {filteredProductGroups.length > 0 ? (
                        <StyledProductGridRow gutter={[8, 8]} justify="center"> {/* Smaller gutter for mobile */}
                            {filteredProductGroups.map((productGroup, index) => (
                                <Col key={productGroup.id} xs={12} sm={12} md={8} lg={6} xl={4}>
                                    <div>
                                        <Suspense fallback={<Card loading />}>
                                            <ProductGroupCard
                                                productGroup={productGroup}
                                                onVariantSelectForModal={showModal}
                                            />
                                        </Suspense>
                                    </div>
                                    {index === filteredProductGroups.length - 1 && hasMore && (
                                        <div ref={lastProductGroupRef} style={{ height: "20px" }} />
                                    )}
                                </Col>
                            ))}
                        </StyledProductGridRow>
                    ) : (
                        <StyledParagraph>
                            No products available for this selection.
                        </StyledParagraph>
                    )}
                </>
            )}

            {/* More Products Loading Spinner */}
            {loading && page > 1 && (
                <div style={{ textAlign: "center", marginTop: "12px" }}>
                    <Spin />
                </div>
            )}

            {/* Product Modal */}
            <Suspense
                fallback={
                    <Modal visible={isModalVisible} footer={null} onCancel={handleCancel}>
                        <Spin />
                    </Modal>
                }
            >
                <ProductGroupModal
                    productGroup={selectedModalProductGroup}
                    initialSelectedVariantId={initialModalVariantId}
                    visible={isModalVisible}
                    onClose={handleCancel}
                />
            </Suspense>
        </StyledCategoryPageContainer>
    );
};

export default CategoryPage;