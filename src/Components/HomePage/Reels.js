import React, { useState, useEffect, useRef, useCallback } from "react";
import { getRequest } from "../../Services/api";
import { Row, Col, Card, Spin, Typography, Button } from "antd";
import { Play, Volume2, VolumeX } from "lucide-react";
import styled from "styled-components"; // Import styled-components
import "antd/dist/reset.css"; // Ensure Ant Design styles are reset

const { Title } = Typography;

// --- Styled Components for Responsive Design ---

const ReelsContainer = styled.div`
    background: transparent;
    border-radius: 12px; /* Slightly smaller border-radius for mobile */
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06); /* Lighter shadow for mobile */
    position: relative;
    margin: 8px; /* Reduced overall margin for mobile */

    @media (min-width: 576px) { /* Small devices (landscape phones, 576px and up) */
        margin: 16px;
        border-radius: 16px;
        box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
    }
    @media (min-width: 768px) { /* Medium devices (tablets, 768px and up) */
        margin: 24px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }
    @media (min-width: 992px) { /* Large devices (desktops, 992px and up) */
        margin: 32px;
    }
`;

const SectionTitle = styled(Title)`
    text-align: center;
    margin: 16px 0 12px !important; /* Reduced bottom margin for mobile */
    font-size: 1.6em !important; /* Smaller title for mobile */
    color: #333;

    span {
        border-bottom: 3px solid #52c41a;
        padding-bottom: 4px;
    }

    @media (min-width: 576px) {
        font-size: 2em !important;
        margin: 20px 0 16px !important;
    }
    @media (min-width: 768px) {
        font-size: 2.4em !important;
        margin: 24px 0 20px !important;
    }
`;

const ReelsScrollWrapper = styled.div`
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
    display: flex;
    scroll-snap-type: x mandatory; /* Snap reels into view */
    padding: 0 8px 8px; /* Padding for scrollable area, 8px for bottom to accommodate shadow/scroll indicator */

    &::-webkit-scrollbar {
        height: 6px;
    }
    &::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 3px;
    }
    &::-webkit-scrollbar-track {
        background-color: rgba(0, 0, 0, 0.1);
    }

    @media (min-width: 768px) {
        padding: 0 16px 16px; /* More padding on larger screens */
    }
`;

const StyledReelCol = styled(Col)`
    flex: 0 0 auto;
    width: 50vw; /* Each reel takes 85% of viewport width on mobile */
    max-width: 280px; /* Cap mobile reel width */
    scroll-snap-align: center; /* Snap to center when scrolling */
    margin-right: 12px; /* Space between reels */
    padding-bottom: 4px; /* Slight padding to avoid cutting off scrollbar */

    &:last-child {
        margin-right: 8px; /* Adjusted last item margin to not cut off padding */
    }

    @media (min-width: 576px) {
        width: 45vw; /* Two reels per row on landscape phones */
        max-width: 320px;
        margin-right: 16px;
    }
    @media (min-width: 768px) {
        width: 30vw; /* Three reels per row on tablets */
        max-width: 300px; /* Fixed max width for tablet/desktop reels */
        margin-right: 20px; /* Increased space for desktop */
    }
    @media (min-width: 992px) {
        width: 22vw; /* Four reels on small desktops */
        max-width: 280px;
        margin-right: 24px;
    }
    @media (min-width: 1200px) {
        width: 18vw; /* Five reels on large desktops */
        max-width: 250px;
        margin-right: 28px;
    }
`;

const ReelCard = styled(Card)`
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); /* Lighter shadow */
    transition: transform 0.3s ease;
    padding-bottom: 177.77%; /* For 9:16 aspect ratio (height = width * 16/9) */
    height: 0;
    position: relative;
    border: 0 !important;

    .ant-card-body {
        border: 0 !important;
        padding: 0 !important;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
    }

    &:hover {
        transform: scale(1.03); /* Slightly less aggressive hover scale for mobile */
    }

    @media (min-width: 768px) {
        border-radius: 16px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        &:hover {
            transform: scale(1.04); /* More prominent hover on desktop */
        }
    }
`;

const VideoWrapper = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #000;

    iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 12px; /* Match card border-radius */
    }
`;

const ThumbnailImage = styled.img`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 12px;
`;

const PlayButton = styled(Button)`
    z-index: 10;
    opacity: 0.8;
    background-color: rgba(24, 144, 255, 0.8); /* Ant Design Primary Blue with opacity */
    border-color: rgba(24, 144, 255, 0.8);

    .lucide-play {
        width: 32px; /* Smaller icon size for mobile */
        height: 32px;
    }

    @media (min-width: 768px) {
        .lucide-play {
            width: 48px; /* Larger icon for desktop */
            height: 48px;
        }
    }
`;

const MuteButton = styled(Button)`
    position: absolute;
    top: 12px; /* Closer to top edge on mobile */
    right: 12px; /* Closer to right edge on mobile */
    z-index: 15; /* Higher z-index to ensure it's on top of play button */
    background-color: rgba(255, 255, 255, 0.5); /* Semi-transparent white */
    backdrop-filter: blur(2px); /* Subtle blur effect */
    border: none;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: rgba(255, 255, 255, 0.7);
    }

    .lucide-volume-2, .lucide-volume-x {
        width: 18px; /* Slightly larger mute icon */
        height: 18px;
    }

    @media (min-width: 768px) {
        top: 16px; /* More space on desktop */
        right: 16px;
        background-color: rgba(255, 255, 255, 0.6);
        backdrop-filter: blur(4px);
        .lucide-volume-2, .lucide-volume-x {
            width: 20px;
            height: 20px;
        }
    }
