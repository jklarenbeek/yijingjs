// src/components/HomePanel.jsx

import { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '../utils/tools';
import HexagramCard from './HexagramCard';
import HexagramTextPanel from './KingWenPanel';

const EXPLAINERS = {
  three: 'Throw three coins six times — one throw per hexagram line (line 1 = bottom). Heads counts as 3, tails as 2. The sum (6–9) determines the line: 6 = old yin (moving →yang), 7 = young yang, 8 = young yin, 9 = old yang (moving →yin). Moving lines produce a second, transformed hexagram.',
  six: 'All six coins are cast at once. The five gold coins each represent one line (coin 1 at left = bottom line, coin 6 = top line): heads = yang, tails = yin. The special red coin\'s position among the six determines the single moving line. That one line transforms in the second hexagram.',
};

const rnd = () => Math.random() < 0.5;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function throwThree() {
  const coins = [rnd(), rnd(), rnd()];
  const value = coins.reduce((s, h) => s + (h ? 3 : 2), 0);
  return { coins, value };
}

function lineInfo(v) {
  return {
    isYang: v === 7 || v === 9,
    isMoving: v === 6 || v === 9,
    label: ({ 6: 'Old Yin', 7: 'Young Yang', 8: 'Young Yin', 9: 'Old Yang' })[v],
  };
}

function throwSix() {
  const specialSlot = Math.floor(Math.random() * 6);
  const coins = Array.from({ length: 6 }, () => rnd());
  return { coins, specialSlot };
}

function countBits(n) {
  let c = 0;
  while (n) { c += n & 1; n >>= 1; }
  return c;
}

const Coin = ({ isHeads, isSpecial, showLineNum, lineNum }) => {
  const [spinning, setSpinning] = useState(true);
  const dur = useRef((0.72 + Math.random() * 0.52).toFixed(2));
  const innerRef = useRef(null);

  useEffect(() => {
    // End spin after CSS duration
    const timer = setTimeout(() => {
      setSpinning(false);
    }, dur.current * 1000);
    return () => clearTimeout(timer);
  }, []);

  const faces = `absolute inset-0 rounded-full flex flex-col items-center justify-center`;
  const hole = `w-3.5 h-3.5 bg-gray-950 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-inner`;
  const textH = `absolute top-1 left-0 right-0 text-center text-[0.52rem] font-bold text-black/30 pointer-events-none`;
  const textSym = `absolute bottom-1 left-0 right-0 text-center text-[0.48rem] tracking-widest text-black/30 pointer-events-none`;

  const hCls = isSpecial
    ? `bg-[radial-gradient(circle_at_32%_32%,_#ffbf9f_0%,_#e06030_20%,_#9e2e0a_55%,_#5c1505_85%,_#200500_100%)] shadow-[inset_0_3px_5px_rgba(255,180,120,0.45),_inset_0_-3px_5px_rgba(0,0,0,0.5),_0_5px_14px_rgba(0,0,0,0.7),_0_0_26px_rgba(200,80,20,0.4)]`
    : `bg-[radial-gradient(circle_at_32%_32%,_#fff5aa_0%,_#ffd166_20%,_#c9920a_55%,_#7a5208_85%,_#3d2800_100%)] shadow-[inset_0_3px_5px_rgba(255,255,255,0.45),_inset_0_-3px_5px_rgba(0,0,0,0.5),_0_5px_14px_rgba(0,0,0,0.7),_0_0_22px_rgba(201,146,10,0.35)]`;

  const tCls = isSpecial
    ? `bg-[radial-gradient(circle_at_65%_65%,_#ffbf9f_0%,_#e06030_20%,_#9e2e0a_55%,_#5c1505_85%,_#200500_100%)] shadow-[inset_0_3px_5px_rgba(255,180,120,0.3),_inset_0_-3px_5px_rgba(0,0,0,0.5),_0_5px_14px_rgba(0,0,0,0.7)]`
    : `bg-[radial-gradient(circle_at_65%_65%,_#fff5aa_0%,_#ffd166_20%,_#c9920a_55%,_#7a5208_85%,_#3d2800_100%)] shadow-[inset_0_3px_5px_rgba(255,255,255,0.3),_inset_0_-3px_5px_rgba(0,0,0,0.5),_0_5px_14px_rgba(0,0,0,0.7)]`;

  return (
    <div className="w-[50px] h-[50px] sm:w-[58px] sm:h-[58px] shrink-0 relative" style={{ perspective: '600px' }}>
      <div
        ref={innerRef}
        className={cn("w-full h-full relative transition-transform duration-100", spinning && "animate-coin-spin")}
        style={{
          transformStyle: 'preserve-3d',
          '--spin-dur': `${dur.current}s`,
          transform: !spinning ? (isHeads ? 'rotateY(0deg)' : 'rotateY(180deg)') : (isHeads ? 'rotateY(0deg)' : 'rotateY(180deg)')
        }}
      >
        {/* Heads */}
        <div className={cn(faces, hCls)} style={{ backfaceVisibility: 'hidden' }}>
          <div className={hole}></div>
          <span className={textH}>H</span>
          <span className={textSym}>{isSpecial ? '☯' : '⊕'}</span>
        </div>
        {/* Tails */}
        <div className={cn(faces, tCls)} style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
          <div className={hole}></div>
          <span className={textH}>T</span>
          <span className={textSym}>{isSpecial ? '☯' : '⊕'}</span>
        </div>
      </div>

      {showLineNum && lineNum != null && (
        <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 text-[0.52rem] text-gray-500 whitespace-nowrap">
          L{lineNum}
        </div>
      )}
      {isSpecial && (
        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 border-gray-950 font-bold text-white flex items-center justify-center text-[0.45rem] z-10">
          ✦
        </div>
      )}
    </div>
  );
};

const LineSymbol = ({ isYang, isMoving }) => {
  return (
    <div className="flex w-[52px] h-[10px]">
      {isYang ? (
        <div className={cn(
          "w-full h-full rounded-[2px]",
          isMoving ? "bg-gradient-to-r from-red-600 to-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)] animate-[pulse-glow_1.8s_infinite]"
            : "bg-gradient-to-r from-amber-700 to-amber-400 shadow-[0_0_7px_rgba(245,158,11,0.5)]"
        )} />
      ) : (
        <>
          <div className={cn(
            "w-[44%] h-full rounded-[2px]",
            isMoving ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)] animate-[pulse-glow_1.8s_infinite]" : "bg-gray-500"
          )} />
          <div className={cn(
            "w-[44%] h-full rounded-[2px] ml-auto",
            isMoving ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)] animate-[pulse-glow_1.8s_infinite]" : "bg-gray-500"
          )} />
        </>
      )}
    </div>
  );
};


