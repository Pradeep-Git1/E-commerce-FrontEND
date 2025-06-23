import React, { useState, useEffect, useCallback, useRef, lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import { getRequest } from "../../Services/api";
import SearchComponent from "../HomePage/SearchComponent";
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
import styled from "styled-components";

import ProductGroupCard from "./ProductGroupCard";
const ProductGroupModal = lazy(() => import("./ProductGroupModal"));

const { Title, Paragraph } = Typography;

// ---
// Styled Components
// ---

const StyledCategoryPageContainer = styled.div`
    padding: 10px; /* Increased padding for better spacing */
    margin: 20px auto; /* Center the container with some margin */
    max-width: 1200px; /* Max width for large screens to keep content readable */
    width: 95%; /* Responsive width */

`;

const StyledTitle = styled(Title)`
    text-align: center;
    color: #333;
    margin-bottom: 24px !important; /* Increased margin for title */
    font-size: 2em !important;

    @media (min-width: 576px) {
        font-size: 2.2em !important;
        margin-bottom: 28px !important;
    }

    @media (min-width: 768px) {
        font-size: 2.5em !important;
        margin-bottom: 32px !important;
    }
`;

const StyledSubcategorySpace = styled(Space)`
    justify-content: center;
    margin-bottom: 24px; /* Adjusted margin */
    display: flex;
    flex-wrap: wrap;
    padding: 0 8px;

    .ant-btn {
        margin: 6px; /* Slightly increased button margin */
        padding: 6px 15px; /* Adjust padding for button size */
    }

    @media (min-width: 768px) {
        margin-bottom: 32px;
        padding: 0 12px;
    }
`;

const StyledProductGridRow = styled(Row)`
    margin: 0 8px; /* Increased margin */

    @media (min-width: 576px) {
        margin: 0 12px;
    }
`;

const StyledAlert = styled(Alert)`
    margin: 0 16px 20px; /* Adjusted margin for alert */
`;

const StyledParagraph = styled(Paragraph)`
    text-align: center;
    margin-top: 20px; /* Adjusted margin */
    color: #777;
    font-size: 1em;

    @media (min-width: 576px) {
        font-size: 1.1em;
    }
`;

// ---
// Helper Functions
// ---

// Helper function to extract all product groups from a nested category structure
// Only includes product groups that have at least one variant.
const extractAllProductGroups = (category) => {
    let allProductGroups = [];
    if (!category) return [];

    // Add product groups from the current level only if they have variants
    if (category.product_groups && category.product_groups.length > 0) {
        const productGroupsWithVariants = category.product_groups.filter(
            (productGroup) => productGroup.variants && productGroup.variants.length > 0
        );
        allProductGroups = [...allProductGroups, ...productGroupsWithVariants];
    }

    // Recursively add product groups from subcategories (with the same variant filter)
    if (category.subcategories && category.subcategories.length > 0) {
        category.subcategories.forEach(sub => {
            allProductGroups = [...allProductGroups, ...extractAllProductGroups(sub)];
        });
    }
    return allProductGroups;
};

// Helper function to get all subcategories at any level for display buttons
const getAllSubcategories = (category) => {
    let subcategories = [];
    if (!category) return [];

    if (category.subcategories && category.subcategories.length > 0) {
        category.subcategories.forEach(sub => {
            subcategories.push(sub);
            // Recursively add subcategories of subcategories
            subcategories = [...subcategories, ...getAllSubcategories(sub)];
        });
    }
    return subcategories;
};


const CategoryPage = () => {
    const { categoryId, categoryNameSlug } = useParams();
    const [fullCategoryTree, setFullCategoryTree] = useState(null); // Stores the full nested API response
    const [displayedProductGroups, setDisplayedProductGroups] = useState([]); // Products currently being shown
    const [activeFilterId, setActiveFilterId] = useState(null); // ID of the currently active filter (category or subcategory)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isModalVisible, setIsModal] = useState(false);
    const [selectedModalProductGroup, setSelectedModalProductGroup] = useState(null);
    const [initialModalVariantId, setInitialModalVariantId] = useState(null);

    // Fetch the initial category data (main category and its entire sub-tree)
    const fetchCategoryData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            setFullCategoryTree(null);
            setDisplayedProductGroups([]);
            setActiveFilterId(null); // Reset active filter when fetching new category

            const response = await getRequest(
                `/products/category/${categoryId}/`
            );

            setFullCategoryTree(response); // Store the entire nested object

            // Initially, show all products from the main category and its subcategories
            // `extractAllProductGroups` already filters out product groups without variants.
            const allProducts = extractAllProductGroups(response);
            setDisplayedProductGroups(allProducts);
            setActiveFilterId(response.id); // Set main category as active filter initially

        } catch (err) {
            console.error("Failed to load category data:", err);
            setError("Failed to load products. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [categoryId]);

    useEffect(() => {
        fetchCategoryData();
    }, [fetchCategoryData]);

    // Handle clicking on a subcategory button or "All Products"
    const handleCategorySelect = useCallback((selectedId) => {
        if (!fullCategoryTree) return;

        setActiveFilterId(selectedId); // Update the active filter ID

        if (selectedId === fullCategoryTree.id) {
            // If "All Products" (main category) is selected, show all product groups
            // `extractAllProductGroups` already filters out product groups without variants.
            setDisplayedProductGroups(extractAllProductGroups(fullCategoryTree));
        } else {
            // Find the selected subcategory and display only its direct product groups
            const findAndExtractProducts = (category, targetId) => {
                if (category.id === targetId) {
                    // Filter product groups at this level for variants
                    return (category.product_groups || []).filter(
                        (productGroup) => productGroup.variants && productGroup.variants.length > 0
                    );
                }
                if (category.subcategories) {
                    for (const sub of category.subcategories) {
                        const foundProducts = findAndExtractProducts(sub, targetId);
                        if (foundProducts.length > 0 || sub.id === targetId) {
                            return foundProducts;
                        }
                    }
                }
                return [];
            };
            setDisplayedProductGroups(findAndExtractProducts(fullCategoryTree, selectedId));
        }
    }, [fullCategoryTree]);

    // Derived state for rendering
    const currentCategoryDisplayName = fullCategoryTree ? fullCategoryTree.name : (categoryNameSlug ? categoryNameSlug.replace(/-/g, ' ') : "Loading...");

    // Get all unique subcategories for button display
    const allAvailableSubcategories = fullCategoryTree ? getAllSubcategories(fullCategoryTree) : [];

    const showModal = (productGroup, variantId) => {
        setSelectedModalProductGroup(productGroup);
        setInitialModalVariantId(variantId);
        setIsModal(true);
    };

    const handleCancel = () => {
        setIsModal(false);
        setSelectedModalProductGroup(null);
        setInitialModalVariantId(null);
    };

    const hasProductsToDisplay = displayedProductGroups.length > 0;

    return (
        <StyledCategoryPageContainer>
            
            <StyledTitle level={2}>
                {currentCategoryDisplayName}
            </StyledTitle>

            {/* Subcategory Buttons and "All Products" */}
            {fullCategoryTree && (
                <StyledSubcategorySpace
                    direction="horizontal"
                    size={[4, 8]}
                >
                    {/* "All Products" button */}
                    <Button
                        type={activeFilterId === fullCategoryTree.id ? "primary" : "default"}
                        onClick={() => handleCategorySelect(fullCategoryTree.id)}
                        size="small"
                    >
                        All {fullCategoryTree.name} Products
                    </Button>

                    {/* Buttons for all available subcategories */}
                    {allAvailableSubcategories.map((sub) => (
                        <Button
                            key={sub.id}
                            type={activeFilterId === sub.id ? "primary" : "default"}
                            onClick={() => handleCategorySelect(sub.id)}
                            size="small"
                        >
                            {sub.name}
                        </Button>
                    ))}
                </StyledSubcategorySpace>
            )}

            {/* Loading Skeletons */}
            {loading ? (
                <StyledProductGridRow gutter={[8, 8]} justify="center">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <Col key={index} xs={12} sm={12} md={8} lg={6} xl={4}>
                            <Card><Skeleton active /></Card>
                        </Col>
                    ))}
                </StyledProductGridRow>
            ) : error ? (
                <StyledAlert message={error} type="error" showIcon />
            ) : (
                <>
                    {/* Product Grid */}
                    {hasProductsToDisplay ? (
                        <StyledProductGridRow gutter={[30,30]} justify="center">
                            {displayedProductGroups.map((productGroup) => (
                                <Col key={productGroup.id} xs={12} sm={12} md={8} xl={6}>
                                    <div>
                                        <Suspense fallback={<Card loading />}>
                                            <ProductGroupCard
                                                productGroup={productGroup}
                                                onVariantSelectForModal={showModal}
                                            />
                                        </Suspense>
                                    </div>
                                </Col>
                            ))}
                        </StyledProductGridRow>
                    ) : (
                        <StyledParagraph>
                            No products with variants available for this selection.
                        </StyledParagraph>
                    )}
                </>
            )}

            {/* More Products Loading Spinner (not needed with full tree fetch, but kept for consistency if future pagination is added) */}
            {loading && (
                <div style={{ textAlign: "center", marginTop: "20px" }}> {/* Adjusted margin */}
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
            <SearchComponent/>
        </StyledCategoryPageContainer>
    );
};

export default CategoryPage;