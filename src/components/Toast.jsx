import React, { useState, useEffect } from "react";

const Toast = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Set the toast to visible after mounting
    setVisible(true);

    // Automatically close the toast after 2 seconds
    const timer = setTimeout(() => {
      setVisible(false); // Start fade-out transition
      setTimeout(onClose, 500); // Wait for transition before removing from DOM
    }, 2000);

    return () => clearTimeout(timer);
  }, [onClose]);

  // Define styles based on the type of toast
  const typeStyles = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
    warning: "bg-yellow-500",
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`fixed top-20 left-1/2 transform -translate-x-1/2 flex items-center px-4 py-2 rounded shadow-lg text-white ${
        typeStyles[type]
      } transition-opacity duration-500 ease-in-out ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <span className="mr-3">{message}</span>
      <button
        onClick={() => setVisible(false)}
        className="text-lg font-bold"
        aria-label="Close"
      >
        &times;
      </button>
    </div>
  );
};

export default Toast;
