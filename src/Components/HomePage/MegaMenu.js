import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { RightOutlined, DownOutlined } from '@ant-design/icons';

// CSS styles as a JavaScript object
const styles = {
  ul: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  li: {
    marginBottom: '5px',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 12px',
    textDecoration: 'none',
    color: '#333',
    fontWeight: '500',
    borderRadius: '4px',
    transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out',
  },
  linkHover: { // This will need to be applied dynamically on hover
    backgroundColor: '#f0f0f0',
    color: '#007bff',
  },
  span: {
    flexGrow: 1,
  },
  anticon: {
    fontSize: '12px',
    marginLeft: '8px',
    color: '#666',
  },
  submenuContainer: {
    marginLeft: '15px',
    borderLeft: '1px solid #eee',
    paddingLeft: '10px',
  },
  submenuUl: {
    paddingTop: '5px',
  },
};

// Recursive component for rendering subcategories within the Mega Menu
const MegaMenuCategoryColumn = ({ categories, selectedCategory, onLinkClick }) => {
  const [openSubmenuId, setOpenSubmenuId] = useState(null);
  const [hoveredLink, setHoveredLink] = useState(null); // State to manage hover effect

  if (!categories || categories.length === 0) {
    return null;
  }

  const handleCategoryClick = (e, category) => {
    if (category.subcategories && category.subcategories.length > 0) {
      e.preventDefault();
      setOpenSubmenuId(openSubmenuId === category.id ? null : category.id);
    } else {
      onLinkClick();
    }
  };

  return (
    <ul style={styles.ul}>
      {categories.map(category => (
        <li key={category.id} style={styles.li}>
          <Link
            to={`/category/${category.id}`}
            onClick={(e) => handleCategoryClick(e, category)}
            onMouseEnter={() => setHoveredLink(category.id)}
            onMouseLeave={() => setHoveredLink(null)}
            style={{
              ...styles.link,
              ...(hoveredLink === category.id ? styles.linkHover : {}),
            }}
          >
            <span style={styles.span}>{category.name}</span>
            {category.subcategories && category.subcategories.length > 0 && (
              openSubmenuId === category.id ? (
                <DownOutlined style={styles.anticon} />
              ) : (
                <RightOutlined style={styles.anticon} />
              )
            )}
          </Link>
          {category.subcategories && category.subcategories.length > 0 && (
            <div style={{ ...styles.submenuContainer, display: openSubmenuId === category.id ? 'block' : 'none' }}>
              <MegaMenuCategoryColumn
                categories={category.subcategories}
                selectedCategory={selectedCategory}
                onLinkClick={onLinkClick}
              />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default MegaMenuCategoryColumn;