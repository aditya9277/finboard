"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { dashboardTemplates } from "@/lib/templates";
import { useDashboardStore } from "@/store/dashboardStore";
import { v4 as uuidv4 } from "uuid";

interface TemplateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TemplateSelector({
  isOpen,
  onClose,
}: TemplateSelectorProps) {
  const { importDashboard, theme } = useDashboardStore();
  const isDark = theme === "dark";

  const handleSelectTemplate = (templateId: string) => {
    const template = dashboardTemplates.find((t) => t.id === templateId);
    if (!template) return;

    // Generate new IDs for widgets to avoid conflicts
    const widgetIdMap = new Map<string, string>();
    const widgets = template.config.widgets.map((w) => {
      const newId = uuidv4();
      widgetIdMap.set(w.id, newId);
      return { ...w, id: newId };
    });

    const layout = template.config.layout.map((l) => ({
      ...l,
      i: widgetIdMap.get(l.i) || l.i,
    }));

    importDashboard({
      id: uuidv4(),
      name: template.config.name,
      widgets,
      layout,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        className={`rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border ${
          isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
        }`}>
        {/* Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b ${
            isDark ? "border-slate-800" : "border-slate-200"
          }`}>
          <div>
            <h2
              className={`text-xl font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
              Dashboard Templates
            </h2>
            <p
              className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Start with a pre-built template or create from scratch
            </p>
          </div>
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

        {/* Templates Grid */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
          {dashboardTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => handleSelectTemplate(template.id)}
              className={`p-4 border rounded-xl text-left transition-all group ${
                isDark
                  ? "bg-slate-800/50 border-slate-700 hover:border-emerald-500 hover:bg-slate-800"
                  : "bg-slate-50 border-slate-200 hover:border-emerald-500 hover:bg-slate-100"
              }`}>
              <div
                className={`w-12 h-12 rounded-lg mb-3 flex items-center justify-center group-hover:bg-emerald-600/20 transition-colors ${
                  isDark ? "bg-slate-700" : "bg-slate-200"
                }`}>
                <span className="text-2xl">
                  {template.id === "crypto-tracker" && "₿"}
                  {template.id === "multi-currency" && "💱"}
                  {template.id === "empty" && "➕"}
                </span>
              </div>
              <h3
                className={`font-medium mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>
                {template.name}
              </h3>
              <p
                className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                {template.description}
              </p>
              <div
                className={`mt-2 text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                {template.config.widgets.length} widget
                {template.config.widgets.length !== 1 ? "s" : ""}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
