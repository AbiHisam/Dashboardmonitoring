import { useState, useMemo, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  Activity,
  Flame,
  Calendar,
  Building2,
  ShieldAlert,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
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
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
  color: string;
}

function KPICard({ title, value, change, changeType, icon, color }: KPICardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs text-gray-600 mb-1">{title}</p>
          <p className="text-2xl text-gray-900 mb-2">{value}</p>
          {change && (
            <div className="flex items-center gap-1">
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
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}15` }}
        >
          <div style={{ color }}>{icon}</div>
        </div>
      </div>
    </div>
  );
}

// Full dataset untuk semua divisi
const fullDataset = {
  All: {
    monthlyTrend: [
      { month: "Jan", budget: 76730000, actual: 65830000 },
      { month: "Feb", budget: 52730000, actual: 48500000 },
      { month: "Mar", budget: 85730000, actual: 76200000 },
      { month: "Apr", budget: 59500000, actual: 54000000 },
      { month: "May", budget: 59500000, actual: 51000000 },
      { month: "Jun", budget: 84500000, actual: 72000000 },
      { month: "Jul", budget: 45500000, actual: 38000000 },
      { month: "Aug", budget: 43500000, actual: 35000000 },
      { month: "Sep", budget: 68500000, actual: 52000000 },
      { month: "Oct", budget: 42000000, actual: 28000000 },
      { month: "Nov", budget: 42000000, actual: 20000000 },
      { month: "Dec", budget: 69000000, actual: 15000000 },
    ],
    quarterly: [
      { quarter: "Q1", budget: 215190000, actual: 190530000 },
      { quarter: "Q2", budget: 203500000, actual: 177000000 },
      { quarter: "Q3", budget: 157500000, actual: 125000000 },
      { quarter: "Q4", budget: 153000000, actual: 63000000 },
    ],
    divisionUtilization: [
      { division: "IT", budget: 282000000, actual: 242000000, utilization: 85.8 },
      { division: "Marketing", budget: 216000000, actual: 178000000, utilization: 82.4 },
      { division: "HR", budget: 124000000, actual: 95000000, utilization: 76.6 },
      { division: "Operations", budget: 95000000, actual: 72000000, utilization: 75.8 },
      { division: "Finance", budget: 12500000, actual: 8530000, utilization: 68.2 },
    ],
    topActivities: [
      { activity: "AWS Cloud Services", actual: 112500000 },
      { activity: "Google Ads Campaign", actual: 108000000 },
      { activity: "Employee Training", actual: 100000000 },
      { activity: "Social Media Mgmt", actual: 67000000 },
      { activity: "Office Supplies", actual: 26500000 },
    ],
    riskAlerts: [
      {
        id: "1",
        activity: "AWS Cloud Services",
        division: "IT",
        budget: 111000000,
        actual: 112500000,
        utilization: 101.4,
        status: "danger" as const,
      },
      {
        id: "2",
        activity: "Google Ads Campaign",
        division: "Marketing",
        budget: 108000000,
        actual: 108000000,
        utilization: 100,
        status: "warning" as const,
      },
      {
        id: "3",
        activity: "Social Media Management",
        division: "Marketing",
        budget: 67000000,
        actual: 65000000,
        utilization: 97.0,
        status: "warning" as const,
      },
    ],
    totalBudget: 729190000,
    totalActual: 555530000,
  },
  IT: {
    monthlyTrend: [
      { month: "Jan", budget: 24500000, actual: 21230000 },
      { month: "Feb", budget: 24000000, actual: 21500000 },
      { month: "Mar", budget: 25000000, actual: 23000000 },
      { month: "Apr", budget: 24500000, actual: 22000000 },
      { month: "May", budget: 24500000, actual: 21000000 },
      { month: "Jun", budget: 25000000, actual: 23000000 },
      { month: "Jul", budget: 23000000, actual: 20000000 },
      { month: "Aug", budget: 23000000, actual: 19500000 },
      { month: "Sep", budget: 24000000, actual: 21000000 },
      { month: "Oct", budget: 23000000, actual: 19000000 },
      { month: "Nov", budget: 23000000, actual: 17000000 },
      { month: "Dec", budget: 23500000, actual: 14770000 },
    ],
    quarterly: [
      { quarter: "Q1", budget: 73500000, actual: 65730000 },
      { quarter: "Q2", budget: 74000000, actual: 66000000 },
      { quarter: "Q3", budget: 70000000, actual: 60500000 },
      { quarter: "Q4", budget: 69500000, actual: 50770000 },
    ],
    divisionUtilization: [
      { division: "IT", budget: 282000000, actual: 242000000, utilization: 85.8 },
    ],
    topActivities: [
      { activity: "AWS Cloud Services", actual: 112500000 },
      { activity: "Digital Ocean", actual: 17000000 },
      { activity: "HRIS", actual: 4200000 },
      { activity: "CloudLinux Imunify360", actual: 230000 },
    ],
    riskAlerts: [
      {
        id: "1",
        activity: "AWS Cloud Services",
        division: "IT",
        budget: 111000000,
        actual: 112500000,
        utilization: 101.4,
        status: "danger" as const,
      },
    ],
    totalBudget: 282000000,
    totalActual: 242000000,
  },
  Marketing: {
    monthlyTrend: [
      { month: "Jan", budget: 20000000, actual: 19500000 },
      { month: "Feb", budget: 20000000, actual: 20000000 },
      { month: "Mar", budget: 25000000, actual: 25000000 },
      { month: "Apr", budget: 23000000, actual: 23000000 },
      { month: "May", budget: 23000000, actual: 23000000 },
      { month: "Jun", budget: 27000000, actual: 27000000 },
      { month: "Jul", budget: 11000000, actual: 10000000 },
      { month: "Aug", budget: 11000000, actual: 9000000 },
      { month: "Sep", budget: 11000000, actual: 8000000 },
      { month: "Oct", budget: 11000000, actual: 7000000 },
      { month: "Nov", budget: 11000000, actual: 3500000 },
      { month: "Dec", budget: 14000000, actual: 3000000 },
    ],
    quarterly: [
      { quarter: "Q1", budget: 65000000, actual: 64500000 },
      { quarter: "Q2", budget: 73000000, actual: 73000000 },
      { quarter: "Q3", budget: 33000000, actual: 27000000 },
      { quarter: "Q4", budget: 36000000, actual: 13500000 },
    ],
    divisionUtilization: [
      { division: "Marketing", budget: 216000000, actual: 178000000, utilization: 82.4 },
    ],
    topActivities: [
      { activity: "Google Ads Campaign", actual: 108000000 },
      { activity: "Social Media Management", actual: 67000000 },
      { activity: "Content Marketing", actual: 3000000 },
    ],
    riskAlerts: [
      {
        id: "2",
        activity: "Google Ads Campaign",
        division: "Marketing",
        budget: 108000000,
        actual: 108000000,
        utilization: 100,
        status: "warning" as const,
      },
      {
        id: "3",
        activity: "Social Media Management",
        division: "Marketing",
        budget: 67000000,
        actual: 65000000,
        utilization: 97.0,
        status: "warning" as const,
      },
    ],
    totalBudget: 216000000,
    totalActual: 178000000,
  },
  HR: {
    monthlyTrend: [
      { month: "Jan", budget: 12000000, actual: 12000000 },
      { month: "Feb", budget: 0, actual: 0 },
      { month: "Mar", budget: 25000000, actual: 25000000 },
      { month: "Apr", budget: 0, actual: 0 },
      { month: "May", budget: 0, actual: 0 },
      { month: "Jun", budget: 25000000, actual: 25000000 },
      { month: "Jul", budget: 12000000, actual: 12000000 },
      { month: "Aug", budget: 0, actual: 0 },
      { month: "Sep", budget: 25000000, actual: 21000000 },
      { month: "Oct", budget: 0, actual: 0 },
      { month: "Nov", budget: 0, actual: 0 },
      { month: "Dec", budget: 25000000, actual: 0 },
    ],
    quarterly: [
      { quarter: "Q1", budget: 37000000, actual: 37000000 },
      { quarter: "Q2", budget: 25000000, actual: 25000000 },
      { quarter: "Q3", budget: 37000000, actual: 33000000 },
      { quarter: "Q4", budget: 25000000, actual: 0 },
    ],
    divisionUtilization: [
      { division: "HR", budget: 124000000, actual: 95000000, utilization: 76.6 },
    ],
    topActivities: [
      { activity: "Employee Training Program", actual: 71000000 },
      { activity: "Recruitment Platform", actual: 24000000 },
    ],
    riskAlerts: [],
    totalBudget: 124000000,
    totalActual: 95000000,
  },
  Operations: {
    monthlyTrend: [
      { month: "Jan", budget: 2000000, actual: 2150000 },
      { month: "Feb", budget: 2000000, actual: 2000000 },
      { month: "Mar", budget: 2500000, actual: 2500000 },
      { month: "Apr", budget: 2000000, actual: 2000000 },
      { month: "May", budget: 2000000, actual: 2000000 },
      { month: "Jun", budget: 2500000, actual: 2500000 },
      { month: "Jul", budget: 2000000, actual: 2000000 },
      { month: "Aug", budget: 2000000, actual: 1500000 },
      { month: "Sep", budget: 2500000, actual: 2000000 },
      { month: "Oct", budget: 2000000, actual: 1500000 },
      { month: "Nov", budget: 2000000, actual: 0 },
      { month: "Dec", budget: 3000000, actual: 0 },
    ],
    quarterly: [
      { quarter: "Q1", budget: 6500000, actual: 6650000 },
      { quarter: "Q2", budget: 6500000, actual: 6500000 },
      { quarter: "Q3", budget: 6500000, actual: 5500000 },
      { quarter: "Q4", budget: 7000000, actual: 1500000 },
    ],
    divisionUtilization: [
      { division: "Operations", budget: 95000000, actual: 72000000, utilization: 75.8 },
    ],
    topActivities: [
      { activity: "Office Supplies", actual: 20150000 },
      { activity: "Facility Management", actual: 51850000 },
    ],
    riskAlerts: [],
    totalBudget: 95000000,
    totalActual: 72000000,
  },
  Finance: {
    monthlyTrend: [
      { month: "Jan", budget: 3500000, actual: 3500000 },
      { month: "Feb", budget: 730000, actual: 0 },
      { month: "Mar", budget: 730000, actual: 700000 },
      { month: "Apr", budget: 0, actual: 0 },
      { month: "May", budget: 0, actual: 0 },
      { month: "Jun", budget: 0, actual: 0 },
      { month: "Jul", budget: 500000, actual: 500000 },
      { month: "Aug", budget: 500000, actual: 500000 },
      { month: "Sep", budget: 6500000, actual: 3330000 },
      { month: "Oct", budget: 0, actual: 0 },
      { month: "Nov", budget: 0, actual: 0 },
      { month: "Dec", budget: 3500000, actual: 0 },
    ],
    quarterly: [
      { quarter: "Q1", budget: 4960000, actual: 4200000 },
      { quarter: "Q2", budget: 0, actual: 0 },
      { quarter: "Q3", budget: 7500000, actual: 4330000 },
      { quarter: "Q4", budget: 3500000, actual: 0 },
    ],
    divisionUtilization: [
      { division: "Finance", budget: 12500000, actual: 8530000, utilization: 68.2 },
    ],
    topActivities: [
      { activity: "Accounting Software", actual: 7000000 },
      { activity: "Audit Services", actual: 1530000 },
    ],
    riskAlerts: [],
    totalBudget: 12500000,
    totalActual: 8530000,
  },
};

export default function BudgetDashboard() {
  const [selectedYear, setSelectedYear] = useState<string>("2024");
  const [selectedDivision, setSelectedDivision] = useState<string>("All");
  const { currentRole } = useRole();
  const navigate = useNavigate();

  // Role guard - only Top Management can access
  useEffect(() => {
    if (currentRole !== "Top Management") {
      navigate("/");
    }
  }, [currentRole, navigate]);

  const years = ["2024", "2025", "2026"];
  const divisions = ["All", "IT", "Marketing", "HR", "Finance", "Operations"];

  // Get filtered data based on selection
  const filteredData = useMemo(() => {
    return fullDataset[selectedDivision as keyof typeof fullDataset];
  }, [selectedDivision]);

  // Calculate KPIs
  const totalBudget = filteredData.totalBudget;
  const totalActual = filteredData.totalActual;
  const remainingBudget = totalBudget - totalActual;
  const utilizationRate = ((totalActual / totalBudget) * 100).toFixed(1);
  const atRiskCount = filteredData.riskAlerts.length;

  // Calculate average monthly burn rate (last 3 months)
  const recentMonths = filteredData.monthlyTrend.slice(-3);
  const avgBurnRate =
    recentMonths.reduce((sum, month) => sum + month.actual, 0) / recentMonths.length;

  const budgetDistributionData = [
    { name: "Used", value: totalActual, color: "#6CC7C3" },
    { name: "Remaining", value: remainingBudget, color: "#F6D400" },
  ];

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `Rp ${(value / 1000000000).toFixed(1)}B`;
    }
    if (value >= 1000000) {
      return `Rp ${(value / 1000000).toFixed(0)}M`;
    }
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatCurrencyFull = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Only show if Top Management
  if (currentRole !== "Top Management") {
    return null;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-gray-600">
          Strategic overview of budget planning and actual spending performance
        </p>
        <div className="flex gap-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC7C3]"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-gray-500" />
            <select
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC7C3]"
            >
              {divisions.map((div) => (
                <option key={div} value={div}>
                  {div}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <KPICard
          title="Total Budget"
          value={formatCurrency(totalBudget)}
          icon={<DollarSign className="w-6 h-6" />}
          color="#6CC7C3"
        />
        <KPICard
          title="Realisasi Budget"
          value={formatCurrency(totalActual)}
          change={`${utilizationRate}% of budget`}
          changeType="neutral"
          icon={<Activity className="w-6 h-6" />}
          color="#6CC7C3"
        />
        <KPICard
          title="Sisa Anggaran"
          value={formatCurrency(remainingBudget)}
          icon={<DollarSign className="w-6 h-6" />}
          color="#F6D400"
        />
        <KPICard
          title="Tingkat Pemakaian Anggaran"
          value={`${utilizationRate}%`}
          change={parseFloat(utilizationRate) > 90 ? "High usage" : "On track"}
          changeType={parseFloat(utilizationRate) > 90 ? "negative" : "positive"}
          icon={<TrendingUp className="w-6 h-6" />}
          color="#9BC53D"
        />
        <KPICard
          title="Rata-rata Pengeluaran Bulanan"
          value={formatCurrency(avgBurnRate)}
          change="per month (3M avg)"
          changeType="neutral"
          icon={<Flame className="w-6 h-6" />}
          color="#F26C8A"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Budget vs Actual Trend */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-sm text-gray-900 mb-4">
            Budget vs Actual Trend
            {selectedDivision !== "All" && (
              <span className="ml-2 text-xs text-gray-500">
                ({selectedDivision})
              </span>
            )}
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={filteredData.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${value / 1000000}M`}
              />
              <Tooltip
                formatter={(value: number) => formatCurrencyFull(value)}
                contentStyle={{
                  fontSize: "12px",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Line
                type="monotone"
                dataKey="budget"
                stroke="#6CC7C3"
                strokeWidth={2}
                name="Budget"
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#F26C8A"
                strokeWidth={2}
                name="Actual"
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Quarterly Budget vs Actual */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-sm text-gray-900 mb-4">
            Quarterly Performance
            {selectedDivision !== "All" && (
              <span className="ml-2 text-xs text-gray-500">
                ({selectedDivision})
              </span>
            )}
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={filteredData.quarterly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="quarter" tick={{ fontSize: 12 }} />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${value / 1000000}M`}
              />
              <Tooltip
                formatter={(value: number) => formatCurrencyFull(value)}
                contentStyle={{
                  fontSize: "12px",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar dataKey="budget" fill="#6CC7C3" name="Budget" radius={[4, 4, 0, 0]} />
              <Bar dataKey="actual" fill="#F26C8A" name="Actual" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Division Utilization */}
        <div className="col-span-2 bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-sm text-gray-900 mb-4">
            {selectedDivision === "All"
              ? "Budget Utilization by Division"
              : `${selectedDivision} Division Utilization`}
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={filteredData.divisionUtilization} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="division" type="category" tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: number, name: string) => {
                  if (name === "utilization") return `${value}%`;
                  return formatCurrencyFull(value);
                }}
                contentStyle={{
                  fontSize: "12px",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar dataKey="budget" fill="#6CC7C3" name="Budget" radius={[0, 4, 4, 0]} />
              <Bar dataKey="actual" fill="#F26C8A" name="Actual" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Budget Distribution Donut */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-sm text-gray-900 mb-4">Budget Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={budgetDistributionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
                label={(entry) => `${((entry.value / totalBudget) * 100).toFixed(1)}%`}
                labelLine={false}
              >
                {budgetDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => formatCurrencyFull(value)}
                contentStyle={{
                  fontSize: "12px",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 3 */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Top Cost Activities */}
        <div className="col-span-2 bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-sm text-gray-900 mb-4">
            Top Cost Activities
            {selectedDivision !== "All" && (
              <span className="ml-2 text-xs text-gray-500">
                ({selectedDivision})
              </span>
            )}
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={filteredData.topActivities} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                type="number"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${value / 1000000}M`}
              />
              <YAxis dataKey="activity" type="category" tick={{ fontSize: 12 }} width={140} />
              <Tooltip
                formatter={(value: number) => formatCurrencyFull(value)}
                contentStyle={{
                  fontSize: "12px",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                }}
              />
              <Bar dataKey="actual" fill="#F6D400" name="Actual Spending" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Risk & Alerts */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-sm text-gray-900 mb-4">Risk & Alerts</h3>
          <div className="space-y-3">
            {filteredData.riskAlerts.length > 0 ? (
              filteredData.riskAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border ${
                    alert.status === "danger"
                      ? "bg-red-50 border-red-200"
                      : "bg-yellow-50 border-yellow-200"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <AlertTriangle
                      className={`w-4 h-4 mt-0.5 ${
                        alert.status === "danger" ? "text-red-600" : "text-yellow-600"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-900 mb-0.5">
                        {alert.activity}
                      </p>
                      <p className="text-xs text-gray-600 mb-1">{alert.division}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">
                          {formatCurrency(alert.actual)} / {formatCurrency(alert.budget)}
                        </span>
                        <span
                          className={`font-medium ${
                            alert.status === "danger" ? "text-red-700" : "text-yellow-700"
                          }`}
                        >
                          {alert.utilization}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div
                  className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#9BC53D15" }}
                >
                  <TrendingUp className="w-6 h-6" style={{ color: "#9BC53D" }} />
                </div>
                <p className="text-xs text-gray-600">All budgets are on track</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Insights Section */}
      <div className="bg-gradient-to-r from-[#6CC7C315] to-[#F6D40015] border border-gray-200 rounded-lg p-6">
        <h3 className="text-sm text-gray-900 mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" style={{ color: "#6CC7C3" }} />
          Key Insights
          {selectedDivision !== "All" && (
            <span className="text-xs text-gray-500">
              ({selectedDivision} Division)
            </span>
          )}
        </h3>
        <div className="space-y-2 text-sm text-gray-700">
          {selectedDivision === "All" ? (
            <>
              <p>
                • Overall budget utilization is at <strong>{utilizationRate}%</strong> which is healthy
                for this time of year.
              </p>
              <p>
                • <strong>IT Division</strong> has the highest utilization rate at{" "}
                <strong>85.8%</strong>, primarily driven by cloud infrastructure costs.
              </p>
              <p>
                • <strong>AWS Cloud Services</strong> has exceeded budget by{" "}
                <strong>1.4%</strong> and requires immediate attention.
              </p>
              <p>
                • Q4 actual spending is tracking lower than planned, indicating potential
                budget reallocation opportunities.
              </p>
              <p>
                • Monthly burn rate has decreased in recent months, suggesting improved cost
                control measures.
              </p>
            </>
          ) : selectedDivision === "IT" ? (
            <>
              <p>
                • IT Division utilization is at <strong>{utilizationRate}%</strong>, higher than company average.
              </p>
              <p>
                • <strong>AWS Cloud Services</strong> has exceeded budget allocation and requires cost optimization.
              </p>
              <p>
                • Cloud infrastructure costs dominate the spending, accounting for majority of the budget.
              </p>
              <p>
                • Q4 spending is below plan, indicating potential for infrastructure upgrades or carry-over.
              </p>
            </>
          ) : selectedDivision === "Marketing" ? (
            <>
              <p>
                • Marketing Division utilization is at <strong>{utilizationRate}%</strong>.
              </p>
              <p>
                • <strong>Google Ads Campaign</strong> has reached 100% of allocated budget.
              </p>
              <p>
                • Digital advertising campaigns in H1 performed well, H2 shows reduced spending.
              </p>
              <p>
                • Social media management is near budget limit at 97%, close monitoring required.
              </p>
            </>
          ) : selectedDivision === "HR" ? (
            <>
              <p>
                • HR Division utilization is at <strong>{utilizationRate}%</strong>.
              </p>
              <p>
                • Quarterly training programs show consistent execution pattern.
              </p>
              <p>
                • Q4 training budget is unspent, suggesting potential schedule adjustment.
              </p>
              <p>
                • Recruitment platform investment concentrated in H1 as planned.
              </p>
            </>
          ) : selectedDivision === "Operations" ? (
            <>
              <p>
                • Operations Division utilization is at <strong>{utilizationRate}%</strong>.
              </p>
              <p>
                • Office supplies spending is consistent and predictable.
              </p>
              <p>
                • Q4 shows lower spending which may indicate procurement delays.
              </p>
              <p>
                • Overall spending pattern is healthy with no major concerns.
              </p>
            </>
          ) : (
            <>
              <p>
                • Finance Division utilization is at <strong>{utilizationRate}%</strong>.
              </p>
              <p>
                • Accounting software renewal completed in Q1 as scheduled.
              </p>
              <p>
                • Spending is concentrated in specific periods aligned with renewal cycles.
              </p>
              <p>
                • No budget overruns detected, all spending within planned allocations.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}