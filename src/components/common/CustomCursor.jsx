import { useState, useEffect, useRef } from "react";
import { useTheme } from "../../context/ThemeContext.jsx";

const CustomCursor = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const cursorRef = useRef(null);
  const [isClicking, setIsClicking] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer) return;

    setEnabled(true);
    document.documentElement.classList.add("custom-cursor-active");

    const move = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
      setIsVisible(true);

      const target = e.target;
      const interactive = target.closest(
        "a, button, [role='button'], input, select, textarea, label, .cursor-pointer, [data-cursor='pointer']"
      );
      setIsPointer(!!interactive);
    };

    const handleDown = () => setIsClicking(true);
    const handleUp = () => setIsClicking(false);
    const handleLeaveWindow = () => setIsVisible(false);
    const handleEnterWindow = () => setIsVisible(true);

    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", handleDown);
    window.addEventListener("mouseup", handleUp);
    document.addEventListener("mouseleave", handleLeaveWindow);
    document.addEventListener("mouseenter", handleEnterWindow);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mouseup", handleUp);
      document.removeEventListener("mouseleave", handleLeaveWindow);
      document.removeEventListener("mouseenter", handleEnterWindow);
    };
  }, []);

  if (!enabled) return null;

  const handleColor = isDark ? "#fb7185" : "#db2777";
  const handleShine = isDark ? "#fda4af" : "#f472b6";
  const bolsterColor = isDark ? "#d4d4d8" : "#a1a1aa";
  const bladeFill = isDark ? "#f4f4f5" : "#e4e4e7";
  const bladeEdge = isDark ? "#a1a1aa" : "#71717a";
  const accentColor = isDark ? "#fde68a" : "#fbbf24";

  const baseTilt = -22;
  const sliceRotation = isClicking ? -14 : 0;
  const sliceShift = isClicking ? 2 : 0;
  const scale = isPointer ? 1.2 : 1;

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className={`pointer-events-none fixed top-0 left-0 z-[9999] transition-opacity duration-200 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      style={{ willChange: "transform" }}
    >
      <svg
        width="46"
        height="26"
        viewBox="0 0 46 26"
        fill="none"
        style={{
          transform: `translate(-6px, -10px) scale(${scale}) rotate(${
            baseTilt + sliceRotation
          }deg) translateY(${sliceShift}px)`,
          transformOrigin: "12px 13px",
          transition: "transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)",
          filter: isDark
            ? "drop-shadow(0 2px 4px rgba(0,0,0,0.55))"
            : "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
        }}
      >
        {/* Blade — straight spine, curved cutting edge */}
        <path
          d="M16 8.5 L42 10.5 C44 10.7 44 13.3 42 13.5 L16 17.5 C13.5 14.5 13.5 11.5 16 8.5 Z"
          fill={bladeFill}
          stroke={bladeEdge}
          strokeWidth="0.75"
        />
        {/* Spine highlight */}
        <path
          d="M16.5 9.3 L41.5 11.1"
          stroke="#ffffff"
          strokeWidth="0.9"
          strokeLinecap="round"
          opacity="0.7"
        />

        {/* Bolster (metal collar) */}
        <rect
          x="12.5"
          y="7.5"
          width="3"
          height="11"
          rx="1"
          fill={bolsterColor}
        />

        {/* Handle */}
        <rect x="0" y="8.5" width="13" height="9" rx="4" fill={handleColor} />
        <rect
          x="2"
          y="10"
          width="9"
          height="1.4"
          rx="0.7"
          fill={handleShine}
          opacity="0.7"
        />
        <circle cx="4.5" cy="13" r="0.7" fill="#ffffff" opacity="0.35" />
        <circle cx="8.5" cy="13" r="0.7" fill="#ffffff" opacity="0.35" />
      </svg>

      {/* Motion lines on slice */}
      {isClicking && (
        <>
          <span
            className="absolute rounded-full"
            style={{
              left: "2px",
              top: "-4px",
              width: "10px",
              height: "2px",
              background: accentColor,
              transform: "rotate(-22deg)",
              animation: "cursor-snip 0.35s ease-out forwards",
            }}
          />
          <span
            className="absolute rounded-full"
            style={{
              left: "-4px",
              top: "2px",
              width: "7px",
              height: "2px",
              background: accentColor,
              opacity: 0.7,
              transform: "rotate(-22deg)",
              animation: "cursor-snip 0.4s ease-out forwards",
            }}
          />
        </>
      )}
    </div>
  );
};

export default CustomCursor;
