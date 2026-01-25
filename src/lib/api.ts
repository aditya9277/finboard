import type { CacheEntry, ApiKeyConfig } from '@/types';

const CACHE_DURATION = 60 * 1000; // 1 minute default cache

// Rate limiting tracking per API key
interface RateLimitEntry {
  count: number;
  resetTime: number;
  dailyCount: number;
  dailyResetTime: number;
}

const rateLimitTracker = new Map<string, RateLimitEntry>();

class ApiCache {
  private cache: Map<string, CacheEntry> = new Map();

  get(key: string): unknown | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  set(key: string, data: unknown, duration: number = CACHE_DURATION): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + duration,
    });
  }

  invalidate(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }
}

export const apiCache = new ApiCache();

// Check and update rate limiting for an API key
export function checkRateLimit(apiKey: ApiKeyConfig): { allowed: boolean; message?: string } {
  const now = Date.now();
  const keyId = apiKey.id;
  
  let entry = rateLimitTracker.get(keyId);
  
  // Initialize or reset if needed
  if (!entry) {
    entry = {
      count: 0,
      resetTime: now + 60000, // 1 minute
      dailyCount: 0,
      dailyResetTime: now + 86400000, // 24 hours
    };
  }
  
  // Reset minute counter if time expired
  if (now > entry.resetTime) {
    entry.count = 0;
    entry.resetTime = now + 60000;
  }
  
  // Reset daily counter if time expired
  if (now > entry.dailyResetTime) {
    entry.dailyCount = 0;
    entry.dailyResetTime = now + 86400000;
  }
  
  // Check minute rate limit
  if (apiKey.rateLimit && entry.count >= apiKey.rateLimit) {
    const waitTime = Math.ceil((entry.resetTime - now) / 1000);
    return { 
      allowed: false, 
      message: `Rate limit reached. Try again in ${waitTime}s` 
    };
  }
  
  // Check daily limit
  if (apiKey.dailyLimit && entry.dailyCount >= apiKey.dailyLimit) {
    return { 
      allowed: false, 
      message: 'Daily API limit reached. Try again tomorrow.' 
    };
  }
  
  // Increment counters
  entry.count++;
  entry.dailyCount++;
  rateLimitTracker.set(keyId, entry);
  
  return { allowed: true };
}

// Build URL with API key
export function buildUrlWithApiKey(url: string, apiKey: ApiKeyConfig): string {
  const urlObj = new URL(url);
  
  // Common API key parameter names based on provider
  const keyParams: Record<string, string> = {
    'alphavantage': 'apikey',
    'finnhub': 'token',
    'twelvedata': 'apikey',
    'coingecko': 'x_cg_pro_api_key',
  };
  
  // Detect provider from URL
  const providerKey = Object.keys(keyParams).find(p => 
    url.toLowerCase().includes(p)
  );
  
  const paramName = providerKey ? keyParams[providerKey] : 'apikey';
  urlObj.searchParams.set(paramName, apiKey.key);
  
  return urlObj.toString();
}

// Extracts a value from nested object using dot notation path
export function getValueByPath(obj: unknown, path: string): unknown {
  const keys = path.split('.');
  let value: unknown = obj;
  
  for (const key of keys) {
    if (value === null || value === undefined) return undefined;
    if (typeof value !== 'object') return undefined;
    value = (value as Record<string, unknown>)[key];
  }
  
  return value;
}

// Flattens a nested object into dot-notation paths
export function flattenObject(
  obj: unknown,
  prefix = '',
  result: Record<string, { path: string; value: unknown; type: string }> = {}
): Record<string, { path: string; value: unknown; type: string }> {
  if (obj === null || obj === undefined) return result;
  
  if (Array.isArray(obj)) {
    // For arrays, just note it's an array and include first item sample
    result[prefix] = {
      path: prefix,
      value: `Array[${obj.length}]`,
      type: 'array',
    };
    if (obj.length > 0 && typeof obj[0] === 'object') {
      flattenObject(obj[0], `${prefix}[0]`, result);
    }
    return result;
  }
  
  if (typeof obj === 'object') {
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      const newPrefix = prefix ? `${prefix}.${key}` : key;
      if (typeof value === 'object' && value !== null) {
        flattenObject(value, newPrefix, result);
      } else {
        result[newPrefix] = {
          path: newPrefix,
          value,
          type: typeof value,
        };
      }
    }
  }
  
  return result;
}

// Formats value based on format type
export function formatValue(
  value: unknown,
  format?: 'currency' | 'percentage' | 'number' | 'text',
  prefix?: string,
  suffix?: string
): string {
  if (value === null || value === undefined) return '-';
  
  let formatted: string;
  
  switch (format) {
    case 'currency':
      formatted = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2,
      }).format(Number(value));
      break;
    case 'percentage':
      formatted = `${Number(value).toFixed(2)}%`;
      break;
    case 'number':
      formatted = new Intl.NumberFormat('en-IN', {
        maximumFractionDigits: 4,
      }).format(Number(value));
      break;
    default:
      formatted = String(value);
  }
  
  return `${prefix || ''}${formatted}${suffix || ''}`;
}

// Fetches data from API with caching and optional API key
export async function fetchApiData(
  url: string,
  useCache: boolean = true,
  apiKey?: ApiKeyConfig
): Promise<{ data: unknown; error?: string }> {
  // Check rate limit if API key is provided
  if (apiKey) {
    const rateLimitCheck = checkRateLimit(apiKey);
    if (!rateLimitCheck.allowed) {
      return { data: null, error: rateLimitCheck.message };
    }
  }

  // Build URL with API key if provided
  const finalUrl = apiKey ? buildUrlWithApiKey(url, apiKey) : url;
  const cacheKey = url; // Use original URL as cache key

  // Check cache first
  if (useCache) {
    const cached = apiCache.get(cacheKey);
    if (cached) {
      return { data: cached };
    }
  }

  try {
    const response = await fetch(finalUrl);
    
    if (!response.ok) {
      if (response.status === 429) {
        return { data: null, error: 'API rate limit exceeded. Please try again later.' };
      }
      if (response.status === 401 || response.status === 403) {
        return { data: null, error: 'Invalid API key or unauthorized access.' };
      }
      return { data: null, error: `API error: ${response.status} ${response.statusText}` };
    }
    
    const data = await response.json();
    
    // Cache the response
    if (useCache) {
      apiCache.set(cacheKey, data);
    }
    
    return { data };
  } catch (error) {
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Failed to fetch data' 
    };
  }
}

// Tests API connection and returns flattened fields
export async function testApiConnection(url: string): Promise<{
  success: boolean;
  fields?: Record<string, { path: string; value: unknown; type: string }>;
  error?: string;
}> {
  const { data, error } = await fetchApiData(url, false);
  
  if (error || !data) {
    return { success: false, error: error || 'No data received' };
  }
  
  const fields = flattenObject(data);
  return { success: true, fields };
}
