import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchApiData, getValueByPath } from '@/lib/api';
import type { WidgetConfig } from '@/types';

interface UseWidgetDataResult {
  data: unknown;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refetch: () => Promise<void>;
}

export function useWidgetData(widget: WidgetConfig): UseWidgetDataResult {
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await fetchApiData(widget.apiUrl);
    
    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setData(result.data);
    setLastUpdated(new Date());
    setLoading(false);
  }, [widget.apiUrl]);

  // Initial fetch and interval setup
  useEffect(() => {
    fetchData();

    // Set up auto-refresh if interval is configured
    if (widget.refreshInterval > 0) {
      intervalRef.current = setInterval(fetchData, widget.refreshInterval * 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchData, widget.refreshInterval]);

  return { data, loading, error, lastUpdated, refetch: fetchData };
}

// Extracts display values from API data based on field configuration
export function useExtractedFields(data: unknown, widget: WidgetConfig) {
  return widget.fields.map((field) => ({
    ...field,
    value: getValueByPath(data, field.path),
  }));
}
