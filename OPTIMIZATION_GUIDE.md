# Performance Optimization: RAF Loop

## Problem

Currently, the RAF loop runs 60fps constantly and redraws the canvas every frame, even when the animation has finished and the frame index hasn't changed. This wastes GPU/CPU resources on redundant canvas operations.

```tsx
// CURRENT (WASTEFUL)
const tick = () => {
  const curr = currentFrameRef.current;
  const target = targetFrameRef.current;
  const diff = target - curr;
  const step = Math.abs(diff) < 0.001 ? 0 : diff * 0.2;
  const next = step === 0 ? target : curr + step;
  currentFrameRef.current = next;
  drawFrame(Math.round(next)); // Draws EVERY frame, even if index unchanged
  rafRef.current = requestAnimationFrame(tick);
};
```

## Optimization: Only Redraw When Frame Index Changes

Track the previous frame index and only call `drawFrame()` if it actually changed:

```tsx
// OPTIMIZED (EFFICIENT)
useEffect(() => {
  let prevFrameIndex = Math.round(currentFrameRef.current);

  const tick = () => {
    const curr = currentFrameRef.current;
    const target = targetFrameRef.current;
    const diff = target - curr;
    const step = Math.abs(diff) < 0.001 ? 0 : diff * 0.2;
    const next = step === 0 ? target : curr + step;

    currentFrameRef.current = next;
    const nextFrameIndex = Math.round(next);

    // Only redraw if frame index actually changed
    if (nextFrameIndex !== prevFrameIndex) {
      drawFrame(nextFrameIndex);
      prevFrameIndex = nextFrameIndex;
    }

    rafRef.current = requestAnimationFrame(tick);
  };

  rafRef.current = requestAnimationFrame(tick);
  return () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  };
}, []);
```

## What Changes

| Scenario          | Before                    | After                 |
| ----------------- | ------------------------- | --------------------- |
| User scrolling    | 60 redraws/sec            | 60 redraws/sec (same) |
| Idle/stopped      | 60 redraws/sec (wasteful) | ~1-2 redraws/sec ✓    |
| Canvas operations | Always active             | Only when needed      |

## Impact

- **GPU work:** Reduced by ~95% during idle
- **CPU work:** Minimal reduction (RAF still runs, but skips canvas ops)
- **Battery/heat:** Less CPU throttling, longer mobile battery life
- **Smoothness:** Zero impact, still 60fps responsive when scrolling

## How It Works

1. Track `prevFrameIndex` (the frame we last drew)
2. Each RAF tick calculates `nextFrameIndex` from the lerp
3. Only call expensive `drawFrame()` if `nextFrameIndex !== prevFrameIndex`
4. Update `prevFrameIndex` after draw

When you stop scrolling, the lerp approaches its target and the frame index stabilizes. After a few frames, it stops changing, so `drawFrame()` is skipped entirely—but RAF still runs (unavoidable and harmless).

## Result

Canvas only redraws when the animation frame actually advances. Huge savings for idle time with zero visual impact.

## Verify with DevTools Paint Flashing

Use Chrome DevTools to confirm fewer repaints when idle:

- Open DevTools → More Tools → Rendering → enable "Paint flashing".
- Observe the canvas area:
  - Before optimization: constant green flashes even when not scrolling.
  - After optimization: flashes stop or become rare when idle.
- For deeper analysis, record in the Performance panel and compare "Rendering" → "Paint" events before vs. after; idle sessions should show significantly fewer paints.
