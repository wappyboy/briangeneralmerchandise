"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
const INTRO_SESSION_KEY = "brians-general-merchandise-intro-seen";

const INTRO_TIMING = {
  startExit: 2600,
  removeOverlay: 3200,
  skipRemoveOverlay: 450,
} as const;

const soundBarHeights = [
  "h-5",
  "h-9",
  "h-14",
  "h-8",
  "h-16",
  "h-10",
  "h-6",
  "h-12",
  "h-7",
  "h-14",
  "h-9",
  "h-5",
];

function markIntroAsSeen() {
  window.sessionStorage.setItem(INTRO_SESSION_KEY, "true");
}

function hasSeenIntro() {
  return window.sessionStorage.getItem(INTRO_SESSION_KEY) === "true";
}

export function WelcomeTransition() {
  const [shouldShowIntro, setShouldShowIntro] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const prefersReducedMotion = useReducedMotion();
  const timersRef = useRef<number[]>([]);

  function clearIntroTimers() {
    timersRef.current.forEach((timerId) => {
      window.clearTimeout(timerId);
    });

    timersRef.current = [];
  }

  function closeIntro(delay = INTRO_TIMING.skipRemoveOverlay) {
    markIntroAsSeen();
    setIsLeaving(true);

    const closeTimer = window.setTimeout(() => {
      setShouldShowIntro(false);
    }, delay);

    timersRef.current.push(closeTimer);
  }

  useEffect(() => {
    if (hasSeenIntro()) {
      return;
    }

    if (prefersReducedMotion) {
      markIntroAsSeen();
      return;
    }


  const showTimer = window.setTimeout(() => {
    setShouldShowIntro(true);
  }, 0);

    const exitTimer = window.setTimeout(() => {
      setIsLeaving(true);
    }, INTRO_TIMING.startExit);

  const removeTimer = window.setTimeout(() => {
    markIntroAsSeen();
    setShouldShowIntro(false);
  }, INTRO_TIMING.removeOverlay);

  timersRef.current.push(showTimer, exitTimer, removeTimer);

    return () => {
      clearIntroTimers();
    };
  }, [prefersReducedMotion]);

  function handleSkipIntro() {
    clearIntroTimers();
    closeIntro();
  }

  return (
    <AnimatePresence mode="wait">
      {shouldShowIntro ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Welcome intro for Brian's General Merchandise"
          className="fixed inset-0 z-[9999] overflow-hidden bg-black text-white"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
        >
          <SpotlightBeams />

          <motion.div
            className="absolute left-1/2 top-1/2 size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{
              scale: [0.6, 1, 0.85],
              opacity: [0, 0.35, 0.12],
            }}
            transition={{ duration: 2.7, ease: "easeInOut" }}
          />

          <button
            type="button"
            onClick={handleSkipIntro}
            className="absolute right-4 top-4 z-20 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-300 backdrop-blur-md transition hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-6 sm:top-6"
            aria-label="Skip welcome intro"
          >
            Skip
            <X className="size-4" aria-hidden="true" />
          </button>

          <div className="relative z-10 flex min-h-screen items-center justify-center px-4 text-center">
            <div className="mx-auto max-w-4xl">
                <motion.div
                className="mx-auto mb-8 flex size-28 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white p-2 shadow-2xl sm:size-36"
                initial={{ opacity: 0, scale: 0.7, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                >
                <Image
                    src="/images/brian-logo.jpg"
                    alt="Brian's General Merchandise logo"
                    width={140}
                    height={140}
                    className="h-full w-full rounded-full object-cover"
                    priority
                />
                </motion.div>

              <SoundWaveBars />

              <motion.p
                className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-neutral-400"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
              >
                Event Rental Services
              </motion.p>

              <motion.h1
                className="text-4xl font-black uppercase tracking-tight text-white sm:text-6xl lg:text-7xl"
                initial={{ opacity: 0, y: 28, filter: "blur(12px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.9, delay: 0.55, ease: "easeOut" }}
              >
                Brian&apos;s General Merchandise
              </motion.h1>

              <motion.p
                className="mt-5 text-sm font-medium uppercase tracking-[0.25em] text-neutral-300 sm:text-base"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.9, ease: "easeOut" }}
              >
                Sounds • Lights • Tables • Chairs
              </motion.p>
            </div>
          </div>

          <ExitReveal isLeaving={isLeaving} />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function SpotlightBeams() {
  return (
    <>
      <motion.div
        className="absolute -left-24 top-[-20%] h-[140%] w-44 origin-top rotate-12 bg-white/10 blur-2xl"
        initial={{ x: "-30vw", opacity: 0 }}
        animate={{
          x: "120vw",
          opacity: [0, 0.6, 0.2, 0],
        }}
        transition={{
          duration: 2.8,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute -right-24 top-[-20%] h-[140%] w-44 origin-top -rotate-12 bg-white/10 blur-2xl"
        initial={{ x: "30vw", opacity: 0 }}
        animate={{
          x: "-120vw",
          opacity: [0, 0.45, 0.2, 0],
        }}
        transition={{
          duration: 2.8,
          ease: "easeInOut",
          delay: 0.15,
        }}
      />
    </>
  );
}

function SoundWaveBars() {
  return (
    <div
      className="mb-8 flex items-center justify-center gap-1.5 sm:gap-2"
      aria-hidden="true"
    >
      {soundBarHeights.map((height, index) => (
        <motion.span
          key={`${height}-${index}`}
          className={`${height} w-1 rounded-full bg-white/70 sm:w-1.5`}
          initial={{ scaleY: 0.25, opacity: 0 }}
          animate={{
            scaleY: [0.25, 1, 0.45, 0.9, 0.3],
            opacity: [0, 1, 0.7, 1, 0.5],
          }}
          transition={{
            duration: 1.1,
            repeat: 2,
            delay: index * 0.04,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

type ExitRevealProps = {
  isLeaving: boolean;
};

function ExitReveal({ isLeaving }: ExitRevealProps) {
  return (
    <>
      <motion.div
        className="absolute inset-y-0 left-0 z-30 bg-white"
        initial={{ width: "0%" }}
        animate={{
          width: isLeaving ? "100%" : "0%",
        }}
        transition={{
          duration: 0.45,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute inset-0 z-40 bg-white"
        initial={{ opacity: 0 }}
        animate={{
          opacity: isLeaving ? [0, 1, 0] : 0,
        }}
        transition={{
          duration: 0.55,
          ease: "easeInOut",
        }}
      />
    </>
  );
}