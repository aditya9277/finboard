"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useDashboardStore } from "@/store/dashboardStore";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import Header from "@/components/Header";
import DashboardGrid from "@/components/DashboardGrid";
import EmptyState from "@/components/EmptyState";
import AddWidgetModal from "@/components/AddWidgetModal";
import EditWidgetModal from "@/components/EditWidgetModal";
import TemplateSelector from "@/components/TemplateSelector";
import AddWidgetCard from "@/components/AddWidgetCard";
import ApiKeyModal from "@/components/ApiKeyModal";
import QuickStats from "@/components/QuickStats";
import FloatingActions from "@/components/FloatingActions";
import ToastContainer, { ToastMessage } from "@/components/Toast";
import { v4 as uuidv4 } from "uuid";
import type { WidgetConfig, WidgetType, FieldConfig, ChartType } from "@/types";

export default function DashboardPage() {
  const { dashboard, addWidget, theme, toggleTheme } = useDashboardStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showApiKeys, setShowApiKeys] = useState(false);
  const [editingWidget, setEditingWidget] = useState<WidgetConfig | null>(null);
  const [mounted, setMounted] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // Toast helper functions
  const addToast = useCallback((toast: Omit<ToastMessage, "id">) => {
    setToasts((prev) => [...prev, { ...toast, id: uuidv4() }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Refresh all widgets
  const handleRefreshAll = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
    addToast({
      type: "success",
      title: "Refreshing all widgets",
      message: `${dashboard.widgets.length} widgets are being updated`,
    });
    // Trigger window event for widget refresh
    window.dispatchEvent(new CustomEvent("refresh-all-widgets"));
  }, [dashboard.widgets.length, addToast]);

  // Keyboard shortcuts for power users
  const shortcuts = useMemo(
    () => [
      {
        key: "n",
        ctrlKey: true,
        callback: () => setShowAddModal(true),
        description: "Add new widget",
      },
      {
        key: "t",
        ctrlKey: true,
        callback: () => setShowTemplates(true),
        description: "Open templates",
      },
      {
        key: "d",
        ctrlKey: true,
        shiftKey: true,
        callback: toggleTheme,
        description: "Toggle theme",
      },
      {
        key: "r",
        ctrlKey: true,
        callback: handleRefreshAll,
        description: "Refresh all widgets",
      },
    ],
    [toggleTheme, handleRefreshAll],
  );

  useKeyboardShortcuts(shortcuts);

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Show template selector on first visit
  useEffect(() => {
    if (mounted && dashboard.widgets.length === 0) {
      setShowTemplates(true);
    }
  }, [mounted, dashboard.widgets.length]);

  // Apply theme to document
  useEffect(() => {
    if (mounted) {
      document.documentElement.classList.toggle("dark", theme === "dark");
      document.documentElement.classList.toggle("light", theme === "light");
    }
  }, [theme, mounted]);

  const handleAddWidget = (widget: {
    name: string;
    type: WidgetType;
    apiUrl: string;
    refreshInterval: number;
    fields: FieldConfig[];
    chartType?: ChartType;
  }) => {
    addWidget(widget);
    setShowAddModal(false);
    addToast({
      type: "success",
      title: "Widget created!",
      message: `"${widget.name}" has been added to your dashboard`,
    });
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  const isDark = theme === "dark";
  const hasWidgets = dashboard.widgets.length > 0;

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        isDark ? "bg-slate-900" : "bg-slate-50"
      }`}>
      <Header
        onAddWidget={() => setShowAddModal(true)}
        onOpenApiKeys={() => setShowApiKeys(true)}
        widgetCount={dashboard.widgets.length}
      />

      <main className="flex-1 max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Quick Stats */}
        {hasWidgets && <QuickStats />}

        {!hasWidgets ? (
          <EmptyState onAddWidget={() => setShowAddModal(true)} />
        ) : (
          <div className="relative">
            <DashboardGrid onEditWidget={setEditingWidget} />

            {/* Floating Add Widget Card */}
            <div className="mt-4 max-w-sm">
              <AddWidgetCard onClick={() => setShowAddModal(true)} />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        className={`py-4 text-center border-t transition-colors ${
          isDark
            ? "border-slate-800 bg-slate-900/80"
            : "border-slate-200 bg-white/80"
        }`}>
        <p
          className={`text-sm ${isDark ? "text-slate-500" : "text-slate-600"}`}>
          Made by Aditya Gupta
        </p>
      </footer>

      {/* Floating Actions */}
      <FloatingActions
        onAddWidget={() => setShowAddModal(true)}
        onRefreshAll={handleRefreshAll}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} isDark={isDark} />

      {/* Modals */}
      <AddWidgetModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddWidget}
      />

      <EditWidgetModal
        widget={editingWidget}
        isOpen={!!editingWidget}
        onClose={() => setEditingWidget(null)}
      />

      <TemplateSelector
        isOpen={showTemplates}
        onClose={() => setShowTemplates(false)}
      />

      <ApiKeyModal isOpen={showApiKeys} onClose={() => setShowApiKeys(false)} />
    </div>
  );
}
