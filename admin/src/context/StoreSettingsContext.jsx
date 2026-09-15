import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { fetchAdminSettings } from '../lib/api';

const DEFAULT_CURRENCY = 'USD';
const StoreSettingsContext = createContext(null);

function currencyLocale(currency) {
  return currency === 'PKR' ? 'en-PK' : 'en-US';
}

export function AdminStoreSettingsProvider({ children }) {
  const [settings, setSettings] = useState({ default_currency: DEFAULT_CURRENCY, pricing_currency: DEFAULT_CURRENCY });
  const [loaded, setLoaded] = useState(false);

  const refreshStoreSettings = useCallback(async () => {
    try {
      const data = await fetchAdminSettings();
      setSettings((current) => ({ ...current, ...data }));
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    const refreshAfterAuthentication = () => refreshStoreSettings().catch(() => {});
    refreshAfterAuthentication();
    window.addEventListener('admin-authenticated', refreshAfterAuthentication);
    return () => window.removeEventListener('admin-authenticated', refreshAfterAuthentication);
  }, [refreshStoreSettings]);

  // Use the persisted pricing currency while a settings conversion is
  // pending. That avoids rendering USD 170 as PKR 170.
  const currency = settings.pricing_currency || settings.default_currency || DEFAULT_CURRENCY;
  const value = useMemo(() => ({
    settings,
    loaded,
    currency,
    refreshStoreSettings,
    formatPrice: (amount, options = {}) => new Intl.NumberFormat(currencyLocale(currency), {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
      ...options,
    }).format(Number(amount || 0)),
  }), [currency, loaded, refreshStoreSettings, settings]);

  return <StoreSettingsContext.Provider value={value}>{children}</StoreSettingsContext.Provider>;
}

export function useAdminStoreSettings() {
  const context = useContext(StoreSettingsContext);
  if (!context) throw new Error('useAdminStoreSettings must be used within AdminStoreSettingsProvider');
  return context;
}
