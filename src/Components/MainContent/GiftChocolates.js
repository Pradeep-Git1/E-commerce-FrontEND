import React from "react";
import { Card, Typography, Button, Badge } from "antd";

const { Title, Paragraph } = Typography;

// Gift Chocolate Products
const giftChocolates = [
  {
    id: 1,
    name: "Golden Celebration Box",
    price: "₹2,999",
    tag: "Best Seller",
    description: "A luxurious collection of gourmet chocolates wrapped in gold.",
    images: ["/images/image1.jpg", "/images/image2.jpg", "/images/image3.jpg"],
  },
  {
    id: 2,
    name: "Ruby Love Selection",
    price: "₹3,499",
    tag: "Limited Edition",
    description: "An elegant mix of ruby chocolate and rich dark cocoa.",
    images: ["/images/image1.jpg", "/images/image2.jpg", "/images/image3.jpg"],
  },
  {
    id: 3,
    name: "Luxury Truffle Assortment",
    price: "₹3,999",
    tag: "New Arrival",
    description: "A handpicked selection of premium truffles for every occasion.",
    images: ["/images/image1.jpg", "/images/image2.jpg", "/images/image3.jpg"],
  },
  {
    id: 4,
    name: "Festive Cocoa Bliss",
    price: "₹2,499",
    tag: "Gift Special",
    description: "A celebration of cocoa flavors with a touch of elegance.",
    images: ["/images/image1.jpg", "/images/image2.jpg", "/images/image3.jpg"],
  },
  {
    id: 5,
    name: "Belgian Dark Elegance",
    price: "₹4,199",
    tag: "Premium",
    description: "Rich Belgian dark chocolate with roasted almond & hazelnut fusion.",
    images: ["/images/image1.jpg", "/images/image2.jpg", "/images/image3.jpg"],
  },
  {
    id: 6,
    name: "Swiss Chocolate Fantasy",
    price: "₹4,799",
    tag: "Customer Favorite",
    description: "Smooth Swiss chocolate with caramel and sea salt infusion.",
    images: ["/images/image1.jpg", "/images/image2.jpg", "/images/image3.jpg"],
  },
  {
    id: 7,
    name: "Royal Cocoa Treasure",
    price: "₹5,299",
    tag: "Luxury Pick",
    description: "A royal selection of dark and milk chocolates in a velvet box.",
    images: ["/images/image1.jpg", "/images/image2.jpg", "/images/image3.jpg"],
  },
  {
    id: 8,
    name: "Signature Bonbon Collection",
    price: "₹3,999",
    tag: "Handcrafted",
    description: "Delightful handcrafted bonbons filled with unique flavors.",
    images: ["/images/image1.jpg", "/images/image2.jpg", "/images/image3.jpg"],
  },
  {
    id: 9,
    name: "Exotic Fruit-Infused Chocolates",
    price: "₹3,299",
    tag: "Tropical Bliss",
    description: "A mix of dark chocolate infused with exotic fruit flavors.",
    images: ["/images/image1.jpg", "/images/image2.jpg", "/images/image3.jpg"],
  },
  {
    id: 10,
    name: "Diamond Praline Assortment",
    price: "₹5,999",
    tag: "Ultimate Gift",
    description: "A collection of pralines infused with rare cocoa blends and gold flakes.",
    images: ["/images/image1.jpg", "/images/image2.jpg", "/images/image3.jpg"],
  },
];


const GiftChocolates = () => {
  return (
    <div className="container-fluid mt-4 px-3 w-100">
      <Title level={2} className="text-center mb-4 text-gift">🎁 Premium Gift Chocolates</Title>

      {/* FLEX WRAP CONTAINER */}
      <div className="d-flex justify-content-center overflow-auto">
        {giftChocolates.map((choco) => (
          <Badge.Ribbon key={choco.id} text={choco.tag} color="gold">
            <Card
              hoverable
              className="gift-card shadow-lg border-0 m-3 p-0"
              style={{
                textAlign: "center",
                width: "250px", // FIXED WIDTH
                maxWidth: "100%", // PREVENT OVERFLOW
              }}
            >
              {/* Chocolate Image */}
              <div className="gift-image-container">
                <img
                  src={choco.images[0]}
                  alt={choco.name}
                  className="w-100 rounded-3"
                  style={{ height: "200px", objectFit: "cover" }}
                />
              </div>

              {/* Chocolate Details */}
              <div className="mt-3">
                <Title level={5} className="fw-bold mb-1 text-maroon">{choco.name}</Title>
                <Paragraph className="mb-1 text-muted small">
                  <strong>Price:</strong> {choco.price}
                </Paragraph>
                <Paragraph className="small text-muted">{choco.description}</Paragraph>
                <Button type="primary" size="middle" className="mt-2 gift-btn">
                  Add to Cart 🎀
                </Button>
              </div>
            </Card>
          </Badge.Ribbon>
        ))}
      </div>

      {/* Custom Styles to Fit Parent */}
      <style>
        {`
          /* Luxurious Maroon & Gold Theme */
          .text-gift {
            color: #b22222 !important;
            font-weight: bold;
          }

          .text-maroon {
            color: #800000 !important;
            font-weight: bold;
          }

          /* Stylish Gift Card */
          .gift-card {
            transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
            width: auto; /* Adjusts based on parent width */
          }

          .gift-card:hover {
            transform: scale(1.03);
            box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.2);
          }

          /* Golden Glow Button */
          .gift-btn {
            background: linear-gradient(to right, #d4af37, #b8860b);
            border: none;
            font-weight: bold;
          }

          .gift-btn:hover {
            background: linear-gradient(to right, #b8860b, #d4af37);
            transform: scale(1.05);
          }
        `}
      </style>
    </div>
  );
};

export default GiftChocolates;
