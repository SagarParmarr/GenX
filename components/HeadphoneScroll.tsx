"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  CDN_BASE_URL,
  FRAME_CONFIG,
  ANIMATION_CONFIG,
  PRELOAD_STRATEGY,
  OPACITY_TRANSITIONS,
} from "@/lib/config";

const { COUNT: FRAME_COUNT, DPR_LIMIT, INITIAL_FRAME_COUNT } = FRAME_CONFIG;
const { LERP_FACTOR, LERP_THRESHOLD, SPRING: SPRING_CONFIG } = ANIMATION_CONFIG;


function pad3(n: number): string {
  return String(n).padStart(3, "0");
}

function getWebpSrc(i: number): string {
  return `${CDN_BASE_URL}frame_${pad3(i)}_delay-0.04s.webp`;
}

function calculateContainFit(
  canvasWidth: number,
  canvasHeight: number,
  imageWidth: number,
  imageHeight: number,
  dpr: number
) {
  const cw = canvasWidth / dpr;
  const ch = canvasHeight / dpr;
  const canvasAR = cw / ch;
  const imgAR = imageWidth / imageHeight;

  let dw = cw;
  let dh = ch;

  if (imgAR > canvasAR) {
    dw = cw;
    dh = dw / imgAR;
  } else {
    dh = ch;
    dw = dh * imgAR;
  }

  return {
    width: dw,
    height: dh,
    x: (cw - dw) / 2,
    y: (ch - dh) / 2,
  };
}

function drawImageToCanvas(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  img: HTMLImageElement | undefined,
  dprLimit: number
) {
  ctx.save();
  ctx.fillStyle = "#050505";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();

  if (!img || !img.width || !img.height) return;

  const dpr = Math.min(window.devicePixelRatio || 1, dprLimit);
  const fit = calculateContainFit(canvas.width, canvas.height, img.width, img.height, dpr);

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, fit.x, fit.y, fit.width, fit.height);
}

function loadAllFrames(
  frameLoadTimes: number[],
  imagesRef: React.MutableRefObject<HTMLImageElement[]>,
  setLoaded: (loaded: boolean) => void,
  drawFrame: (index: number) => void,
  cancelled: boolean
) {
  let loadedCount = 0;

  for (let i = 0; i < FRAME_COUNT; i++) {
    const img = new Image();
    img.decoding = "async";
    img.crossOrigin = "anonymous";
    img.src = getWebpSrc(i);
    const startTime = performance.now();

    img.onload = () => {
      frameLoadTimes.push(performance.now() - startTime);
      loadedCount++;
      if (cancelled) return;
      
      imagesRef.current[i] = img;
      
      if (loadedCount === FRAME_COUNT) {
        const avgTime = (
          frameLoadTimes.reduce((a, b) => a + b) / frameLoadTimes.length
        ).toFixed(2);
        console.log(`✅ All ${FRAME_COUNT} frames loaded. Avg time: ${avgTime}ms`);
        setLoaded(true);
        drawFrame(0);
      }
    };

    img.onerror = () => {
      loadedCount++;
      console.warn(`❌ Frame ${i} failed to load from: ${getWebpSrc(i)}`);
    };
  }
}

function loadVisibleFrames(
  imagesRef: React.MutableRefObject<HTMLImageElement[]>,
  setLoaded: (loaded: boolean) => void,
  drawFrame: (index: number) => void
) {
  const initialFrames = Math.min(INITIAL_FRAME_COUNT, FRAME_COUNT);
  let initialLoaded = 0;

  for (let i = 0; i < initialFrames; i++) {
    const img = new Image();
    img.decoding = "async";
    img.crossOrigin = "anonymous";
    img.src = getWebpSrc(i);

    img.onload = () => {
      initialLoaded++;
      imagesRef.current[i] = img;
      
      if (initialLoaded === initialFrames) {
        setLoaded(true);
        drawFrame(0);
        loadRemainingFrames();
      }
    };
  }

  function loadRemainingFrames() {
    for (let i = initialFrames; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.decoding = "async";
      img.src = getWebpSrc(i);

      img.onload = () => {
        imagesRef.current[i] = img;
      };
    }
  }
}

export default function HeadphoneScroll() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const [loaded, setLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  
  const smoothProgress = useSpring(scrollYProgress, SPRING_CONFIG);

  const title0 = useTransform(scrollYProgress, OPACITY_TRANSITIONS.title, [1, 1, 0]);
  const left30 = useTransform(scrollYProgress, OPACITY_TRANSITIONS.left, [0, 1, 0]);
  const right60 = useTransform(scrollYProgress, OPACITY_TRANSITIONS.right, [0, 1, 0]);
  const cta90 = useTransform(scrollYProgress, OPACITY_TRANSITIONS.cta, [0, 1, 1]);

  const drawFrame = (index: number) => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;
    
    const img = imagesRef.current[index];
    drawImageToCanvas(ctx, canvas, img, DPR_LIMIT);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    ctxRef.current = ctx;

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_LIMIT);
      const { innerWidth: vw, innerHeight: vh } = window;
      
      canvas.width = Math.floor(vw * dpr);
      canvas.height = Math.floor(vh * dpr);
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawFrame(Math.round(currentFrameRef.current));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let cancelled = false;
    imagesRef.current = new Array(FRAME_COUNT);

    const probe = new Image();
    probe.crossOrigin = "anonymous";
    probe.src = getWebpSrc(0);
    
    probe.onload = () => handlePreload();
    probe.onerror = () => {
      console.warn("⚠️ Failed to load probe image. Check CDN_BASE_URL configuration.");
      handlePreload();
    };

    function handlePreload() {
      const frameLoadTimes: number[] = [];

      switch (PRELOAD_STRATEGY) {
        case "eager":
          loadAllFrames(frameLoadTimes, imagesRef, setLoaded, drawFrame, cancelled);
          break;
        case "visible":
          loadVisibleFrames(imagesRef, setLoaded, drawFrame);
          break;
        case "none":
          setLoaded(true);
          break;
      }
    }

    return () => {
      cancelled = true;
    };
  }, []);

  useMotionValueEvent(smoothProgress, "change", (v) => {
    const nextTarget = Math.max(
      0,
      Math.min(FRAME_COUNT - 1, Math.round(v * (FRAME_COUNT - 1)))
    );
    targetFrameRef.current = nextTarget;
  });

  useEffect(() => {
    const tick = () => {
      const curr = currentFrameRef.current;
      const target = targetFrameRef.current;
      const diff = target - curr;
      
      const step = Math.abs(diff) < LERP_THRESHOLD ? 0 : diff * LERP_FACTOR;
      const next = step === 0 ? target : curr + step;

      const prevFrame = Math.round(curr);
      const nextFrame = Math.round(next);

      currentFrameRef.current = next;

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

  return (
    <section
      ref={sectionRef}
      className="relative h-[400vh] w-full bg-[#050505]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas ref={canvasRef} className="block h-full w-full" />

        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="loader" />
          </div>
        )}

        <div className="pointer-events-none absolute inset-0">
          <motion.div
            style={{ opacity: title0 }}
            className="absolute inset-0 flex items-center justify-center p-6 text-center"
          >
            <h1 className="h1">GenX. Pure Sound.</h1>
          </motion.div>

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
