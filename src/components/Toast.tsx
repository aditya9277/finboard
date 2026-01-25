"use client";

import { useEffect, useState } from "react";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message?: string;
  duration?: number;
}

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
  isDark: boolean;
}

function Toast({ toast, onDismiss, isDark }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Animate in
    requestAnimationFrame(() => setIsVisible(true));

    // Auto dismiss
    const timer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(() => onDismiss(toast.id), 300);
    }, toast.duration || 4000);

    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  const handleDismiss = () => {
    setIsLeaving(true);
    setTimeout(() => onDismiss(toast.id), 300);
  };

  const icons = {
    success: <CheckCircleIcon className="w-5 h-5 text-emerald-500" />,
    error: <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />,
    warning: <ExclamationTriangleIcon className="w-5 h-5 text-amber-500" />,
    info: <InformationCircleIcon className="w-5 h-5 text-blue-500" />,
  };

  const borderColors = {
    success: "border-l-emerald-500",
    error: "border-l-red-500",
    warning: "border-l-amber-500",
    info: "border-l-blue-500",
  };

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg shadow-lg border-l-4 transition-all duration-300 ${
        borderColors[toast.type]
      } ${
        isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
      } ${
        isVisible && !isLeaving
          ? "translate-x-0 opacity-100"
          : "translate-x-full opacity-0"
      }`}
      style={{ minWidth: "320px", maxWidth: "420px" }}>
      <div className="flex-shrink-0 mt-0.5">{icons[toast.type]}</div>
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium ${isDark ? "text-white" : "text-slate-900"}`}>
          {toast.title}
        </p>
        {toast.message && (
          <p
            className={`text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            {toast.message}
          </p>
        )}
      </div>
      <button
        onClick={handleDismiss}
        className={`flex-shrink-0 p-1 rounded transition-colors ${
          isDark ? "hover:bg-slate-700" : "hover:bg-slate-100"
        }`}>
        <XMarkIcon
          className={`w-4 h-4 ${isDark ? "text-slate-500" : "text-slate-400"}`}
        />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
  isDark: boolean;
}

export default function ToastContainer({
  toasts,
  onDismiss,
  isDark,
}: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onDismiss={onDismiss}
          isDark={isDark}
        />
      ))}
    </div>
  );
}
