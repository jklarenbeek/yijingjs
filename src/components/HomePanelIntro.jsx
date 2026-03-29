/* eslint-disable no-unused-vars */
// src/components/HomePanelIntro.jsx
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useYijing } from './YijingContext';
import { toBinary } from '../utils/tools';
import DynamicHexagram from './DynamicHexagram';

// ── Concept carousel data ─────────────────────────────────────────────────────

const concepts = [
  {
    tag:   'State Space',
    title: 'A 6-bit universe',
    text:  'Each state is a unique binary configuration of six lines — yin or yang, 0 or 1.',
    mode:  'random',
    accent: '#f59e0b',
  },
  {
    tag:   'Combinatorics',
    title: '64 possible states',
    text:  'Two states for each of six lines gives exactly 64 complete combinations.',
    mode:  'sequence',
    accent: '#818cf8',
  },
  {
    tag:   'Hamiltonian Path',
    title: 'Minimal change',
    text:  'Neighboring states differ by exactly one bit — a Hamiltonian path through a 6D hypercube.',
    mode:  'neighbors',
    accent: '#34d399',
  },
  {
    tag:   'Group Symmetry',
    title: 'Transformations',
    text:  'Inversion, reflection, and permutation form a group that reveals deep structural symmetry.',
    mode:  'transformations',
    accent: '#f472b6',
  },
  {
    tag:   'Gray Encoding',
    title: 'A system of change',
    text:  "Gray code traces a smooth path through all states. Not symbolic — computational.",
    mode:  'gray',
    accent: '#38bdf8',
  },
];

// ── Sub-components ────────────────────────────────────────────────────────────

const ConceptHero = ({ concept }) => (
  <motion.div
    initial={{ opacity: 0, y: 28, filter: 'blur(6px)' }}
    animate={{ opacity: 1, y: 0,  filter: 'blur(0px)' }}
    exit   ={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
    transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
    className="absolute inset-0 flex flex-col justify-center gap-3 md:gap-5 text-center md:text-left"
  >
    {/* Concept tag */}
    <motion.span
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1, duration: 0.4 }}
      className="text-xs font-mono uppercase tracking-[0.25em] font-semibold"
      style={{ color: concept.accent }}
    >
      {concept.tag}
    </motion.span>

    {/* Main title */}
    <h2
      className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight"
      style={{ letterSpacing: '-0.02em' }}
    >
      {concept.title}
    </h2>

    {/* Body text */}
    <p className="text-base md:text-lg text-indigo-200/70 font-mono leading-relaxed max-w-lg">
      {concept.text}
    </p>
  </motion.div>
);

// Dot indicator that flashes amber when its concept is active
const StepDot = ({ active, accent, onClick }) => (
  <button
    onClick={onClick}
    aria-label="Jump to concept"
    className="w-1.5 h-1.5 rounded-full transition-all duration-300 focus:outline-none"
    style={{
      background: active ? accent : 'rgba(255,255,255,0.2)',
      transform:  active ? 'scale(1.8)' : 'scale(1)',
      boxShadow:  active ? `0 0 8px ${accent}cc` : 'none',
    }}
  />
);

// ── Main component ────────────────────────────────────────────────────────────

