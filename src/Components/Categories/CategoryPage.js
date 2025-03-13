import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getRequest } from "../../Services/api";
import { Spin, Alert, Button, Row, Col, Typography, Space } from "antd";
import ProductCard from "./ProductCard";

const { Title, Paragraph } = Typography;

const CategoryPage = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategoryData = useCallback(async () => {
    try {
      setLoading(true);
      setSelectedSubcategory(null);

      const response = await getRequest(`/products/category/${categoryId}/`);
      setCategoryName(response.category_name);
      setSubcategories(response.subcategories || []);
      setProducts(response.products);
    } catch (err) {
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    fetchCategoryData();
  }, [fetchCategoryData]);

  const filteredProducts = selectedSubcategory
    ? products.filter((p) => p.category_id === selectedSubcategory)
    : products;

  const handleSubcategorySelect = (subcategoryId) => {
    setSelectedSubcategory(subcategoryId);
  };

  return (
    <div style={{ padding: "24px", minHeight: "100vh" }}>
      <Title level={2} style={{ textAlign: "center", color: "#333", marginBottom: "24px" }}>
        {categoryName || "Loading..."}
      </Title>

      {loading ? (
        <div style={{ textAlign: "center", marginTop: "48px" }}>
          <Spin size="large" />
        </div>
      ) : error ? (
        <Alert message={error} type="error" showIcon style={{ marginBottom: "24px" }} />
      ) : (
        <>
          {subcategories.length > 0 && (
            <Space direction="horizontal" size="middle" style={{ justifyContent: "center", marginBottom: "24px", display: "flex", flexWrap: 'wrap' }}>
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

          {filteredProducts.length > 0 ? (
            <Row gutter={[24, 24]} justify="center">
              {filteredProducts.map((product) => (
                <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>
          ) : (
            <Paragraph style={{ textAlign: "center", marginTop: "32px", color: "#777" }}>
              No products available.
            </Paragraph>
          )}
        </>
      )}
    </div>
  );
};

export default CategoryPage;