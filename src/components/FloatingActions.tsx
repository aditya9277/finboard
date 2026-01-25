"use client";

import { useState } from "react";
import { useDashboardStore } from "@/store/dashboardStore";
import {
  PlusIcon,
  ArrowPathIcon,
  MoonIcon,
  SunIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface FloatingActionsProps {
  onAddWidget: () => void;
  onRefreshAll: () => void;
}

export default function FloatingActions({
  onAddWidget,
  onRefreshAll,
}: FloatingActionsProps) {
  const { theme, toggleTheme, dashboard, resetDashboard } = useDashboardStore();
  const isDark = theme === "dark";
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const actions = [
    {
      icon: <PlusIcon className="w-5 h-5" />,
      label: "Add Widget",
      onClick: () => {
        onAddWidget();
        setIsOpen(false);
      },
      color: "bg-emerald-500 hover:bg-emerald-600",
    },
    {
      icon: <ArrowPathIcon className="w-5 h-5" />,
      label: "Refresh All",
      onClick: () => {
        onRefreshAll();
        setIsOpen(false);
      },
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      icon: isDark ? (
        <SunIcon className="w-5 h-5" />
      ) : (
        <MoonIcon className="w-5 h-5" />
      ),
      label: isDark ? "Light Mode" : "Dark Mode",
      onClick: () => {
        toggleTheme();
        setIsOpen(false);
      },
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      icon: <TrashIcon className="w-5 h-5" />,
      label: "Reset Dashboard",
      onClick: () => {
        setShowConfirmReset(true);
      },
      color: "bg-red-500 hover:bg-red-600",
      disabled: dashboard.widgets.length === 0,
    },
  ];

  const handleConfirmReset = () => {
    resetDashboard();
    setShowConfirmReset(false);
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse items-end gap-3">
        {/* Action buttons */}
        {isOpen && (
          <div className="flex flex-col gap-2 mb-2">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                disabled={action.disabled}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-full text-white font-medium shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  action.color
                }`}
                style={{
                  animation: `slideIn 0.2s ease-out ${index * 0.05}s both`,
                }}>
                {action.icon}
                <span className="text-sm whitespace-nowrap">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Main FAB */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
            isOpen
              ? "bg-slate-600 hover:bg-slate-700 rotate-45"
              : "bg-emerald-600 hover:bg-emerald-700"
          }`}>
          {isOpen ? (
            <XMarkIcon className="w-6 h-6 text-white" />
          ) : (
            <PlusIcon className="w-6 h-6 text-white" />
          )}
        </button>
      </div>

      {/* Reset Confirmation Modal */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div
            className={`p-6 rounded-xl shadow-xl max-w-sm w-full mx-4 ${
              isDark ? "bg-slate-800" : "bg-white"
            }`}>
            <h3
              className={`text-lg font-semibold mb-2 ${
                isDark ? "text-white" : "text-slate-900"
              }`}>
              Reset Dashboard?
            </h3>
            <p className={`mb-4 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              This will remove all widgets and reset your dashboard to default.
              This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirmReset(false)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isDark
                    ? "text-slate-400 hover:text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}>
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors">
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
