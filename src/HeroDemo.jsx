import { useEffect, useRef, useState } from 'react';
import { CalendarCheck, RotateCcw } from 'lucide-react';

// The homepage hero's product shot: one inbound lead, from form to booked meeting,
// played out in a few seconds so a visitor sees what the agent does before reading
// a word about it. Same scenario as the worked example further down the page.
//
// Every step is rendered from the start and only revealed, and the reply is typed
// over an invisible copy of itself, so the card holds its final height throughout --
// the hero never shifts while it plays. The full text is in the DOM for screen
// readers; only the typed overlay is hidden from them.

const REPLY = "Hi Mark — got your note about the flashing on Oakley. I can have someone look at it Thursday morning or Friday after 2. If the leak is active, reply and we'll put you first.";

// ms. Step n becomes visible at STEP_AT[n]; the reply types between steps 2 and 3.
const STEP_AT = [400, 1500];
const TYPE_MS = 16;
const AFTER_TYPING = [900, 2100];

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

export default function HeroDemo() {
  // With reduced motion the card starts, and stays, in its finished state.
  const [still] = useState(prefersReducedMotion);
  const [run, setRun] = useState(0);
  // Starts when the card is actually on screen -- on phones it sits below the fold,
  // and a sequence that finished before anyone scrolled to it would show nothing.
  const ref = useRef(null);
  const [inView, setInView] = useState(() => typeof IntersectionObserver === 'undefined');
  const [step, setStep] = useState(still ? 4 : 0);
  const [typed, setTyped] = useState(still ? REPLY.length : 0);

  const replay = () => {
    setStep(0);
    setTyped(0);
    setRun(r => r + 1);
  };

  useEffect(() => {
    if (still || inView) return undefined;
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); io.disconnect(); }
    }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, [still, inView]);

  useEffect(() => {
    if (still || !inView) return undefined;
    const timers = [];
    let typer;

    timers.push(setTimeout(() => setStep(1), STEP_AT[0]));
    timers.push(setTimeout(() => {
      setStep(2);
      let n = 0;
      typer = setInterval(() => {
        n += 1;
        setTyped(n);
        if (n >= REPLY.length) {
          clearInterval(typer);
          timers.push(setTimeout(() => setStep(3), AFTER_TYPING[0]));
          timers.push(setTimeout(() => setStep(4), AFTER_TYPING[1]));
        }
      }, TYPE_MS);
    }, STEP_AT[1]));

    return () => { timers.forEach(clearTimeout); clearInterval(typer); };
  }, [run, still, inView]);

  const done = step >= 4 && typed >= REPLY.length;
  const shown = (n) => `transition-all duration-500 ease-out ${step >= n ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`;

  return (
    <figure
      ref={ref}
      className="relative rounded-3xl border border-zinc-200 bg-white shadow-[0_1px_2px_rgba(24,24,27,0.04),0_40px_80px_-40px_rgba(24,24,27,0.25)] overflow-hidden text-left"
      aria-label="Example: how the agent handles a new lead, from form to booked meeting"
    >
      <div className="flex items-center justify-between gap-4 px-5 sm:px-6 py-4 border-b border-zinc-200 bg-zinc-50/80">
        <div className="min-w-0">
          <div className="font-semibold tracking-[-0.01em] truncate">Summit Roofing</div>
          <div className="text-xs text-zinc-500">Inbound leads &middot; Tuesday evening</div>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-600/20 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800 flex-shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
          Agent live
        </span>
      </div>

      <ol className="relative px-5 sm:px-6 pt-6 pb-2">
        {/* The rail behind the step markers: list padding + time gutter + gap + half a
            marker. Keep in step with the widths in Step below. */}
        <span className="absolute left-[calc(1.25rem+5px)] sm:left-[calc(1.5rem+4.5rem+1rem+5px)] top-8 bottom-10 w-px bg-zinc-200" aria-hidden="true" />

        <Step time="8:30 PM" className={shown(1)}>
          <div className="font-medium text-zinc-900">New quote request</div>
          <div className="text-xs text-zinc-500 mb-2.5">Website form &middot; Mark R.</div>
          <p className="rounded-xl bg-zinc-50 border border-zinc-200 px-3.5 py-2.5 text-sm text-zinc-700 leading-relaxed">
            Leak around the flashing at the back of the house on Oakley. Can someone take a look this week?
          </p>
        </Step>

        <Step time="8:34 PM" className={shown(2)} accent>
          <div className="flex items-center gap-2">
            <span className="font-medium text-zinc-900">Reply sent</span>
            <span className="rounded-full bg-emerald-50 border border-emerald-600/20 px-2 py-px text-[11px] font-semibold text-emerald-800 tabular-nums">4 min</span>
          </div>
          <div className="text-xs text-zinc-500 mb-2.5">From Sarah at Summit Roofing</div>
          <div className="rounded-xl border border-zinc-200 px-3.5 py-2.5">
            <div className="text-xs text-zinc-500 mb-1.5 truncate"><span className="font-medium text-zinc-700">Re:</span> Quick question about your roof estimate</div>
            <p className="relative text-sm text-zinc-800 leading-relaxed">
              <span className="opacity-0">{REPLY}</span>
              <span className="absolute inset-0" aria-hidden="true">
                {REPLY.slice(0, typed)}
                {step === 2 && typed < REPLY.length && <span className="inline-block w-[2px] h-[1em] -mb-[2px] ml-px bg-emerald-600 motion-safe:animate-pulse" />}
              </span>
            </p>
          </div>
        </Step>

        <Step time="8:52 PM" className={shown(3)}>
          <div className="font-medium text-zinc-900 mb-2">Mark replied</div>
          <p className="inline-block rounded-xl rounded-tl-sm bg-zinc-900 text-white px-3.5 py-2 text-sm leading-relaxed">
            Thursday morning works. Thanks for the quick reply.
          </p>
        </Step>

        <Step time="8:52 PM" className={shown(4)} accent last>
          <div className="flex items-start gap-3 rounded-xl border border-emerald-600/20 bg-emerald-50 px-3.5 py-3">
            <CalendarCheck className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <div className="font-semibold text-emerald-900">Meeting booked</div>
              <div className="text-sm text-emerald-900/80">Thu 9:00 AM &middot; Roof inspection with Mark R.</div>
            </div>
          </div>
        </Step>
      </ol>

      <figcaption className="flex items-center justify-between gap-4 px-5 sm:px-6 py-3.5 border-t border-zinc-200 text-xs text-zinc-500">
        <span>Illustrative example of one lead</span>
        {/* No replay when motion is reduced: there is nothing to replay. */}
        {!still && <button
          type="button"
          onClick={replay}
          className={`inline-flex items-center gap-1.5 font-medium text-zinc-600 hover:text-zinc-900 transition ${done ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          tabIndex={done ? 0 : -1}
          aria-hidden={!done}
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" /> Replay
        </button>}
      </figcaption>
    </figure>
  );
}

const MONO = { fontFamily: 'var(--cag-mono)' };

// One row of the timeline: a fixed-width time gutter, a marker on the rail, content.
function Step({ time, accent = false, last = false, className = '', children }) {
  return (
    <li className={`relative flex gap-3 sm:gap-4 ${last ? 'pb-5' : 'pb-6'} ${className}`}>
      <span className="hidden sm:block w-[4.5rem] flex-shrink-0 pt-px text-xs font-medium text-zinc-400 tabular-nums" style={MONO}>{time}</span>
      <span className={`relative z-10 mt-1 w-[11px] h-[11px] rounded-full flex-shrink-0 ${accent ? 'bg-emerald-600' : 'bg-white border-2 border-zinc-300'}`} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        {/* Phones drop the time gutter for width and show the time above the step. */}
        <div className="sm:hidden text-[11px] font-medium text-zinc-400 tabular-nums mb-1" style={MONO}>{time}</div>
        {children}
      </div>
    </li>
  );
}
