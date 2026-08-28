export const discounts = [
  {
    id: 'SUMMERLUXE24',
    code: 'SUMMERLUXE24',
    type: 'Percentage',
    value: '15%',
    usageCount: '42 / 100',
    expiryDate: 'Aug 31, 2024',
    status: 'active',
  },
  {
    id: 'WELCOMEGIFT',
    code: 'WELCOMEGIFT',
    type: 'Fixed Amount',
    value: '$50.00',
    usageCount: '128 / ∞',
    expiryDate: 'No Expiry',
    status: 'active',
  },
  {
    id: 'VIPDIAMOND',
    code: 'VIPDIAMOND',
    type: 'Percentage',
    value: '20%',
    usageCount: '12 / 50',
    expiryDate: 'Dec 31, 2024',
    status: 'active',
  },
];

export const discountTypes = [
  { value: 'percentage', label: 'Percentage' },
  { value: 'fixed', label: 'Fixed Amount' },
];

export const currencies = [
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'PKR', label: 'PKR - Pakistani Rupee' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - British Pound' },
];

export const timezones = [
  { value: 'EST', label: '(GMT-05:00) Eastern Time (US & Canada)' },
  { value: 'PST', label: '(GMT-08:00) Pacific Time (US & Canada)' },
  { value: 'GMT', label: '(GMT+00:00) Greenwich Mean Time' },
];

export const settingsSections = [
  {
    id: 'general',
    label: 'General',
    icon: 'storefront',
  },
  {
    id: 'payments',
    label: 'Payments',
    icon: 'payments',
  },
  {
    id: 'shipping',
    label: 'Shipping',
    icon: 'local_shipping',
  },
  {
    id: 'taxes',
    label: 'Taxes',
    icon: 'account_balance',
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: 'campaign',
  },
];