import React, { useState, useEffect } from 'react';

const ChocolateLoader = () => {
  const [loadingText, setLoadingText] = useState("Loading...");
  const chocolatePieces = ['🍫', '🍫', '🍫', '🍫', '🍫'];
  const [displayedPiece, setDisplayedPiece] = useState('');
  const [animationComplete, setAnimationComplete] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < chocolatePieces.length) {
        setDisplayedPiece(chocolatePieces[index]);
        setCurrentIndex(index); // Track the current index
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setAnimationComplete(true);
          setLoadingText("Enjoy! 😋");
        }, 500);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [chocolatePieces]);

  return (
    <div className="chocolate-loader-container">
      <div className="chocolate-bar">
        {displayedPiece}
      </div>
      <p className={`loading-text ${animationComplete ? 'text-complete' : ''}`}>
        {loadingText}
      </p>
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
          padding: 10px;
          border-radius: 50%; /* Make it a circle */
          box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.3);
          background-color: #f0e68c; /* Light Yellow */
          width: 80px; /* Adjust size as needed */
          height: 80px;
          align-items: center;
          justify-content: center;
          font-size: 2.5em; /* Increased size of emoji */
          animation: pulse 1s infinite alternate; /* Add a pulse animation */
        }

        @keyframes pulse {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }

        .loading-text {
          font-size: 20px; /* Increased font size */
          font-weight: bold;
          margin-top: 20px; /* Increased margin */
          color: #8B4513;
          transition: color 0.5s ease;
        }

        .text-complete {
          color: #228B22;
        }
      `}</style>
    </div>
  );
};

export default ChocolateLoader;
