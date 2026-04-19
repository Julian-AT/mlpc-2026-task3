"use client";

import { useMotionValueEvent, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export function AnimatedMetric({
  value,
  decimals = 2,
  className,
}: {
  value: number;
  decimals?: number;
  className?: string;
}) {
  const spring = useSpring(value, { stiffness: 140, damping: 20, mass: 0.35 });
  const [text, setText] = useState(value.toFixed(decimals));

  useMotionValueEvent(spring, "change", (v) => {
    setText(v.toFixed(decimals));
  });

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <span className={className}>{text}</span>;
}
