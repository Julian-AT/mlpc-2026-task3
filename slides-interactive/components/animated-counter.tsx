"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface AnimatedCounterProps {
  target: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  separator?: boolean;
  className?: string;
  delay?: number;
}

export function AnimatedCounter({
  target,
  duration = 1.5,
  suffix = "",
  prefix = "",
  separator = true,
  className = "",
  delay = 0,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!isInView || hasStarted.current) return;
    hasStarted.current = true;

    const timeout = setTimeout(() => {
      const startTime = performance.now();
      const step = (now: number) => {
        const elapsed = (now - startTime) / 1000;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [isInView, target, duration, delay]);

  const formatted = separator
    ? count.toLocaleString()
    : count.toString();

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.3, delay }}
      className={className}
    >
      {prefix}{formatted}{suffix}
    </motion.span>
  );
}
