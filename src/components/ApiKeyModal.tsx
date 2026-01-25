"use client";

import { useState } from "react";
import {
  XMarkIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";
import { useDashboardStore } from "@/store/dashboardStore";

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Pre-configured API providers with their details
const apiProviders = [
  {
    name: "Alpha Vantage",
    baseUrl: "https://www.alphavantage.co/query",
    rateLimit: 5, // Free tier: 5 calls/min
    dailyLimit: 25, // Free tier: 25 calls/day
    signupUrl: "https://www.alphavantage.co/support/#api-key",
    description: "Stocks, forex, crypto, fundamentals (Free: 25/day)",
  },
  {
    name: "Finnhub",
    baseUrl: "https://finnhub.io/api/v1",
    rateLimit: 30, // Free tier: 30 calls/second max
    dailyLimit: 60, // Free tier: 60 calls/min
    signupUrl: "https://finnhub.io/register",
    description: "Real-time stocks, news, fundamentals (Free: 60/min)",
  },
  {
    name: "Twelve Data",
    baseUrl: "https://api.twelvedata.com",
    rateLimit: 8, // Free tier: 8 calls/min
    dailyLimit: 800, // Free tier: 800/day
    signupUrl: "https://twelvedata.com/account/api-keys",
    description: "Stocks, forex, crypto, ETFs (Free: 8/min)",
  },
  {
    name: "CoinGecko Pro",
    baseUrl: "https://pro-api.coingecko.com/api/v3",
    rateLimit: 50,
    dailyLimit: 10000,
    signupUrl: "https://www.coingecko.com/en/api/pricing",
    description: "Cryptocurrency market data (Paid plans)",
  },
  {
    name: "Custom API",
    baseUrl: "",
    rateLimit: 60,
    dailyLimit: 1000,
    signupUrl: "",
    description: "Add your own API configuration",
  },
];

export default function ApiKeyModal({ isOpen, onClose }: ApiKeyModalProps) {
  const { apiKeys, addApiKey, removeApiKey, theme } = useDashboardStore();
  const isDark = theme === "dark";

  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(apiProviders[0]);
  const [apiKey, setApiKey] = useState("");
  const [customName, setCustomName] = useState("");
  const [customBaseUrl, setCustomBaseUrl] = useState("");
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  const handleAddKey = () => {
    if (!apiKey) return;

    const name =
      selectedProvider.name === "Custom API"
        ? customName || "Custom API"
        : selectedProvider.name;
    const baseUrl =
      selectedProvider.name === "Custom API"
        ? customBaseUrl
        : selectedProvider.baseUrl;

    addApiKey({
      name,
      key: apiKey,
      baseUrl,
      rateLimit: selectedProvider.rateLimit,
      dailyLimit: selectedProvider.dailyLimit,
      usageCount: 0,
      lastReset: new Date().toISOString(),
    });

    setApiKey("");
    setCustomName("");
    setCustomBaseUrl("");
    setShowAddForm(false);
  };

  const toggleKeyVisibility = (id: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(id)) {
      newVisible.delete(id);
    } else {
      newVisible.add(id);
    }
    setVisibleKeys(newVisible);
  };

  const maskApiKey = (key: string) => {
    if (key.length <= 8) return "••••••••";
    return key.slice(0, 4) + "••••••••" + key.slice(-4);
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
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-600/20 rounded-lg">
              <KeyIcon className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <h2
                className={`text-xl font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                API Key Management
              </h2>
              <p
                className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Securely store your API keys for financial data access
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"
            }`}>
            <XMarkIcon
              className={`w-5 h-5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* Security Notice */}
          <div
            className={`mb-6 p-4 rounded-lg border ${
              isDark
                ? "bg-amber-900/20 border-amber-800 text-amber-200"
                : "bg-amber-50 border-amber-200 text-amber-800"
            }`}>
            <p className="text-sm">
              <strong>🔒 Security Note:</strong> API keys are stored locally in
              your browser. Never share your API keys or commit them to version
              control.
            </p>
          </div>

          {/* Existing API Keys */}
          {apiKeys.length > 0 && (
            <div className="mb-6">
              <h3
                className={`text-sm font-medium mb-3 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                Stored API Keys
              </h3>
              <div className="space-y-3">
                {apiKeys.map((key) => (
                  <div
                    key={key.id}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      isDark
                        ? "bg-slate-800/50 border-slate-700"
                        : "bg-slate-50 border-slate-200"
                    }`}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-medium ${isDark ? "text-white" : "text-slate-900"}`}>
                          {key.name}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${
                            isDark
                              ? "bg-slate-700 text-slate-400"
                              : "bg-slate-200 text-slate-600"
                          }`}>
                          {key.rateLimit}/min
                        </span>
                      </div>
                      <div
                        className={`text-sm font-mono mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                        {visibleKeys.has(key.id)
                          ? key.key
                          : maskApiKey(key.key)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleKeyVisibility(key.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          isDark ? "hover:bg-slate-700" : "hover:bg-slate-200"
                        }`}
                        title={
                          visibleKeys.has(key.id) ? "Hide key" : "Show key"
                        }>
                        {visibleKeys.has(key.id) ? (
                          <EyeSlashIcon
                            className={`w-4 h-4 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                          />
                        ) : (
                          <EyeIcon
                            className={`w-4 h-4 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                          />
                        )}
                      </button>
                      <button
                        onClick={() => removeApiKey(key.id)}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                        title="Delete key">
                        <TrashIcon className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add New Key Form */}
          {showAddForm ? (
            <div
              className={`p-4 rounded-lg border ${
                isDark
                  ? "bg-slate-800/50 border-slate-700"
                  : "bg-slate-50 border-slate-200"
              }`}>
              <h3
                className={`text-sm font-medium mb-4 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                Add New API Key
              </h3>

              {/* Provider Selection */}
              <div className="mb-4">
                <label
                  className={`block text-sm mb-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Select Provider
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {apiProviders.map((provider) => (
                    <button
                      key={provider.name}
                      onClick={() => setSelectedProvider(provider)}
                      className={`p-3 rounded-lg text-left text-sm transition-colors border ${
                        selectedProvider.name === provider.name
                          ? "border-emerald-500 bg-emerald-500/10"
                          : isDark
                            ? "border-slate-600 hover:border-slate-500"
                            : "border-slate-300 hover:border-slate-400"
                      }`}>
                      <div
                        className={`font-medium ${isDark ? "text-white" : "text-slate-900"}`}>
                        {provider.name}
                      </div>
                      <div
                        className={`text-xs ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                        {provider.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Name (for custom API) */}
              {selectedProvider.name === "Custom API" && (
                <>
                  <div className="mb-4">
                    <label
                      className={`block text-sm mb-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      API Name
                    </label>
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="e.g., My Stock API"
                      className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:border-emerald-500 ${
                        isDark
                          ? "bg-slate-800 border border-slate-700 text-white placeholder-slate-500"
                          : "bg-white border border-slate-300 text-slate-900 placeholder-slate-400"
                      }`}
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      className={`block text-sm mb-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      Base URL
                    </label>
                    <input
                      type="text"
                      value={customBaseUrl}
                      onChange={(e) => setCustomBaseUrl(e.target.value)}
                      placeholder="e.g., https://api.example.com"
                      className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:border-emerald-500 ${
                        isDark
                          ? "bg-slate-800 border border-slate-700 text-white placeholder-slate-500"
                          : "bg-white border border-slate-300 text-slate-900 placeholder-slate-400"
                      }`}
                    />
                  </div>
                </>
              )}

              {/* API Key Input */}
              <div className="mb-4">
                <label
                  className={`block text-sm mb-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API key"
                  className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:border-emerald-500 ${
                    isDark
                      ? "bg-slate-800 border border-slate-700 text-white placeholder-slate-500"
                      : "bg-white border border-slate-300 text-slate-900 placeholder-slate-400"
                  }`}
                />
              </div>

              {/* Get API Key Link */}
              {selectedProvider.signupUrl && (
                <p
                  className={`text-sm mb-4 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Don&apos;t have a key?{" "}
                  <a
                    href={selectedProvider.signupUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-500 hover:text-emerald-400">
                    Get one here →
                  </a>
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={handleAddKey}
                  disabled={!apiKey}
                  className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-600 disabled:text-slate-400 text-white rounded-lg font-medium transition-colors">
                  Save API Key
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isDark
                      ? "bg-slate-700 hover:bg-slate-600 text-white"
                      : "bg-slate-200 hover:bg-slate-300 text-slate-800"
                  }`}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              className={`w-full flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed transition-colors ${
                isDark
                  ? "border-slate-700 hover:border-emerald-500 text-slate-400 hover:text-emerald-500"
                  : "border-slate-300 hover:border-emerald-500 text-slate-500 hover:text-emerald-600"
              }`}>
              <PlusIcon className="w-5 h-5" />
              Add New API Key
            </button>
          )}
        </div>

        {/* Footer */}
        <div
          className={`px-6 py-4 border-t ${
            isDark
              ? "border-slate-800 bg-slate-800/30"
              : "border-slate-200 bg-slate-50"
          }`}>
          <p
            className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>
            💡 Tip: Most free APIs have rate limits. Check your provider&apos;s
            documentation for limits.
          </p>
        </div>
      </div>
    </div>
  );
}
