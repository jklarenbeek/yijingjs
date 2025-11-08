// src/components/Tooltip.jsx
import { useState } from 'react';
import { cn } from '../utils/tools.js';

export const Tooltip = ({
  children,
  title,
  placement = 'top',
  className,
}) => {
  const [visible, setVisible] = useState(false);

  const placementClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {/* Trigger */}
      {children}

      {/* Tooltip bubble */}
      {visible && (
        <div
          className={cn(
            'absolute z-50 whitespace-nowrap rounded-md bg-gray-800 px-2 py-1 text-xs text-white shadow-lg transition-opacity',
            placementClasses[placement],
            className
          )}
        >
          {title}
          <div
            className={cn(
              'absolute h-2 w-2 rotate-45 bg-gray-800',
              placement === 'top' && 'bottom-[-4px] left-1/2 -translate-x-1/2',
              placement === 'bottom' && 'top-[-4px] left-1/2 -translate-x-1/2',
              placement === 'left' && 'right-[-4px] top-1/2 -translate-y-1/2',
              placement === 'right' && 'left-[-4px] top-1/2 -translate-y-1/2',
            )}
          />
        </div>
      )}
    </div>
  );
};