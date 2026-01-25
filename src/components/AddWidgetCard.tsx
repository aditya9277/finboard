"use client";

import { PlusIcon } from "@heroicons/react/24/outline";
import { useDashboardStore } from "@/store/dashboardStore";

interface AddWidgetCardProps {
  onClick: () => void;
}

export default function AddWidgetCard({ onClick }: AddWidgetCardProps) {
  const theme = useDashboardStore((state) => state.theme);
  const isDark = theme === "dark";

  return (
    <button
      onClick={onClick}
      className={`h-full min-h-[200px] flex flex-col items-center justify-center bg-transparent border-2 border-dashed rounded-xl transition-colors group ${
        isDark
          ? "border-slate-700 hover:border-emerald-500"
          : "border-slate-300 hover:border-emerald-500"
      }`}>
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors ${
          isDark
            ? "bg-slate-800 group-hover:bg-emerald-600/20"
            : "bg-slate-200 group-hover:bg-emerald-100"
        }`}>
        <PlusIcon
          className={`w-8 h-8 transition-colors ${
            isDark
              ? "text-slate-500 group-hover:text-emerald-500"
              : "text-slate-400 group-hover:text-emerald-600"
          }`}
        />
      </div>
      <span
        className={`font-medium mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>
        Add Widget
      </span>
      <span
        className={`text-sm text-center px-4 ${isDark ? "text-slate-500" : "text-slate-600"}`}>
        Connect to a finance API and create a custom widget
      </span>
    </button>
  );
}
