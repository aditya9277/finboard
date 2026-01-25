"use client";

import { useDashboardStore } from "@/store/dashboardStore";
import {
  ChartBarIcon,
  TableCellsIcon,
  Squares2X2Icon,
  ClockIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";

export default function QuickStats() {
  const { dashboard, theme } = useDashboardStore();
  const isDark = theme === "dark";

  const stats = {
    total: dashboard.widgets.length,
    cards: dashboard.widgets.filter((w) => w.type === "card").length,
    tables: dashboard.widgets.filter((w) => w.type === "table").length,
    charts: dashboard.widgets.filter((w) => w.type === "chart").length,
    avgRefresh:
      dashboard.widgets.length > 0
        ? Math.round(
            dashboard.widgets.reduce((acc, w) => acc + w.refreshInterval, 0) /
              dashboard.widgets.length,
          )
        : 0,
  };

  if (dashboard.widgets.length === 0) return null;

  return (
    <div
      className={`mb-6 p-4 rounded-xl border ${
        isDark
          ? "bg-slate-900/50 border-slate-800"
          : "bg-white border-slate-200 shadow-sm"
      }`}>
      <div className="flex items-center justify-between mb-3">
        <h3
          className={`text-sm font-medium ${isDark ? "text-slate-400" : "text-slate-600"}`}>
          Dashboard Stats
        </h3>
        <div
          className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>
          Last updated: {format(new Date(dashboard.updatedAt), "MMM d, HH:mm")}
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        <StatCard
          icon={<Squares2X2Icon className="w-5 h-5" />}
          label="Total Widgets"
          value={stats.total}
          color="emerald"
          isDark={isDark}
        />
        <StatCard
          icon={<TableCellsIcon className="w-5 h-5" />}
          label="Card Widgets"
          value={stats.cards}
          color="blue"
          isDark={isDark}
        />
        <StatCard
          icon={<TableCellsIcon className="w-5 h-5" />}
          label="Table Widgets"
          value={stats.tables}
          color="purple"
          isDark={isDark}
        />
        <StatCard
          icon={<ChartBarIcon className="w-5 h-5" />}
          label="Chart Widgets"
          value={stats.charts}
          color="amber"
          isDark={isDark}
        />
        <StatCard
          icon={<BoltIcon className="w-5 h-5" />}
          label="Avg Refresh"
          value={`${stats.avgRefresh}s`}
          color="rose"
          isDark={isDark}
        />
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
  isDark,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
  isDark: boolean;
}) {
  const colorClasses: Record<string, string> = {
    emerald: isDark
      ? "text-emerald-500 bg-emerald-500/10"
      : "text-emerald-600 bg-emerald-50",
    blue: isDark ? "text-blue-500 bg-blue-500/10" : "text-blue-600 bg-blue-50",
    purple: isDark
      ? "text-purple-500 bg-purple-500/10"
      : "text-purple-600 bg-purple-50",
    amber: isDark
      ? "text-amber-500 bg-amber-500/10"
      : "text-amber-600 bg-amber-50",
    rose: isDark ? "text-rose-500 bg-rose-500/10" : "text-rose-600 bg-rose-50",
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${colorClasses[color]}`}>{icon}</div>
      <div>
        <div
          className={`text-lg font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
          {value}
        </div>
        <div
          className={`text-xs ${isDark ? "text-slate-500" : "text-slate-500"}`}>
          {label}
        </div>
      </div>
    </div>
  );
}
