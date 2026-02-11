import { useState } from "react";
import { Upload, Download, Calendar, Building2 } from "lucide-react";
import { useRole } from "../contexts/role-context";
import { useNavigate } from "react-router";

interface BudgetData {
  id: string;
  year: number;
  division: string;
  activity: string;
  description: string;
  jan: number;
  feb: number;
  mar: number;
  apr: number;
  may: number;
  jun: number;
  jul: number;
  aug: number;
  sep: number;
  oct: number;
  nov: number;
  dec: number;
  uploadedBy: string;
  uploadedDate: string;
}

export default function Budgeting() {
  const { currentRole } = useRole();
  const navigate = useNavigate();

  const [selectedYear, setSelectedYear] = useState<string>("2024");
  const [selectedDivision, setSelectedDivision] = useState<string>("All");

  const canUpload = currentRole === "Admin" || currentRole === "Finance" || currentRole === "Divisi User" || currentRole === "Divisi Sales Komersial";

  // Mock data
  const budgetData: BudgetData[] = [
    {
      id: "1",
      year: 2024,
      division: "IT",
      activity: "CloudLinux Imunify360",
      description: "Invoice akhir bulan",
      jan: 230000,
      feb: 0,
      mar: 0,
      apr: 0,
      may: 0,
      jun: 0,
      jul: 0,
      aug: 0,
      sep: 0,
      oct: 0,
      nov: 0,
      dec: 0,
      uploadedBy: "John Doe (Finance)",
      uploadedDate: "2024-01-15",
    },
    {
      id: "2",
      year: 2024,
      division: "IT",
      activity: "Digital Ocean",
      description: "Server Prod",
      jan: 1500000,
      feb: 1500000,
      mar: 1500000,
      apr: 1500000,
      may: 1500000,
      jun: 1500000,
      jul: 1500000,
      aug: 1500000,
      sep: 1500000,
      oct: 1500000,
      nov: 1500000,
      dec: 1500000,
      uploadedBy: "John Doe (Finance)",
      uploadedDate: "2024-01-15",
    },
    {
      id: "3",
      year: 2024,
      division: "IT",
      activity: "HRIS",
      description: "Exp Jan 2026",
      jan: 4000000,
      feb: 0,
      mar: 0,
      apr: 0,
      may: 0,
      jun: 0,
      jul: 0,
      aug: 0,
      sep: 0,
      oct: 0,
      nov: 0,
      dec: 0,
      uploadedBy: "Admin User",
      uploadedDate: "2024-01-17",
    },
    {
      id: "4",
      year: 2024,
      division: "IT",
      activity: "AWS Cloud Services",
      description: "Cloud infrastructure monthly",
      jan: 8500000,
      feb: 8500000,
      mar: 8500000,
      apr: 9000000,
      may: 9000000,
      jun: 9000000,
      jul: 9500000,
      aug: 9500000,
      sep: 9500000,
      oct: 10000000,
      nov: 10000000,
      dec: 10000000,
      uploadedBy: "John Doe (Finance)",
      uploadedDate: "2024-01-15",
    },
    {
      id: "5",
      year: 2024,
      division: "Marketing",
      activity: "Google Ads Campaign",
      description: "Digital marketing Q1-Q2",
      jan: 15000000,
      feb: 15000000,
      mar: 20000000,
      apr: 18000000,
      may: 18000000,
      jun: 22000000,
      jul: 0,
      aug: 0,
      sep: 0,
      oct: 0,
      nov: 0,
      dec: 0,
      uploadedBy: "Jane Smith (Marketing)",
      uploadedDate: "2024-01-16",
    },
    {
      id: "6",
      year: 2024,
      division: "Marketing",
      activity: "Social Media Management",
      description: "Monthly retainer fee",
      jan: 5000000,
      feb: 5000000,
      mar: 5000000,
      apr: 5000000,
      may: 5000000,
      jun: 5000000,
      jul: 6000000,
      aug: 6000000,
      sep: 6000000,
      oct: 6000000,
      nov: 6000000,
      dec: 6000000,
      uploadedBy: "Jane Smith (Marketing)",
      uploadedDate: "2024-01-16",
    },
    {
      id: "7",
      year: 2024,
      division: "HR",
      activity: "Employee Training Program",
      description: "Quarterly training sessions",
      jan: 0,
      feb: 0,
      mar: 25000000,
      apr: 0,
      may: 0,
      jun: 25000000,
      jul: 0,
      aug: 0,
      sep: 25000000,
      oct: 0,
      nov: 0,
      dec: 25000000,
      uploadedBy: "HR Manager",
      uploadedDate: "2024-01-18",
    },
    {
      id: "8",
      year: 2024,
      division: "HR",
      activity: "Recruitment Platform",
      description: "Annual subscription Jobstreet",
      jan: 12000000,
      feb: 0,
      mar: 0,
      apr: 0,
      may: 0,
      jun: 0,
      jul: 12000000,
      aug: 0,
      sep: 0,
      oct: 0,
      nov: 0,
      dec: 0,
      uploadedBy: "HR Manager",
      uploadedDate: "2024-01-18",
    },
    {
      id: "9",
      year: 2024,
      division: "Finance",
      activity: "Accounting Software",
      description: "Accurate license renewal",
      jan: 3500000,
      feb: 0,
      mar: 0,
      apr: 0,
      may: 0,
      jun: 0,
      jul: 0,
      aug: 0,
      sep: 0,
      oct: 0,
      nov: 0,
      dec: 0,
      uploadedBy: "Finance Head",
      uploadedDate: "2024-01-20",
    },
    {
      id: "10",
      year: 2024,
      division: "Operations",
      activity: "Office Supplies",
      description: "Monthly office supplies",
      jan: 2000000,
      feb: 2000000,
      mar: 2500000,
      apr: 2000000,
      may: 2000000,
      jun: 2500000,
      jul: 2000000,
      aug: 2000000,
      sep: 2500000,
      oct: 2000000,
      nov: 2000000,
      dec: 3000000,
      uploadedBy: "Operations Manager",
      uploadedDate: "2024-01-19",
    },
    {
      id: "11",
      year: 2024,
      division: "Sales Komersial",
      activity: "Sales Team Incentive",
      description: "Quarterly sales team bonus",
      jan: 0,
      feb: 0,
      mar: 50000000,
      apr: 0,
      may: 0,
      jun: 55000000,
      jul: 0,
      aug: 0,
      sep: 60000000,
      oct: 0,
      nov: 0,
      dec: 65000000,
      uploadedBy: "Sales Manager",
      uploadedDate: "2024-01-21",
    },
    {
      id: "12",
      year: 2024,
      division: "Sales Komersial",
      activity: "CRM System",
      description: "Salesforce annual subscription",
      jan: 25000000,
      feb: 0,
      mar: 0,
      apr: 0,
      may: 0,
      jun: 0,
      jul: 25000000,
      aug: 0,
      sep: 0,
      oct: 0,
      nov: 0,
      dec: 0,
      uploadedBy: "Sales Manager",
      uploadedDate: "2024-01-21",
    },
  ];

  const years = ["2024", "2025", "2026"];
  const divisions = ["All", "IT", "Marketing", "HR", "Finance", "Operations", "Sales Komersial"];

  // Filter data based on role
  const getFilteredData = () => {
    let filtered = budgetData;

    // Filter by selected year
    if (selectedYear !== "All") {
      filtered = filtered.filter((item) => item.year.toString() === selectedYear);
    }

    // Filter by selected division
    if (selectedDivision !== "All") {
      filtered = filtered.filter((item) => item.division === selectedDivision);
    }

    // Role-based filtering
    if (currentRole === "Divisi User") {
      // In real app, this would filter by user's division
      filtered = filtered.filter((item) => item.division === "IT");
    } else if (currentRole === "Divisi Sales Komersial") {
      // Sales Komersial can only see their own division
      filtered = filtered.filter((item) => item.division === "Sales Komersial");
    }

    return filtered;
  };

  const calculateQuarterly = (data: BudgetData) => {
    const q1 = data.jan + data.feb + data.mar;
    const q2 = data.apr + data.may + data.jun;
    const q3 = data.jul + data.aug + data.sep;
    const q4 = data.oct + data.nov + data.dec;
    const total = q1 + q2 + q3 + q4;
    return { q1, q2, q3, q4, total };
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const filteredData = getFilteredData();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-gray-600">
          {currentRole === "Top Management"
            ? "View budgeting data and analytics"
            : "Manage annual budget data by division"}
        </p>
        {canUpload && (
          <button
            onClick={() => navigate("/budgeting/upload")}
            className="px-4 py-2 rounded-md text-gray-900 transition-opacity hover:opacity-90 flex items-center gap-2"
            style={{ backgroundColor: "#F6D400" }}
          >
            <Upload className="w-4 h-4" />
            Upload Budget
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 flex-1">
            <Calendar className="w-4 h-4 text-gray-500" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC7C3]"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {currentRole !== "Divisi User" && currentRole !== "Divisi Sales Komersial" && (
            <div className="flex items-center gap-2 flex-1">
              <Building2 className="w-4 h-4 text-gray-500" />
              <select
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC7C3]"
              >
                {divisions.map((div) => (
                  <option key={div} value={div}>
                    {div}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Data Table */}
      {filteredData.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 sticky left-0 bg-gray-50 z-10 border-r border-gray-200">
                    Year
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 sticky left-16 bg-gray-50 z-10 border-r border-gray-200">
                    Division
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 min-w-[200px]">
                    Activity / Item
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 min-w-[250px] border-r-2 border-gray-300">
                    Description
                  </th>
                  {/* Q1 */}
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 bg-blue-50 min-w-[120px]">
                    Jan
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 bg-blue-50 min-w-[120px]">
                    Feb
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 bg-blue-50 min-w-[120px]">
                    Mar
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-900 bg-blue-100 border-l-2 border-r-2 border-blue-300 min-w-[120px]">
                    Q1
                  </th>
                  {/* Q2 */}
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 bg-green-50 min-w-[120px]">
                    Apr
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 bg-green-50 min-w-[120px]">
                    May
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 bg-green-50 min-w-[120px]">
                    Jun
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-900 bg-green-100 border-l-2 border-r-2 border-green-300 min-w-[120px]">
                    Q2
                  </th>
                  {/* Q3 */}
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 bg-amber-50 min-w-[120px]">
                    Jul
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 bg-amber-50 min-w-[120px]">
                    Aug
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 bg-amber-50 min-w-[120px]">
                    Sep
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-900 bg-amber-100 border-l-2 border-r-2 border-amber-300 min-w-[120px]">
                    Q3
                  </th>
                  {/* Q4 */}
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 bg-purple-50 min-w-[120px]">
                    Oct
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 bg-purple-50 min-w-[120px]">
                    Nov
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 bg-purple-50 min-w-[120px]">
                    Dec
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-900 bg-purple-100 border-l-2 border-r-2 border-purple-300 min-w-[120px]">
                    Q4
                  </th>
                  {/* Total & Meta */}
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-900 border-r-2 border-gray-300 min-w-[140px]">
                    Total Budget
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 min-w-[150px]">
                    Uploaded By
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 min-w-[120px]">
                    Uploaded Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.map((row) => {
                  const quarterly = calculateQuarterly(row);
                  return (
                    <tr key={row.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900 sticky left-0 bg-white border-r border-gray-200">
                        {row.year}
                      </td>
                      <td className="px-4 py-3 text-gray-900 sticky left-16 bg-white border-r border-gray-200">
                        {row.division}
                      </td>
                      <td className="px-4 py-3 text-gray-900">
                        {row.activity}
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs border-r-2 border-gray-300">
                        {row.description}
                      </td>
                      {/* Q1 */}
                      <td className="px-4 py-3 text-right text-gray-700 bg-blue-50">
                        {formatCurrency(row.jan)}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700 bg-blue-50">
                        {formatCurrency(row.feb)}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700 bg-blue-50">
                        {formatCurrency(row.mar)}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-900 font-medium bg-blue-100 border-l-2 border-r-2 border-blue-300">
                        {formatCurrency(quarterly.q1)}
                      </td>
                      {/* Q2 */}
                      <td className="px-4 py-3 text-right text-gray-700 bg-green-50">
                        {formatCurrency(row.apr)}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700 bg-green-50">
                        {formatCurrency(row.may)}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700 bg-green-50">
                        {formatCurrency(row.jun)}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-900 font-medium bg-green-100 border-l-2 border-r-2 border-green-300">
                        {formatCurrency(quarterly.q2)}
                      </td>
                      {/* Q3 */}
                      <td className="px-4 py-3 text-right text-gray-700 bg-amber-50">
                        {formatCurrency(row.jul)}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700 bg-amber-50">
                        {formatCurrency(row.aug)}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700 bg-amber-50">
                        {formatCurrency(row.sep)}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-900 font-medium bg-amber-100 border-l-2 border-r-2 border-amber-300">
                        {formatCurrency(quarterly.q3)}
                      </td>
                      {/* Q4 */}
                      <td className="px-4 py-3 text-right text-gray-700 bg-purple-50">
                        {formatCurrency(row.oct)}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700 bg-purple-50">
                        {formatCurrency(row.nov)}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700 bg-purple-50">
                        {formatCurrency(row.dec)}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-900 font-medium bg-purple-100 border-l-2 border-r-2 border-purple-300">
                        {formatCurrency(quarterly.q4)}
                      </td>
                      {/* Total & Meta */}
                      <td className="px-4 py-3 text-right font-bold text-gray-900 border-r-2 border-gray-300">
                        {formatCurrency(quarterly.total)}
                      </td>
                      <td className="px-4 py-3 text-gray-700 text-xs">{row.uploadedBy}</td>
                      <td className="px-4 py-3 text-gray-700 text-xs">
                        {formatDate(row.uploadedDate)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <div
            className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#6CC7C315" }}
          >
            <Download className="w-8 h-8" style={{ color: "#6CC7C3" }} />
          </div>
          <h3 className="text-base text-gray-900 mb-2">No Budget Data Available</h3>
          <p className="text-sm text-gray-600 mb-6">
            {canUpload
              ? "Upload your first budget file to get started"
              : "No budget data has been uploaded yet"}
          </p>
          {canUpload && (
            <button
              onClick={() => navigate("/budgeting/upload")}
              className="px-4 py-2 rounded-md text-gray-900 transition-opacity hover:opacity-90 inline-flex items-center gap-2"
              style={{ backgroundColor: "#F6D400" }}
            >
              <Upload className="w-4 h-4" />
              Upload Budget
            </button>
          )}
        </div>
      )}
    </div>
  );
}