"use client";

import { useState, useEffect } from "react";
import { useDashboardStore } from "@/store/dashboardStore";
import { SignalIcon, SignalSlashIcon } from "@heroicons/react/24/solid";

export default function ConnectionStatus() {
  const { theme } = useDashboardStore();
  const isDark = theme === "dark";
  const [isOnline, setIsOnline] = useState(true);
  const [showPulse, setShowPulse] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowPulse(true);
      setTimeout(() => setShowPulse(false), 2000);
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Initial check
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div
      className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
        isOnline
          ? isDark
            ? "bg-emerald-500/10 text-emerald-400"
            : "bg-emerald-50 text-emerald-600"
          : isDark
            ? "bg-red-500/10 text-red-400"
            : "bg-red-50 text-red-600"
      }`}>
      <div className="relative">
        {isOnline ? (
          <SignalIcon className="w-3.5 h-3.5" />
        ) : (
          <SignalSlashIcon className="w-3.5 h-3.5" />
        )}
        {showPulse && (
          <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-75" />
        )}
      </div>
      <span>{isOnline ? "Connected" : "Offline"}</span>
    </div>
  );
}
