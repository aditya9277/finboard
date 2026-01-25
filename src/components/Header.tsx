"use client";

import {
  SunIcon,
  MoonIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  PlusIcon,
  KeyIcon,
  CommandLineIcon,
} from "@heroicons/react/24/outline";
import { ChartBarIcon } from "@heroicons/react/24/solid";
import { useDashboardStore } from "@/store/dashboardStore";
import { useRef, useState } from "react";
import ConnectionStatus from "./ConnectionStatus";

interface HeaderProps {
  onAddWidget: () => void;
  onOpenApiKeys: () => void;
  widgetCount: number;
}

export default function Header({
  onAddWidget,
  onOpenApiKeys,
  widgetCount,
}: HeaderProps) {
  const { theme, toggleTheme, exportDashboard, importDashboard, dashboard } =
    useDashboardStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const handleExport = () => {
    const config = exportDashboard();
    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${dashboard.name.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target?.result as string);
        importDashboard(config);
      } catch {
        alert("Invalid configuration file");
      }
    };
    reader.readAsText(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-sm border-b transition-colors ${
        theme === "dark"
          ? "bg-slate-900/95 border-slate-800"
          : "bg-white/95 border-slate-200"
      }`}>
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl shadow-lg shadow-emerald-500/20">
              <ChartBarIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1
                  className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                  FinBoard
                </h1>
                <ConnectionStatus />
              </div>
              <p
                className={`text-xs ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                {widgetCount} active widget{widgetCount !== 1 ? "s" : ""} •
                Real-time data
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-100"
              }`}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
              {theme === "dark" ? (
                <SunIcon className="w-5 h-5 text-slate-400" />
              ) : (
                <MoonIcon className="w-5 h-5 text-slate-600" />
              )}
            </button>

            {/* API Keys */}
            <button
              onClick={onOpenApiKeys}
              className={`p-2 rounded-lg transition-colors ${
                theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-100"
              }`}
              title="Manage API Keys">
              <KeyIcon
                className={`w-5 h-5 ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}
              />
            </button>

            {/* Keyboard Shortcuts */}
            <div className="relative">
              <button
                onClick={() => setShowShortcuts(!showShortcuts)}
                onBlur={() => setTimeout(() => setShowShortcuts(false), 200)}
                className={`p-2 rounded-lg transition-colors ${
                  theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-100"
                }`}
                title="Keyboard Shortcuts">
                <CommandLineIcon
                  className={`w-5 h-5 ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}
                />
              </button>
              {showShortcuts && (
                <div
                  className={`absolute right-0 mt-2 w-56 rounded-lg shadow-xl border z-50 ${
                    theme === "dark"
                      ? "bg-slate-800 border-slate-700"
                      : "bg-white border-slate-200"
                  }`}>
                  <div
                    className={`px-3 py-2 border-b ${
                      theme === "dark" ? "border-slate-700" : "border-slate-100"
                    }`}>
                    <span
                      className={`text-sm font-medium ${
                        theme === "dark" ? "text-white" : "text-slate-900"
                      }`}>
                      Keyboard Shortcuts
                    </span>
                  </div>
                  <div className="p-2 space-y-1">
                    {[
                      { key: "N", action: "Add new widget" },
                      { key: "T", action: "Toggle theme" },
                      { key: "R", action: "Refresh all widgets" },
                      { key: "Esc", action: "Close modals" },
                    ].map((shortcut) => (
                      <div
                        key={shortcut.key}
                        className="flex items-center justify-between px-2 py-1.5">
                        <span
                          className={`text-sm ${
                            theme === "dark"
                              ? "text-slate-400"
                              : "text-slate-600"
                          }`}>
                          {shortcut.action}
                        </span>
                        <kbd
                          className={`px-2 py-0.5 text-xs font-mono rounded ${
                            theme === "dark"
                              ? "bg-slate-700 text-slate-300"
                              : "bg-slate-100 text-slate-700"
                          }`}>
                          {shortcut.key}
                        </kbd>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Import */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImport}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`p-2 rounded-lg transition-colors ${
                theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-100"
              }`}
              title="Import Dashboard">
              <ArrowDownTrayIcon
                className={`w-5 h-5 ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}
              />
            </button>

            {/* Export */}
            <button
              onClick={handleExport}
              className={`p-2 rounded-lg transition-colors ${
                theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-100"
              }`}
              title="Export Dashboard">
              <ArrowUpTrayIcon
                className={`w-5 h-5 ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}
              />
            </button>

            {/* Add Widget Button */}
            <button
              onClick={onAddWidget}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors font-medium shadow-lg shadow-emerald-500/20">
              <PlusIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Add Widget</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
