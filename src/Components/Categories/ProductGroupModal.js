import React, { useState, useEffect, useCallback } from "react";
import { Modal, Typography, Button, Space, Divider, message as AntMessage, Tag } from "antd";
import {
  ShoppingCartOutlined,
  PlusOutlined,
  MinusOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../app/features/cart/cartSlice";
import { useMediaQuery } from 'react-responsive';
import { useSwipeable } from 'react-swipeable';

const { Title, Paragraph, Text } = Typography;
const BASE_URL = "https://chocosign.in";

const ProductGroupModal = ({ productGroup, initialSelectedVariantId, visible, onClose }) => {
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
  useEffect(() => {
    if (productGroup && visible) {
      const variantToSelect = productGroup.variants.find(v => v.id === initialSelectedVariantId) ||
                              productGroup.variants.find(v => v.is_active) ||
                              productGroup.variants[0];
      setSelectedVariant(variantToSelect);
      setQuantity(variantToSelect?.minimum_order_quantity || 1);
      setCurrentImage(0); // Reset image index on new product/variant selection

      // Handle browser history for modal
      window.history.pushState({ modalOpen: true }, '', '#product-open');
      window.addEventListener('popstate', handlePopState);
    } else {
      // Cleanup: remove listener when modal is not visible
      window.removeEventListener('popstate', handlePopState);
      // Remove the history entry pushed by this modal when it closes naturally
      if (window.history.state && window.history.state.modalOpen) {
        window.history.back();
      }
    }

    // Cleanup function for the effect
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [productGroup, initialSelectedVariantId, visible]);

  // Effect to update quantity and image when selectedVariant changes internally
  useEffect(() => {
    if (selectedVariant) {
      setQuantity(selectedVariant.minimum_order_quantity || 1);
      setCurrentImage(0); // Reset image when variant changes
    }
  }, [selectedVariant]);

  const handlePopState = useCallback((event) => {
    // If popstate happens and the state indicates modal was opened, or if it's open but state is gone
    if ((event.state && event.state.modalOpen) || visible) {
      console.log("Modal closed via browser popstate (back button or history navigation)");
      onClose(); // Trigger the onClose from the parent
    }
  }, [visible, onClose]);

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
      setTimeout(() => {
        onClose(); // Close the modal after adding to cart
      }, 800);
    }
  };

  const handleModalClose = () => {
    console.log("Modal closed via Ant Design's onCancel event (e.g., clicking mask or close icon).");
    // This will trigger the useEffect cleanup which handles history
    onClose();
  };

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
    preventScrollOnSwipe: true, // Prevent vertical scroll when swiping horizontally
    trackMouse: true, // Enable mouse tracking for desktop testing
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
    <Modal
      visible={visible}
      onCancel={handleModalClose}
      footer={null}
      centered
      width={isMobile ? "95%" : 800}
      className="product-detail-modal"
      closeIcon={<CloseOutlined style={{ color: '#fff', fontSize: '18px' }} />}
    >
      <style>
        {`
          .product-detail-modal .ant-modal-content {
            padding: 0 !important;
            border-radius: 12px !important;
            overflow: hidden;
            background-color: #2c3e50;
            color: #ecf0f1;
          }
          .product-detail-modal .ant-modal-header {
            display: none;
          }
          .product-detail-modal .ant-modal-close-x {
            width: 40px;
            height: 40px;
            line-height: 40px;
            border-radius: 50%;
            background-color: rgba(0, 0, 0, 0.4);
            transition: background-color 0.3s ease;
            position: absolute;
            top: 15px;
            right: 15px;
            z-index: 10;
          }
          .product-detail-modal .ant-modal-close-x:hover {
            background-color: rgba(0, 0, 0, 0.6);
          }
          /* Custom scrollbar for description */
          .product-detail-modal .product-description-scroll::-webkit-scrollbar {
            width: 6px;
          }
          .product-detail-modal .product-description-scroll::-webkit-scrollbar-track {
            background: #34495e;
            border-radius: 10px;
          }
          .product-detail-modal .product-description-scroll::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 10px;
          }
          .product-detail-modal .product-description-scroll::-webkit-scrollbar-thumb:hover {
            background: #555;
          }

          /* Added for swipeable image */
          .swipe-area {
            cursor: grab;
            user-select: none; /* Prevent text selection during swipe */
          }

          /* NEW STYLES: Container for Quantity and Add to Cart */
          .quantity-add-to-cart-row {
            display: flex;
            align-items: center; /* Vertically align items */
            gap: 15px; /* Space between quantity controls and button */
            flex-wrap: wrap; /* Allow wrapping on smaller screens if needed */
            margin-top: ${isMobile ? '15px' : '30px'};
            justify-content: ${isMobile ? 'center' : 'flex-start'}; /* Center on mobile, left-align on desktop */
          }

          /* Style for compact warning messages, now below the row */
          .product-quantity-info-warnings {
            min-height: 20px; /* Ensure space even if no message */
            margin-top: 8px; /* Space above warnings if they appear */
            text-align: ${isMobile ? 'center' : 'left'};
          }
          .product-quantity-info-warnings .ant-typography-warning {
            display: block; /* Ensures each warning message takes full width in its container */
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

      <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row" }}>
        {/* Left Section: Image Gallery */}
        <div
          {...handlers} 
          style={{ flex: isMobile ? "none" : 1, position: "relative", backgroundColor: '#1a1a1a' }}
          className="swipe-area" // Add a class for styling cursor
        >
          <img
            src={formatImageUrl(selectedVariant.images && selectedVariant.images.length > 0 ? selectedVariant.images[currentImage] : "/media/default-placeholder.png")}
            alt={selectedVariant.name}
            style={{
              width: "100%",
              height: isMobile ? 240 : 400, // Reduced height for mobile
              objectFit: "contain",
              padding: isMobile ? '8px' : '20px', // Reduced padding for mobile
            }}
          />

          {discountPercentage !== null && (
            <div style={{
              position: "absolute",
              top: 10, // Adjusted for smaller padding
              left: 10, // Adjusted for smaller padding
              backgroundColor: "#e74c3c",
              color: "#fff",
              padding: "5px 10px", // Reduced padding
              borderRadius: "15px", // Slightly smaller border radius
              fontSize: "0.8rem", // Slightly smaller font size
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
              paddingBottom: isMobile ? 8 : 15, // Reduced padding for mobile
              flexWrap: 'wrap',
            }}>
              {selectedVariant.images.map((img, index) => (
                <img
                  key={index}
                  src={formatImageUrl(img)}
                  alt={`Thumbnail ${index}`}
                  style={{
                    width: isMobile ? 50 : 70, // Reduced size for mobile thumbnails
                    height: isMobile ? 50 : 70, // Reduced size for mobile thumbnails
                    objectFit: "cover",
                    margin: isMobile ? 3 : 8, // Reduced margin for mobile
                    cursor: "pointer",
                    borderRadius: 6, // Slightly smaller border radius
                    border: currentImage === index ? "2px solid #3498db" : "1px solid transparent", // Thinner border for mobile
                    boxShadow: currentImage === index ? "0 0 8px rgba(52, 152, 219, 0.7)" : "none", // Smaller shadow
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
          padding: isMobile ? "15px" : "30px", // Reduced padding for mobile
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}>
          <div>
            {/* Product Group Name (Main Title) */}
            <Title level={isMobile ? 3 : 2} style={{
              marginBottom: 5, // Reduced margin
              color: "#f39c12",
              fontWeight: 700,
              fontSize: isMobile ? '1.5rem' : '2.2rem', // Adjusted font size for mobile
              lineHeight: 1.2,
            }}>
              {productGroup.name}
            </Title>
            <Paragraph
              className="product-description-scroll" // Add class for custom scrollbar
              style={{
                margin: '10px 0 0', // Reduced margin
                textAlign: "justify",
                lineHeight: "1.5", // Slightly reduced line height
                fontSize: isMobile ? '0.9rem' : '1.1rem', // Adjusted font size for mobile
                color: "#ecf0f1",
                maxHeight: isMobile ? '70px' : '100px', // Adjusted max height for mobile
                overflowY: 'auto',
                paddingRight: isMobile ? '0' : '8px', // Reduced padding
              }}
            >
              {selectedVariant.description || "No description available for this variant."}
            </Paragraph>

            {/* Variant Name & Sizing (if applicable) */}
            {(selectedVariant.name !== productGroup.name || selectedVariant.sizing) && (
              <Paragraph style={{
                marginBottom: isMobile ? 8 : 15, // Reduced margin
                color: "#bdc3c7",
                fontSize: isMobile ? '1rem' : '1.3rem', // Adjusted font size for mobile
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
                    fontSize: isMobile ? 14 : 20, // Adjusted font size for mobile
                    color: "rgba(255, 255, 255, 0.6)",
                  }}
                >
                  ₹{selectedVariant.price}
                </Text>
              )}

              <Text strong style={{
                fontSize: isMobile ? 20 : 30, // Adjusted font size for mobile
                color: "#2ecc71",
                fontWeight: 900,
              }}>
                ₹{selectedVariant.discount_price < selectedVariant.price ? selectedVariant.discount_price : selectedVariant.price}
              </Text>
            </Space>

            <Divider style={{ margin: isMobile ? "10px 0" : "25px 0", borderColor: 'rgba(255,255,255,0.1)' }} />

            {/* Variant Selection Options */}
            <div style={{ marginBottom: isMobile ? 10 : 20 }}> {/* Reduced margin */}
              {uniqueSizings.length > 0 && (
                <div style={{ marginBottom: 8 }}> {/* Reduced margin */}
                  <Text strong style={{ color: '#bdc3c7', display: 'block', marginBottom: 4, fontSize: isMobile ? '0.9rem' : '1rem' }}>Size:</Text>
                  <Space size={[6, 6]} wrap> {/* Reduced space size */}
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
                        style={{ cursor: 'pointer', borderColor: '#3498db', color: currentSizing === size ? '#fff' : '#ecf0f1', background: currentSizing === size ? '#3498db' : 'transparent', fontSize: isMobile ? '0.8rem' : '0.9rem', padding: '4px 8px' }} // Adjusted font size and padding
                      >
                        {size}
                      </Tag>
                    ))}
                  </Space>
                </div>
              )}

              {uniqueColors.length > 0 && (
                <div style={{ marginBottom: 8 }}> {/* Reduced margin */}
                  <Text strong style={{ color: '#bdc3c7', display: 'block', marginBottom: 4, fontSize: isMobile ? '0.9rem' : '1rem' }}>Color:</Text>
                  <Space size={[6, 6]} wrap> {/* Reduced space size */}
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
                        style={{ cursor: 'pointer', borderColor: '#9b59b6', color: currentColor === color ? '#fff' : '#ecf0f1', background: currentColor === color ? '#9b59b6' : 'transparent', fontSize: isMobile ? '0.8rem' : '0.9rem', padding: '4px 8px' }} // Adjusted font size and padding
                      >
                        {color}
                      </Tag>
                    ))}
                  </Space>
                </div>
              )}

              {uniqueMaterials.length > 0 && (
                <div style={{ marginBottom: 8 }}> {/* Reduced margin */}
                  <Text strong style={{ color: '#bdc3c7', display: 'block', marginBottom: 4, fontSize: isMobile ? '0.9rem' : '1rem' }}>Material:</Text>
                  <Space size={[6, 6]} wrap> {/* Reduced space size */}
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

          {/* NEW: Quantity Controls and Add to Cart Button on the same line */}
          <div className="quantity-add-to-cart-row">
            {/* Quantity controls */}
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

            {/* Add to Cart Button */}
            <Button
              type="primary"
              icon={<ShoppingCartOutlined />}
              size={isMobile ? "middle" : "large"}
              onClick={handleAddToCart}
              style={{
                flexGrow: 1, // Allow button to grow and fill available space
                maxWidth: isMobile ? 'calc(100% - 100px)' : 220, // Adjust max width based on other elements
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

          {/* Warning messages (now placed below the main quantity/button row) */}
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
    </Modal>
  );
};

export default ProductGroupModal;