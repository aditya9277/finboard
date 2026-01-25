"use client";

import {
  ChartBarIcon,
  TableCellsIcon,
  PresentationChartLineIcon,
  ArrowsPointingOutIcon,
  KeyIcon,
  PaintBrushIcon,
  CloudArrowDownIcon,
  CommandLineIcon,
} from "@heroicons/react/24/outline";

const features = [
  {
    icon: ChartBarIcon,
    title: "Multiple Widget Types",
    description:
      "Choose from cards, charts, and tables to display your data exactly how you want it.",
    color: "emerald",
  },
  {
    icon: ArrowsPointingOutIcon,
    title: "Drag & Drop",
    description:
      "Effortlessly rearrange widgets by dragging them to your preferred position on the grid.",
    color: "blue",
  },
  {
    icon: KeyIcon,
    title: "Secure API Keys",
    description:
      "Store multiple API keys locally with secure browser storage. Your keys never leave your device.",
    color: "purple",
  },
  {
    icon: PaintBrushIcon,
    title: "Theme Customization",
    description:
      "Switch between beautiful light and dark themes. Your preference persists across sessions.",
    color: "amber",
  },
  {
    icon: CloudArrowDownIcon,
    title: "Import & Export",
    description:
      "Export your dashboard configuration as JSON and import it on any device.",
    color: "rose",
  },
  {
    icon: CommandLineIcon,
    title: "Keyboard Shortcuts",
    description:
      "Power users can navigate quickly using intuitive keyboard shortcuts for common actions.",
    color: "cyan",
  },
];

const colorClasses = {
  emerald: {
    bg: "bg-emerald-100",
    icon: "text-emerald-600",
    border: "border-emerald-200",
  },
  blue: {
    bg: "bg-blue-100",
    icon: "text-blue-600",
    border: "border-blue-200",
  },
  purple: {
    bg: "bg-purple-100",
    icon: "text-purple-600",
    border: "border-purple-200",
  },
  amber: {
    bg: "bg-amber-100",
    icon: "text-amber-600",
    border: "border-amber-200",
  },
  rose: {
    bg: "bg-rose-100",
    icon: "text-rose-600",
    border: "border-rose-200",
  },
  cyan: {
    bg: "bg-cyan-100",
    icon: "text-cyan-600",
    border: "border-cyan-200",
  },
};

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium mb-4">
            Features
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
            Everything you need to
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
              {" "}
              track finances
            </span>
          </h2>
          <p className="text-xl text-slate-600">
            A powerful, flexible dashboard that adapts to your unique financial
            tracking needs.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const colors =
              colorClasses[feature.color as keyof typeof colorClasses];
            return (
              <div
                key={index}
                className="group relative p-8 bg-white rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                {/* Icon */}
                <div
                  className={`w-14 h-14 ${colors.bg} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-7 h-7 ${colors.icon}`} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover gradient */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white via-transparent to-slate-50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
