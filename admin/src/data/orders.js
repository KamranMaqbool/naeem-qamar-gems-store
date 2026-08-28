export const orderDetail = {
  id: '#1045',
  status: 'processing',
  date: 'October 26, 2023',
  customer: {
    name: 'Julianne Moore',
    email: 'julianne.m@example.com',
    phone: '+1 (555) 019-2834',
  },
  shipping: {
    name: 'Julianne Moore',
    address1: '1000 Fifth Avenue',
    address2: 'Apt 12B',
    city: 'New York',
    state: 'NY',
    zip: '10028',
    country: 'United States',
  },
  items: [
    {
      id: 1,
      name: '1.5ct Emerald Cut Diamond',
      category: 'Diamond',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANRBp_2Y5fz2Tx1OSWtiAAI0z4ye0lExN8EsaDws8g7DPDvpUGknm9q98_Gg-cZnKdODDk5QLWgkpAGaW9y3v9iy-w2SxN7QklY-I10Ep2BRdnJIuovl64IU58B6lFtzma0WXvHuazq0dxIHYTS0beJif1iLTM9XfhJu2kYUoVcHuM8g-hkXQ7cAJudzyYuGjEEHUphsCeXK6ULs07OXDQ3LDbcpzw6_1nMOWiEpBm0nmzXXje3EOGsQ',
      unitPrice: 12500,
      quantity: 1,
      total: 12500,
    },
    {
      id: 2,
      name: 'Round Brilliant Sapphire',
      category: 'Sapphire',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBU08pie_38Lxn8s9horzSWo4N3d5JrQSjQVn3Ecfu9I7MnWyAHqjnKjoNHW7szRgxi5hmgVFGbVl2debHJWyLJvlXyize7gEPTeYW25kGaVMnIFmj5uzmbQcgouTT3_l1sl4XtOwCqy6JdWVDX1Kk5PSxfhFOQEUlh02_RhknWNGTu1389fQZZbKmfI4y7fFoAMFrHWcmwgZLuHSfopxW0OqhMpdzMBF9HqVxRUceajPXlCFn-k2xURQ',
      unitPrice: 3200,
      quantity: 2,
      total: 6400,
    },
  ],
  summary: {
    subtotal: 18900,
    shipping: 150,
    tax: 1619.25,
    total: 20669.25,
  },
};

export const orders = [
  {
    id: '#1045',
    customer: { name: 'Julianne Moore', initials: 'JM', email: 'julianne.m@example.com' },
    date: 'October 26, 2023',
    amount: '$20,669.25',
    status: 'processing',
    items: 2,
  },
  {
    id: '#1044',
    customer: { name: 'Robert Chen', initials: 'RC', email: 'robert.c@example.com' },
    date: 'October 25, 2023',
    amount: '$8,450.00',
    status: 'shipped',
    items: 1,
  },
  {
    id: '#1043',
    customer: { name: 'Amara Patel', initials: 'AP', email: 'amara.p@example.com' },
    date: 'October 24, 2023',
    amount: '$12,300.00',
    status: 'delivered',
    items: 3,
  },
  {
    id: '#1042',
    customer: { name: 'Eleanor Vance', initials: 'EV', email: 'eleanor.v@example.com' },
    date: 'October 23, 2023',
    amount: '$12,450.00',
    status: 'pending',
    items: 1,
  },
  {
    id: '#1041',
    customer: { name: 'Arthur Reed', initials: 'AR', email: 'arthur.r@example.com' },
    date: 'October 22, 2023',
    amount: '$3,200.00',
    status: 'shipped',
    items: 1,
  },
];

export const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export const statusConfig = {
  pending: { label: 'Pending', className: 'bg-warning-bg text-warning-text border border-warning/20' },
  processing: { label: 'Processing', className: 'bg-info-bg text-info-text border border-info/20' },
  shipped: { label: 'Shipped', className: 'bg-info-bg text-info-text border border-info/20' },
  delivered: { label: 'Delivered', className: 'bg-success-bg text-success-text border border-success/20' },
  completed: { label: 'Completed', className: 'bg-success-bg text-success-text border border-success/20' },
  cancelled: { label: 'Cancelled', className: 'bg-error-bg text-error-text border border-error/20' },
};