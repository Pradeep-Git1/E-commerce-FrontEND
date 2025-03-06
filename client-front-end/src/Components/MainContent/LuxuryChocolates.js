import React from "react";
import { Carousel, Card, Typography, Button } from "antd";

const { Title, Paragraph } = Typography;

// Luxury Chocolate Products (More Products Added)
const luxuryChocolates = [
  {
    id: 1,
    name: "Belgian Gold Truffle",
    price: "₹1,999",
    cocoa: "85%",
    description: "Exquisite Belgian dark truffles with a silky ganache filling.",
    images: ["/images/image1.jpg", "/images/image2.jpg", "/images/image3.jpg"],
  },
  {
    id: 2,
    name: "Swiss Hazelnut Bliss",
    price: "₹2,499",
    cocoa: "75%",
    description: "A creamy blend of Swiss chocolate and premium hazelnuts.",
    images: ["/images/image1.jpg", "/images/image2.jpg", "/images/image3.jpg"],
  },
  {
    id: 3,
    name: "Gold Leaf Cocoa Delight",
    price: "₹3,299",
    cocoa: "90%",
    description: "Handcrafted dark chocolate with real edible gold flakes.",
    images: ["/images/image1.jpg", "/images/image2.jpg", "/images/image3.jpg"],
  },
  {
    id: 4,
    name: "French Raspberry Noir",
    price: "₹1,899",
    cocoa: "80%",
    description: "Rich dark chocolate infused with raspberry essence.",
    images: ["/images/image1.jpg", "/images/image2.jpg", "/images/image3.jpg"],
  },
  {
    id: 5,
    name: "Italian Dark Almond",
    price: "₹2,199",
    cocoa: "82%",
    description: "Finest Italian dark chocolate with roasted almonds.",
    images: ["/images/image1.jpg", "/images/image2.jpg", "/images/image3.jpg"],
  },
  {
    id: 6,
    name: "Venezuelan Criollo",
    price: "₹3,599",
    cocoa: "95%",
    description: "Rare Venezuelan Criollo cocoa for an intense flavor.",
    images: ["/images/image1.jpg", "/images/image2.jpg", "/images/image3.jpg"],
  },
  {
    id: 7,
    name: "Peruvian Golden Cocoa",
    price: "₹2,799",
    cocoa: "88%",
    description: "Handcrafted Peruvian dark chocolate with gold dust.",
    images: ["/images/image1.jpg", "/images/image2.jpg", "/images/image3.jpg"],
  },
  {
    id: 8,
    name: "Truffle Royale Collection",
    price: "₹4,499",
    cocoa: "92%",
    description: "A luxurious mix of dark chocolate and gourmet truffles.",
    images: ["/images/image1.jpg", "/images/image2.jpg", "/images/image3.jpg"],
  },
];

const LuxuryChocolates = () => {
  return (
    <div className="container-fluid mt-5">
      <Title level={2} className="text-center mb-4">🍫 Luxury Chocolates Collection</Title>

      <div className="d-flex g-4 justify-content-center overflow-auto">
        {luxuryChocolates.map((choco) => (
          <div key={choco.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
            <Card 
              hoverable 
              className="rounded-3 shadow-sm border-0 p-2" 
              style={{ background: "#fff", textAlign: "center" }}
            >
              {/* Chocolate Image Carousel */}
              <Carousel autoplay effect="fade">
                {choco.images.map((image, index) => (
                  <div key={index}>
                    <img
                      src={image}
                      alt={choco.name}
                      className="w-100 rounded-3"
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  </div>
                ))}
              </Carousel>

              {/* Chocolate Details */}
              <div className="mt-3">
                <Title level={5} className="fw-semibold mb-1">{choco.name}</Title>
                <Paragraph className="mb-1 text-muted small">
                  <strong>Cocoa:</strong> {choco.cocoa}
                </Paragraph>
                <Paragraph className="mb-1 text-muted small">
                  <strong>Price:</strong> {choco.price}
                </Paragraph>
                <Paragraph className="small text-muted">{choco.description}</Paragraph>
                <Button 
                  type="primary" 
                  size="middle" 
                  className="mt-2"
                  style={{ background: "#D4A373", borderColor: "#D4A373", borderRadius: "6px" }}
                >
                  Buy Now 🛒
                </Button>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LuxuryChocolates;
