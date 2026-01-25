"use client";

import { useMemo } from "react";
import {
  ArrowPathIcon,
  Cog6ToothIcon,
  TrashIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import { useWidgetData } from "@/hooks/useWidgetData";
import { getValueByPath } from "@/lib/api";
import type { WidgetConfig } from "@/types";
import { format } from "date-fns";
import { useDashboardStore } from "@/store/dashboardStore";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartWidgetProps {
  widget: WidgetConfig;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ChartWidget({
  widget,
  onEdit,
  onDelete,
}: ChartWidgetProps) {
  const { theme, duplicateWidget } = useDashboardStore();
  const isDark = theme === "dark";
  const { data, loading, error, lastUpdated, refetch } = useWidgetData(widget);

  // Extract chart data from API response
  const chartData = useMemo(() => {
    if (!data) return [];

    // If chartDataPath is specified, use it
    if (widget.chartDataPath) {
      const arrayData = getValueByPath(data, widget.chartDataPath);
      if (Array.isArray(arrayData)) return arrayData;
    }

    // Try to find array data
    if (Array.isArray(data)) return data;

    if (typeof data === "object" && data !== null) {
      const obj = data as Record<string, unknown>;
      // Check common data paths
      if (Array.isArray(obj.data)) return obj.data;
      if (Array.isArray(obj.values)) return obj.values;
      if (Array.isArray(obj.prices)) return obj.prices;

      // For stock APIs, data might be keyed by date
      const entries = Object.entries(obj);
      if (entries.length > 0 && typeof entries[0][1] === "object") {
        // Transform time series data to array format
        return entries
          .slice(0, 30)
          .map(([date, values]) => ({
            date,
            ...(values as object),
          }))
          .reverse();
      }
    }

    return [];
  }, [data, widget.chartDataPath]);

  // Get keys for X and Y axis
  const xKey = widget.chartXKey || "date";
  const yKey =
    widget.chartYKey || widget.fields[0]?.path.split(".").pop() || "value";

  const chartColor = "#10B981"; // Emerald
  const gridColor = isDark ? "#374151" : "#E5E7EB";
  const axisColor = isDark ? "#6B7280" : "#9CA3AF";
  const tooltipBg = isDark ? "#1F2937" : "#FFFFFF";
  const tooltipBorder = isDark ? "#374151" : "#E5E7EB";
  const tooltipColor = isDark ? "#fff" : "#111827";

  const renderChart = () => {
    if (chartData.length === 0) {
      return (
        <div className="flex items-center justify-center h-full text-slate-500">
          No chart data available
        </div>
      );
    }

    const commonProps = {
      data: chartData,
      margin: { top: 10, right: 10, left: 0, bottom: 0 },
    };

    switch (widget.chartType) {
      case "area":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart {...commonProps}>
              <defs>
                <linearGradient
                  id={`gradient-${widget.id}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1">
                  <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis
                dataKey={xKey}
                stroke={axisColor}
                tick={{ fontSize: 10 }}
                tickFormatter={(value) => {
                  if (typeof value === "string" && value.includes("-")) {
                    return value.slice(5);
                  }
                  return value;
                }}
              />
              <YAxis stroke={axisColor} tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: tooltipBg,
                  border: `1px solid ${tooltipBorder}`,
                  borderRadius: "8px",
                  color: tooltipColor,
                }}
              />
              <Area
                type="monotone"
                dataKey={yKey}
                stroke={chartColor}
                fill={`url(#gradient-${widget.id})`}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case "line":
      default:
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis
                dataKey={xKey}
                stroke={axisColor}
                tick={{ fontSize: 10 }}
                tickFormatter={(value) => {
                  if (typeof value === "string" && value.includes("-")) {
                    return value.slice(5);
                  }
                  return value;
                }}
              />
              <YAxis stroke={axisColor} tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: tooltipBg,
                  border: `1px solid ${tooltipBorder}`,
                  borderRadius: "8px",
                  color: tooltipColor,
                }}
              />
              <Line
                type="monotone"
                dataKey={yKey}
                stroke={chartColor}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: chartColor }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div
      className={`h-full flex flex-col rounded-xl overflow-hidden ${
        isDark
          ? "bg-slate-900 border border-slate-800"
          : "bg-white border border-slate-200 shadow-sm"
      }`}>
      {/* Widget Header */}
      <div
        className={`flex items-center justify-between px-4 py-3 border-b ${
          isDark ? "border-slate-800" : "border-slate-200"
        }`}>
        <div className="flex items-center gap-2">
          <span
            className={`font-medium ${isDark ? "text-white" : "text-slate-900"}`}>
            {widget.name}
          </span>
          <span
            className={`text-xs px-2 py-0.5 rounded ${
              isDark ? "text-slate-500 bg-slate-800" : "text-slate-500 bg-slate-100"
            }`}>
            {widget.refreshInterval}s
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={refetch}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"
            }`}
            title="Refresh">
            <ArrowPathIcon
              className={`w-4 h-4 ${isDark ? "text-slate-400" : "text-slate-500"} ${loading ? "animate-spin" : ""}`}
            />
          </button>
          <button
            onClick={onEdit}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"
            }`}
            title="Settings">
            <Cog6ToothIcon
              className={`w-4 h-4 ${isDark ? "text-slate-400" : "text-slate-500"}`}
            />
          </button>
          <button
            onClick={() => duplicateWidget(widget.id)}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"
            }`}
            title="Duplicate Widget">
            <DocumentDuplicateIcon
              className={`w-4 h-4 ${isDark ? "text-slate-400" : "text-slate-500"}`}
            />
          </button>
          <button
            onClick={onDelete}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"
            }`}
            title="Delete">
            <TrashIcon
              className={`w-4 h-4 ${isDark ? "text-slate-400" : "text-slate-500"}`}
            />
          </button>
        </div>
      </div>

      {/* Chart Content */}
      <div className="flex-1 p-4 min-h-0">
        {loading && !data ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-red-400 text-sm mb-2">Failed to load data</div>
            <div className="text-slate-500 text-xs">{error}</div>
            <button
              onClick={refetch}
              className="mt-3 text-emerald-500 text-sm hover:text-emerald-400">
              Try again
            </button>
          </div>
        ) : (
          renderChart()
        )}
      </div>

      {/* Last Updated */}
      {lastUpdated && (
        <div
          className={`px-4 py-2 border-t text-center ${
            isDark ? "border-slate-800" : "border-slate-200"
          }`}>
          <span
            className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>
            Last updated: {format(lastUpdated, "HH:mm:ss")}
          </span>
        </div>
      )}
    </div>
  );
}
