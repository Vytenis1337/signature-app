import React, { useEffect } from "react";

const Toast = ({ message, type, onClose }) => {
  // Automatically close the toast after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000); // 3 seconds

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
      className={`fixed top-20 left-1/2 transform -translate-x-1/2 flex items-center px-4 py-2 rounded shadow-lg text-white ${typeStyles[type]} transition-opacity duration-500`}
    >
      <span className="mr-3">{message}</span>
      <button
        onClick={onClose}
        className="text-lg font-bold"
        aria-label="Close"
      >
        &times;
      </button>
    </div>
  );
};

export default Toast;
