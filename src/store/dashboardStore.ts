import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { DashboardConfig, WidgetConfig, LayoutItem, ThemeMode, ApiKeyConfig } from '@/types';

interface DashboardState {
  // Dashboard data
  dashboard: DashboardConfig;
  theme: ThemeMode;
  apiKeys: ApiKeyConfig[];
  
  // Widget actions
  addWidget: (widget: Omit<WidgetConfig, 'id'>) => string;
  updateWidget: (id: string, updates: Partial<WidgetConfig>) => void;
  removeWidget: (id: string) => void;
  duplicateWidget: (id: string) => string | null;
  reorderWidgets: (widgets: WidgetConfig[]) => void;
  
  // Layout actions
  updateLayout: (layout: LayoutItem[]) => void;
  
  // Theme actions
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  
  // API Key actions
  addApiKey: (apiKey: Omit<ApiKeyConfig, 'id'>) => string;
  updateApiKey: (id: string, updates: Partial<ApiKeyConfig>) => void;
  removeApiKey: (id: string) => void;
  getApiKey: (id: string) => ApiKeyConfig | undefined;
  
  // Dashboard actions
  setDashboardName: (name: string) => void;
  resetDashboard: () => void;
  importDashboard: (config: DashboardConfig) => void;
  exportDashboard: () => DashboardConfig;
}

const getDefaultDashboard = (): DashboardConfig => ({
  id: uuidv4(),
  name: 'My Finance Dashboard',
  widgets: [],
  layout: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      dashboard: getDefaultDashboard(),
      theme: 'light',
      apiKeys: [],

      addWidget: (widgetData) => {
        const id = uuidv4();
        const widget: WidgetConfig = { ...widgetData, id };
        
        // Calculate position for new widget
        const currentLayout = get().dashboard.layout;
        const maxY = currentLayout.reduce((max, item) => Math.max(max, item.y + item.h), 0);
        
        const layoutItem: LayoutItem = {
          i: id,
          x: 0,
          y: maxY,
          w: widget.type === 'table' ? 12 : 6,
          h: widget.type === 'chart' ? 4 : 3,
          minW: 3,
          minH: 2,
        };

        set((state) => ({
          dashboard: {
            ...state.dashboard,
            widgets: [...state.dashboard.widgets, widget],
            layout: [...state.dashboard.layout, layoutItem],
            updatedAt: new Date().toISOString(),
          },
        }));

        return id;
      },

      updateWidget: (id, updates) => {
        set((state) => ({
          dashboard: {
            ...state.dashboard,
            widgets: state.dashboard.widgets.map((w) =>
              w.id === id ? { ...w, ...updates } : w
            ),
            updatedAt: new Date().toISOString(),
          },
        }));
      },

      removeWidget: (id) => {
        set((state) => ({
          dashboard: {
            ...state.dashboard,
            widgets: state.dashboard.widgets.filter((w) => w.id !== id),
            layout: state.dashboard.layout.filter((l) => l.i !== id),
            updatedAt: new Date().toISOString(),
          },
        }));
      },

      duplicateWidget: (id) => {
        const widget = get().dashboard.widgets.find((w) => w.id === id);
        if (!widget) return null;
        
        const newId = uuidv4();
        const duplicatedWidget: WidgetConfig = {
          ...widget,
          id: newId,
          name: `${widget.name} (Copy)`,
        };
        
        // Find the original layout item and position the duplicate below it
        const originalLayout = get().dashboard.layout.find((l) => l.i === id);
        const currentLayout = get().dashboard.layout;
        const maxY = currentLayout.reduce((max, item) => Math.max(max, item.y + item.h), 0);
        
        const layoutItem: LayoutItem = {
          i: newId,
          x: originalLayout?.x ?? 0,
          y: maxY,
          w: originalLayout?.w ?? (duplicatedWidget.type === 'table' ? 12 : 6),
          h: originalLayout?.h ?? (duplicatedWidget.type === 'chart' ? 4 : 3),
          minW: 3,
          minH: 2,
        };

        set((state) => ({
          dashboard: {
            ...state.dashboard,
            widgets: [...state.dashboard.widgets, duplicatedWidget],
            layout: [...state.dashboard.layout, layoutItem],
            updatedAt: new Date().toISOString(),
          },
        }));

        return newId;
      },

      reorderWidgets: (widgets) => {
        set((state) => ({
          dashboard: {
            ...state.dashboard,
            widgets,
            updatedAt: new Date().toISOString(),
          },
        }));
      },

      updateLayout: (layout) => {
        set((state) => ({
          dashboard: {
            ...state.dashboard,
            layout,
            updatedAt: new Date().toISOString(),
          },
        }));
      },

      toggleTheme: () => {
        set((state) => ({
          theme: state.theme === 'dark' ? 'light' : 'dark',
        }));
      },

      setTheme: (theme) => set({ theme }),

      // API Key management
      addApiKey: (apiKeyData) => {
        const id = uuidv4();
        const apiKey: ApiKeyConfig = { ...apiKeyData, id };
        set((state) => ({
          apiKeys: [...state.apiKeys, apiKey],
        }));
        return id;
      },

      updateApiKey: (id, updates) => {
        set((state) => ({
          apiKeys: state.apiKeys.map((k) =>
            k.id === id ? { ...k, ...updates } : k
          ),
        }));
      },

      removeApiKey: (id) => {
        set((state) => ({
          apiKeys: state.apiKeys.filter((k) => k.id !== id),
        }));
      },

      getApiKey: (id) => {
        return get().apiKeys.find((k) => k.id === id);
      },

      setDashboardName: (name) => {
        set((state) => ({
          dashboard: {
            ...state.dashboard,
            name,
            updatedAt: new Date().toISOString(),
          },
        }));
      },

      resetDashboard: () => {
        set({ dashboard: getDefaultDashboard() });
      },

      importDashboard: (config) => {
        set({
          dashboard: {
            ...config,
            updatedAt: new Date().toISOString(),
          },
        });
      },

      exportDashboard: () => get().dashboard,
    }),
    {
      name: 'finboard-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
