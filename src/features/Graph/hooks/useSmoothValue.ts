import { useEffect, useRef, useState } from 'react';

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export const useSmoothValue = (target: number, duration = 180) => {
  const [value, setValue] = useState(target);
  const animationFrameRef = useRef<number | null>(null);
  const startValueRef = useRef(target);
  const startTimeRef = useRef(0);

  useEffect(() => {
    startValueRef.current = value;
  }, [value]);

  useEffect(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    startTimeRef.current = Date.now();

    const step = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutCubic(progress);
      const nextValue =
        startValueRef.current + (target - startValueRef.current) * eased;

      setValue(nextValue);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(step);
      }
    };

    animationFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [target, duration]);

  return value;
};


