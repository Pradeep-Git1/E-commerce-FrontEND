import React, { useState, useEffect, useRef } from "react";
import { getRequest } from "../../Services/api";
import { Row, Col, Card, Spin, Typography, Button } from "antd";
import { Volume2, VolumeX } from "lucide-react";
import "antd/dist/reset.css";

const { Title } = Typography;

function CompanyReels() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);
  const [muteStates, setMuteStates] = useState({});

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const data = await getRequest("/reels/");
        setReels(data);
        const initialMute = {};
        data.forEach((reel) => {
          initialMute[reel.id] = true;
        });
        setMuteStates(initialMute);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch reels.");
        setLoading(false);
      }
    };

    fetchReels();
  }, []);

  const toggleMute = (reelId) => {
    setMuteStates((prev) => ({
      ...prev,
      [reelId]: !prev[reelId],
    }));
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 200 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <div style={{ color: "red", textAlign: "center" }}>{error}</div>;
  }

  return (
    <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 6px 24px rgba(0,0,0,0.08)", position: "relative" }}>
      <Title level={3} style={{ textAlign: "center", margin: "16px 0" }}>
        <span style={{ borderBottom: "3px solid #52c41a", paddingBottom: 4 }}>
          Our Vids
        </span>
      </Title>

      <div
        ref={scrollRef}
        style={{
          overflowX: "scroll",
          overflowY: "hidden",
          WebkitOverflowScrolling: "touch",
          display: "flex",
        }}
        onWheel={(e) => {
          if (e.deltaY !== 0) e.currentTarget.scrollLeft += e.deltaY;
        }}
      >
        <Row
          gutter={[16, 16]}
          style={{
            display: "flex",
            flexWrap: "nowrap",
            minWidth: "max-content",
            padding: "0 10px 20px",
          }}
        >
          {reels.map((reel) => {
            const videoId = reel.url.split("/shorts/")[1];
            const muted = muteStates[reel.id];
            const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${muted ? 1 : 0}&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&iv_load_policy=3&showinfo=0`;

            return (
              <Col
                key={reel.id}
                style={{
                  flex: "0 0 auto",
                  minWidth: 250,
                  maxWidth: 250,
                  position: "relative",
                }}
              >
                <Card
                  hoverable
                  style={{
                    borderRadius: 16,
                    overflow: "hidden",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                    transition: "transform 0.3s ease",
                    height: 445, // Uniform fixed height
                  }}
                  bodyStyle={{ padding: 0, height: "100%" }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <div style={{ position: "relative", width: "100%", height: "100%" }}>
                    <iframe
                      src={embedUrl}
                      title={`reel-${reel.id}`}
                      allowFullScreen
                      frameBorder="0"
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        borderRadius: 12,
                      }}
                    />
                  </div>
                </Card>

                {/* Per-video mute/unmute button */}
                <Button
                  shape="circle"
                  type="default"
                  icon={muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  onClick={() => toggleMute(reel.id)}
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    zIndex: 10,
                    backgroundColor: "#ffffffcc",
                    backdropFilter: "blur(4px)",
                    border: "none",
                  }}
                />
              </Col>
            );
          })}
        </Row>
      </div>

      {/* Right fade gradient */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: 80,
          pointerEvents: "none",
          background: "linear-gradient(to right, transparent, #fff 80%)",
        }}
      />
    </div>
  );
}

export default CompanyReels;
