// Widget and Dashboard type definitions

export type WidgetType = 'card' | 'table' | 'chart';
export type ChartType = 'line' | 'candlestick' | 'area';
export type ThemeMode = 'light' | 'dark';

export interface FieldConfig {
  path: string;        // JSON path to the field (e.g., "data.rates.USD")
  label: string;       // Display label
  format?: 'currency' | 'percentage' | 'number' | 'text';
  prefix?: string;
  suffix?: string;
}

// API Key configuration for services that require authentication
export interface ApiKeyConfig {
  id: string;
  name: string;           // Display name (e.g., "Alpha Vantage")
  key: string;            // The actual API key (stored securely)
  baseUrl?: string;       // Optional base URL for the API
  rateLimit?: number;     // Requests per minute limit
  dailyLimit?: number;    // Requests per day limit
  usageCount?: number;    // Current usage count
  lastReset?: string;     // Last time the count was reset
}

export interface WidgetConfig {
  id: string;
  name: string;
  type: WidgetType;
  apiUrl: string;
  apiKeyId?: string;      // Reference to stored API key
  refreshInterval: number;  // in seconds
  fields: FieldConfig[];
  chartType?: ChartType;
  chartDataPath?: string;   // Path to array data for charts
  chartXKey?: string;       // X-axis key
  chartYKey?: string;       // Y-axis key
  tableSearchEnabled?: boolean;
  tablePaginationSize?: number;
}

export interface LayoutItem {
  i: string;    // Widget ID
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
}

export interface DashboardConfig {
  id: string;
  name: string;
  widgets: WidgetConfig[];
  layout: LayoutItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse {
  data: unknown;
  error?: string;
  loading: boolean;
  lastUpdated?: Date;
}

export interface CacheEntry {
  data: unknown;
  timestamp: number;
  expiresAt: number;
}

// Template for pre-built dashboards
export interface DashboardTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  config: Omit<DashboardConfig, 'id' | 'createdAt' | 'updatedAt'>;
}
