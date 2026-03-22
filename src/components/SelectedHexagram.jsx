// src/components/SelectedOverlay.jsx
import { useEffect, useRef, useState } from 'react';
import { cn } from '../utils/tools.js';

const SelectedHexagram = ({ targetRef }) => {
  const overlayRef = useRef(null);
  const [dimensions, setDimensions] = useState(null);

  useEffect(() => {
    const updatePosition = () => {
      if (targetRef.current) {
        const rect = targetRef.current.getBoundingClientRect();
        const parentRect = targetRef.current.offsetParent.getBoundingClientRect();
        setDimensions({
          top: rect.top - parentRect.top,
          left: rect.left - parentRect.left,
          width: rect.width,
          height: rect.height,
        });
      }
    };

    updatePosition();
    const handleResize = () => updatePosition();
    window.addEventListener('resize', handleResize);
    const resizeObserver = new ResizeObserver(updatePosition);
    if (targetRef.current) {
      resizeObserver.observe(targetRef.current);
      resizeObserver.observe(targetRef.current.offsetParent);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
    };
  }, [targetRef]);

  if (!dimensions) return null;

  return (
    <div
      ref={overlayRef}
      className={cn(
        "absolute border-2 pointer-events-none origin-center rounded-lg",
        "border-gray-900 dark:border-gray-100 bg-transparent",
        //"transition duration-700 ease-in-out",
        //"scale-105 opacity-40",
        //"animate-reveal-overlay pulse-glow-slow"
        "animate-in fade-in zoom-in",
      )}
      style={{
        top: `${dimensions.top}px`,
        left: `${dimensions.left}px`,
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        zIndex: 20, // Higher than cards,
        boxShadow: '0 0 25px rgba(250, 204, 21, 0.5)',
      }}
    />
  );
};

export default SelectedHexagram;
