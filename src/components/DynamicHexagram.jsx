/* eslint-disable no-unused-vars */
// src/components/DynamicHexagram.jsx
import { motion } from 'framer-motion';

/**
 * A single hexagram line rendered with Framer Motion.
 * Bit convention matches HexagramCard: bit 0 = top line of the upper trigram.
 *
 * @param {boolean} isYang  - true for yang (solid), false for yin (broken)
 * @param {number}  index   - 0–5 stagger source; also used to derive trigram position
 * @param {boolean} isTop   - whether this is the topmost line of a trigram (subtle glow tweak)
 */
const Line = ({ isYang, index, isTop }) => {
  const delay = index * 0.06;

  const transition = {
    duration: 0.55,
    ease: [0.4, 0, 0.2, 1],
    delay,
  };

  // Intensity varies by line position — upper trigram slightly brighter
  const upperTrigram = index < 3;
  const glowIntensity = isTop ? '0.75' : upperTrigram ? '0.55' : '0.40';
  const glowSize      = isTop ? '16px' : '10px';

  return (
    <div className="relative w-full" style={{ height: '10px', marginBottom: '5px' }}>

      {/* Yang: one solid bar */}
      <motion.div
        initial={false}
        animate={{
          opacity: isYang ? 1 : 0,
          scaleX: isYang ? 1 : 0.85,
        }}
        transition={transition}
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '3px',
          background: `linear-gradient(90deg,
            rgba(251,180,20,0.7) 0%,
            rgba(251,191,36,1) 40%,
            rgba(255,215,80,1) 60%,
            rgba(251,191,36,0.8) 100%
          )`,
          boxShadow: isYang
            ? `0 0 ${glowSize} rgba(251,191,36,${glowIntensity}), 0 0 4px rgba(255,255,200,0.4)`
            : 'none',
        }}
      />

      {/* Yin: left half */}
      <motion.div
        initial={false}
        animate={{
          opacity: !isYang ? 1 : 0,
          x: !isYang ? '0%' : '12%',
        }}
        transition={transition}
        style={{
          position: 'absolute',
          left: 0, top: 0, bottom: 0,
          width: '43%',
          borderRadius: '3px',
          background: `linear-gradient(90deg,
            rgba(251,160,10,0.6) 0%,
            rgba(251,191,36,0.9) 100%
          )`,
          boxShadow: !isYang
            ? `0 0 ${glowSize} rgba(251,191,36,${glowIntensity})`
            : 'none',
        }}
      />

      {/* Yin: right half */}
      <motion.div
        initial={false}
        animate={{
          opacity: !isYang ? 1 : 0,
          x: !isYang ? '0%' : '-12%',
        }}
        transition={transition}
        style={{
          position: 'absolute',
          right: 0, top: 0, bottom: 0,
          width: '43%',
          borderRadius: '3px',
          background: `linear-gradient(90deg,
            rgba(251,191,36,0.9) 0%,
            rgba(251,160,10,0.6) 100%
          )`,
          boxShadow: !isYang
            ? `0 0 ${glowSize} rgba(251,191,36,${glowIntensity})`
            : 'none',
        }}
      />
    </div>
  );
};

/**
 * Renders a hexagram as two stacked trigrams with an inter-trigram gap.
 * Bit ordering matches HexagramCard (bit 0 = top line).
 *
 * @param {number} value     - Hexagram value 0–63
 * @param {string} className - Extra Tailwind classes on the outer wrapper
 */
export default function DynamicHexagram({ value, className = '' }) {
  // Extract 6 bits; bit 0 = top line (matches HexagramCard convention)
  const bits = Array.from({ length: 6 }, (_, i) => (value >> i) & 1);

  // Upper trigram: indices 0, 1, 2 (top → middle of upper group)
  // Lower trigram: indices 3, 4, 5
  const upperBits = bits.slice(0, 3);
  const lowerBits = bits.slice(3, 6);

  return (
    <div
      className={className}
      style={{ display: 'flex', flexDirection: 'column', width: '100%' }}
    >
      {/* Upper trigram */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {upperBits.map((bit, i) => (
          <Line key={i} index={i} isYang={bit === 1} isTop={i === 0} />
        ))}
      </div>

      {/* Inter-trigram gap */}
      <div style={{ height: '10px' }} />

      {/* Lower trigram */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {lowerBits.map((bit, i) => (
          <Line key={i + 3} index={i + 3} isYang={bit === 1} isTop={false} />
        ))}
      </div>
    </div>
  );
}
