import { useState } from "react";
import { Upload, Plus, Download, Calendar, Building2, Tag, X, FileUp } from "lucide-react";
import { useRole } from "../contexts/role-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

interface ActualBudgetData {
  id: string;
  year: number;
  division: string;
  activity: string;
  month: string;
  actualAmount: number;
  description: string;
  inputBy: string;
  inputDate: string;
  source: "Upload" | "Manual";
}

export default function ActualBudget() {
  const { currentRole } = useRole();

  const [selectedYear, setSelectedYear] = useState<string>("2024");
  const [selectedDivision, setSelectedDivision] = useState<string>("All");
  const [selectedActivity, setSelectedActivity] = useState<string>("All");

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Manual form state
  const [manualForm, setManualForm] = useState({
    year: "2024",
    division: "",
    activity: "",
    month: "",
    actualAmount: "",
    description: "",
  });

  const canInput = currentRole === "Admin" || currentRole === "Finance" || currentRole === "Divisi User" || currentRole === "Divisi Sales Komersial";

  // Mock data
  const actualBudgetData: ActualBudgetData[] = [
    {
      id: "1",
      year: 2024,
      division: "IT",
      activity: "Digital Ocean",
      month: "Jan",
      actualAmount: 1450000,
      description: "Server hosting January",
      inputBy: "John Doe (Finance)",
      inputDate: "2024-02-05",
      source: "Upload",
    },
    {
      id: "2",
      year: 2024,
      division: "IT",
      activity: "Digital Ocean",
      month: "Feb",
      actualAmount: 1500000,
      description: "Server hosting February",
      inputBy: "John Doe (Finance)",
      inputDate: "2024-03-05",
      source: "Upload",
    },
    {
      id: "3",
      year: 2024,
      division: "IT",
      activity: "CloudLinux Imunify360",
      month: "Jan",
      actualAmount: 230000,
      description: "License renewal Q1",
      inputBy: "Admin User",
      inputDate: "2024-02-10",
      source: "Manual",
    },
    {
      id: "4",
      year: 2024,
      division: "IT",
      activity: "HRIS",
      month: "Jan",
      actualAmount: 4200000,
      description: "System renewal and maintenance",
      inputBy: "IT Manager",
      inputDate: "2024-02-15",
      source: "Manual",
    },
    {
      id: "5",
      year: 2024,
      division: "Marketing",
      activity: "Google Ads Campaign",
      month: "Jan",
      actualAmount: 14500000,
      description: "Q1 campaign - brand awareness",
      inputBy: "Jane Smith (Marketing)",
      inputDate: "2024-02-08",
      source: "Upload",
    },
    {
      id: "6",
      year: 2024,
      division: "Marketing",
      activity: "Social Media Management",
      month: "Jan",
      actualAmount: 5000000,
      description: "Monthly retainer - January",
      inputBy: "Jane Smith (Marketing)",
      inputDate: "2024-02-08",
      source: "Upload",
    },
    {
      id: "7",
      year: 2024,
      division: "HR",
      activity: "Recruitment Platform",
      month: "Jan",
      actualAmount: 12000000,
      description: "Jobstreet annual subscription",
      inputBy: "HR Manager",
      inputDate: "2024-02-12",
      source: "Manual",
    },
    {
      id: "8",
      year: 2024,
      division: "Operations",
      activity: "Office Supplies",
      month: "Jan",
      actualAmount: 2150000,
      description: "Monthly office supplies purchase",
      inputBy: "Operations Manager",
      inputDate: "2024-02-06",
      source: "Upload",
    },
    {
      id: "9",
      year: 2024,
      division: "Sales Komersial",
      activity: "CRM System",
      month: "Jan",
      actualAmount: 25000000,
      description: "Salesforce annual subscription payment",
      inputBy: "Sales Manager",
      inputDate: "2024-02-08",
      source: "Upload",
    },
  ];

  const years = ["2024", "2025", "2026"];
  const divisions = ["All", "IT", "Marketing", "HR", "Finance", "Operations", "Sales Komersial"];
  const activities = ["All", "Digital Ocean", "CloudLinux Imunify360", "HRIS", "AWS Cloud Services", "Google Ads Campaign", "Social Media Management", "CRM System"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Filter data
  const getFilteredData = () => {
    let filtered = actualBudgetData;

    if (selectedYear !== "All") {
      filtered = filtered.filter((item) => item.year.toString() === selectedYear);
    }

    if (selectedDivision !== "All") {
      filtered = filtered.filter((item) => item.division === selectedDivision);
    }

    if (selectedActivity !== "All") {
      filtered = filtered.filter((item) => item.activity === selectedActivity);
    }

    // Role-based filtering
    if (currentRole === "Divisi User") {
      filtered = filtered.filter((item) => item.division === "IT");
    } else if (currentRole === "Divisi Sales Komersial") {
      filtered = filtered.filter((item) => item.division === "Sales Komersial");
    }

    return filtered;
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

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleDownloadTemplate = () => {
    const templateData = [
      ["INSTRUCTIONS:"],
      ["- Do not change column names or order"],
      ["- Activity must match Budget data exactly"],
      ["- Month must be: Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec"],
      ["- One row = one actual transaction"],
      ["- Duplicate Month for same activity will replace existing data"],
      [""],
      ["Year", "Division", "Activity", "Month", "Actual Amount", "Description"],
      [2024, "IT", "Digital Ocean", "Jan", 1450000, "Server hosting January"],
      [2024, "IT", "CloudLinux Imunify360", "Jan", 230000, "License renewal Q1"],
      [2024, "Marketing", "Google Ads Campaign", "Feb", "", ""],
    ];

    const csvContent = templateData.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", "actual_budget_template.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUploadSubmit = () => {
    if (uploadedFile) {
      console.log("Uploading file:", uploadedFile.name);
      setShowUploadModal(false);
      setUploadedFile(null);
    }
  };

  const handleManualSubmit = () => {
    console.log("Manual form data:", manualForm);
    setShowManualModal(false);
    setManualForm({
      year: "2024",
      division: "",
      activity: "",
      month: "",
      actualAmount: "",
      description: "",
    });
  };

  const filteredData = getFilteredData();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-gray-600">
          {currentRole === "Top Management"
            ? "View actual spending data and compare with budget"
            : "Track actual spending against planned budget"}
        </p>
        {canInput && (
          <div className="flex gap-2">
            <button
              onClick={() => setShowManualModal(true)}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Manual Actual
            </button>
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 rounded-md text-gray-900 transition-opacity hover:opacity-90 flex items-center gap-2"
              style={{ backgroundColor: "#F6D400" }}
            >
              <Upload className="w-4 h-4" />
              Upload Actual
            </button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
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
            <div className="flex items-center gap-2">
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

          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-gray-500" />
            <select
              value={selectedActivity}
              onChange={(e) => setSelectedActivity(e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC7C3]"
            >
              {activities.map((activity) => (
                <option key={activity} value={activity}>
                  {activity}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      {filteredData.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                    Year
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                    Division
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 min-w-[200px]">
                    Activity / Item
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                    Month
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 min-w-[140px]">
                    Actual Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 min-w-[250px]">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                    Source
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 min-w-[150px]">
                    Input By
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                    Input Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900">{row.year}</td>
                    <td className="px-4 py-3 text-gray-900">{row.division}</td>
                    <td className="px-4 py-3 text-gray-900">{row.activity}</td>
                    <td className="px-4 py-3 text-gray-700">
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                        {row.month}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900 font-medium">
                      {formatCurrency(row.actualAmount)}
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">
                      {row.description}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          row.source === "Upload"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-green-50 text-green-700"
                        }`}
                      >
                        {row.source}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700 text-xs">
                      {row.inputBy}
                    </td>
                    <td className="px-4 py-3 text-gray-700 text-xs">
                      {formatDate(row.inputDate)}
                    </td>
                  </tr>
                ))}
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
            <FileUp className="w-8 h-8" style={{ color: "#6CC7C3" }} />
          </div>
          <h3 className="text-base text-gray-900 mb-2">
            No actual budget data available yet
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            {canInput
              ? "Upload an Excel file or add actual data manually"
              : "No actual data has been entered yet"}
          </p>
          {canInput && (
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setShowManualModal(true)}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Manual Actual
              </button>
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-4 py-2 rounded-md text-gray-900 transition-opacity hover:opacity-90 inline-flex items-center gap-2"
                style={{ backgroundColor: "#F6D400" }}
              >
                <Upload className="w-4 h-4" />
                Upload Actual
              </button>
            </div>
          )}
        </div>
      )}

      {/* Upload Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Upload Actual Budget</DialogTitle>
            <DialogDescription>
              Upload actual spending data based on existing budget activities.
              The system will validate the data before processing.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? "border-[#6CC7C3] bg-[#6CC7C315]"
                  : "border-gray-300 bg-gray-50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {uploadedFile ? (
                <div className="space-y-2">
                  <FileUp className="w-12 h-12 mx-auto" style={{ color: "#6CC7C3" }} />
                  <p className="text-sm text-gray-900 font-medium">
                    {uploadedFile.name}
                  </p>
                  <button
                    onClick={() => setUploadedFile(null)}
                    className="text-xs text-gray-600 hover:text-gray-900 underline"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-sm text-gray-900 mb-1">
                    Drag and drop your Excel file here
                  </p>
                  <p className="text-xs text-gray-600 mb-4">or</p>
                  <label className="cursor-pointer">
                    <span className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100 inline-block">
                      Browse Files
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept=".xlsx,.xls,.csv"
                      onChange={handleFileChange}
                    />
                  </label>
                </>
              )}
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-gray-900 font-medium mb-2">
                Validation Notes:
              </p>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• Activity must match existing Budget data exactly</li>
                <li>• Month must be Jan–Dec</li>
                <li>• Duplicate entries will replace existing data</li>
              </ul>
            </div>

            <button
              onClick={handleDownloadTemplate}
              className="mt-4 flex items-center gap-2 px-3 py-2 text-xs border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Download className="w-3 h-3" />
              Download Template
            </button>
          </div>

          <DialogFooter>
            <button
              onClick={() => {
                setShowUploadModal(false);
                setUploadedFile(null);
              }}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleUploadSubmit}
              disabled={!uploadedFile}
              className="px-4 py-2 text-sm rounded-md text-gray-900 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#F6D400" }}
            >
              Upload
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manual Input Modal */}
      <Dialog open={showManualModal} onOpenChange={setShowManualModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Manual Actual</DialogTitle>
            <DialogDescription>
              Enter actual spending data for an existing budget activity.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Select
                value={manualForm.year}
                onValueChange={(value) =>
                  setManualForm({ ...manualForm, year: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="division">Division</Label>
              <Select
                value={manualForm.division}
                onValueChange={(value) =>
                  setManualForm({ ...manualForm, division: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select division" />
                </SelectTrigger>
                <SelectContent>
                  {divisions.filter(d => d !== "All").map((div) => (
                    <SelectItem key={div} value={div}>
                      {div}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="activity">Activity</Label>
              <Select
                value={manualForm.activity}
                onValueChange={(value) =>
                  setManualForm({ ...manualForm, activity: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select activity from budget" />
                </SelectTrigger>
                <SelectContent>
                  {activities.filter(a => a !== "All").map((activity) => (
                    <SelectItem key={activity} value={activity}>
                      {activity}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-600">
                Only activities with existing budget are shown
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="month">Month</Label>
              <Select
                value={manualForm.month}
                onValueChange={(value) =>
                  setManualForm({ ...manualForm, month: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Actual Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0"
                value={manualForm.actualAmount}
                onChange={(e) =>
                  setManualForm({ ...manualForm, actualAmount: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                rows={3}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC7C3]"
                placeholder="Enter description..."
                value={manualForm.description}
                onChange={(e) =>
                  setManualForm({ ...manualForm, description: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <button
              onClick={() => {
                setShowManualModal(false);
                setManualForm({
                  year: "2024",
                  division: "",
                  activity: "",
                  month: "",
                  actualAmount: "",
                  description: "",
                });
              }}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleManualSubmit}
              disabled={
                !manualForm.division ||
                !manualForm.activity ||
                !manualForm.month ||
                !manualForm.actualAmount
              }
              className="px-4 py-2 text-sm rounded-md text-gray-900 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#F6D400" }}
            >
              Save Actual
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}