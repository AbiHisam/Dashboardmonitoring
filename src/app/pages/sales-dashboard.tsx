import { useState, useMemo, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  AlertTriangle,
  Award,
  TrendingDown as Gap,
  Package,
  ShoppingCart,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useRole } from "../contexts/role-context";
import { useNavigate } from "react-router";

interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
  color: string;
  achievement?: number;
}

function KPICard({ title, value, subtitle, change, changeType, icon, color, achievement }: KPICardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="text-xs text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${color}15` }}
        >
          <div style={{ color }}>{icon}</div>
        </div>
      </div>
      {achievement !== undefined && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-600">Achievement</span>
            <span className={`text-sm font-semibold ${
              achievement >= 100 ? "text-green-600" : 
              achievement >= 90 ? "text-yellow-600" : 
              "text-red-600"
            }`}>
              {achievement.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all ${
                achievement >= 100 ? "bg-green-600" : 
                achievement >= 90 ? "bg-yellow-600" : 
                "bg-red-600"
              }`}
              style={{ width: `${Math.min(achievement, 100)}%` }}
            />
          </div>
        </div>
      )}
      {change && (
        <div className="flex items-center gap-1 mt-2">
          {changeType === "positive" ? (
            <TrendingUp className="w-3 h-3 text-green-600" />
          ) : changeType === "negative" ? (
            <TrendingDown className="w-3 h-3 text-red-600" />
          ) : null}
          <span
            className={`text-xs ${
              changeType === "positive"
                ? "text-green-600"
                : changeType === "negative"
                ? "text-red-600"
                : "text-gray-600"
            }`}
          >
            {change}
          </span>
        </div>
      )}
    </div>
  );
}

// Mock data for Sales Dashboard
const mockSalesData = {
  // Total metrics
  totalTarget: 850000000,
  totalActual: 765000000,
  totalOrders: 8500,
  totalUnits: 42500,
  
  // Monthly trend (Target vs Actual)
  monthlyTrend: [
    { month: "Jan", target: 150000000, actual: 165000000 },
    { month: "Feb", target: 120000000, actual: 105000000 },
    { month: "Mar", target: 140000000, actual: 135000000 },
    { month: "Apr", target: 130000000, actual: 120000000 },
    { month: "May", target: 145000000, actual: 125000000 },
    { month: "Jun", target: 165000000, actual: 115000000 },
  ],
  
  // Target vs Actual by Brand
  brandPerformance: [
    { 
      brand: "Kavela", 
      target: 250000000, 
      actual: 210000000, 
      achievement: 84.0,
      gap: -40000000 
    },
    { 
      brand: "Gendes", 
      target: 320000000, 
      actual: 295000000, 
      achievement: 92.2,
      gap: -25000000 
    },
    { 
      brand: "MARUI", 
      target: 280000000, 
      actual: 260000000, 
      achievement: 92.9,
      gap: -20000000 
    },
  ],
  
  // Target vs Actual by Channel
  channelPerformance: [
    { 
      channel: "Shopee", 
      target: 280000000, 
      actual: 265000000, 
      achievement: 94.6 
    },
    { 
      channel: "TikTok Shop", 
      target: 250000000, 
      actual: 235000000, 
      achievement: 94.0 
    },
    { 
      channel: "Tokopedia", 
      target: 200000000, 
      actual: 175000000, 
      achievement: 87.5 
    },
    { 
      channel: "Offline", 
      target: 120000000, 
      actual: 90000000, 
      achievement: 75.0 
    },
  ],
  
  // Underperforming segments
  criticalUnderperformance: [
    { 
      segment: "Kavela - Offline",
      target: 45000000,
      actual: 28000000,
      achievement: 62.2,
      gap: -17000000
    },
    { 
      segment: "Kavela - Tokopedia",
      target: 65000000,
      actual: 52000000,
      achievement: 80.0,
      gap: -13000000
    },
    { 
      segment: "Gendes - TikTok Shop",
      target: 95000000,
      actual: 81000000,
      achievement: 85.3,
      gap: -14000000
    },
  ],
  
  // Top performers
  topPerformers: [
    { brand: "Gendes", channel: "Shopee", achievement: 110.0, actual: 165000000 },
    { brand: "MARUI", channel: "Shopee", achievement: 108.5, actual: 130000000 },
    { brand: "MARUI", channel: "TikTok Shop", achievement: 103.2, actual: 95000000 },
  ],
};

export default function SalesDashboard() {
  // Temporary filter states (before apply)
  const [tempPeriod, setTempPeriod] = useState<string>("monthly");
  const [tempYear, setTempYear] = useState<string>("2026");
  const [tempBrand, setTempBrand] = useState<string>("All");
  const [tempChannel, setTempChannel] = useState<string>("All");
  
  // Applied filter states (after click Apply)
  const [selectedPeriod, setSelectedPeriod] = useState<string>("monthly");
  const [selectedYear, setSelectedYear] = useState<string>("2026");
  const [selectedBrand, setSelectedBrand] = useState<string>("All");
  const [selectedChannel, setSelectedChannel] = useState<string>("All");
  
  const { currentRole } = useRole();
  const navigate = useNavigate();

  // Role guard - only Top Management can access
  useEffect(() => {
    if (currentRole !== "Top Management") {
      navigate("/");
    }
  }, [currentRole, navigate]);

  const periodOptions = ["monthly", "quarterly", "yearly"];
  const years = ["2024", "2025", "2026"];
  const brands = ["All", "Gendes", "Kavela", "MARUI"];
  const channels = ["All", "Shopee", "TikTok Shop", "Tokopedia", "Offline"];

  // Apply filters handler
  const handleApplyFilters = () => {
    setSelectedPeriod(tempPeriod);
    setSelectedYear(tempYear);
    setSelectedBrand(tempBrand);
    setSelectedChannel(tempChannel);
  };

  // Filter data based on applied filters
  const filteredData = useMemo(() => {
    let brandData = [...mockSalesData.brandPerformance];
    let channelData = [...mockSalesData.channelPerformance];
    let criticalData = [...mockSalesData.criticalUnderperformance];
    let topPerformersData = [...mockSalesData.topPerformers];

    // Filter by brand
    if (selectedBrand !== "All") {
      brandData = brandData.filter(item => item.brand === selectedBrand);
      criticalData = criticalData.filter(item => item.segment.startsWith(selectedBrand));
      topPerformersData = topPerformersData.filter(item => item.brand === selectedBrand);
    }

    // Filter by channel
    if (selectedChannel !== "All") {
      channelData = channelData.filter(item => item.channel === selectedChannel);
      criticalData = criticalData.filter(item => item.segment.includes(selectedChannel));
      topPerformersData = topPerformersData.filter(item => item.channel === selectedChannel);
    }

    // Calculate totals based on filtered data
    const totalTarget = brandData.reduce((sum, item) => sum + item.target, 0);
    const totalActual = brandData.reduce((sum, item) => sum + item.actual, 0);

    return {
      brandPerformance: brandData,
      channelPerformance: channelData,
      criticalUnderperformance: criticalData,
      topPerformers: topPerformersData,
      totalTarget: totalTarget > 0 ? totalTarget : mockSalesData.totalTarget,
      totalActual: totalActual > 0 ? totalActual : mockSalesData.totalActual,
    };
  }, [selectedBrand, selectedChannel]);

  // Calculate KPIs
  const achievement = (filteredData.totalActual / filteredData.totalTarget) * 100;
  const salesGap = filteredData.totalTarget - filteredData.totalActual;
  
  // Run rate projection
  const monthsPassed = mockSalesData.monthlyTrend.length;
  const avgMonthlySales = mockSalesData.totalActual / monthsPassed;
  const projectedYearEnd = avgMonthlySales * 12;
  const projectedAchievement = (projectedYearEnd / mockSalesData.totalTarget) * 100;

  const formatCurrency = (value: number) => {
    const formatted = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(value));
    return value < 0 ? `-${formatted}` : formatted;
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("id-ID").format(value);
  };

  // Sort brands by achievement (lowest first)
  const sortedBrands = useMemo(() => {
    return [...filteredData.brandPerformance].sort((a, b) => a.achievement - b.achievement);
  }, [filteredData.brandPerformance]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Sales Performance Dashboard Komersial</h1>
        <p className="text-sm text-gray-600 mt-1">
          Executive overview of Target vs Actual Sales achievement
        </p>
      </div>

      {/* Global Filters - Sticky */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 sticky top-0 z-10 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1.5 block">Period</label>
            <select
              value={tempPeriod}
              onChange={(e) => setTempPeriod(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC7C3]"
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1.5 block">Year</label>
            <select
              value={tempYear}
              onChange={(e) => setTempYear(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC7C3]"
            >
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1.5 block">Brand</label>
            <select
              value={tempBrand}
              onChange={(e) => setTempBrand(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC7C3]"
            >
              {brands.map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1.5 block">Sales Channel</label>
            <select
              value={tempChannel}
              onChange={(e) => setTempChannel(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC7C3]"
            >
              {channels.map((channel) => (
                <option key={channel} value={channel}>{channel}</option>
              ))}
            </select>
          </div>
          <div className="col-span-4">
            <button
              onClick={handleApplyFilters}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-[#6CC7C3] rounded-md hover:bg-[#59BFB8] focus:outline-none focus:ring-2 focus:ring-[#6CC7C3]"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Executive KPI Overview - Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <KPICard
          title="Total Target Sales"
          value={formatCurrency(filteredData.totalTarget)}
          icon={<Target className="w-6 h-6" />}
          color="#6CC7C3"
        />
        <KPICard
          title="Total Actual Sales"
          value={formatCurrency(filteredData.totalActual)}
          icon={<DollarSign className="w-6 h-6" />}
          color="#F26C8A"
          achievement={achievement}
        />
        <KPICard
          title="Achievement"
          value={`${achievement.toFixed(1)}%`}
          subtitle={achievement >= 100 ? "Target Achieved" : "Below Target"}
          icon={achievement >= 100 ? <Award className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
          color={achievement >= 100 ? "#9BC53D" : achievement >= 90 ? "#F6D400" : "#F26C8A"}
          change={achievement >= 90 ? "On track" : "Needs attention"}
          changeType={achievement >= 90 ? "positive" : "negative"}
        />
      </div>

      {/* Executive KPI Overview - Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <KPICard
          title="Sales Gap"
          value={formatCurrency(salesGap)}
          subtitle="Target - Actual"
          icon={<Gap className="w-6 h-6" />}
          color="#F6D400"
        />
        <KPICard
          title="Total Orders"
          value={formatNumber(mockSalesData.totalOrders)}
          icon={<ShoppingCart className="w-6 h-6" />}
          color="#6CC7C3"
        />
        <KPICard
          title="Total Units Sold"
          value={formatNumber(mockSalesData.totalUnits)}
          icon={<Package className="w-6 h-6" />}
          color="#9BC53D"
        />
      </div>

      {/* Core Comparison Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Target vs Actual by Brand */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-gray-900">Target vs Actual by Brand</h3>
            <p className="text-xs text-gray-600 mt-1">Sorted by achievement (lowest first)</p>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={sortedBrands} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="brand" tick={{ fontSize: 11 }} width={80} />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  formatCurrency(value),
                  name === "target" ? "Target" : "Actual"
                ]}
                contentStyle={{ fontSize: "12px", borderRadius: "6px" }}
              />
              <Legend 
                wrapperStyle={{ fontSize: "12px" }}
                formatter={(value) => value === "target" ? "Target" : "Actual"}
              />
              <Bar dataKey="target" fill="#6CC7C3" radius={[4, 4, 4, 4]} />
              <Bar dataKey="actual" fill="#F26C8A" radius={[4, 4, 4, 4]} />
            </BarChart>
          </ResponsiveContainer>
          {/* Achievement labels */}
          <div className="mt-3 space-y-1">
            {sortedBrands.map((brand) => (
              <div key={brand.brand} className="flex items-center justify-between text-xs">
                <span className="text-gray-600">{brand.brand}</span>
                <span className={`font-semibold ${
                  brand.achievement >= 100 ? "text-green-600" :
                  brand.achievement >= 90 ? "text-yellow-600" :
                  "text-red-600"
                }`}>
                  {brand.achievement.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Target vs Actual by Channel */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-gray-900">Target vs Actual by Channel</h3>
            <p className="text-xs text-gray-600 mt-1">Channel performance comparison</p>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={filteredData.channelPerformance} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="channel" tick={{ fontSize: 11 }} width={100} />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  formatCurrency(value),
                  name === "target" ? "Target" : "Actual"
                ]}
                contentStyle={{ fontSize: "12px", borderRadius: "6px" }}
              />
              <Legend 
                wrapperStyle={{ fontSize: "12px" }}
                formatter={(value) => value === "target" ? "Target" : "Actual"}
              />
              <Bar dataKey="target" fill="#6CC7C3" radius={[4, 4, 4, 4]} />
              <Bar dataKey="actual" fill="#F26C8A" radius={[4, 4, 4, 4]} />
            </BarChart>
          </ResponsiveContainer>
          {/* Achievement labels */}
          <div className="mt-3 space-y-1">
            {filteredData.channelPerformance.map((channel) => (
              <div key={channel.channel} className="flex items-center justify-between text-xs">
                <span className="text-gray-600">{channel.channel}</span>
                <span className={`font-semibold ${
                  channel.achievement >= 100 ? "text-green-600" :
                  channel.achievement >= 90 ? "text-yellow-600" :
                  "text-red-600"
                }`}>
                  {channel.achievement.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sales Trend vs Target */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-gray-900">Sales Trend vs Target</h3>
          <p className="text-xs text-gray-600 mt-1">Monthly performance tracking</p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mockSalesData.monthlyTrend} margin={{ left: 10, right: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip 
              formatter={(value: number, name: string) => [
                formatCurrency(value),
                name === "target" ? "Target" : "Actual"
              ]}
              contentStyle={{ fontSize: "12px", borderRadius: "6px" }}
            />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Line 
              type="monotone" 
              dataKey="target" 
              stroke="#6CC7C3" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: "#6CC7C3", r: 4 }}
              name="Target"
            />
            <Line 
              type="monotone" 
              dataKey="actual" 
              stroke="#F26C8A" 
              strokeWidth={3}
              dot={{ fill: "#F26C8A", r: 5 }}
              name="Actual"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Performance Priority Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critical Underperformance */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-red-50 border-b border-red-200 px-6 py-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h3 className="text-base font-semibold text-gray-900">Critical Underperformance</h3>
            </div>
            <p className="text-xs text-gray-600 mt-1">Segments requiring immediate attention</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Segment</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700">Target</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700">Actual</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700">Achievement</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700">Gap</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.criticalUnderperformance.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900 font-medium">{item.segment}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{formatCurrency(item.target)}</td>
                    <td className="px-4 py-3 text-right text-gray-900 font-medium">{formatCurrency(item.actual)}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.achievement >= 90 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"
                      }`}>
                        {item.achievement.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-red-600 font-medium">{formatCurrency(item.gap)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-green-50 border-b border-green-200 px-6 py-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-green-600" />
              <h3 className="text-base font-semibold text-gray-900">Top Performers</h3>
            </div>
            <p className="text-xs text-gray-600 mt-1">Segments exceeding targets</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Brand</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Channel</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700">Achievement</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700">Actual Sales</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.topPerformers.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900 font-medium">{item.brand}</td>
                    <td className="px-4 py-3 text-gray-700">{item.channel}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {item.achievement.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900 font-medium">{formatCurrency(item.actual)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}