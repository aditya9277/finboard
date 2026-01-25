"use client";

import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useDashboardStore } from "@/store/dashboardStore";
import type { WidgetConfig, FieldConfig, WidgetType } from "@/types";

interface EditWidgetModalProps {
  widget: WidgetConfig | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditWidgetModal({
  widget,
  isOpen,
  onClose,
}: EditWidgetModalProps) {
  const { updateWidget } = useDashboardStore();

  const [name, setName] = useState("");
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [widgetType, setWidgetType] = useState<WidgetType>("card");
  const [fields, setFields] = useState<FieldConfig[]>([]);

  useEffect(() => {
    if (widget) {
      setName(widget.name);
      setRefreshInterval(widget.refreshInterval);
      setWidgetType(widget.type);
      setFields(widget.fields);
    }
  }, [widget]);

  const handleSave = () => {
    if (!widget) return;

    updateWidget(widget.id, {
      name,
      refreshInterval,
      type: widgetType,
      fields,
    });

    onClose();
  };

  const handleUpdateFieldLabel = (index: number, label: string) => {
    const updated = [...fields];
    updated[index] = { ...updated[index], label };
    setFields(updated);
  };

  const handleUpdateFieldFormat = (
    index: number,
    format: FieldConfig["format"],
  ) => {
    const updated = [...fields];
    updated[index] = { ...updated[index], format };
    setFields(updated);
  };

  if (!isOpen || !widget) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h2 className="text-xl font-semibold text-white">Edit Widget</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-800 rounded-lg transition-colors">
            <XMarkIcon className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Widget Name */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Widget Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Refresh Interval */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Refresh Interval (seconds)
            </label>
            <input
              type="number"
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
              min={5}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Widget Type */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Display Type
            </label>
            <div className="flex gap-2">
              {(["card", "table", "chart"] as WidgetType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setWidgetType(type)}
                  className={`px-4 py-2 rounded-lg text-sm capitalize transition-colors ${
                    widgetType === type
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}>
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* API URL (read-only) */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              API URL
            </label>
            <div className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-400 text-sm truncate">
              {widget.apiUrl}
            </div>
          </div>

          {/* Fields Configuration */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Fields
            </label>
            <div className="space-y-2">
              {fields.map((field, index) => (
                <div
                  key={field.path}
                  className="flex items-center gap-2 p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
                  <div className="flex-1">
                    <div className="text-xs text-slate-500 font-mono mb-1">
                      {field.path}
                    </div>
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) =>
                        handleUpdateFieldLabel(index, e.target.value)
                      }
                      className="w-full bg-transparent text-white text-sm focus:outline-none"
                    />
                  </div>
                  <select
                    value={field.format || "text"}
                    onChange={(e) =>
                      handleUpdateFieldFormat(
                        index,
                        e.target.value as FieldConfig["format"],
                      )
                    }
                    className="px-2 py-1 bg-slate-700 border border-slate-600 rounded text-sm text-white">
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="currency">Currency</option>
                    <option value="percentage">Percentage</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-400 hover:text-white transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
