"use client";

import { useEffect, useState } from "react";
import AnimatedStatsSection from "./AnimatedStatsSection";

type Stat = {
  label: string;
  value: string;
};

// Fallback stats in case API fails
const FALLBACK_STATS: Stat[] = [
  { label: "Years of Excellence", value: "37+" },
  { label: "Successful Surgeries", value: "140,249+" },
  { label: "Expert Doctors", value: "37+" },
  { label: "Satisfied Patients", value: "1,190,419+" },
];

export default function DynamicStatsSection() {
  const [stats, setStats] = useState<Stat[]>(FALLBACK_STATS);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/site-stats");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setStats(data.map((s: { label: string; value: string }) => ({ label: s.label, value: s.value })));
          }
        }
      } catch {
        // Keep fallback stats on error
      }
    }
    fetchStats();
  }, []);

  return <AnimatedStatsSection stats={stats} />;
}
