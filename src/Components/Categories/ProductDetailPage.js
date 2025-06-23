import React, { useState, useEffect, useCallback } from "react";
import { Typography, Button, Space, Divider, message as AntMessage, Tag } from "antd"; // Removed Modal
import {
  ShoppingCartOutlined,
  PlusOutlined,
  MinusOutlined,
} from "@ant-design/icons"; // CloseOutlined not needed as it was for the modal
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../app/features/cart/cartSlice";
import { useMediaQuery } from 'react-responsive';
import { useSwipeable } from 'react-swipeable';

const { Title, Paragraph, Text } = Typography;
const BASE_URL = "";

// Removed 'visible' and 'onClose' props, as it's no longer a modal
const ProductGroupDetail = ({ productGroup, initialSelectedVariantId }) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  // Find the initial variant or default to the first active/first available
  const initialVariant = productGroup?.variants.find(v => v.id === initialSelectedVariantId) ||
                         productGroup?.variants.find(v => v.is_active) ||
                         productGroup?.variants[0];

  const [selectedVariant, setSelectedVariant] = useState(initialVariant);
  const [quantity, setQuantity] = useState(selectedVariant?.minimum_order_quantity || 1);
  const [currentImage, setCurrentImage] = useState(0);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.data);

  // Update selectedVariant and reset quantity/image when productGroup or initialSelectedVariantId changes
  // Removed history API manipulation and popstate listener
  useEffect(() => {
    if (productGroup) {
      const variantToSelect = productGroup.variants.find(v => v.id === initialSelectedVariantId) ||
                              productGroup.variants.find(v => v.is_active) ||
                              productGroup.variants[0];
      setSelectedVariant(variantToSelect);
      setQuantity(variantToSelect?.minimum_order_quantity || 1);
      setCurrentImage(0); // Reset image index on new product/variant selection
    }
  }, [productGroup, initialSelectedVariantId]);

  // Effect to update quantity and image when selectedVariant changes internally
  useEffect(() => {
    if (selectedVariant) {
      setQuantity(selectedVariant.minimum_order_quantity || 1);
      setCurrentImage(0); // Reset image when variant changes
    }
  }, [selectedVariant]);

  // handlePopState is no longer needed
  // const handlePopState = useCallback((event) => { /* ... */ }, [visible, onClose]);

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(selectedVariant?.minimum_order_quantity || 1, prev - 1));
  };

  const handleAddToCart = () => {
    if (selectedVariant) {
      dispatch(
        addToCart({ product: selectedVariant, quantity }, { meta: { arg: { user: user } }})
      );
      AntMessage.success(`${selectedVariant.name} (${selectedVariant.sizing || ''}) added to cart!`);
      // No onClose call here, as it's not a modal
    }
  };

  // handleModalClose is no longer needed
  // const handleModalClose = () => { /* ... */ };

  const formatImageUrl = (img) =>
    img.startsWith("http") ? img : `${BASE_URL}${img}`;

  const handleThumbnailClick = (index) => {
    setCurrentImage(index);
  };

  // --- Swipe Logic ---
  const handleSwipeLeft = () => {
    if (selectedVariant.images && selectedVariant.images.length > 1) {
      setCurrentImage((prev) => (prev + 1) % selectedVariant.images.length);
    }
  };

  const handleSwipeRight = () => {
    if (selectedVariant.images && selectedVariant.images.length > 1) {
      setCurrentImage((prev) => (prev - 1 + selectedVariant.images.length) % selectedVariant.images.length);
    }
  };

  // Configure swipe handlers
  const handlers = useSwipeable({
    onSwipedLeft: handleSwipeLeft,
    onSwipedRight: handleSwipeRight,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });
  // --- End Swipe Logic ---

  if (!productGroup || !selectedVariant) return null; // Ensure we have data before rendering

  const discountPercentage =
    selectedVariant.discount_price < selectedVariant.price
      ? Math.round(((selectedVariant.price - selectedVariant.discount_price) / selectedVariant.price) * 100)
      : null;

  // Group variants by their distinct attributes for selection dropdowns
  const uniqueSizings = Array.from(new Set(productGroup.variants.map(v => v.sizing).filter(Boolean)));
  const uniqueColors = Array.from(new Set(productGroup.variants.map(v => v.color).filter(Boolean)));
  const uniqueMaterials = Array.from(new Set(productGroup.variants.map(v => v.material).filter(Boolean)));

  // Determine current selection for each attribute type
  const currentSizing = selectedVariant.sizing || '';
  const currentColor = selectedVariant.color || '';
  const currentMaterial = selectedVariant.material || '';

  // Function to filter variants based on current selections
  const getFilteredVariants = (attribute, value) => {
    return productGroup.variants.filter(v => {
      const matchSizing = (attribute === 'sizing' ? v.sizing === value : v.sizing === currentSizing) || (!currentSizing && !v.sizing);
      const matchColor = (attribute === 'color' ? v.color === value : v.color === currentColor) || (!currentColor && !v.color);
      const matchMaterial = (attribute === 'material' ? v.material === value : v.material === currentMaterial) || (!currentMaterial && !v.material);
      return matchSizing && matchColor && matchMaterial;
    });
  };

  return (
    // Replaced Ant Design Modal with a div
    <div
      className="product-detail-page-container" // New class name for page-level styling
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        maxWidth: 1200, // Example max width for a page component
        margin: '20px auto', // Center the component on the page
        backgroundColor: "#2c3e50", // Same background as modal content
        color: "#ecf0f1", // Same text color
        borderRadius: "12px", // Same border radius
        overflow: "hidden",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)", // Example shadow
      }}
    >
      <style>
        {`
          .product-detail-page-container {
            /* Styles for the main container (formerly modal content) */
          }
          /* Custom scrollbar for description */
          .product-detail-page-container .product-description-scroll::-webkit-scrollbar {
            width: 6px;
          }
          .product-detail-page-container .product-description-scroll::-webkit-scrollbar-track {
            background: #34495e;
            border-radius: 10px;
          }
          .product-detail-page-container .product-description-scroll::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 10px;
          }
          .product-detail-page-container .product-description-scroll::-webkit-scrollbar-thumb:hover {
            background: #555;
          }

          /* Added for swipeable image */
          .swipe-area {
            cursor: grab;
            user-select: none;
          }

          /* Container for Quantity and Add to Cart */
          .quantity-add-to-cart-row {
            display: flex;
            align-items: center;
            gap: 15px;
            flex-wrap: wrap;
            margin-top: ${isMobile ? '15px' : '30px'};
            justify-content: ${isMobile ? 'center' : 'flex-start'};
          }

          /* Style for compact warning messages, now below the row */
          .product-quantity-info-warnings {
            min-height: 20px;
            margin-top: 8px;
            text-align: ${isMobile ? 'center' : 'left'};
          }
          .product-quantity-info-warnings .ant-typography-warning {
            display: block;
            font-size: 0.75rem;
            color: #f1c40f;
            line-height: 1.2;
            margin-bottom: 2px;
          }
          .product-quantity-info-warnings .ant-typography-warning:last-child {
            margin-bottom: 0;
          }
        `}
      </style>

      {/* Main content structure remains largely the same */}
      <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", width: "100%" }}>
        {/* Left Section: Image Gallery */}
        <div
          {...handlers}
          style={{ flex: isMobile ? "none" : 1, position: "relative", backgroundColor: '#1a1a1a' }}
          className="swipe-area"
        >
          <img
            src={formatImageUrl(selectedVariant.images && selectedVariant.images.length > 0 ? selectedVariant.images[currentImage] : "/media/default-placeholder.png")}
            alt={selectedVariant.name}
            style={{
              width: "100%",
              height: isMobile ? 240 : 400,
              objectFit: "contain",
              padding: isMobile ? '8px' : '20px',
            }}
          />

          {discountPercentage !== null && (
            <div style={{
              position: "absolute",
              top: 10,
              left: 10,
              backgroundColor: "#e74c3c",
              color: "#fff",
              padding: "5px 10px",
              borderRadius: "15px",
              fontSize: "0.8rem",
              fontWeight: "bold",
              zIndex: 1,
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
            }}>
              {discountPercentage}% OFF
            </div>
          )}

          {selectedVariant.images && selectedVariant.images.length > 1 && (
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: 'center',
              paddingBottom: isMobile ? 8 : 15,
              flexWrap: 'wrap',
            }}>
              {selectedVariant.images.map((img, index) => (
                <img
                  key={index}
                  src={formatImageUrl(img)}
                  alt={`Thumbnail ${index}`}
                  style={{
                    width: isMobile ? 50 : 70,
                    height: isMobile ? 50 : 70,
                    objectFit: "cover",
                    margin: isMobile ? 3 : 8,
                    cursor: "pointer",
                    borderRadius: 6,
                    border: currentImage === index ? "2px solid #3498db" : "1px solid transparent",
                    boxShadow: currentImage === index ? "0 0 8px rgba(52, 152, 219, 0.7)" : "none",
                    transition: "all 0.3s ease",
                  }}
                  onClick={() => handleThumbnailClick(index)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Section: Product Details & Actions */}
        <div style={{
          flex: 1,
          padding: isMobile ? "15px" : "30px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}>
          <div>
            {/* Product Group Name (Main Title) */}
            <Title level={isMobile ? 3 : 2} style={{
              marginBottom: 5,
              color: "#f39c12",
              fontWeight: 700,
              fontSize: isMobile ? '1.5rem' : '2.2rem',
              lineHeight: 1.2,
            }}>
              {productGroup.name}
            </Title>
            <Paragraph
              className="product-description-scroll"
              style={{
                margin: '10px 0 0',
                textAlign: "justify",
                lineHeight: "1.5",
                fontSize: isMobile ? '0.9rem' : '1.1rem',
                color: "#ecf0f1",
                maxHeight: isMobile ? '70px' : '100px',
                overflowY: 'auto',
                paddingRight: isMobile ? '0' : '8px',
              }}
            >
              {selectedVariant.description || "No description available for this variant."}
            </Paragraph>

            {/* Variant Name & Sizing (if applicable) */}
            {(selectedVariant.name !== productGroup.name || selectedVariant.sizing) && (
              <Paragraph style={{
                marginBottom: isMobile ? 8 : 15,
                color: "#bdc3c7",
                fontSize: isMobile ? '1rem' : '1.3rem',
                fontWeight: 600,
              }}>
                {selectedVariant.name !== productGroup.name ? selectedVariant.name : ''}
              </Paragraph>
            )}

            {/* Price Information */}
            <Space size={isMobile ? 'small' : 'middle'} align="center" style={{ marginBottom: isMobile ? 5 : 8, flexWrap: 'wrap' }}>
              {selectedVariant.discount_price < selectedVariant.price && (
                <Text
                  delete
                  style={{
                    fontSize: isMobile ? 14 : 20,
                    color: "rgba(255, 255, 255, 0.6)",
                  }}
                >
                  ₹{selectedVariant.price}
                </Text>
              )}

              <Text strong style={{
                fontSize: isMobile ? 20 : 30,
                color: "#2ecc71",
                fontWeight: 900,
              }}>
                ₹{selectedVariant.discount_price < selectedVariant.price ? selectedVariant.discount_price : selectedVariant.price}
              </Text>
            </Space>

            <Divider style={{ margin: isMobile ? "10px 0" : "25px 0", borderColor: 'rgba(255,255,255,0.1)' }} />

            {/* Variant Selection Options */}
            <div style={{ marginBottom: isMobile ? 10 : 20 }}>
              {uniqueSizings.length > 0 && (
                <div style={{ marginBottom: 8 }}>
                  <Text strong style={{ color: '#bdc3c7', display: 'block', marginBottom: 4, fontSize: isMobile ? '0.9rem' : '1rem' }}>Size:</Text>
                  <Space size={[6, 6]} wrap>
                    {uniqueSizings.map(size => (
                      <Tag
                        key={size}
                        color={currentSizing === size ? "#3498db" : "default"}
                        onClick={() => {
                          const matchingVariants = getFilteredVariants('sizing', size);
                          if (matchingVariants.length > 0) {
                            setSelectedVariant(matchingVariants[0]);
                          } else {
                            const singleMatch = productGroup.variants.find(v => v.sizing === size);
                            if (singleMatch) setSelectedVariant(singleMatch);
                          }
                        }}
                        style={{ cursor: 'pointer', borderColor: '#3498db', color: currentSizing === size ? '#fff' : '#ecf0f1', background: currentSizing === size ? '#3498db' : 'transparent', fontSize: isMobile ? '0.8rem' : '0.9rem', padding: '4px 8px' }}
                      >
                        {size}
                      </Tag>
                    ))}
                  </Space>
                </div>
              )}

              {uniqueColors.length > 0 && (
                <div style={{ marginBottom: 8 }}>
                  <Text strong style={{ color: '#bdc3c7', display: 'block', marginBottom: 4, fontSize: isMobile ? '0.9rem' : '1rem' }}>Color:</Text>
                  <Space size={[6, 6]} wrap>
                    {uniqueColors.map(color => (
                      <Tag
                        key={color}
                        color={currentColor === color ? "#9b59b6" : "default"}
                        onClick={() => {
                          const matchingVariants = getFilteredVariants('color', color);
                          if (matchingVariants.length > 0) {
                            setSelectedVariant(matchingVariants[0]);
                          } else {
                            const singleMatch = productGroup.variants.find(v => v.color === color);
                            if (singleMatch) setSelectedVariant(singleMatch);
                          }
                        }}
                        style={{ cursor: 'pointer', borderColor: '#9b59b6', color: currentColor === color ? '#fff' : '#ecf0f1', background: currentColor === color ? '#9b59b6' : 'transparent', fontSize: isMobile ? '0.8rem' : '0.9rem', padding: '4px 8px' }}
                      >
                        {color}
                      </Tag>
                    ))}
                  </Space>
                </div>
              )}

              {uniqueMaterials.length > 0 && (
                <div style={{ marginBottom: 8 }}>
                  <Text strong style={{ color: '#bdc3c7', display: 'block', marginBottom: 4, fontSize: isMobile ? '0.9rem' : '1rem' }}>Material:</Text>
                  <Space size={[6, 6]} wrap>
                    {uniqueMaterials.map(material => (
                      <Tag
                        key={material}
                        color={currentMaterial === material ? "#27ae60" : "default"}
                        onClick={() => {
                          const matchingVariants = getFilteredVariants('material', material);
                          if (matchingVariants.length > 0) {
                            setSelectedVariant(matchingVariants[0]);
                          } else {
                            const singleMatch = productGroup.variants.find(v => v.material === material);
                            if (singleMatch) setSelectedVariant(singleMatch);
                          }
                        }}
                        style={{ cursor: 'pointer', borderColor: '#27ae60', color: currentMaterial === material ? '#fff' : '#ecf0f1', background: currentMaterial === material ? '#27ae60' : 'transparent', fontSize: isMobile ? '0.8rem' : '0.9rem', padding: '4px 8px' }}
                      >
                        {material}
                      </Tag>
                    ))}
                  </Space>
                </div>
              )}
            </div>

            <Divider style={{ margin: isMobile ? "10px 0" : "25px 0", borderColor: 'rgba(255,255,255,0.1)' }} />
          </div>

          {/* Quantity Controls and Add to Cart Button */}
          <div className="quantity-add-to-cart-row">
            <Space size="middle">
              <Button
                icon={<MinusOutlined />}
                size={isMobile ? "small" : "large"}
                onClick={handleDecrement}
                disabled={quantity <= (selectedVariant?.minimum_order_quantity || 1)}
                style={{ backgroundColor: '#e74c3c', borderColor: '#e74c3c', color: '#fff' }}
              />
              <Text style={{
                fontSize: isMobile ? '1.3rem' : '1.8rem',
                fontWeight: "bold",
                minWidth: "30px",
                textAlign: "center",
                color: '#ecf0f1',
              }}>
                {quantity}
              </Text>
              <Button
                icon={<PlusOutlined />}
                size={isMobile ? "small" : "large"}
                onClick={handleIncrement}
                disabled={selectedVariant.total_stock > 0 && quantity >= selectedVariant.total_stock}
                style={{ backgroundColor: '#2ecc71', borderColor: '#2ecc71', color: '#fff' }}
              />
            </Space>

            <Button
              type="primary"
              icon={<ShoppingCartOutlined />}
              size={isMobile ? "middle" : "large"}
              onClick={handleAddToCart}
              style={{
                flexGrow: 1,
                maxWidth: isMobile ? 'calc(100% - 100px)' : 220,
                height: isMobile ? 40 : 50,
                borderRadius: 6,
                fontWeight: "bold",
                backgroundColor: "#3498db",
                borderColor: "#3498db",
                boxShadow: "0 2px 8px rgba(52, 152, 219, 0.4)",
                transition: "all 0.3s ease",
              }}
              disabled={
                selectedVariant.total_stock === 0 ||
                quantity < (selectedVariant?.minimum_order_quantity || 1) ||
                (selectedVariant.total_stock > 0 && quantity > selectedVariant.total_stock)
              }
            >
              {selectedVariant.total_stock === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
          </div>

          {/* Warning messages */}
          <div className="product-quantity-info-warnings">
            {selectedVariant.total_stock > 0 && quantity > selectedVariant.total_stock && (
                <Text type="warning">
                  Only {selectedVariant.total_stock} items available in stock.
                </Text>
            )}
            {quantity < (selectedVariant?.minimum_order_quantity || 1) && (
              <Text type="warning">
                Minimum Order Quantity: {selectedVariant?.minimum_order_quantity || 1}
              </Text>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductGroupDetail;