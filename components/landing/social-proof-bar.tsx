// components/landing/social-proof-bar.tsx
"use client";

import { useEffect, useState } from "react";

const schools = [
  { name: "Manchester Academy", logo: "/logos/school1.svg" },
  { name: "London Grammar", logo: "/logos/school2.svg" },
  { name: "Birmingham High", logo: "/logos/school3.svg" },
  { name: "Leeds College", logo: "/logos/school4.svg" },
  { name: "Bristol School", logo: "/logos/school5.svg" },
];

export function SocialProofBar() {
  const [activeUsers, setActiveUsers] = useState(127);

  // Simulate live user count
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers((prev) => prev + Math.floor(Math.random() * 3) - 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="py-8 border-y bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Live Counter */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              <div className="absolute inset-0 w-3 h-3 rounded-full bg-green-500 animate-ping" />
            </div>
            <p className="text-sm">
              <span className="font-bold text-foreground">{activeUsers}</span>
              <span className="text-muted-foreground"> educators planning right now</span>
            </p>
          </div>

          {/* School Logos */}
          <div className="flex items-center gap-8">
            <span className="text-xs text-muted-foreground uppercase tracking-wider hidden sm:block">
              Trusted by schools across the UK
            </span>
            <div className="flex items-center gap-6 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
              {schools.slice(0, 4).map((school) => (
                <div key={school.name} className="h-8 w-auto" title={school.name}>
                  {/* Replace with actual logos or use placeholder text */}
                  <div className="h-full px-3 flex items-center text-xs font-medium text-muted-foreground border rounded">
                    {school.name.split(" ")[0]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}