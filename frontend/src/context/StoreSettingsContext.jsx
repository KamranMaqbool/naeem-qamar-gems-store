import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { fetchStoreSettings } from '../lib/api';
import { formatPrice as formatCurrency } from '../utils/helpers';

const DEFAULT_SETTINGS = {
  store_name: "Virtuoso's Gems",
  default_currency: 'USD',
  tax_rate_percentage: '0',
  free_shipping_threshold: '0',
};

const StoreSettingsContext = createContext(null);

export function StoreSettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  const refreshSettings = useCallback(async () => {
    try {
      const data = await fetchStoreSettings();
      setSettings((current) => ({ ...current, ...data }));
    } catch {
      // Keep the safe defaults when the public settings endpoint is unavailable.
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    refreshSettings();
    // Pick up administrative changes without requiring a visitor to clear
    // browser data. A refresh is still immediate for a newly opened page.
    const interval = window.setInterval(refreshSettings, 60_000);
    return () => window.clearInterval(interval);
  }, [refreshSettings]);

  const value = useMemo(() => ({
    settings,
    loaded,
    refreshSettings,
    currency: settings.default_currency || 'USD',
    formatPrice: (price, options = {}) => formatCurrency(price, {
      currency: settings.default_currency || 'USD',
      ...options,
    }),
  }), [settings, loaded, refreshSettings]);

  return <StoreSettingsContext.Provider value={value}>{children}</StoreSettingsContext.Provider>;
}

export function useStoreSettings() {
  const context = useContext(StoreSettingsContext);
  if (!context) throw new Error('useStoreSettings must be used within StoreSettingsProvider');
  return context;
}
