"use client";

import { PlusIcon } from "@heroicons/react/24/outline";
import { ChartBarIcon } from "@heroicons/react/24/solid";
import { useDashboardStore } from "@/store/dashboardStore";

interface EmptyStateProps {
  onAddWidget: () => void;
}

export default function EmptyState({ onAddWidget }: EmptyStateProps) {
  const theme = useDashboardStore((state) => state.theme);
  const isDark = theme === "dark";

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div
        className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 ${
          isDark ? "bg-slate-800" : "bg-slate-200"
        }`}>
        <ChartBarIcon
          className={`w-10 h-10 ${isDark ? "text-slate-600" : "text-slate-400"}`}
        />
      </div>

      <h2
        className={`text-2xl font-semibold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
        Build Your Finance Dashboard
      </h2>

      <p
        className={`max-w-md mb-8 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
        Create custom widgets by connecting to any finance API. Track stocks,
        crypto, forex, or economic indicators — all in real-time.
      </p>

      <button
        onClick={onAddWidget}
        className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors">
        <PlusIcon className="w-5 h-5" />
        Add Your First Widget
      </button>
    </div>
  );
}
