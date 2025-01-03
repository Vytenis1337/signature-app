import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useContext,
  useMemo,
} from "react";
import "./App.css";
import AnimatedSignature from "./components/AnimatedSignature";
import { LanguageContext } from "./contexts/LanguageContext";
import enTranslation from "./locales/en/translation.json";
import ltTranslation from "./locales/lt/translation.json";
import Toast from "./components/Toast";
import LanguageSwitcher from "./components/LanguageSwitcher";

export default function App() {
  const { language } = useContext(LanguageContext);
  const translations = useMemo(
    () => ({
      en: enTranslation,
      lt: ltTranslation,
    }),
    []
  );
  const canvasRef = useRef(null);
  const gifRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const [signatureImage, setSignatureImage] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);

  const [hasDrawn, setHasDrawn] = useState(false);
  const [toasts, setToasts] = useState(null);

  const DEFAULT_COLOR = "#000000";
  const DEFAULT_BRUSH_SIZE = 2;

  const addToast = useCallback(
    (messageKey, type) => {
      const id = Date.now();
      setToasts({ id, message: translations[language][messageKey], type });
    },
    [translations, language]
  );

  const removeToast = () => {
    setToasts(null);
  };

  // Set up canvas for high DPI displays and enhance drawing quality
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      addToast("canvas_not_available", "error");
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      addToast("canvas_context_failed", "error");
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    const container = canvas.parentElement; // Get the parent container
    const containerWidth = container.offsetWidth; // Dynamically get container's width
    const canvasWidth = containerWidth * 0.95; // Use 95% of the parent width
    const canvasHeight = canvasWidth * (3 / 5); // Maintain the 5:3 aspect ratio

    canvas.width = canvasWidth * dpr;
    canvas.height = canvasHeight * dpr;
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;

    ctx.scale(dpr, dpr);

    // Set default drawing settings
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = DEFAULT_BRUSH_SIZE;
    ctx.strokeStyle = DEFAULT_COLOR;
  }, [addToast]);

  // Update stroke color when `color` state changes

  // Start drawing
  const startDrawing = (e) => {
    if (animating) return;
    const ctx = canvasRef.current.getContext("2d");
    const { offsetX, offsetY } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  // Draw on canvas
  const draw = useCallback(
    (e) => {
      if (!isDrawing || animating) return; // Disable drawing if animating
      const { offsetX, offsetY } = getCoordinates(e);
      const ctx = canvasRef.current.getContext("2d");
      ctx.lineTo(offsetX, offsetY);
      ctx.stroke();
    },
    [isDrawing, animating] // Include 'animating' as a dependency
  );

  // Stop drawing
  const stopDrawing = () => {
    if (!isDrawing) return;
    const ctx = canvasRef.current.getContext("2d");
    ctx.closePath();
    setIsDrawing(false);
  };

  // Clear the canvas and send the signature
  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");

    // Convert canvas to image before clearing
    const dataURL = canvasRef.current.toDataURL("image/png");
    // Debugging

    setSignatureImage(dataURL);

    setAnimating(true);

    // Now clear the canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    // Removed setColor and setBrushSize

    setHasDrawn(false);
  };
  // Helper to get coordinates (for mouse and touch events)
  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if (e.touches) {
      const touch = e.touches[0];
      return {
        offsetX: (touch.clientX - rect.left) * scaleX,
        offsetY: (touch.clientY - rect.top) * scaleY,
      };
    }

    return {
      offsetX: (e.nativeEvent.offsetX || e.clientX - rect.left) * scaleX,
      offsetY: (e.nativeEvent.offsetY || e.clientY - rect.top) * scaleY,
    };
  };

  // Function to calculate start and end positions
  const calculatePositions = useCallback(() => {
    if (!canvasRef.current || !gifRef.current) {
      console.log("App - Refs not available");
      return { start: { x: 0, y: 0 }, end: { x: 0, y: 0 } };
    }

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const gifRect = gifRef.current.getBoundingClientRect();

    // Dynamic offsets to fine-tune centering
    const offsetX = -100; // Move left (reduce positive value)
    const offsetY = -200; // Move up (reduce positive value)

    const endX = gifRect.left + gifRect.width / 2 + offsetX;
    const endY = gifRect.top + gifRect.height / 2 + offsetY;

    return {
      start: { x: canvasRect.left, y: canvasRect.top },
      end: { x: endX, y: endY },
    };
  }, []);
  // Function to remove a toast

  useEffect(() => {
    if (isPulsing) {
      // Reset pulse after animation duration (1s)
      addToast("signature_sent_success", "success");
      const timer = setTimeout(() => {
        setIsPulsing(false);
      }, 1000); // Match the pulse-effect duration

      return () => clearTimeout(timer);
    }
  }, [addToast, isPulsing]);

  return (
    <div className="touch-none flex flex-col items-center p-8 h-screen relative space-y-6 overflow-hidden">
      <h1 className="text-6xl font-bold text-blue-600 mb-8">
        {translations[language]["welcome"]}
      </h1>
      <LanguageSwitcher />
      <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch w-full ">
        <div className="w-full md:w-1/2 flex flex-col  justify-center items-center ">
          <div className="text-xl text-center mb-4 max-w-4xl">
            <p className="w-full max-w-[600px]">
              {translations[language]["draw_instruction"]}
            </p>
          </div>

          <canvas
            ref={canvasRef}
            className={`touch-none ${
              isDrawing
                ? "border-4 border-blue-500"
                : "border-2 border-gray-400"
            } cursor-crosshair bg-white rounded-lg h-auto w-full  ${
              animating ? "cursor-not-allowed" : "cursor-crosshair"
            }`}
            style={{
              maxHeight: "100%",
              maxWidth: "100%",
              aspectRatio: "5 / 3",
            }} // Responsive display size maintaining 5:3 aspect ratio
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            aria-label="Signature Canvas"
            role="img"
          />

          {/* Loader Overlay */}
          {/* {animating && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="loader"></div> 
              </div>
            )} */}

          <div className="flex justify-center items-center space-x-12 mt-4">
            <button
              onClick={clearCanvas}
              disabled={animating || !hasDrawn}
              className={`px-12 py-6 bg-blue-500 text-xl text-white font-bold rounded-md 
          hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 
          transition ease-in-out duration-200 
          ${animating || !hasDrawn ? "opacity-50 cursor-not-allowed" : ""}`}
              style={{ minWidth: "200px" }} // Larger size for "Send" button
            >
              {translations[language]["send_button"]}
            </button>
            <button
              onClick={() => {
                const ctx = canvasRef.current.getContext("2d");
                ctx.clearRect(
                  0,
                  0,
                  canvasRef.current.width,
                  canvasRef.current.height
                );

                setHasDrawn(false);
                addToast("canvas_cleared", "info");
              }}
              disabled={animating || !hasDrawn}
              className={`px-6 py-3 bg-red-500 text-lg text-white font-semibold rounded-md 
          hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 
          transition ease-in-out duration-200 
          ${animating || !hasDrawn ? "opacity-50 cursor-not-allowed" : ""}`}
              style={{ minWidth: "120px" }} // Smaller size for "Clear" button
            >
              {translations[language]["clear_button"]}
            </button>
          </div>

          {/* {message && (
            <div className="mt-4 text-green-600 font-medium">{message}</div>
          )} */}
        </div>

        <div className="w-full md:w-1/2 flex justify-center items-center ">
          <img
            ref={gifRef}
            src="/signature_cloud.gif"
            alt="Animated cloud representing collected signatures"
            className={` max-w-full max-h-full object-contain ${
              isPulsing ? "animate-pulse-effect" : ""
            }`}
            loading="lazy"
          />
        </div>
      </div>

      {/* Animated Signature */}
      {signatureImage && animating && (
        <AnimatedSignature
          src={signatureImage}
          calculatePositions={calculatePositions}
          onAnimationEnd={() => {
            setAnimating(false);
            setIsPulsing(true);
          }}
        />
      )}
      {toasts && (
        <Toast
          key={toasts.id}
          message={toasts.message}
          type={toasts.type}
          onClose={removeToast}
        />
      )}
    </div>
  );
}