const HomePanel = ({ selectedHex, handleSelectHex }) => {
  const [currentMethod, setCurrentMethod] = useState('three');
  const [isActive, setIsActive] = useState(false);
  const [throwResults, setThrowResults] = useState([]);
  const [dots, setDots] = useState({ done: 0, total: 6 });
  const [sensorStatus, setSensorStatus] = useState('');
  const [shakeHint, setShakeHint] = useState('');
  const [isShakeActive, setIsShakeActive] = useState(false);

  // Finished hexagram maps array: [] or [primaryBits, changedBits, movingMask]
  const [finalResult, setFinalResult] = useState(null);

  const accelPrev = useRef(0);
  const stillTimer = useRef(null);
  const buttonRef = useRef(null);
  const oracleRef = useRef(null);

  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdStartTime = useRef(0);
  const holdReqRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    return () => {
      if (holdReqRef.current) cancelAnimationFrame(holdReqRef.current);
    };
  }, []);

  useEffect(() => {
    if (finalResult) {
      setTimeout(() => {
        oracleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    } else if (throwResults.length > 0) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 50);
    }
  }, [throwResults, finalResult, dots]);

  const totalThrows = currentMethod === 'three' ? 6 : 1;

  const selectMethod = (m) => {
    if (isActive) return;
    setCurrentMethod(m);
    setThrowResults([]);
    setFinalResult(null);
    setDots({ done: 0, total: m === 'three' ? 6 : 1 });
  };

  const startHold = (e) => {
    if (isActive || (e && e.pointerType === 'mouse' && e.button !== 0)) return;
    setIsHolding(true);
    holdStartTime.current = performance.now();
    
    if (shakeHint.includes('tap above')) requestMotion();

    const animate = (time) => {
      const elapsed = time - holdStartTime.current;
      setHoldProgress(elapsed);
      holdReqRef.current = requestAnimationFrame(animate);
    };
    holdReqRef.current = requestAnimationFrame(animate);
  };

  const endHold = () => {
    if (!isHolding) return;
    setIsHolding(false);
    if (holdReqRef.current) cancelAnimationFrame(holdReqRef.current);
    setHoldProgress(0);
    
    handleThrowClick();
  };

  const cancelHold = () => {
    if (!isHolding) return;
    setIsHolding(false);
    if (holdReqRef.current) cancelAnimationFrame(holdReqRef.current);
    setHoldProgress(0);
  };

  const spawnParticles = useCallback(() => {
    if (!buttonRef.current) return;
    const r = buttonRef.current.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const cols = ['#f59e0b', '#10b981', '#ef4444', '#d97706', '#9ca3af', '#8b5cf6'];

    for (let i = 0; i < 24; i++) {
      const p = document.createElement('div');
      p.className = 'absolute rounded-full pointer-events-none z-[999] animate-pfly';
      const ang = Math.random() * Math.PI * 2;
      const dist = 50 + Math.random() * 140;

      p.style.left = `${cx}px`;
      p.style.top = `${cy}px`;
      p.style.width = `${4 + Math.random() * 6}px`;
      p.style.height = `${4 + Math.random() * 6}px`;
      p.style.backgroundColor = cols[i % cols.length];
      p.style.setProperty('--tx', `${(Math.cos(ang) * dist).toFixed(1)}px`);
      p.style.setProperty('--ty', `${(Math.sin(ang) * dist).toFixed(1)}px`);
      p.style.setProperty('--dur', `${(0.45 + Math.random() * 0.55).toFixed(2)}s`);
      p.style.animationDelay = `${(Math.random() * 0.08).toFixed(3)}s`;

      document.body.appendChild(p);
      setTimeout(() => p.remove(), 1400);
    }
  }, []);

  const handleThrowClick = async () => {
    if (isActive) return;
    setIsActive(true);
    setThrowResults([]);
    setFinalResult(null);
    setDots({ done: 0, total: totalThrows });

    try {
      let results = [];
      if (currentMethod === 'three') {
        for (let i = 0; i < 6; i++) {
          await sleep(i === 0 ? 80 : 340);
          const result = throwThree();
          const timedResult = { ...result, revealedCoins: [] };
          results.push(timedResult);
          setThrowResults([...results]);
          setDots({ done: i + 1, total: 6 });

          // Stagger coins
          for (let c = 0; c < 3; c++) {
            await sleep(110);
            results[i].revealedCoins.push(c);
            setThrowResults([...results]);
          }
          await sleep(260); // reveal line
          results[i].lineRevealed = true;
          setThrowResults([...results]);
        }
      } else {
        await sleep(100);
        const result = throwSix();
        const timedResult = { ...result, revealedCoins: [] };
        results.push(timedResult);
        setThrowResults([...results]);
        setDots({ done: 1, total: 1 });

        for (let c = 0; c < 6; c++) {
          await sleep(130);
          results[0].revealedCoins.push(c);
          setThrowResults([...results]);
        }
        await sleep(250);
        results[0].lineRevealed = true;
        setThrowResults([...results]);
      }

      await sleep(500);

      // Compute final result
      let primaryBits = 0;
      let movingMask = 0;

      if (currentMethod === 'three') {
        results.forEach(({ value }, i) => {
          const { isYang, isMoving } = lineInfo(value);
          if (isYang) primaryBits |= (1 << i);
          if (isMoving) movingMask |= (1 << i);
        });
      } else {
        const { coins, specialSlot } = results[0];
        coins.forEach((isHeads, i) => {
          if (isHeads) primaryBits |= (1 << i);
        });
        movingMask = (1 << specialSlot);
      }

      const changedBits = (primaryBits ^ movingMask) & 0b111111;
      setFinalResult([primaryBits, changedBits, movingMask]);
      spawnParticles();

    } catch (err) {
      console.error(err);
    } finally {
      setIsActive(false);
    }
  };

  const isActiveRef = useRef(isActive);
  useEffect(() => { isActiveRef.current = isActive; }, [isActive]);

  const setupMotion = useCallback(() => {
    setShakeHint('— or shake the device to cast —');
    setSensorStatus('⋯ MOTION SENSOR ACTIVE ⋯');

    let shaking = false;
    let buf = [];
    const SHAKE = 18, STILL = 4, WAIT = 700;

    const handler = (e) => {
      const a = e.accelerationIncludingGravity;
      if (!a) return;
      const mag = Math.sqrt(a.x ** 2 + a.y ** 2 + a.z ** 2);
      const delta = Math.abs(mag - accelPrev.current);
      accelPrev.current = mag;
      buf.push(delta);
      if (buf.length > 12) buf.shift();
      const avg = buf.reduce((s, v) => s + v, 0) / buf.length;

      if (avg > SHAKE && !isActiveRef.current) {
        setIsShakeActive(true);
        shaking = true;
        clearTimeout(stillTimer.current);
      } else if (shaking && avg < STILL) {
        setIsShakeActive(false);
        clearTimeout(stillTimer.current);
        stillTimer.current = setTimeout(() => {
          if (shaking && !isActiveRef.current) {
            shaking = false;
            handleThrowClick();
          } else {
            shaking = false;
          }
        }, WAIT);
      }
    };
    window.addEventListener('devicemotion', handler);
    return () => window.removeEventListener('devicemotion', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const requestMotion = async () => {
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
      try {
        const res = await DeviceMotionEvent.requestPermission();
        if (res === 'granted') setupMotion();
      } catch (err) {
        console.warn('Motion permission request failed:', err);
      }
    } else {
      setupMotion();
    }
  };

  useEffect(() => {
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
      setShakeHint('— tap above to grant motion access, then shake —');
    } else {
      setupMotion();
    }
  }, [setupMotion]);

  return (
    <div className="flex flex-col p-4 md:p-8 w-full h-full max-w-screen-2xl mx-auto overflow-y-auto relative">
      <div className={cn("fixed inset-0 border-4 border-blue-400 pointer-events-none z-[100] transition-opacity duration-150 shadow-[inset_0_0_60px_rgba(59,130,246,0.15)]", isShakeActive ? "opacity-100" : "opacity-0")} />

      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
          Everything is changing<br />Discover what is next!
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl">
          Cast the coins — let the cosmos speak. {EXPLAINERS[currentMethod]}
        </p>
      </div>

      <div className="flex flex-col items-center gap-8 w-full bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-10 shadow-sm border border-gray-200 dark:border-gray-700 min-h-[500px]">

        <div className="flex flex-wrap gap-4 justify-center w-full relative z-10">
          {[
            { id: 'three', label: 'Three Coins × 6', sub: 'Traditional · one throw per line' },
            { id: 'six', label: 'Six Coins × 1', sub: 'Single cast · special coin = moving' }
          ].map(m => (
            <button
              key={m.id}
              onClick={() => selectMethod(m.id)}
              className={cn(
                "px-5 py-3 border rounded-xl transition-all flex flex-col items-center min-w-[180px]",
                currentMethod === m.id
                  ? "border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 shadow-sm"
                  : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              )}
            >
              <span className="font-semibold">{m.label}</span>
              <span className="block text-xs opacity-80 mt-1">{m.sub}</span>
            </button>
          ))}
        </div>

        <div className={cn("text-sm text-blue-500 font-medium text-center h-[1.2em] transition-opacity duration-500", sensorStatus ? "opacity-100" : "opacity-0")}>
          {sensorStatus}
        </div>

        <div className="flex flex-col items-center gap-3 relative z-10">
          <button
            ref={buttonRef}
            disabled={isActive}
            onPointerDown={startHold}
            onPointerUp={endHold}
            onPointerLeave={cancelHold}
            onPointerCancel={cancelHold}
            onContextMenu={(e) => { if (isHolding) e.preventDefault(); }}
            className={cn(
              "relative px-12 py-4 rounded-xl text-white font-bold tracking-wide transition-all overflow-hidden group select-none touch-none",
              isHolding ? "bg-gradient-to-br from-purple-600 to-pink-600 scale-[1.02] shadow-[0_0_25px_rgba(236,72,153,0.6)]" : "bg-gradient-to-br from-blue-600 to-purple-600 hover:-translate-y-0.5 hover:shadow-lg shadow-md hover:from-blue-500 hover:to-purple-500 active:translate-y-0 active:scale-[0.98]",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            )}
          >
            <div 
              className="absolute inset-0 bg-white/20 transition-transform duration-75 origin-left"
              style={{ transform: `scaleX(${Math.min(holdProgress / 2000, 1)})` }}
            />
            <div 
              className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.4)_0,transparent_50%)] transition-opacity duration-75"
              style={{ 
                opacity: Math.min(holdProgress / 2000, 1),
                transform: `scale(${1 + Math.min(holdProgress / 2000, 1) * 2})` 
              }}
            />
            <span className="relative z-10 drop-shadow-md flex items-center justify-center gap-2 min-w-[140px]">
              {isHolding ? (
                <>
                  <span className="animate-[spin_2s_linear_infinite] text-lg block leading-none">☯</span>
                  <span className="tracking-widest">
                    QI {(Math.min(holdProgress / 2000, 1) * 100).toFixed(0)}%
                  </span>
                </>
              ) : (
                'Cast the Oracle'
              )}
            </span>
          </button>
          <p className="text-sm text-gray-500 text-center min-h-[1.2em]">{shakeHint}</p>
        </div>

        <div className="flex gap-2 justify-center min-h-[14px] relative z-10">
          {Array.from({ length: dots.total }).map((_, i) => (
            <div key={i} className={cn(
              "w-2.5 h-2.5 rounded-full transition-all duration-400",
              i < dots.done ? "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" : "bg-gray-200 dark:bg-gray-700"
            )} />
          ))}
        </div>

        {/* Legend */}
        <div className="flex gap-6 flex-wrap justify-center text-sm font-medium text-gray-600 dark:text-gray-400 relative z-10">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full shrink-0 bg-blue-500"></div>7 = Yang ──</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full shrink-0 bg-gray-500"></div>8 = Yin – –</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full shrink-0 bg-emerald-500"></div>6 = Old Yin (moving)</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full shrink-0 bg-purple-500"></div>9 = Old Yang (moving)</div>
        </div>

        <div className="w-full max-w-2xl flex flex-col gap-4 relative z-10 mt-4">
          {currentMethod === 'three' && throwResults.map((tr, idx) => (
            <div key={idx} className="flex items-center gap-4 flex-wrap py-4 px-5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl relative animate-reveal-overlay text-gray-800 dark:text-gray-100">
              <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-blue-500 to-purple-500 rounded-l-xl"></div>
              <div className="text-sm font-bold text-gray-400 min-w-[1.5rem] text-center">{idx + 1}</div>
              <div className="flex gap-3 flex-1 flex-wrap items-center">
                {tr.revealedCoins.map(ci => <Coin key={ci} isHeads={tr.coins[ci]} isSpecial={false} />)}
              </div>
              {tr.lineRevealed && (
                <div className="flex flex-col items-center gap-1 min-w-[80px] animate-reveal-overlay">
                  <LineSymbol isYang={lineInfo(tr.value).isYang} isMoving={lineInfo(tr.value).isMoving} />
                  <div className={cn("text-lg font-bold leading-none mt-2",
                    tr.value === 6 ? "text-emerald-500" : tr.value === 7 ? "text-blue-500" : tr.value === 8 ? "text-gray-500" : "text-purple-500")}>
                    {tr.value}
                  </div>
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">{lineInfo(tr.value).label}</div>
                </div>
              )}
            </div>
          ))}

          {currentMethod === 'six' && throwResults.map((tr) => (
            <div key="six-cast" className="py-6 px-5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl relative animate-reveal-overlay text-gray-800 dark:text-gray-100 w-full">
              <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-blue-500 to-purple-500 rounded-l-xl"></div>
              <div className="text-sm font-bold text-gray-500 mb-5 text-center uppercase tracking-wider">Single Cast — Six Coins</div>
              <div className="flex gap-3 justify-center flex-wrap mb-5">
                {tr.revealedCoins.map(ci => <Coin key={ci} isHeads={tr.coins[ci]} isSpecial={ci === tr.specialSlot} showLineNum lineNum={ci + 1} />)}
              </div>
              {tr.lineRevealed && (
                <>
                  <div className="text-center text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed animate-reveal-overlay">
                    The special coin (position&nbsp;{tr.specialSlot + 1}) shows <strong className="text-gray-900 dark:text-gray-100">{tr.coins[tr.specialSlot] ? 'yang' : 'yin'}</strong> → this line is moving and will transform to <strong className="text-gray-900 dark:text-gray-100">{tr.coins[tr.specialSlot] ? 'yin' : 'yang'}</strong>.
                  </div>
                  <div className="text-center text-sm font-medium text-gray-500 animate-reveal-overlay">
                    Moving line: <span className="text-purple-500 font-bold">Line {tr.specialSlot + 1}</span>
                    <span className="text-xs text-gray-400 ml-1">(counting from bottom)</span>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {finalResult && (
          <div className="w-full flex justify-center animate-reveal-overlay relative z-10 mt-6 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col items-center">
              <div ref={oracleRef} className="text-sm font-bold tracking-widest text-blue-500 uppercase text-center mb-8 scroll-mt-28">The Oracle Speaks</div>
              <div className="flex flex-row gap-8 md:gap-16 flex-wrap items-center justify-center pointer-events-auto">

                <div className="flex flex-col items-center gap-4 w-[160px] sm:w-[210px]">
                  <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Primary Hexagram</div>
                  <HexagramCard hexIndex={finalResult[0]} selectedHex={selectedHex} onClick={handleSelectHex} />
                </div>

                {finalResult[2] !== 0 && (
                  <>
                    <div className="text-4xl text-gray-300 dark:text-gray-600 animate-pulse my-4 md:my-0 flex items-center justify-center">➔</div>
                    <div className="flex flex-col items-center gap-4 w-[160px] sm:w-[210px]">
                      <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Transformed Hexagram</div>
                      <HexagramCard hexIndex={finalResult[1]} selectedHex={selectedHex} onClick={handleSelectHex} />
                    </div>
                  </>
                )}
              </div>

              <div className="mt-10 text-center text-base font-medium text-gray-600 dark:text-gray-400 max-w-lg bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl border border-gray-100 dark:border-gray-800">
                {finalResult[2] !== 0 ? (
                  <p>
                    <strong className="text-gray-900 dark:text-gray-100">{countBits(finalResult[2])} moving line{countBits(finalResult[2]) > 1 ? 's' : ''}</strong> — the situation is in flux. Contemplate the transition.
                  </p>
                ) : (
                  <p>No moving lines — the situation is stable. Contemplate the imagery with stillness.</p>
                )}
              </div>

              <div className="mt-8 w-full max-w-3xl text-left bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden animate-reveal-overlay overflow-x-hidden">
                <HexagramTextPanel 
                  hexIndex={finalResult[0]} 
                  animated={true} 
                  movingLinesMask={finalResult[2]} 
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <div ref={bottomRef} className="h-8 shrink-0" />
    </div>
  );
};

export default HomePanel;
