/* eslint-disable react-refresh/only-export-components */
// src/components/YijingContext.jsx
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import * as Yijing from '@yijingjs/core';

// Named export so useYijing.js can import it directly
export const YijingContext = createContext();

// Modes: 'sequence', 'gray', 'neighbors', 'random', 'transformations'
const INTERVAL_MS = {
  sequence:        1600,
  random:          1600,
  gray:            1600,
  neighbors:        900,
  transformations: 1400,
};

export const YijingProvider = ({ children }) => {
  const [value, setValue] = useState(0);
  const [mode, setMode] = useState('sequence');

  // Keep a stable ordinal counter that is always in binary-sequence space.
  // This avoids the ambiguity of treating `value` as either binary or gray.
  // `ordinalRef` is used as fast internal counter (avoids stale closures);
  // `ordinal` mirrors it as reactive state so consumers re-render on each tick.
  const ordinalRef = useRef(0);
  const [ordinal, setOrdinal] = useState(0);

  // Reset the ordinal to 0 and snap value to 0 when the mode changes.
  // Wrapped in useCallback so consumers can safely use it as a useEffect dependency
  // without it re-triggering the effect on every Provider re-render.
  const handleSetMode = useCallback((nextMode) => {
    ordinalRef.current = 0;
    setOrdinal(0);
    setValue(0);
    setMode(nextMode);
  }, []); // setMode/setValue/setOrdinal are stable React setter refs

  useEffect(() => {
    const intervalTime = INTERVAL_MS[mode] ?? 1600;

    const interval = setInterval(() => {
      ordinalRef.current = (ordinalRef.current + 1) % 64;
      const ord = ordinalRef.current;
      setOrdinal(ord);

      switch (mode) {
        case 'sequence':
          setValue(ord);
          break;

        case 'gray':
          // Advance through ordinal positions, encode as Gray code
          setValue(Yijing.yijing_toGray(ord));
          break;

        case 'random':
          setValue(Math.floor(Math.random() * 64));
          break;

        case 'neighbors':
          setValue((prev) => {
            const neighbors = Yijing.yijing_neighbors(prev);
            return neighbors[Math.floor(Math.random() * neighbors.length)];
          });
          break;

        case 'transformations':
          setValue((prev) => {
            const transforms = [
              Yijing.yijing_invert,
              Yijing.yijing_reverse,
              Yijing.yijing_opposite,
            ];
            const fn = transforms[Math.floor(Math.random() * transforms.length)];
            const next = fn(prev);
            // Fallback if transformation leaves value unchanged (symmetric hex)
            return next === prev ? Yijing.yijing_invert(prev) : next;
          });
          break;

        default:
          break;
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [mode]);

  return (
    <YijingContext.Provider value={{ value, setValue, mode, setMode: handleSetMode, ordinal }}>
      {children}
    </YijingContext.Provider>
  );
};

// Export hook for direct import (eslint-disable above suppresses Fast Refresh warning)
export const useYijing = () => useContext(YijingContext);
