"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

const FRAME_COUNT = 192; // Adjusted to available frames
const DPR_LIMIT = 2; // clamp devicePixelRatio for performance

function pad3(n: number) {
  return String(n).padStart(3, "0");
}

function getWebpSrc(i: number) {
  // Expected naming: frame_000_delay-0.04s.webp placed under /public/sequence
  return `/sequence/frame_${pad3(i)}_delay-0.04s.webp`;
}

export default function HeadphoneScroll() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.2,
  });

  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  // Overlay opacities
  const title0 = useTransform(scrollYProgress, [0.0, 0.05, 0.12], [1, 1, 0]);
  const left30 = useTransform(scrollYProgress, [0.25, 0.32, 0.42], [0, 1, 0]);
  const right60 = useTransform(scrollYProgress, [0.55, 0.62, 0.72], [0, 1, 0]);
  const cta90 = useTransform(scrollYProgress, [0.85, 0.92, 1.0], [0, 1, 1]);

  // Setup canvas context and handle resizing with DPR for crispness
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    ctxRef.current = ctx;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_LIMIT);
      const { innerWidth: vw, innerHeight: vh } = window;
      canvas.width = Math.floor(vw * dpr);
      canvas.height = Math.floor(vh * dpr);
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Redraw current frame on resize
      drawFrame(Math.round(currentFrameRef.current));
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // Preload images
  useEffect(() => {
    let cancelled = false;
    imagesRef.current = new Array(FRAME_COUNT);

    // Probe first webp; if it fails, fallback to jpg pattern
    const probe = new Image();
    probe.src = getWebpSrc(0);
    probe.onload = () => preloadSequence();
    probe.onerror = () => {
      preloadSequence();
    };

    function preloadSequence() {
      let loadedCount = 0;
      for (let i = 0; i < FRAME_COUNT; i++) {
        const img = new Image();
        img.decoding = "async";
        img.src = getWebpSrc(i);
        img.onload = () => {
          loadedCount++;
          if (cancelled) return;
          imagesRef.current[i] = img;
          if (loadedCount === FRAME_COUNT) {
            setLoaded(true);
            // Draw first frame once ready
            drawFrame(0);
          }
        };
        img.onerror = () => {
          // ignore missing frames; keep preloading others
        };
      }
    }

    return () => {
      cancelled = true;
    };
  }, []);

  // Scroll -> target frame mapping
  useMotionValueEvent(smoothProgress, "change", (v) => {
    const nextTarget = Math.max(
      0,
      Math.min(FRAME_COUNT - 1, Math.round(v * (FRAME_COUNT - 1)))
    );
    targetFrameRef.current = nextTarget;
  });

  // RAF lerp for smoothness
  useEffect(() => {
    const tick = () => {
      const curr = currentFrameRef.current;
      const target = targetFrameRef.current;
      const diff = target - curr;
      const step = Math.abs(diff) < 0.001 ? 0 : diff * 0.2;
      const next = step === 0 ? target : curr + step;

      const prevFrame = Math.round(currentFrameRef.current);
      const nextFrame = Math.round(next);

      currentFrameRef.current = next;

      // Only redraw if frame index actually changed
      if (nextFrame !== prevFrame) {
        drawFrame(nextFrame);
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  function drawFrame(index: number) {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;
    const img = imagesRef.current[index];
    // Fill background to ensure seamless blending
    ctx.save();
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    if (!img || !img.width || !img.height) return;

    // Contain-fit drawing
    const cw = canvas.width / Math.min(window.devicePixelRatio || 1, DPR_LIMIT);
    const ch =
      canvas.height / Math.min(window.devicePixelRatio || 1, DPR_LIMIT);
    const canvasAR = cw / ch;
    const imgAR = img.width / img.height;

    let dw = cw;
    let dh = ch;
    if (imgAR > canvasAR) {
      // image is wider -> fit width
      dw = cw;
      dh = dw / imgAR;
    } else {
      // image is taller -> fit height
      dh = ch;
      dw = dh * imgAR;
    }
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, dx, dy, dw, dh);
  }

  return (
    <section
      ref={sectionRef}
      className="relative h-[400vh] w-full bg-[#050505]"
    >
      {/* Sticky canvas */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas ref={canvasRef} className="block h-full w-full" />

        {/* Loading overlay */}
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="loader" />
          </div>
        )}

        {/* Text overlays */}
        <div className="pointer-events-none absolute inset-0">
          {/* 0%: Centered Title */}
          <motion.div
            style={{ opacity: title0 }}
            className="absolute inset-0 flex items-center justify-center p-6 text-center"
          >
            <h1 className="h1">GenX. Pure Sound.</h1>
          </motion.div>

          {/* 30%: Left aligned */}
          <motion.div
            style={{ opacity: left30 }}
            className="absolute inset-y-0 left-0 flex items-center p-6 md:p-12"
          >
            <div className="max-w-md">
              <h2 className="h2">Precision Engineering.</h2>
              <p className="p mt-3">
                Every micron matters. Tuned for silence between notes.
              </p>
            </div>
          </motion.div>

          {/* 60%: Right aligned */}
          <motion.div
            style={{ opacity: right60 }}
            className="absolute inset-y-0 right-0 flex items-center p-6 md:p-12 justify-end text-right"
          >
            <div className="max-w-md">
              <h2 className="h2">Titanium Drivers.</h2>
              <p className="p mt-3">
                Rigid, ultra-light diaphragms reveal hidden detail and depth.
              </p>
            </div>
          </motion.div>

          {/* 90%: Centered CTA */}
          <motion.div
            style={{ opacity: cta90 }}
            className="absolute inset-x-0 bottom-[15vh] flex items-center justify-center p-6"
          >
            <div className="text-center">
              <h2 className="h2">Hear Everything.</h2>
              <p className="p mt-3">From the first breath to the last echo.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
