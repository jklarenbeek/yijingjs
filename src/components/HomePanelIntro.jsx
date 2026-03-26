// HomePanelIntro.jsx
// Drop this in place of the existing <div className="p-2 mb-8"> header block in HomePanel.jsx

import { useEffect, useRef } from 'react';

const I_CHING_BLURB =
  'The I Ching — Book of Changes — is a 3,000-year-old oracle and philosophical system rooted in ancient China. ' +
  'Its 64 hexagrams map every archetypal situation in the cosmos. ' +
  'Cast coins, observe the lines, and let the shifting patterns speak to your present moment.';

// A single hexagram glyph built from pure divs — no SVG dependency
const HexagramGlyph = () => (
  <div className="flex flex-col gap-[5px] shrink-0 pt-1">
    {[true, false, true, false, true, false].map((yang, i) =>
      yang ? (
        // Solid yang line
        <div
          key={i}
          className="h-[7px] w-[44px] rounded-sm bg-amber-500"
          style={{ animationDelay: `${i * 0.18}s` }}
        />
      ) : (
        // Broken yin line
        <div key={i} className="flex gap-[6px]" style={{ animationDelay: `${i * 0.18}s` }}>
          <div className="h-[7px] w-[19px] rounded-sm bg-amber-500" />
          <div className="h-[7px] w-[19px] rounded-sm bg-amber-500" />
        </div>
      )
    )}
  </div>
);

const HomePanelIntro = ({ currentMethod }) => {
  const blurbRef = useRef(null);

  // Trigger blurb reveal once on mount (after title animation settles)
  useEffect(() => {
    const t = setTimeout(() => {
      if (blurbRef.current) blurbRef.current.classList.add('opacity-100', 'translate-y-0');
    }, 1900);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="p-2 mb-8">
      {/* Eyebrow rule + label */}
      <div
        className="flex items-center gap-3 mb-4 opacity-0 translate-y-2"
        style={{ animation: 'slideUpFade 0.6s cubic-bezier(.16,1,.3,1) 0.1s forwards' }}
      >
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
        <span className="text-[10px] tracking-[0.25em] text-gray-400 dark:text-gray-500 font-medium uppercase">
          Yijing · Explorer
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
      </div>

      {/* Glyph + title block */}
      <div className="flex items-start gap-5 flex-wrap">
        {/* Animated hexagram glyph */}
        <div
          className="opacity-0 scale-75 -rotate-12"
          style={{ animation: 'glyphReveal 0.9s cubic-bezier(.16,1,.3,1) 0.15s forwards' }}
        >
          <HexagramGlyph />
        </div>

        <div className="flex-1 min-w-[200px]">
          {/* Line 1 */}
          <h2
            className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 leading-tight opacity-0 translate-y-3"
            style={{ animation: 'slideUpFade 0.7s cubic-bezier(.16,1,.3,1) 0.35s forwards' }}
          >
            Everything is changing
          </h2>
          {/* Line 2 */}
          <p
            className="text-xl text-gray-600 dark:text-gray-400 mt-1 opacity-0 translate-y-3"
            style={{ animation: 'slideUpFade 0.7s cubic-bezier(.16,1,.3,1) 0.65s forwards' }}
          >
            Discover what is next!
          </p>
        </div>
      </div>

      {/* Blurb — appears after title animation */}
      <p
        ref={blurbRef}
        className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl text-sm leading-relaxed
                   border-l-2 border-gray-200 dark:border-gray-700 pl-3
                   opacity-0 translate-y-2 transition-all duration-700 ease-out"
      >
        {I_CHING_BLURB}
      </p>

      <style>{`
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes glyphReveal {
          from { opacity: 0; transform: scale(0.7) rotate(-20deg); }
          60%  { opacity: 1; transform: scale(1.08) rotate(3deg); }
          to   { opacity: 1; transform: scale(1) rotate(0deg); }
        }
      `}</style>
    </div>
  );
};

export default HomePanelIntro;
