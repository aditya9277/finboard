"use client";

import {
  ArrowPathIcon,
  Cog6ToothIcon,
  TrashIcon,
  TableCellsIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import { useWidgetData, useExtractedFields } from "@/hooks/useWidgetData";
import { formatValue } from "@/lib/api";
import { useDashboardStore } from "@/store/dashboardStore";
import type { WidgetConfig } from "@/types";
import { format } from "date-fns";

interface CardWidgetProps {
  widget: WidgetConfig;
  onEdit: () => void;
  onDelete: () => void;
}

export default function CardWidget({
  widget,
  onEdit,
  onDelete,
}: CardWidgetProps) {
  const { data, loading, error, lastUpdated, refetch } = useWidgetData(widget);
  const fields = useExtractedFields(data, widget);
  const { theme, duplicateWidget } = useDashboardStore();
  const isDark = theme === "dark";

  return (
    <div
      className={`h-full flex flex-col rounded-xl overflow-hidden border ${
        isDark
          ? "bg-slate-900 border-slate-800"
          : "bg-white border-slate-200 shadow-sm"
      }`}>
      {/* Widget Header */}
      <div
        className={`flex items-center justify-between px-4 py-3 border-b ${
          isDark ? "border-slate-800" : "border-slate-100"
        }`}>
        <div className="flex items-center gap-2">
          <TableCellsIcon
            className={`w-4 h-4 ${isDark ? "text-emerald-500" : "text-emerald-600"}`}
          />
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

      {/* Widget Content */}
      <div className="flex-1 p-4">
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
          <div className="space-y-3">
            {fields.map((field) => (
              <div
                key={field.path}
                className="flex justify-between items-center">
                <span
                  className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  {field.label}
                </span>
                <span
                  className={`font-medium text-right ${isDark ? "text-white" : "text-slate-900"}`}>
                  {formatValue(
                    field.value,
                    field.format,
                    field.prefix,
                    field.suffix,
                  )}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Last Updated */}
      {lastUpdated && (
        <div
          className={`px-4 py-2 border-t text-center ${
            isDark ? "border-slate-800" : "border-slate-100"
          }`}>
          <span className="text-xs text-slate-500">
            Last updated: {format(lastUpdated, "HH:mm:ss")}
          </span>
        </div>
      )}
    </div>
  );
}
