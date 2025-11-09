// src/components/Tooltip.jsx

import { useState, useRef } from 'react';
import { cn } from '../utils/tools.js';

export const Tooltip = ({
  children,
  title,
  placement = 'top',
  className,
  block = false,
  followMouse = false,
}) => {
  const [visible, setVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);

  const handleMouseMove = (event) => {
    if (!followMouse || !triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    setVisible(true);
  };

  const handleMouseLeave = () => {
    setVisible(false);
  };

  // Calculate tooltip position based on mouse position
  const getTooltipStyle = () => {
    if (!followMouse || !triggerRef.current || !visible) return {};

    const rect = triggerRef.current.getBoundingClientRect();
    const { x, y } = mousePosition;

    // Determine which edge the mouse is closest to
    const edgeThreshold = 20; // pixels from edge to trigger placement
    let currentPlacement = placement;

    if (x < edgeThreshold) currentPlacement = 'left';
    else if (x > rect.width - edgeThreshold) currentPlacement = 'right';
    else if (y < edgeThreshold) currentPlacement = 'top';
    else if (y > rect.height - edgeThreshold) currentPlacement = 'bottom';

    // Calculate position along the edge
    let left = '50%';
    let top = '50%';
    let transform = '';

    switch (currentPlacement) {
      case 'top':
        left = `${(x / rect.width) * 100}%`;
        top = '0%';
        transform = 'translate(-50%, -100%)';
        break;
      case 'bottom':
        left = `${(x / rect.width) * 100}%`;
        top = '100%';
        transform = 'translate(-50%, 0)';
        break;
      case 'left':
        left = '0%';
        top = `${(y / rect.height) * 100}%`;
        transform = 'translate(-100%, -50%)';
        break;
      case 'right':
        left = '100%';
        top = `${(y / rect.height) * 100}%`;
        transform = 'translate(0, -50%)';
        break;
    }

    return {
      position: 'absolute',
      left,
      top,
      transform,
    };
  };

  const getArrowPosition = () => {
    if (!followMouse) {
      // Original arrow positioning for non-following tooltips
      return cn(
        'absolute h-2 w-2 rotate-45 bg-gray-800',
        placement === 'top' && 'bottom-[-4px] left-1/2 -translate-x-1/2',
        placement === 'bottom' && 'top-[-4px] left-1/2 -translate-x-1/2',
        placement === 'left' && 'right-[-4px] top-1/2 -translate-y-1/2',
        placement === 'right' && 'left-[-4px] top-1/2 -translate-y-1/2',
      );
    }

    // For follow-mouse tooltips, determine arrow position based on current edge
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return '';

    const { x, y } = mousePosition;
    const edgeThreshold = 20;
    let currentPlacement = placement;

    if (x < edgeThreshold) currentPlacement = 'left';
    else if (x > rect.width - edgeThreshold) currentPlacement = 'right';
    else if (y < edgeThreshold) currentPlacement = 'top';
    else if (y > rect.height - edgeThreshold) currentPlacement = 'bottom';

    return cn(
      'absolute h-2 w-2 rotate-45 bg-gray-800',
      currentPlacement === 'top' && 'bottom-[-4px] left-1/2 -translate-x-1/2',
      currentPlacement === 'bottom' && 'top-[-4px] left-1/2 -translate-x-1/2',
      currentPlacement === 'left' && 'right-[-4px] top-1/2 -translate-y-1/2',
      currentPlacement === 'right' && 'left-[-4px] top-1/2 -translate-y-1/2',
    );
  };

  return (
    <div
      ref={triggerRef}
      className={cn(
        "relative",
        block ? "block" : "inline-block"
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={followMouse ? handleMouseMove : undefined}
    >
      {/* Trigger */}
      {children}

      {/* Tooltip bubble */}
      {visible && (
        <div
          ref={tooltipRef}
          className={cn(
            'absolute z-50 whitespace-nowrap rounded-md bg-gray-800 px-2 py-1 text-xs text-white shadow-lg transition-all duration-150',
            !followMouse && [
              placement === 'top' && 'bottom-full left-1/2 -translate-x-1/2 mb-2',
              placement === 'bottom' && 'top-full left-1/2 -translate-x-1/2 mt-2',
              placement === 'left' && 'right-full top-1/2 -translate-y-1/2 mr-2',
              placement === 'right' && 'left-full top-1/2 -translate-y-1/2 ml-2',
            ],
            className
          )}
          style={followMouse ? getTooltipStyle() : {}}
        >
          {title}
          <div className={getArrowPosition()} />
        </div>
      )}
    </div>
  );
};
