"use client";

import { useState, useMemo } from "react";
import {
  ArrowPathIcon,
  Cog6ToothIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronUpDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import { useWidgetData } from "@/hooks/useWidgetData";
import { formatValue, getValueByPath } from "@/lib/api";
import type { WidgetConfig } from "@/types";
import { format } from "date-fns";
import { useDashboardStore } from "@/store/dashboardStore";

interface TableWidgetProps {
  widget: WidgetConfig;
  onEdit: () => void;
  onDelete: () => void;
}

export default function TableWidget({
  widget,
  onEdit,
  onDelete,
}: TableWidgetProps) {
  const { theme, duplicateWidget } = useDashboardStore();
  const isDark = theme === "dark";
  const { data, loading, error, lastUpdated, refetch } = useWidgetData(widget);

  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(widget.tablePaginationSize || 10);

  // Extract table data - handles both array responses and object responses
  const tableData = useMemo(() => {
    if (!data) return [];

    // If widget has chartDataPath, use it to find the array
    if (widget.chartDataPath) {
      const arrayData = getValueByPath(data, widget.chartDataPath);
      if (Array.isArray(arrayData)) return arrayData;
    }

    // Try to find an array in the response
    if (Array.isArray(data)) return data;

    // Check if data.data is an array
    if (typeof data === "object" && data !== null) {
      const obj = data as Record<string, unknown>;
      if (Array.isArray(obj.data)) return obj.data;

      // Look for first array property
      for (const value of Object.values(obj)) {
        if (Array.isArray(value)) return value;
      }
    }

    // Convert object to single-row array
    if (typeof data === "object") {
      return [data];
    }

    return [];
  }, [data, widget.chartDataPath]);

  // Filter and sort data
  const processedData = useMemo(() => {
    let result = [...tableData];

    // Apply search filter
    if (search) {
      result = result.filter((row) => {
        return widget.fields.some((field) => {
          const value = getValueByPath(
            row,
            field.path.split(".").pop() || field.path,
          );
          return String(value).toLowerCase().includes(search.toLowerCase());
        });
      });
    }

    // Apply sorting
    if (sortField) {
      result.sort((a, b) => {
        const aVal = getValueByPath(a, sortField);
        const bVal = getValueByPath(b, sortField);

        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
        }

        const aStr = String(aVal || "");
        const bStr = String(bVal || "");
        return sortDirection === "asc"
          ? aStr.localeCompare(bStr)
          : bStr.localeCompare(aStr);
      });
    }

    return result;
  }, [tableData, search, sortField, sortDirection, widget.fields]);

  // Pagination
  const totalPages = Math.ceil(processedData.length / pageSize);
  const paginatedData = processedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handleSort = (fieldPath: string) => {
    const key = fieldPath.split(".").pop() || fieldPath;
    if (sortField === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(key);
      setSortDirection("asc");
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (processedData.length === 0) return;

    const headers = widget.fields.map((f) => f.label).join(",");
    const rows = processedData
      .map((row) =>
        widget.fields
          .map((field) => {
            const key = field.path.split(".").pop() || field.path;
            const value =
              getValueByPath(row, key) ?? getValueByPath(row, field.path);
            return `"${String(value ?? "").replace(/"/g, '""')}"`;
          })
          .join(","),
      )
      .join("\n");

    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${widget.name.replace(/\s+/g, "_")}_${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getSortIcon = (fieldPath: string) => {
    const key = fieldPath.split(".").pop() || fieldPath;
    if (sortField !== key) {
      return <ChevronUpDownIcon className="w-4 h-4 opacity-40" />;
    }
    return sortDirection === "asc" ? (
      <ChevronUpIcon className="w-4 h-4 text-emerald-500" />
    ) : (
      <ChevronDownIcon className="w-4 h-4 text-emerald-500" />
    );
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
          isDark
            ? "border-slate-800 bg-slate-900/50"
            : "border-slate-200 bg-slate-50/50"
        }`}>
        <div className="flex items-center gap-3">
          <div>
            <span
              className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
              {widget.name}
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className={`text-xs ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                {processedData.length} rows
              </span>
              <span
                className={`text-xs ${isDark ? "text-slate-600" : "text-slate-400"}`}>
                •
              </span>
              <span
                className={`text-xs ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                {widget.refreshInterval}s refresh
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleExportCSV}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"
            }`}
            title="Export CSV">
            <ArrowDownTrayIcon
              className={`w-4 h-4 ${isDark ? "text-slate-400" : "text-slate-500"}`}
            />
          </button>
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

      {/* Search and Filter Bar */}
      <div
        className={`px-4 py-3 border-b flex items-center gap-3 ${isDark ? "border-slate-800" : "border-slate-200"}`}>
        <div className="relative flex-1">
          <MagnifyingGlassIcon
            className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
              isDark ? "text-slate-500" : "text-slate-400"
            }`}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search in table..."
            className={`w-full pl-9 pr-16 py-2 rounded-lg text-sm focus:outline-none transition-colors ${
              isDark
                ? "bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
                : "bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
            }`}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs px-2 py-0.5 rounded ${isDark ? "text-slate-400 hover:text-white bg-slate-700" : "text-slate-500 hover:text-slate-700 bg-slate-200"}`}>
              Clear
            </button>
          )}
        </div>
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setCurrentPage(1);
          }}
          className={`px-3 py-2 rounded-lg text-sm focus:outline-none ${
            isDark
              ? "bg-slate-800 border border-slate-700 text-white"
              : "bg-slate-50 border border-slate-200 text-slate-900"
          }`}>
          <option value={5}>5 rows</option>
          <option value={10}>10 rows</option>
          <option value={25}>25 rows</option>
          <option value={50}>50 rows</option>
        </select>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-auto">
        {loading && !data ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-10 h-10 border-3 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto" />
              <p
                className={`mt-3 text-sm ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                Loading data...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${isDark ? "bg-red-900/20" : "bg-red-50"}`}>
              <span className="text-2xl">⚠️</span>
            </div>
            <div
              className={`text-sm font-medium mb-1 ${isDark ? "text-red-400" : "text-red-600"}`}>
              Failed to load data
            </div>
            <div
              className={`text-xs mb-3 max-w-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>
              {error}
            </div>
            <button
              onClick={refetch}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-lg transition-colors">
              Try again
            </button>
          </div>
        ) : paginatedData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <FunnelIcon
              className={`w-10 h-10 mb-2 ${isDark ? "text-slate-700" : "text-slate-300"}`}
            />
            <div
              className={`text-sm ${isDark ? "text-slate-500" : "text-slate-400"}`}>
              {search ? "No matching results" : "No data available"}
            </div>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="mt-2 text-emerald-500 text-sm hover:text-emerald-400">
                Clear search
              </button>
            )}
          </div>
        ) : (
          <table className="w-full">
            <thead
              className={`sticky top-0 z-10 ${isDark ? "bg-slate-800" : "bg-slate-50"}`}>
              <tr>
                {widget.fields.map((field) => (
                  <th
                    key={field.path}
                    onClick={() => handleSort(field.path)}
                    className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors select-none ${
                      isDark
                        ? "text-slate-400 hover:text-white hover:bg-slate-700/50"
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                    }`}>
                    <div className="flex items-center gap-1.5">
                      <span>{field.label}</span>
                      {getSortIcon(field.path)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody
              className={`divide-y ${isDark ? "divide-slate-800" : "divide-slate-100"}`}>
              {paginatedData.map((row, index) => (
                <tr
                  key={index}
                  className={`transition-colors ${
                    isDark ? "hover:bg-slate-800/50" : "hover:bg-slate-50"
                  }`}>
                  {widget.fields.map((field) => {
                    const key = field.path.split(".").pop() || field.path;
                    const value =
                      getValueByPath(row, key) ??
                      getValueByPath(row, field.path);

                    // Determine color for percentage/change values
                    const isPercentage = field.format === "percentage";
                    const numValue =
                      typeof value === "number"
                        ? value
                        : parseFloat(String(value));
                    const isPositive = !isNaN(numValue) && numValue > 0;
                    const isNegative = !isNaN(numValue) && numValue < 0;

                    let valueColor = isDark ? "text-white" : "text-slate-900";
                    if (isPercentage && isPositive) {
                      valueColor = "text-emerald-500 font-medium";
                    } else if (isPercentage && isNegative) {
                      valueColor = "text-red-500 font-medium";
                    }

                    return (
                      <td
                        key={field.path}
                        className={`px-4 py-3 text-sm ${valueColor}`}>
                        {isPercentage && isPositive && "+"}
                        {formatValue(
                          value,
                          field.format,
                          field.prefix,
                          field.suffix,
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer with pagination */}
      <div
        className={`flex items-center justify-between px-4 py-3 border-t text-sm ${
          isDark
            ? "border-slate-800 bg-slate-900/50"
            : "border-slate-200 bg-slate-50/50"
        }`}>
        <span className={isDark ? "text-slate-500" : "text-slate-600"}>
          {processedData.length > 0
            ? `Showing ${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, processedData.length)} of ${processedData.length}`
            : "No items"}
        </span>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span
              className={`text-xs ${isDark ? "text-slate-600" : "text-slate-400"}`}>
              Updated {format(lastUpdated, "HH:mm:ss")}
            </span>
          )}
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              {/* First */}
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className={`w-8 h-8 flex items-center justify-center rounded-lg disabled:opacity-30 transition-colors ${
                  isDark
                    ? "hover:bg-slate-800 text-slate-400"
                    : "hover:bg-slate-200 text-slate-600"
                }`}
                title="First page">
                <ChevronDoubleLeftIcon className="w-4 h-4" />
              </button>
              {/* Prev */}
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`w-8 h-8 flex items-center justify-center rounded-lg disabled:opacity-30 transition-colors ${
                  isDark
                    ? "hover:bg-slate-800 text-slate-400"
                    : "hover:bg-slate-200 text-slate-600"
                }`}
                title="Previous page">
                <ChevronLeftIcon className="w-4 h-4" />
              </button>

              {/* Page Numbers */}
              {(() => {
                const pages: (number | string)[] = [];
                const maxVisible = 5;

                if (totalPages <= maxVisible) {
                  for (let i = 1; i <= totalPages; i++) pages.push(i);
                } else {
                  if (currentPage <= 3) {
                    pages.push(1, 2, 3, 4, "...", totalPages);
                  } else if (currentPage >= totalPages - 2) {
                    pages.push(
                      1,
                      "...",
                      totalPages - 3,
                      totalPages - 2,
                      totalPages - 1,
                      totalPages,
                    );
                  } else {
                    pages.push(
                      1,
                      "...",
                      currentPage - 1,
                      currentPage,
                      currentPage + 1,
                      "...",
                      totalPages,
                    );
                  }
                }

                return pages.map((page, idx) =>
                  page === "..." ? (
                    <span
                      key={`ellipsis-${idx}`}
                      className={`w-8 text-center ${isDark ? "text-slate-600" : "text-slate-400"}`}>
                      …
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page as number)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                        currentPage === page
                          ? "bg-emerald-600 text-white"
                          : isDark
                            ? "hover:bg-slate-800 text-slate-400"
                            : "hover:bg-slate-200 text-slate-600"
                      }`}>
                      {page}
                    </button>
                  ),
                );
              })()}

              {/* Next */}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className={`w-8 h-8 flex items-center justify-center rounded-lg disabled:opacity-30 transition-colors ${
                  isDark
                    ? "hover:bg-slate-800 text-slate-400"
                    : "hover:bg-slate-200 text-slate-600"
                }`}
                title="Next page">
                <ChevronRightIcon className="w-4 h-4" />
              </button>
              {/* Last */}
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className={`w-8 h-8 flex items-center justify-center rounded-lg disabled:opacity-30 transition-colors ${
                  isDark
                    ? "hover:bg-slate-800 text-slate-400"
                    : "hover:bg-slate-200 text-slate-600"
                }`}
                title="Last page">
                <ChevronDoubleRightIcon className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
