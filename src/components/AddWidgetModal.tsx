"use client";

import { useState, useEffect } from "react";
import {
  XMarkIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  LightBulbIcon,
  InformationCircleIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";
import { testApiConnection } from "@/lib/api";
import { sampleApis } from "@/lib/templates";
import { useDashboardStore } from "@/store/dashboardStore";
import type { WidgetType, FieldConfig, ChartType } from "@/types";

interface AddWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (widget: {
    name: string;
    type: WidgetType;
    apiUrl: string;
    refreshInterval: number;
    fields: FieldConfig[];
    chartType?: ChartType;
    chartDataPath?: string;
    chartXKey?: string;
    chartYKey?: string;
  }) => void;
}

type Step = "config" | "fields";

export default function AddWidgetModal({
  isOpen,
  onClose,
  onAdd,
}: AddWidgetModalProps) {
  const { theme } = useDashboardStore();
  const isDark = theme === "dark";

  const [step, setStep] = useState<Step>("config");
  const [name, setName] = useState("");
  const [apiUrl, setApiUrl] = useState("");
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [widgetType, setWidgetType] = useState<WidgetType>("card");
  const [chartType, setChartType] = useState<ChartType>("line");
  const [showSampleApis, setShowSampleApis] = useState(false);

  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    fields?: Record<string, { path: string; value: unknown; type: string }>;
    error?: string;
  } | null>(null);

  const [selectedFields, setSelectedFields] = useState<FieldConfig[]>([]);
  const [fieldSearch, setFieldSearch] = useState("");
  const [showArraysOnly, setShowArraysOnly] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep("config");
      setName("");
      setApiUrl("");
      setRefreshInterval(30);
      setWidgetType("card");
      setTestResult(null);
      setSelectedFields([]);
      setFieldSearch("");
      setShowSampleApis(false);
    }
  }, [isOpen]);

  const handleSelectSampleApi = (url: string, sampleName: string) => {
    setApiUrl(url);
    if (!name) setName(sampleName);
    setShowSampleApis(false);
  };

  const handleTestApi = async () => {
    if (!apiUrl) return;

    setTesting(true);
    const result = await testApiConnection(apiUrl);
    setTestResult(result);
    setTesting(false);

    if (result.success) {
      setStep("fields");
    }
  };

  const handleAddField = (path: string, value: unknown) => {
    if (selectedFields.some((f) => f.path === path)) return;

    const newField: FieldConfig = {
      path,
      label: path.split(".").pop() || path,
      format: typeof value === "number" ? "number" : "text",
    };
    setSelectedFields([...selectedFields, newField]);
  };

  const handleRemoveField = (path: string) => {
    setSelectedFields(selectedFields.filter((f) => f.path !== path));
  };

  const handleUpdateFieldLabel = (path: string, label: string) => {
    setSelectedFields(
      selectedFields.map((f) => (f.path === path ? { ...f, label } : f)),
    );
  };

  const handleUpdateFieldFormat = (
    path: string,
    format: FieldConfig["format"],
  ) => {
    setSelectedFields(
      selectedFields.map((f) => (f.path === path ? { ...f, format } : f)),
    );
  };

  const handleSubmit = () => {
    if (!name || !apiUrl || selectedFields.length === 0) return;

    onAdd({
      name,
      type: widgetType,
      apiUrl,
      refreshInterval,
      fields: selectedFields,
      chartType: widgetType === "chart" ? chartType : undefined,
    });

    onClose();
  };

  const filteredFields = testResult?.fields
    ? Object.entries(testResult.fields).filter(([path, info]) => {
        const matchesSearch = path
          .toLowerCase()
          .includes(fieldSearch.toLowerCase());
        const matchesArrayFilter = !showArraysOnly || info.type === "array";
        return matchesSearch && matchesArrayFilter;
      })
    : [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        className={`rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border ${
          isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
        }`}>
        {/* Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b ${
            isDark ? "border-slate-800" : "border-slate-200"
          }`}>
          <h2
            className={`text-xl font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
            Add New Widget
          </h2>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors ${
              isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"
            }`}>
            <XMarkIcon
              className={`w-6 h-6 ${isDark ? "text-slate-400" : "text-slate-500"}`}
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Widget Name */}
          <div className="mb-4">
            <label
              className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              Widget Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Bitcoin Price Tracker"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-emerald-500 ${
                isDark
                  ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500"
                  : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400"
              }`}
            />
          </div>

          {/* API URL */}
          <div className="mb-4">
            <label
              className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              API URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="e.g., https://api.coinbase.com/v2/exchange-rates?currency=BTC"
                className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:border-emerald-500 ${
                  isDark
                    ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500"
                    : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400"
                }`}
              />
              <button
                onClick={() => setShowSampleApis(!showSampleApis)}
                className={`px-3 py-3 border rounded-lg transition-colors ${
                  isDark
                    ? "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300"
                    : "bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-600"
                }`}
                title="Sample APIs">
                <LightBulbIcon className="w-5 h-5" />
              </button>
              <button
                onClick={handleTestApi}
                disabled={!apiUrl || testing}
                className={`px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  isDark
                    ? "disabled:bg-slate-700 disabled:text-slate-500"
                    : "disabled:bg-slate-300 disabled:text-slate-500"
                }`}>
                {testing ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "↻"
                )}
                Test
              </button>
            </div>

            {/* Sample APIs Dropdown */}
            {showSampleApis && (
              <div
                className={`mt-2 border rounded-lg overflow-hidden ${
                  isDark
                    ? "bg-slate-800 border-slate-700"
                    : "bg-white border-slate-200 shadow-lg"
                }`}>
                <div
                  className={`px-3 py-2 border-b ${
                    isDark
                      ? "bg-slate-750 border-slate-700"
                      : "bg-slate-50 border-slate-200"
                  }`}>
                  <span
                    className={`text-xs font-medium uppercase tracking-wider ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}>
                    Sample APIs - Click to use
                  </span>
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {sampleApis.map((api, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectSampleApi(api.url, api.name)}
                      className={`w-full px-3 py-2 text-left border-b last:border-0 transition-colors ${
                        isDark
                          ? "hover:bg-slate-700 border-slate-700"
                          : "hover:bg-slate-50 border-slate-100"
                      }`}>
                      <div
                        className={`font-medium text-sm ${isDark ? "text-white" : "text-slate-900"}`}>
                        {api.name}
                      </div>
                      <div
                        className={`text-xs mt-0.5 truncate ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                        {api.url}
                      </div>
                      <div
                        className={`text-xs mt-0.5 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                        {api.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* API Key Reminder Note */}
            <div
              className={`mt-3 flex items-start gap-2 p-3 border rounded-lg ${
                isDark
                  ? "bg-amber-900/20 border-amber-800/50"
                  : "bg-amber-50 border-amber-200"
              }`}>
              <KeyIcon
                className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isDark ? "text-amber-500" : "text-amber-600"}`}
              />
              <div>
                <p
                  className={`text-sm font-medium ${isDark ? "text-amber-400" : "text-amber-700"}`}>
                  Using an API that requires a key?
                </p>
                <p
                  className={`text-xs mt-1 ${isDark ? "text-amber-500/80" : "text-amber-600/80"}`}>
                  Don&apos;t forget to add your API key in the{" "}
                  <span className="font-semibold">API Key Management</span>{" "}
                  section (click the key icon in the navbar). Your keys are
                  stored securely in your browser.
                </p>
              </div>
            </div>

            {testResult && (
              <div
                className={`mt-2 px-3 py-2 rounded-lg text-sm ${
                  testResult.success
                    ? isDark
                      ? "bg-emerald-900/50 text-emerald-400 border border-emerald-800"
                      : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : isDark
                      ? "bg-red-900/50 text-red-400 border border-red-800"
                      : "bg-red-50 text-red-700 border border-red-200"
                }`}>
                {testResult.success
                  ? `✓ API connection successful! ${Object.keys(testResult.fields || {}).length} top-level fields found.`
                  : `✗ ${testResult.error}`}
              </div>
            )}
          </div>

          {/* Refresh Interval */}
          <div className="mb-4">
            <label
              className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              Refresh Interval (seconds)
            </label>
            <input
              type="number"
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
              min={5}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-emerald-500 ${
                isDark
                  ? "bg-slate-800 border-slate-700 text-white"
                  : "bg-slate-50 border-slate-300 text-slate-900"
              }`}
            />
          </div>

          {/* Field Selection (shown after successful API test) */}
          {step === "fields" && testResult?.success && (
            <>
              <div className="mb-4">
                <label
                  className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  Select Fields to Display
                </label>

                {/* Display Mode */}
                <div className="flex gap-2 mb-3">
                  <label
                    className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    Display Mode
                  </label>
                  <div className="flex gap-2">
                    {(["card", "table", "chart"] as WidgetType[]).map(
                      (type) => (
                        <button
                          key={type}
                          onClick={() => setWidgetType(type)}
                          className={`px-3 py-1 rounded-lg text-sm capitalize transition-colors ${
                            widgetType === type
                              ? "bg-emerald-600 text-white"
                              : isDark
                                ? "bg-slate-800 text-slate-400 hover:bg-slate-700"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}>
                          {type}
                        </button>
                      ),
                    )}
                  </div>
                </div>

                {/* Chart Type (if chart selected) */}
                {widgetType === "chart" && (
                  <div className="flex gap-2 mb-3">
                    <label
                      className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      Chart Type
                    </label>
                    <div className="flex gap-2">
                      {(["line", "area", "candlestick"] as ChartType[]).map(
                        (type) => (
                          <button
                            key={type}
                            onClick={() => setChartType(type)}
                            className={`px-3 py-1 rounded-lg text-sm capitalize transition-colors ${
                              chartType === type
                                ? "bg-emerald-600 text-white"
                                : isDark
                                  ? "bg-slate-800 text-slate-400 hover:bg-slate-700"
                                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}>
                            {type}
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {/* Search Fields */}
                <div className="relative mb-3">
                  <MagnifyingGlassIcon
                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? "text-slate-500" : "text-slate-400"}`}
                  />
                  <input
                    type="text"
                    value={fieldSearch}
                    onChange={(e) => setFieldSearch(e.target.value)}
                    placeholder="Search for fields..."
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-emerald-500 ${
                      isDark
                        ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500"
                        : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400"
                    }`}
                  />
                </div>

                {/* Show arrays only toggle */}
                <label
                  className={`flex items-center gap-2 text-sm mb-3 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  <input
                    type="checkbox"
                    checked={showArraysOnly}
                    onChange={(e) => setShowArraysOnly(e.target.checked)}
                    className={`rounded ${isDark ? "bg-slate-800 border-slate-700" : "bg-slate-100 border-slate-300"}`}
                  />
                  Show arrays only (for table view)
                </label>

                {/* Available Fields */}
                <div
                  className={`border rounded-lg max-h-48 overflow-y-auto ${
                    isDark ? "border-slate-700" : "border-slate-200"
                  }`}>
                  <div
                    className={`text-xs px-3 py-2 border-b ${
                      isDark
                        ? "text-slate-500 border-slate-700 bg-slate-800/50"
                        : "text-slate-500 border-slate-200 bg-slate-50"
                    }`}>
                    Available Fields
                  </div>
                  {filteredFields.map(([path, info]) => (
                    <div
                      key={path}
                      className={`flex items-center justify-between px-3 py-2 border-b last:border-b-0 ${
                        isDark
                          ? "hover:bg-slate-800/50 border-slate-700"
                          : "hover:bg-slate-50 border-slate-100"
                      }`}>
                      <div>
                        <div
                          className={`text-sm font-mono ${isDark ? "text-white" : "text-slate-900"}`}>
                          {path}
                        </div>
                        <div
                          className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                          {info.type} | {String(info.value).substring(0, 30)}
                          {String(info.value).length > 30 ? "..." : ""}
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddField(path, info.value)}
                        disabled={selectedFields.some((f) => f.path === path)}
                        className={`p-1 rounded disabled:opacity-50 ${
                          isDark ? "hover:bg-slate-700" : "hover:bg-slate-200"
                        }`}>
                        <PlusIcon className="w-5 h-5 text-emerald-500" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected Fields */}
              {selectedFields.length > 0 && (
                <div className="mb-4">
                  <label
                    className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                    Selected Fields ({selectedFields.length})
                  </label>
                  <div className="space-y-2">
                    {selectedFields.map((field) => (
                      <div
                        key={field.path}
                        className={`flex items-center gap-2 p-3 border rounded-lg ${
                          isDark
                            ? "bg-slate-800/50 border-slate-700"
                            : "bg-slate-50 border-slate-200"
                        }`}>
                        <div className="flex-1 min-w-0">
                          <div
                            className={`text-xs font-mono truncate ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                            {field.path}
                          </div>
                          <input
                            type="text"
                            value={field.label}
                            onChange={(e) =>
                              handleUpdateFieldLabel(field.path, e.target.value)
                            }
                            className={`w-full bg-transparent text-sm focus:outline-none ${isDark ? "text-white" : "text-slate-900"}`}
                            placeholder="Enter label..."
                          />
                        </div>
                        <select
                          value={field.format || "text"}
                          onChange={(e) =>
                            handleUpdateFieldFormat(
                              field.path,
                              e.target.value as FieldConfig["format"],
                            )
                          }
                          className={`px-2 py-1.5 border rounded text-sm focus:outline-none focus:border-emerald-500 ${
                            isDark
                              ? "bg-slate-700 border-slate-600 text-white"
                              : "bg-white border-slate-300 text-slate-900"
                          }`}>
                          <option value="text">Text</option>
                          <option value="number">Number</option>
                          <option value="currency">Currency (₹)</option>
                          <option value="percentage">Percentage (%)</option>
                        </select>
                        <button
                          onClick={() => handleRemoveField(field.path)}
                          className={`p-1.5 rounded transition-colors ${
                            isDark
                              ? "hover:bg-red-900/50 text-red-400"
                              : "hover:bg-red-100 text-red-500"
                          }`}>
                          <XMarkIcon className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div
          className={`flex items-center justify-end gap-3 px-6 py-4 border-t ${
            isDark
              ? "border-slate-800 bg-slate-900/50"
              : "border-slate-200 bg-slate-50"
          }`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 transition-colors ${
              isDark
                ? "text-slate-400 hover:text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}>
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name || !apiUrl || selectedFields.length === 0}
            className={`px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors ${
              isDark
                ? "disabled:bg-slate-700 disabled:text-slate-500"
                : "disabled:bg-slate-300 disabled:text-slate-500"
            }`}>
            Add Widget
          </button>
        </div>
      </div>
    </div>
  );
}
