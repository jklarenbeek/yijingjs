/* eslint-disable no-unused-vars */
// src/components/BackgroundEngine.jsx
import { motion, useReducedMotion } from 'framer-motion';
import { useYijing } from './YijingContext';
import DynamicHexagram from './DynamicHexagram';

/**
 * Persistent, parallax-layered background engine.
 * Renders a living visual representation of the current Yijing state
 * across several depth layers — blurred ghost, sharp ghost, ambient glow,
 * cyber-grid, and a slow rotating radial origin point.
 */
export default function BackgroundEngine() {
  const { value } = useYijing();
  const prefersReducedMotion = useReducedMotion();

  // Reduce animation intensity for users who prefer it
  const gridDuration = prefersReducedMotion ? 0 : 4;
  const rotateDuration = prefersReducedMotion ? 0 : 260;
  const glowDuration = prefersReducedMotion ? 0 : 180;

  return (
    <div
      className="fixed inset-0 -z-50 overflow-hidden pointer-events-none"
      style={{
        background: 'linear-gradient(135deg, #0b0f1a 0%, #0d1230 40%, #0a0d1f 70%, #000000 100%)',
      }}
    >

      {/* ── Layer 1: Deep radial origin glow (slow breathing pulse) ── */}
      <motion.div
        className="absolute inset-0"
        animate={prefersReducedMotion ? {} : {
          opacity: [0.08, 0.14, 0.08],
          scale:   [1, 1.08, 1],
        }}
        transition={{ duration: glowDuration / 3, ease: 'easeInOut', repeat: Infinity }}
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(59,130,246,0.55) 0%, transparent 70%)',
          transformOrigin: 'center',
        }}
      />

      {/* ── Layer 2: Amber warmth counter-gradient ── */}
      <div
        className="absolute inset-0 mix-blend-screen"
        style={{
          background: 'radial-gradient(ellipse 55% 45% at 50% 55%, rgba(251,140,20,0.06) 0%, transparent 65%)',
        }}
      />

      {/* ── Layer 3: Ghost hexagram — far, blurred, slowly rotating ── */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ opacity: 0.045 }}>
        <motion.div
          animate={prefersReducedMotion ? {} : { rotate: [0, 360] }}
          transition={{ duration: rotateDuration, repeat: Infinity, ease: 'linear' }}
          style={{ transform: 'scale(4.5)', filter: 'blur(18px)', transformOrigin: 'center' }}
        >
          <DynamicHexagram value={value} style={{ width: '80px' }} />
        </motion.div>
      </div>

      {/* ── Layer 4: Ghost hexagram — mid distance, sharp, counter-rotating ── */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ opacity: 0.10 }}>
        <motion.div
          animate={prefersReducedMotion ? {} : { rotate: [0, -360] }}
          transition={{ duration: rotateDuration * 0.7, repeat: Infinity, ease: 'linear' }}
          style={{ transform: 'scale(3)', transformOrigin: 'center' }}
        >
          <DynamicHexagram value={value} style={{ width: '80px' }} />
        </motion.div>
      </div>

      {/* ── Layer 5: Foreground ghost — closest, full opacity, no rotation ── */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ opacity: 0.055 }}>
        <div style={{ transform: 'scale(2)', filter: 'blur(1px)', transformOrigin: 'center' }}>
          <DynamicHexagram value={value} style={{ width: '80px' }} />
        </div>
      </div>

      {/* ── Layer 6: Scrolling cyber-grid ── */}
      <motion.div
        className="absolute -inset-full"
        style={{
          backgroundImage: [
            'linear-gradient(rgba(99,120,255,0.035) 1px, transparent 1px)',
            'linear-gradient(90deg, rgba(99,120,255,0.035) 1px, transparent 1px)',
          ].join(', '),
          backgroundSize: '56px 56px',
        }}
        animate={prefersReducedMotion ? {} : { y: [0, 56] }}
        transition={{ duration: gridDuration, ease: 'linear', repeat: Infinity }}
      />

      {/* ── Layer 7: Secondary diagonal grid for depth ── */}
      <div
        className="absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage: [
            'linear-gradient(45deg, rgba(140,160,255,1) 1px, transparent 1px)',
            'linear-gradient(-45deg, rgba(140,160,255,1) 1px, transparent 1px)',
          ].join(', '),
          backgroundSize: '120px 120px',
        }}
      />

      {/* ── Layer 8: Edge vignette ── */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(0,0,0,0.65) 100%)',
          pointerEvents: 'none',
        }}
      />

    </div>
  );
}