`;

const GradientOverlay = styled.div`
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 60px; /* Smaller width for mobile */
    pointer-events: none;
    background: linear-gradient(to right, transparent, #fff 80%);

    @media (min-width: 768px) {
        width: 80px;
    }
`;

// --- CompanyReels Component ---

function CompanyReels() {
    const [reels, setReels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const scrollRef = useRef(null);
    const [muteStates, setMuteStates] = useState({});
    const [playStates, setPlayStates] = useState({});

    useEffect(() => {
        const fetchReels = async () => {
            try {
                const data = await getRequest("/reels/");
                setReels(data);
                const initialMute = {};
                const initialPlay = {};
                data.forEach((reel) => {
                    initialMute[reel.id] = true;
                    initialPlay[reel.id] = false; // Initialize all reels as not playing
                });
                setMuteStates(initialMute);
                setPlayStates(initialPlay);
                setLoading(false);
            } catch (err) {
                setError(err.message || "Failed to fetch reels.");
                setLoading(false);
            }
        };

        fetchReels();
    }, []);

    const toggleMute = useCallback((reelId) => {
        setMuteStates((prev) => ({
            ...prev,
            [reelId]: !prev[reelId],
        }));
    }, []);

    const togglePlay = useCallback((reelId) => {
        setPlayStates((prevPlayStates) => {
            const newPlayStates = { ...prevPlayStates };

            // If the clicked reel is already playing, stop it.
            if (newPlayStates[reelId]) {
                newPlayStates[reelId] = false;
            } else {
                // If the clicked reel is not playing, start it and stop all others.
                for (const id in newPlayStates) {
                    newPlayStates[id] = false; // Pause/stop all other reels
                }
                newPlayStates[reelId] = true; // Play the clicked reel
            }
            return newPlayStates;
        });
    }, []);

    const getThumbnailUrl = useCallback((url) => {
        // Correctly extract video ID from YouTube Shorts URL
        const match = url.match(/(?:youtube\.com\/(?:shorts\/|embed\/|watch\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        const videoId = match ? match[1] : null;
        if (videoId) {
            return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`; // High-quality thumbnail
        }
        return null;
    }, []);

    // Handle scroll for mouse wheel on desktop
    const handleWheelScroll = useCallback((e) => {
        if (scrollRef.current) {
            e.preventDefault(); // Prevent page vertical scroll
            scrollRef.current.scrollLeft += e.deltaY;
        }
    }, []);

    useEffect(() => {
        const currentScrollRef = scrollRef.current;
        if (currentScrollRef) {
            currentScrollRef.addEventListener('wheel', handleWheelScroll, { passive: false });
        }
        return () => {
            if (currentScrollRef) {
                currentScrollRef.removeEventListener('wheel', handleWheelScroll);
            }
        };
    }, [handleWheelScroll]);


    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200, margin: '16px' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (error) {
        return <div style={{ color: "red", textAlign: "center", margin: '16px' }}>{error}</div>;
    }

    return (
        <ReelsContainer>
            <ReelsScrollWrapper ref={scrollRef}>
                <Row
                    gutter={[
                        { xs: 12, sm: 16, md: 20, lg: 24, xl: 28 }, // Horizontal gutter for spacing between cards
                        0 // No vertical gutter needed for a horizontal scroll
                    ]}
                    wrap={false} // Ensure no wrapping, maintaining horizontal scroll
                    style={{ flexWrap: "nowrap", minWidth: "max-content", margin: '0' }} // Reset Antd's default Row margin
                >
                    {reels.map((reel) => {
                        const match = reel.url.match(/(?:youtube\.com\/(?:shorts\/|embed\/|watch\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
                        const videoId = match ? match[1] : null;

                        if (!videoId) {
                            console.warn(`Could not extract video ID from URL: ${reel.url}`);
                            return null; // Skip invalid URLs
                        }

                        const muted = muteStates[reel.id];
                        const isPlaying = playStates[reel.id] || false;
                        const thumbnailUrl = getThumbnailUrl(reel.url);

                        // Corrected YouTube embed URL
                        const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${
                            isPlaying ? 1 : 0
                        }&mute=${
                            muted ? 1 : 0
                        }&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&iv_load_policy=3&showinfo=0`;

                        return (
                            <StyledReelCol key={reel.id}>
                                <ReelCard
                                    hoverable
                                >
                                    <VideoWrapper>
                                        {!isPlaying && thumbnailUrl ? (
                                            <>
                                                <ThumbnailImage
                                                    src={thumbnailUrl}
                                                    alt={`Thumbnail for ${reel.id}`}
                                                />
                                                <PlayButton
                                                    shape="circle"
                                                    type="primary"
                                                    icon={<Play size={48} />}
                                                    onClick={() => togglePlay(reel.id)}
                                                />
                                            </>
                                        ) : (
                                            <iframe
                                                src={embedUrl}
                                                title={`reel-${reel.id}`}
                                                allow="autoplay; encrypted-media; picture-in-picture" // Include autoplay permission
                                                allowFullScreen
                                                frameBorder="0"
                                            ></iframe>
                                        )}
                                    </VideoWrapper>
                                </ReelCard>

                                <MuteButton
                                    shape="circle"
                                    type="default"
                                    icon={muted ? <VolumeX /> : <Volume2 />}
                                    onClick={() => toggleMute(reel.id)}
                                />
                            </StyledReelCol>
                        );
                    })}
                </Row>
            </ReelsScrollWrapper>

            {/* Gradient overlay on the right to indicate more content */}
            <GradientOverlay />
        </ReelsContainer>
    );
}

export default CompanyReels;