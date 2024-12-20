import React, { useState, memo } from "react";

const AnimatedSignature = memo(
  ({ src, calculatePositions, onAnimationEnd }) => {
    const { start, end } = calculatePositions();
    const [isLoaded, setIsLoaded] = useState(false);

    // Calculate the difference in positions
    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;

    const handleLoad = () => {
      setIsLoaded(true);
    };

    return (
      <img
        src={src}
        alt="Animated Signature"
        onLoad={handleLoad}
        onTransitionEnd={onAnimationEnd}
        style={{
          position: "fixed", // Use fixed positioning for animation
          top: `${start.y}px`,
          left: `${start.x}px`,
          zIndex: 1000, // Ensure it's above other elements
          transition: "all 3s ease-in-out", // Smooth animation
          transform: isLoaded
            ? `translate(${deltaX}px, ${deltaY}px) scale(0)` // Animate to the end position and shrink
            : "translate(0, 0) scale(1)", // Start from the initial position
          opacity: isLoaded ? 0 : 1, // Fade out once loaded
          maxWidth: "100%", // Ensure it doesn't overflow horizontally
          maxHeight: "100%", // Ensure it doesn't overflow vertically
        }}
        className="pointer-events-none border-2 border-gray-500 object-contain" // Tailwind for responsiveness
      />
    );
  }
);

export default AnimatedSignature;
