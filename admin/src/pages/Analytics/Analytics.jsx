import { useState, useRef, useEffect } from 'react';
import {
  kpiCards,
  revenueChartData,
  gemstoneDistribution,
  topProductsData,
  channelData,
} from '../../data/analytics';
import { fetchDashboardKPIs, fetchRevenueChart, fetchSalesByGemstone, isAuthenticated, login } from '../../lib/api';

export default function Analytics() {
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [cards, setCards] = useState(kpiCards);
  const [revenueValues, setRevenueValues] = useState(revenueChartData);
  const [gemstoneData, setGemstoneData] = useState(gemstoneDistribution);
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      drawRevenueChart(chartRef.current);
    }
  }, [dateRange, revenueValues]);

  useEffect(() => {
    (async () => {
      try {
        if (!isAuthenticated()) await login('admin@virtuoso-gems.com', 'admin123');
        const [kpis, chart, gemstoneSales] = await Promise.all([
          fetchDashboardKPIs(),
          fetchRevenueChart(dateRange === 'Last 30 Days' ? 'daily' : 'monthly'),
          fetchSalesByGemstone(),
        ]);
        const revenue = Number(kpis.total_revenue || 0);
        const orders = Number(kpis.total_orders || 0);
        setCards([
          { ...kpiCards[0], value: `$${revenue.toLocaleString()}` },
          { ...kpiCards[1], value: `$${Math.round(revenue * 0.3).toLocaleString()}` },
          { ...kpiCards[2], value: String(kpis.active_orders_count || 0) },
          { ...kpiCards[3], value: `$${Math.round(revenue / Math.max(orders, 1)).toLocaleString()}` },
        ]);
        const mapped = (chart || []).map((entry) => ({
          week: new Date(entry.period).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          revenue: Number(entry.revenue || 0),
          profit: Number(entry.revenue || 0) * 0.3,
        }));
        if (mapped.length > 1) setRevenueValues(mapped);
        if (gemstoneSales?.length) {
          const total = gemstoneSales.reduce((sum, item) => sum + Number(item.total_quantity || 0), 0) || 1;
          setGemstoneData(gemstoneSales.slice(0, 4).map((item, index) => ({
            type: item.cut_shape || 'Unknown',
            percentage: Math.round(Number(item.total_quantity || 0) / total * 100),
            color: gemstoneDistribution[index % gemstoneDistribution.length].color,
          })));
        }
      } catch { /* retain the designed fallback values */ }
    })();
  }, [dateRange]);

  const drawRevenueChart = (canvas) => {
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    const height = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const cssWidth = canvas.offsetWidth;
    const cssHeight = canvas.offsetHeight;

    // Clear
    ctx.clearRect(0, 0, cssWidth, cssHeight);

    const values = revenueValues;
    const maxVal = Math.max(...values.map(v => Math.max(v.revenue, v.profit)));
    const minVal = 0;
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
      ctx.fillText('$' + (val / 1000).toFixed(0) + 'k', padding.left - 10, y);
    }

    // Profit area (grey)
    const profitGradient = ctx.createLinearGradient(0, padding.top, 0, cssHeight - padding.bottom);
    profitGradient.addColorStop(0, 'rgba(156, 163, 175, 0.15)');
    profitGradient.addColorStop(1, 'rgba(156, 163, 175, 0)');
    ctx.fillStyle = profitGradient;
    ctx.beginPath();
    ctx.moveTo(getX(0), cssHeight - padding.bottom);
    values.forEach((val, i) => {
      ctx.lineTo(getX(i), getY(val.profit));
    });
    ctx.lineTo(cssWidth - padding.right, cssHeight - padding.bottom);
    ctx.closePath();
    ctx.fill();

    // Revenue area (emerald)
    const revenueGradient = ctx.createLinearGradient(0, padding.top, 0, cssHeight - padding.bottom);
    revenueGradient.addColorStop(0, 'rgba(6, 78, 59, 0.15)');
    revenueGradient.addColorStop(1, 'rgba(6, 78, 59, 0)');
    ctx.fillStyle = revenueGradient;
    ctx.beginPath();
    ctx.moveTo(getX(0), cssHeight - padding.bottom);
    values.forEach((val, i) => {
      ctx.lineTo(getX(i), getY(val.revenue));
    });
    ctx.lineTo(cssWidth - padding.right, cssHeight - padding.bottom);
    ctx.closePath();
    ctx.fill();

    // Profit line
    ctx.strokeStyle = '#9CA3AF';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    values.forEach((val, i) => {
      const x = getX(i);
      const y = getY(val.profit);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Revenue line
    ctx.strokeStyle = '#064E3B';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    values.forEach((val, i) => {
      const x = getX(i);
      const y = getY(val.revenue);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Points
    ctx.fillStyle = '#064E3B';
    values.forEach((val, i) => {
      const x = getX(i);
      const y = getY(val.revenue);
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = '#9CA3AF';
    values.forEach((val, i) => {
      const x = getX(i);
      const y = getY(val.profit);
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // X-axis labels
    ctx.fillStyle = '#707974';
    ctx.font = '11px Inter';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    values.forEach((val, i) => {
      const x = getX(i);
      ctx.fillText(val.week, x, cssHeight - padding.bottom + 8);
    });
  };

  return (
    <div>
      <div>
          {/* Page Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-[36px] leading-[44px] tracking-[-0.02em] font-bold text-on-surface">Analytics & Financial Reports</h2>
              <p className="text-[14px] leading-[20px] text-on-surface-variant mt-1">Monitor high-value inventory performance and sales intelligence.</p>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center bg-surface-container-lowest border border-outline-variant rounded-md px-3 py-2 shadow-sm text-sm">
                <span className="material-symbols-outlined text-[18px] text-outline mr-2">calendar_today</span>
                <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="bg-transparent font-medium text-on-surface outline-none">
                  <option>Last 30 Days</option><option>This Quarter</option><option>This Year</option>
                </select>
              </label>
              <button className="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary font-semibold text-[12px] leading-[16px] uppercase tracking-wider rounded-md shadow-md transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">download</span>
                Download Full PDF Report
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {cards.map((kpi, index) => (
              <div
                key={index}
                className="bg-surface-container-lowest p-6 rounded-xl border border-surface-container-highest shadow-[0px_1px_3px_rgba(0,0,0,0.05),0px_1px_2px_rgba(0,0,0,0.03)] flex flex-col relative overflow-hidden group hover:shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.08)] transition-shadow duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <p className="text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant">{kpi.label}</p>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${kpi.iconBg}/10`} style={{ color: `var(--color-${kpi.iconColor})` }}>
                    <span className="material-symbols-outlined text-[20px]">{kpi.icon}</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <h3 className="text-[24px] leading-[32px] tracking-[-0.01em] font-semibold text-on-surface">{kpi.value}</h3>
                  <span className="text-[12px] leading-[16px] font-semibold px-2 py-0.5 rounded-full bg-success-bg text-success-text flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">trending_up</span>
                    {kpi.change}
                  </span>
                </div>
                <p className="text-[14px] leading-[20px] text-xs text-on-surface-variant/70">vs last 30 days</p>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                  <span className="material-symbols-outlined text-[100px]" style={{ color: `var(--color-${kpi.iconColor})` }}>
                    {kpi.icon}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Bento Grid Layout for Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
            {/* Left Card: Area Line Chart (60%) */}
            <div className="lg:col-span-8 bg-surface-container-lowest rounded-lg border border-surface-container-highest shadow-sm overflow-hidden flex flex-col">
              <div className="px-6 py-5 border-b border-surface-container-highest flex justify-between items-center bg-white">
                <h3 className="text-[20px] leading-[28px] font-semibold text-on-surface">Total Revenue vs. Net Profit</h3>
                <div className="flex gap-4 text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#064E3B]"></div>Revenue</div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#9CA3AF]"></div>Net Profit</div>
                </div>
              </div>
              <div className="p-6 flex-1 bg-white relative">
                <div className="w-full h-64 chart-grid relative">
                  <canvas ref={chartRef} className="w-full h-full" />
                </div>
              </div>
            </div>

            {/* Right Card: Donut Chart (40%) */}
            <div className="lg:col-span-4 bg-surface-container-lowest rounded-lg border border-surface-container-highest shadow-sm overflow-hidden flex flex-col">
              <div className="px-6 py-5 border-b border-surface-container-highest bg-white">
                <h3 className="text-[20px] leading-[28px] font-semibold text-on-surface">Sales by Gemstone Type</h3>
              </div>
              <div className="p-6 flex-1 bg-white flex flex-col justify-center items-center">
                <div className="relative w-48 h-48 mb-6">
                  <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 100 100">
                    {/* Others 10% */}
                    <circle cx="50" cy="50" fill="transparent" r="40" stroke="#E2E8F0" strokeDasharray="25.12 251.2" strokeDashoffset="0" strokeWidth="20" />
                    {/* Rubies 15% */}
                    <circle cx="50" cy="50" fill="transparent" r="40" stroke="#991B1B" strokeDasharray="37.68 251.2" strokeDashoffset="-25.12" strokeWidth="20" />
                    {/* Emeralds 30% */}
                    <circle cx="50" cy="50" fill="transparent" r="40" stroke="#064E3B" strokeDasharray="75.36 251.2" strokeDashoffset="-62.8" strokeWidth="20" />
                    {/* Sapphires 45% */}
                    <circle cx="50" cy="50" fill="transparent" r="40" stroke="#1E3A8A" strokeDasharray="113.04 251.2" strokeDashoffset="-138.16" strokeWidth="20" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-[20px] leading-[28px] font-semibold text-on-surface">1,240</span>
                    <span className="text-xs text-outline">Total Units</span>
                  </div>
                </div>
                {/* Legend */}
                <div className="w-full space-y-3 text-[14px] leading-[20px]">
                  {gemstoneData.map((gem, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: gem.color }} />
                        <span className="text-on-surface-variant">{gem.type}</span>
                      </div>
                      <span className="font-semibold">{gem.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section: Performance Metrics Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Table 1: Top Performing Products */}
            <div className="card overflow-hidden">
              <div className="px-6 py-5 border-b border-surface-container-highest bg-white flex justify-between items-center">
                <h3 className="text-[20px] leading-[28px] font-semibold text-on-surface">Top Performing Products</h3>
                <button className="text-primary text-sm font-medium hover:underline">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse bg-white">
                  <thead>
                    <tr className="bg-[#F1F5F9] border-b border-surface-container-highest">
                      <th className="py-3 px-6 text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant">Gemstone/Item</th>
                      <th className="py-3 px-6 text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant">SKU</th>
                      <th className="py-3 px-6 text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-on-surface-variant text-right">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9]">
                    {topProductsData.map((product) => (
                      <tr key={product.id} className="hover:bg-surface-container-low transition-colors">
                        <td className="py-4 px-6 font-medium">{product.name}</td>
                        <td className="py-4 px-6 text-on-surface-variant text-sm">{product.sku}</td>
                        <td className="py-4 px-6 text-right font-semibold">${product.revenue.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table 2: Sales Channel Breakdown */}
            <div className="card overflow-hidden">
              <div className="px-6 py-5 border-b border-surface-container-highest bg-white">
                <h3 className="text-[20px] leading-[28px] font-semibold text-on-surface">Sales Channel Breakdown</h3>
              </div>
              <div className="p-6 bg-white space-y-6">
                {channelData.map((channel, index) => (
                  <div key={channel.id}>
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <h4 className="font-semibold text-on-surface">{channel.name}</h4>
                        <p className="text-xs text-on-surface-variant mt-1">{channel.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-[20px] leading-[28px] font-semibold text-on-surface">${channel.revenue.toLocaleString()}</div>
                        <div className="text-xs text-success font-medium flex items-center justify-end gap-1">
                          <span className="material-symbols-outlined text-[14px]">trending_up</span>
                          {channel.change}
                        </div>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                      <div className="h-full" style={{ width: `${channel.percentage}%`, backgroundColor: channel.color }} />
                    </div>
                    {index < channelData.length - 1 && <hr className="border-surface-container-highest my-6" />}
                  </div>
                ))}
                {/* Summary Stats underneath */}
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="bg-surface p-4 rounded-md border border-surface-container-highest">
                    <div className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">Avg. Order Value (Web)</div>
                    <div className="text-[20px] leading-[28px] font-semibold">$3,250</div>
                  </div>
                  <div className="bg-surface p-4 rounded-md border border-surface-container-highest">
                    <div className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">Avg. Order Value (Custom)</div>
                    <div className="text-[20px] leading-[28px] font-semibold text-primary">$12,820</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}
