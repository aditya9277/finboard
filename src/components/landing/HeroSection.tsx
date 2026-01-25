"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

interface HeroSectionProps {
  onGetStarted: () => void;
}

export default function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-emerald-50/30" />

      {/* Floating decorative elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-emerald-100 rounded-full blur-3xl opacity-60 animate-pulse" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-40 animate-pulse delay-1000" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-full">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-emerald-700">
                Real-time Financial Data
              </span>
            </div>

            {/* Main headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 leading-tight">
              Finance at your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
                fingertips.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-slate-600 max-w-lg leading-relaxed">
              Build your personalized finance dashboard with real-time data from
              any API. Track stocks, crypto, forex — all in one place.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onGetStarted}
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5">
                Get started
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-200 transition-all duration-300">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                View on GitHub
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-4">
              <div>
                <div className="text-3xl font-bold text-slate-900">∞</div>
                <div className="text-sm text-slate-500">APIs Supported</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-900">3</div>
                <div className="text-sm text-slate-500">Widget Types</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-900">100%</div>
                <div className="text-sm text-slate-500">Customizable</div>
              </div>
            </div>
          </div>

          {/* Right illustration - Dashboard preview */}
          <div className="relative lg:block">
            <div className="relative">
              {/* Phone mockup with dashboard preview */}
              <div className="relative mx-auto w-80 h-[580px] bg-slate-900 rounded-[3rem] p-3 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-slate-900 rounded-b-xl" />
                <div className="w-full h-full bg-slate-50 rounded-[2.5rem] overflow-hidden">
                  {/* Mini dashboard preview */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-20 h-3 bg-slate-200 rounded" />
                      <div className="w-6 h-6 bg-emerald-100 rounded-full" />
                    </div>

                    {/* Mini widget cards */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                        <div className="w-8 h-8 bg-emerald-100 rounded-lg mb-2" />
                        <div className="w-16 h-2 bg-slate-200 rounded mb-1" />
                        <div className="w-20 h-4 bg-emerald-500 rounded" />
                      </div>
                      <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg mb-2" />
                        <div className="w-16 h-2 bg-slate-200 rounded mb-1" />
                        <div className="w-20 h-4 bg-blue-500 rounded" />
                      </div>
                    </div>

                    {/* Mini chart */}
                    <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                      <div className="w-24 h-2 bg-slate-200 rounded mb-3" />
                      <div className="h-24 flex items-end gap-1">
                        {[40, 65, 45, 80, 55, 75, 60, 90, 70, 85].map(
                          (h, i) => (
                            <div
                              key={i}
                              className="flex-1 bg-gradient-to-t from-emerald-500 to-emerald-300 rounded-t"
                              style={{ height: `${h}%` }}
                            />
                          ),
                        )}
                      </div>
                    </div>

                    {/* Mini table */}
                    <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                      <div className="space-y-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-slate-100 rounded-full" />
                            <div className="flex-1 h-2 bg-slate-200 rounded" />
                            <div className="w-12 h-2 bg-emerald-200 rounded" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-emerald-500/10 rounded-2xl backdrop-blur-sm border border-emerald-200 flex items-center justify-center animate-float">
                <span className="text-2xl">📈</span>
              </div>
              <div className="absolute bottom-20 -left-8 w-16 h-16 bg-blue-500/10 rounded-xl backdrop-blur-sm border border-blue-200 flex items-center justify-center animate-float delay-500">
                <span className="text-xl">💹</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
