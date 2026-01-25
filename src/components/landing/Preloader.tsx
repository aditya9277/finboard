"use client";

import { useEffect, useState } from "react";

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "complete" | "exit">(
    "loading",
  );

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Non-linear progress for more natural feel
        const increment = Math.random() * 15 + 5;
        return Math.min(prev + increment, 100);
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      // Brief pause at 100%
      setTimeout(() => setPhase("complete"), 300);
      // Start exit animation
      setTimeout(() => setPhase("exit"), 800);
      // Complete and unmount
      setTimeout(onComplete, 1300);
    }
  }, [progress, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center transition-all duration-500 ${
        phase === "exit" ? "opacity-0 scale-105" : "opacity-100 scale-100"
      }`}>
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Animated Logo */}
        <div className="relative mb-8">
          <div
            className={`w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/30 transform transition-all duration-500 ${
              phase === "complete" ? "scale-110 rotate-6" : "scale-100 rotate-0"
            }`}>
            <span className="text-white font-bold text-4xl">F</span>
          </div>

          {/* Pulsing ring */}
          <div className="absolute inset-0 -m-2 rounded-2xl border-2 border-emerald-400/50 animate-ping" />
          <div className="absolute inset-0 -m-4 rounded-3xl border border-emerald-400/20 animate-pulse" />
        </div>

        {/* Brand name */}
        <h1
          className={`text-3xl font-bold text-white mb-2 transition-all duration-500 ${
            phase === "complete" ? "tracking-wider" : "tracking-normal"
          }`}>
          FinBoard
        </h1>
        <p className="text-slate-400 mb-8">Loading your dashboard...</p>

        {/* Progress bar */}
        <div className="w-64 h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Progress percentage */}
        <div className="mt-4 flex items-center gap-2 text-slate-500 text-sm">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
          <span>{Math.round(progress)}%</span>
        </div>

        {/* Loading messages */}
        <div className="mt-8 h-6">
          <p
            className={`text-slate-500 text-sm transition-opacity duration-300 ${
              progress < 30 ? "opacity-100" : "opacity-0"
            }`}>
            Initializing components...
          </p>
          <p
            className={`text-slate-500 text-sm transition-opacity duration-300 -mt-6 ${
              progress >= 30 && progress < 60 ? "opacity-100" : "opacity-0"
            }`}>
            Setting up dashboard...
          </p>
          <p
            className={`text-slate-500 text-sm transition-opacity duration-300 -mt-6 ${
              progress >= 60 && progress < 90 ? "opacity-100" : "opacity-0"
            }`}>
            Loading widgets...
          </p>
          <p
            className={`text-slate-500 text-sm transition-opacity duration-300 -mt-6 ${
              progress >= 90 ? "opacity-100" : "opacity-0"
            }`}>
            Almost ready!
          </p>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              progress > (i + 1) * 20
                ? "bg-emerald-400 scale-100"
                : "bg-slate-700 scale-75"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
