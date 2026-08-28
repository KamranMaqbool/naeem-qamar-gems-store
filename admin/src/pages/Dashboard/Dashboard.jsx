import { useState, useEffect, useRef } from 'react';
import { kpiCards, recentActivity, recentOrders, statusConfig } from '../../data/dashboard';

export default function Dashboard() {
  const [chartPeriod, setChartPeriod] = useState('Last 30 Days');
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      drawChart(chartRef.current);
    }
  }, [chartPeriod]);

  const drawChart = (canvas) => {
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    const height = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const cssWidth = canvas.offsetWidth;
    const cssHeight = canvas.offsetHeight;

    // Clear
    ctx.clearRect(0, 0, cssWidth, cssHeight);

    // Data points for different periods
    const data = {
      'Last 30 Days': [12000, 19000, 15000, 25000, 22000, 30000, 28000, 35000, 32000, 40000, 38000, 45000, 42000, 48000, 50000, 52000, 55000, 58000, 60000, 62000, 65000, 63000, 68000, 70000, 72000, 75000, 78000, 80000, 82000, 85000],
      'This Quarter': [45000, 52000, 48000, 65000, 58000, 72000, 68000, 85000, 78000, 92000, 88000, 105000, 98000, 112000, 108000, 125000, 118000, 135000, 128000, 142000, 135000, 150000, 142000, 160000, 152000, 168000, 160000, 175000, 168000, 185000],
      'This Year': [120000, 145000, 135000, 180000, 165000, 210000, 195000, 240000, 220000, 270000, 250000, 300000, 280000, 330000, 310000, 360000, 340000, 395000, 370000, 420000, 400000, 450000, 430000, 485000, 460000, 510000, 490000, 540000, 520000, 570000],
    };

    const values = data[chartPeriod] || data['Last 30 Days'];
    const maxVal = Math.max(...values);
    const minVal = Math.min(...values);
    const range = maxVal - minVal || 1;
    const padding = { top: 20, right: 10, bottom: 40, left: 60 };
    const graphWidth = cssWidth - padding.left - padding.right;
    const graphHeight = cssHeight - padding.top - padding.bottom;

    const xStep = graphWidth / (values.length - 1);
    const getY = (val) => padding.top + graphHeight - ((val - minVal) / range) * graphHeight;
    const getX = (i) => padding.left + i * xStep;

    // Grid lines
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (graphHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(cssWidth - padding.right, y);
      ctx.stroke();
    }

    // Y-axis labels
    ctx.fillStyle = '#707974';
    ctx.font = '11px Inter';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let i = 0; i <= 4; i++) {
      const val = maxVal - (range / 4) * i;
      const y = padding.top + (graphHeight / 4) * i;
      ctx.fillText('$' + (val / 1000).toFixed(0) + 'K', padding.left - 10, y);
    }

    // Line
    ctx.strokeStyle = '#064E3B';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    values.forEach((val, i) => {
      const x = getX(i);
      const y = getY(val);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Fill gradient
    const gradient = ctx.createLinearGradient(0, padding.top, 0, cssHeight - padding.bottom);
    gradient.addColorStop(0, 'rgba(6, 78, 59, 0.15)');
    gradient.addColorStop(1, 'rgba(6, 78, 59, 0)');
    ctx.fillStyle = gradient;
    ctx.lineTo(cssWidth - padding.right, cssHeight - padding.bottom);
    ctx.lineTo(padding.left, cssHeight - padding.bottom);
    ctx.closePath();
    ctx.fill();

    // Points
    ctx.fillStyle = '#064E3B';
    values.forEach((val, i) => {
      const x = getX(i);
      const y = getY(val);
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // X-axis labels
    ctx.fillStyle = '#707974';
    ctx.font = '11px Inter';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const labelCount = 6;
    for (let i = 0; i < labelCount; i++) {
      const idx = Math.round(i * (values.length - 1) / (labelCount - 1));
      const x = getX(idx);
      ctx.fillText(`${idx + 1}`, x, cssHeight - padding.bottom + 8);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-[36px] leading-[44px] tracking-[-0.02em] font-bold text-on-surface">Overview</h2>
          <p className="text-[16px] leading-[24px] text-on-surface-variant mt-1">Monitor key metrics and recent operations.</p>
        </div>
        <div className="hidden sm:flex gap-3">
          <button className="px-4 py-2 border border-outline-variant rounded-md text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface hover:bg-surface-container-low transition-colors shadow-sm">Export Data</button>
          <button className="px-4 py-2 bg-primary-container text-white rounded-md text-[12px] leading-[16px] font-semibold uppercase tracking-wider hover:bg-primary transition-colors shadow-resting flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">add</span>
            New Order
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpiCards.map((kpi) => (
          <div key={kpi.id} className="kpi-card">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant">{kpi.label}</p>
              <span className={`material-symbols-outlined ${kpi.iconBg}/10 p-1.5 rounded-lg`} style={{ color: `var(--color-${kpi.iconColor})` }}>
                {kpi.icon}
              </span>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <h3 className="text-[24px] leading-[32px] tracking-[-0.01em] font-semibold text-on-surface">{kpi.value}</h3>
              <span className={`text-[12px] leading-[16px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 ${kpi.changeType === 'positive' ? 'bg-success-bg text-success-text' : 'bg-error-bg text-error-text'}`}>
                <span className="material-symbols-outlined text-[14px]">{kpi.changeType === 'positive' ? 'trending_up' : 'trending_down'}</span>
                {kpi.change}
              </span>
            </div>
            <p className="text-[14px] leading-[20px] text-xs text-on-surface-variant/70">{kpi.description}</p>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 opacity-5 pointer-events-none watermark transition-opacity">
              <span className="material-symbols-outlined text-[100px]" style={{ color: `var(--color-${kpi.iconColor})` }}>
                {kpi.watermarkIcon}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Middle Row: Chart & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Chart Area */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[20px] leading-[28px] font-semibold text-on-surface">Revenue Overview</h3>
            <select
              value={chartPeriod}
              onChange={(e) => setChartPeriod(e.target.value)}
              className="bg-surface-container-low border border-outline-variant text-on-surface-variant text-[12px] leading-[16px] font-semibold uppercase tracking-wider rounded-md px-3 py-1 text-sm focus:ring-1 focus:ring-primary-container outline-none"
            >
              <option>Last 30 Days</option>
              <option>This Quarter</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-[300px] w-full flex items-center justify-center bg-surface-bright rounded-lg border border-surface-container border-dashed relative">
            <canvas ref={chartRef} className="w-full h-full" />
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="card p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[20px] leading-[28px] font-semibold text-on-surface">Recent Activity</h3>
            <button className="text-primary-container hover:text-primary text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-sm transition-colors">View All</button>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-6">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex gap-4 relative">
                <div className="absolute left-[15px] top-[30px] bottom-[-24px] w-[2px] bg-surface-container-highest z-0" />
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 border-2 border-white ${activity.iconBg}/10`} style={{ color: `var(--color-${activity.iconColor})` }}>
                  <span className="material-symbols-outlined text-[16px]">{activity.icon}</span>
                </div>
                <div>
                  <p className="text-[14px] leading-[20px] text-on-surface"><span className="font-semibold text-primary">{activity.title}</span></p>
                  <p className="text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-xs text-on-surface-variant/70 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Data Table */}
      <div className="card overflow-hidden">
        <div className="px-6 py-5 border-b border-surface-container-highest flex justify-between items-center bg-white">
          <h3 className="text-[20px] leading-[28px] font-semibold text-on-surface">Recent Orders</h3>
          <div className="flex gap-2">
            <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-md transition-colors" aria-label="Filter">
              <span className="material-symbols-outlined">filter_list</span>
            </button>
            <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-md transition-colors" aria-label="More options">
              <span className="material-symbols-outlined">more_vert</span>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F1F5F9] border-b border-surface-container-highest">
                <th className="py-3 px-6 text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant">Order ID</th>
                <th className="py-3 px-6 text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant">Customer</th>
                <th className="py-3 px-6 text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant">Date</th>
                <th className="py-3 px-6 text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant">Amount</th>
                <th className="py-3 px-6 text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant">Status</th>
                <th className="py-3 px-6 text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-[#F1F5F9] hover:bg-surface-bright transition-colors group">
                  <td className="py-4 px-6 font-mono text-[13px] leading-[18px] font-medium text-primary-container">{order.id}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant font-bold text-xs">
                        {order.customer.initials}
                      </div>
                      <div>
                        <p className="font-medium text-on-surface">{order.customer.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-on-surface-variant">{order.date}</td>
                  <td className="py-4 px-6 font-medium text-on-surface">{order.amount}</td>
                  <td className="py-4 px-6">
                    <span className={statusConfig[order.status]?.className || 'status-badge'}>
                      {statusConfig[order.status]?.label || order.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-on-surface-variant hover:text-primary transition-colors opacity-0 group-hover:opacity-100" aria-label="Edit order">
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-surface-container-highest bg-white flex items-center justify-between">
          <span className="text-[14px] leading-[20px] text-sm text-on-surface-variant">Showing 1 to 5 of 48 entries</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-outline-variant rounded-md text-sm text-on-surface-variant hover:bg-surface-container-low disabled:opacity-50" disabled>Prev</button>
            <button className="px-3 py-1 bg-primary-container text-white rounded-md text-sm shadow-sm">1</button>
            <button className="px-3 py-1 border border-outline-variant rounded-md text-sm text-on-surface hover:bg-surface-container-low">2</button>
            <button className="px-3 py-1 border border-outline-variant rounded-md text-sm text-on-surface hover:bg-surface-container-low">3</button>
            <button className="px-3 py-1 border border-outline-variant rounded-md text-sm text-on-surface hover:bg-surface-container-low">4</button>
            <button className="px-3 py-1 border border-outline-variant rounded-md text-sm text-on-surface hover:bg-surface-container-low">5</button>
            <button className="px-3 py-1 border border-outline-variant rounded-md text-sm text-on-surface hover:bg-surface-container-low">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}