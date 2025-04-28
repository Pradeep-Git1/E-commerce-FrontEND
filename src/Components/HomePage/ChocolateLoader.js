// ChocolateLoader.js
import React from "react";

const ChocolateLoader = () => (
  <div className="chocolate-loader-container">
    <div className="chocolate-bar">
      <div className="chocolate-piece"></div>
      <div className="chocolate-piece"></div>
      <div className="chocolate-piece"></div>
      <div className="chocolate-piece"></div>
      <div className="chocolate-piece"></div>
    </div>
    <p className="loading-text">Melting Chocolates... 🍫</p>

    {/* CSS Styles for Chocolate Animation */}
    <style>{`
      .chocolate-loader-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 50vh;
      }

      .chocolate-bar {
        display: flex;
        gap: 5px;
        padding: 10px;
        background: #6b3e26;
        border-radius: 10px;
        box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.3);
      }

      .chocolate-piece {
        width: 20px;
        height: 30px;
        background: #8B4513;
        border-radius: 5px;
        animation: melt 1.5s infinite ease-in-out;
      }

      .chocolate-piece:nth-child(2) { animation-delay: 0.2s; }
      .chocolate-piece:nth-child(3) { animation-delay: 0.4s; }
      .chocolate-piece:nth-child(4) { animation-delay: 0.6s; }
      .chocolate-piece:nth-child(5) { animation-delay: 0.8s; }

      @keyframes melt {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(5px); }
      }

      .loading-text {
        font-size: 18px;
        font-weight: bold;
        margin-top: 10px;
        color: #6b3e26;
      }
    `}</style>
  </div>
);

export default ChocolateLoader;