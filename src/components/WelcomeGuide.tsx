"use client";

import { useState, useEffect } from "react";
import { useDashboardStore } from "@/store/dashboardStore";
import {
  XMarkIcon,
  PlusIcon,
  ArrowsRightLeftIcon,
  Cog6ToothIcon,
  KeyIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

interface WelcomeGuideProps {
  onGetStarted: () => void;
}

export default function WelcomeGuide({ onGetStarted }: WelcomeGuideProps) {
  const { theme, dashboard } = useDashboardStore();
  const isDark = theme === "dark";
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Show guide only for first-time users (no widgets and not dismissed before)
    const hasDismissed = localStorage.getItem("finboard-guide-dismissed");
    if (dashboard.widgets.length === 0 && !hasDismissed) {
      setShow(true);
    }
  }, [dashboard.widgets.length]);

  const handleDismiss = () => {
    setShow(false);
    setDismissed(true);
    localStorage.setItem("finboard-guide-dismissed", "true");
  };

  const handleGetStarted = () => {
    handleDismiss();
    onGetStarted();
  };

  if (!show || dismissed) return null;

  const features = [
    {
      icon: <PlusIcon className="w-5 h-5" />,
      title: "Add Widgets",
      description: "Connect to any REST API and create custom widgets",
    },
    {
      icon: <ArrowsRightLeftIcon className="w-5 h-5" />,
      title: "Drag & Drop",
      description: "Rearrange widgets by dragging them around",
    },
    {
      icon: <Cog6ToothIcon className="w-5 h-5" />,
      title: "Customize",
      description: "Edit fields, formats, and refresh intervals",
    },
    {
      icon: <KeyIcon className="w-5 h-5" />,
      title: "API Keys",
      description: "Securely store your API keys locally",
    },
  ];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        className={`relative max-w-lg w-full mx-4 rounded-2xl overflow-hidden shadow-2xl ${
          isDark ? "bg-gray-900" : "bg-white"
        }`}>
        {/* Header with gradient */}
        <div className="relative h-32 bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/10" />
          <SparklesIcon className="w-16 h-16 text-white/90" />
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
            <XMarkIcon className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <h2
            className={`text-2xl font-bold mb-2 text-center ${
              isDark ? "text-white" : "text-gray-900"
            }`}>
            Welcome to FinBoard! 👋
          </h2>
          <p
            className={`text-center mb-6 ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}>
            Build your personalized finance dashboard with real-time data from
            any API.
          </p>

          {/* Features grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl ${
                  isDark ? "bg-gray-800" : "bg-gray-50"
                }`}>
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                    isDark
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-emerald-100 text-emerald-600"
                  }`}>
                  {feature.icon}
                </div>
                <h3
                  className={`font-medium mb-1 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}>
                  {feature.title}
                </h3>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-500" : "text-gray-500"
                  }`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Keyboard shortcuts hint */}
          <div
            className={`p-3 rounded-lg mb-6 flex items-center gap-3 ${
              isDark ? "bg-gray-800" : "bg-gray-100"
            }`}>
            <span
              className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              💡 Pro tip: Use keyboard shortcuts —
            </span>
            <div className="flex gap-2">
              <kbd
                className={`px-2 py-1 text-xs font-mono rounded ${
                  isDark
                    ? "bg-gray-700 text-gray-300"
                    : "bg-white text-gray-700"
                }`}>
                N
              </kbd>
              <kbd
                className={`px-2 py-1 text-xs font-mono rounded ${
                  isDark
                    ? "bg-gray-700 text-gray-300"
                    : "bg-white text-gray-700"
                }`}>
                T
              </kbd>
              <kbd
                className={`px-2 py-1 text-xs font-mono rounded ${
                  isDark
                    ? "bg-gray-700 text-gray-300"
                    : "bg-white text-gray-700"
                }`}>
                R
              </kbd>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleDismiss}
              className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                isDark
                  ? "text-gray-400 hover:text-white hover:bg-gray-800"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}>
              Skip for now
            </button>
            <button
              onClick={handleGetStarted}
              className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
              <PlusIcon className="w-5 h-5" />
              Create Your First Widget
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
