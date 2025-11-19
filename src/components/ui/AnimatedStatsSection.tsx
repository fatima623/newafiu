"use client";

import { useEffect, useRef, useState } from "react";

type Stat = {
  label: string;
  value: string; // e.g. "32+" or "100000+"
};

interface AnimatedStatsSectionProps {
  stats: Stat[];
  /** Total duration of the count-up animation in milliseconds */
  durationMs?: number;
}

const parseNumericValue = (value: string): { target: number; suffix: string } => {
  const match = value.match(/(\d[\d,]*)/);
  const numberPart = match ? match[1].replace(/,/g, "") : "0";
  const target = Number.parseInt(numberPart, 10) || 0;
  const suffix = value.replace(match ? match[1] : "", "");
  return { target, suffix };
};

export default function AnimatedStatsSection({
  stats,
  durationMs = 2000,
}: AnimatedStatsSectionProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState<number[]>(() => stats.map(() => 0));

  // Reset counts if stats length changes
  useEffect(() => {
    setCounts(stats.map(() => 0));
  }, [stats.length]);

  // Observe visibility of the whole statistics section
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting && entry.intersectionRatio > 0.2);
      },
      {
        root: null,
        threshold: [0.2, 0.4, 0.6],
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Animate numbers when the section becomes visible.
  // Restart from 0 every time it re-enters the viewport.
  useEffect(() => {
    const { current: node } = sectionRef;
    if (!node) return;

    if (!isVisible) {
      // Reset when not visible so next entry restarts from 0
      setCounts(stats.map(() => 0));
      return;
    }

    const targets = stats.map((s) => parseNumericValue(s.value).target);
    const start = performance.now();
    let frameId: number;

    const animate = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);

      setCounts(
        targets.map((target) => {
          const current = Math.floor(target * progress);
          return current > target ? target : current;
        })
      );

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [isVisible, stats, durationMs]);

  return (
    <section ref={sectionRef} className="py-16 bg-blue-950 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const { suffix } = parseNumericValue(stat.value);
            const displayed = counts[index] ?? 0;

            return (
              <div key={stat.label ?? index} className="text-center">
                <div className="text-5xl font-bold mb-2">
                  {displayed.toLocaleString()}
                  {suffix}
                </div>
                <div className="text-lg text-white">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