export default function HomePanelIntro() {
  const { value, ordinal, setMode } = useYijing();
  const [step, setStep]   = useState(0);
  const timerRef          = useRef(null);

  // Auto-advance
  const advance = () => setStep(s => (s + 1) % concepts.length);

  const resetTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(advance, 5500);
  };

  useEffect(() => {
    resetTimer();
    return () => clearInterval(timerRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDotClick = (i) => {
    setStep(i);
    resetTimer();
  };

  // Sync engine mode with current concept
  useEffect(() => {
    setMode(concepts[step].mode);
  }, [step, setMode]);

  const bits      = toBinary(value);
  const concept   = concepts[step];

  return (
    <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-12 md:py-24 min-h-[65vh] flex flex-col justify-center">
      <div className="flex flex-col md:flex-row items-center md:items-center gap-10 md:gap-20">

        {/* ── Left: Concept text ── */}
        <div className="flex-1 flex flex-col gap-6 w-full">
          {/* Concept hero with correct AnimatePresence mode */}
          <div className="relative h-52 sm:h-56 md:h-60 w-full">
            <AnimatePresence mode="wait">
              <ConceptHero key={step} concept={concept} />
            </AnimatePresence>
          </div>

          {/* Step dots */}
          <div className="flex items-center gap-3 justify-center md:justify-start mt-2">
            {concepts.map((c, i) => (
              <StepDot
                key={i}
                active={i === step}
                accent={c.accent}
                onClick={() => handleDotClick(i)}
              />
            ))}
          </div>
        </div>

        {/* ── Right: Live data panel ── */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="flex flex-col gap-0 min-w-[300px] max-w-xs w-full"
          style={{
            background: 'linear-gradient(145deg, rgba(15,20,45,0.85) 0%, rgba(10,14,35,0.95) 100%)',
            border: '1px solid rgba(99,120,255,0.18)',
            borderRadius: '16px',
            boxShadow: [
              '-12px 16px 40px rgba(0,0,0,0.6)',
              'inset 0 1px 0 rgba(255,255,255,0.06)',
              '0 0 0 1px rgba(99,120,255,0.08)',
            ].join(', '),
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          {/* Panel header */}
          <div
            className="flex items-center justify-between px-5 py-3"
            style={{ borderBottom: '1px solid rgba(99,120,255,0.12)' }}
          >
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-indigo-300/50">
              live state
            </span>
            <div className="flex items-center gap-2">
              <motion.span
                key={ordinal}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="text-[10px] font-mono tabular-nums text-indigo-300/40"
              >
                {String(ordinal).padStart(2, '0')}/63
              </motion.span>
              <motion.span
                key={concept.mode}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-[10px] font-mono uppercase tracking-widest font-semibold"
                style={{ color: concept.accent }}
              >
                {concept.mode}
              </motion.span>
            </div>
          </div>

          {/* Hexagram visualization */}
          <div
            className="flex items-center justify-center px-5 py-5"
            style={{ borderBottom: '1px solid rgba(99,120,255,0.10)' }}
          >
            <div
              className="relative flex items-center justify-center"
              style={{
                width: '120px',
                aspectRatio: '1 / 1',
                background: 'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(251,191,36,0.08) 0%, transparent 70%)',
                borderRadius: '12px',
              }}
            >
              <DynamicHexagram value={value} style={{ width: '80px' }} />
            </div>
          </div>

          {/* Data rows */}
          <div className="flex flex-col divide-y divide-indigo-500/10">

            {/* Decimal value */}
            <div className="flex items-center justify-between px-5 py-3.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-300/45">
                decimal
              </span>
              <motion.span
                key={ordinal}
                initial={{ opacity: 0.4, scale: 0.82 }}
                animate={{ opacity: 1,   scale: 1 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="text-2xl font-bold font-sans tabular-nums"
                style={{ color: concept.accent, letterSpacing: '-0.03em' }}
              >
                {value.toString().padStart(2, '0')}
              </motion.span>
            </div>

            {/* Binary state */}
            <div className="flex items-center justify-between px-5 py-3.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-300/45">
                binary
              </span>
              <motion.span
                key={bits}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
                className="font-mono font-semibold text-white/90 tabular-nums"
                style={{ letterSpacing: '0.28em', fontSize: '13px' }}
              >
                {bits}
              </motion.span>
            </div>

            {/* Hex representation */}
            <div className="flex items-center justify-between px-5 py-3.5 rounded-b-2xl">
              <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-300/45">
                hex
              </span>
              <motion.span
                key={value}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25, delay: 0.05 }}
                className="font-mono font-semibold tabular-nums"
                style={{ color: 'rgba(156,163,175,0.7)', fontSize: '13px', letterSpacing: '0.1em' }}
              >
                0x{value.toString(16).toUpperCase().padStart(2, '0')}
              </motion.span>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
