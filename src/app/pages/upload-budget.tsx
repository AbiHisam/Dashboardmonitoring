import { useState, useRef, useEffect } from "react";
import { Upload, FileSpreadsheet, Download, X } from "lucide-react";
import { useNavigate } from "react-router";
import { useRole } from "../contexts/role-context";

export default function UploadBudget() {
  const navigate = useNavigate();
  const { currentRole } = useRole();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Redirect if user doesn't have upload permission
  useEffect(() => {
    if (currentRole === "Top Management") {
      navigate("/budgeting");
    }
  }, [currentRole, navigate]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].name.endsWith(".xlsx")) {
      setSelectedFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDownloadTemplate = () => {
    // Create Excel template data with new structure
    const templateData = [
      ["Year", "Division", "Activity", "Description", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      [2024, "IT", "Software Development", "Budget for software development projects", 50000000, 52000000, 48000000, 55000000, 53000000, 51000000, 60000000, 58000000, 62000000, 65000000, 63000000, 70000000],
      [2024, "IT", "Infrastructure Maintenance", "Budget for IT infrastructure and maintenance", "", "", "", "", "", "", "", "", "", "", "", ""],
      [2024, "Marketing", "Digital Marketing Campaigns", "Budget for online marketing activities", "", "", "", "", "", "", "", "", "", "", "", ""],
      [2024, "HR", "Employee Training", "Budget for training and development programs", "", "", "", "", "", "", "", "", "", "", "", ""],
    ];

    // Create CSV content
    const csvContent = templateData.map(row => row.join(",")).join("\n");
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", "budget_template.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    // Handle file upload logic here
    console.log("Uploading file:", selectedFile);
    navigate("/budgeting");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <p className="text-sm text-gray-600">
          Follow the steps below to upload your budget data
        </p>
      </div>

      {/* Instructions */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-lg text-gray-900 mb-4">Instructions</h2>
        <ol className="space-y-3 text-sm text-gray-700">
          <li className="flex items-start gap-3">
            <span
              className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs"
              style={{ backgroundColor: "#6CC7C315", color: "#6CC7C3" }}
            >
              1
            </span>
            <span>
              <span className="text-gray-900">Download the budget template</span> using
              the link below
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span
              className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs"
              style={{ backgroundColor: "#6CC7C315", color: "#6CC7C3" }}
            >
              2
            </span>
            <span>
              <span className="text-gray-900">Fill in your budget data</span> following the template format (Year, Division, Activity, Description, Jan-Dec)
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span
              className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs"
              style={{ backgroundColor: "#6CC7C315", color: "#6CC7C3" }}
            >
              3
            </span>
            <span>
              <span className="text-gray-900">Upload the completed Excel file</span>{" "}
              - Uploading same Year + Division + Activity will replace existing data
            </span>
          </li>
        </ol>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-gray-900 font-medium mb-2">Template Format:</p>
          <p className="text-xs text-gray-700">
            Year | Division | Activity | Description | Jan | Feb | Mar | Apr | May | Jun | Jul | Aug | Sep | Oct | Nov | Dec
          </p>
          <p className="text-xs text-gray-600 mt-2">
            <span className="text-gray-900">Note:</span> Q1-Q4 and Total Budget will be calculated automatically by the system
          </p>
        </div>

        <button
          onClick={handleDownloadTemplate}
          className="mt-6 flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download Budget Template
        </button>
      </div>

      {/* Upload Area */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg text-gray-900 mb-4">Upload Budget File</h2>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
            isDragging
              ? "border-[#6CC7C3] bg-[#6CC7C315]"
              : "border-gray-300 bg-gray-50"
          }`}
        >
          {!selectedFile ? (
            <>
              <div
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#6CC7C315" }}
              >
                <Upload className="w-8 h-8" style={{ color: "#6CC7C3" }} />
              </div>
              <h3 className="text-base text-gray-900 mb-2">
                Drag and drop your Excel file here
              </h3>
              <p className="text-sm text-gray-600 mb-4">or</p>
              <button
                onClick={handleBrowseClick}
                className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-white transition-colors"
              >
                Browse Files
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx"
                onChange={handleFileChange}
                className="hidden"
              />
              <p className="text-xs text-gray-500 mt-4">
                Accepted format: .xlsx | Maximum file size: 10 MB
              </p>
            </>
          ) : (
            <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div
                  className="p-2 rounded"
                  style={{ backgroundColor: "#6CC7C315" }}
                >
                  <FileSpreadsheet className="w-5 h-5" style={{ color: "#6CC7C3" }} />
                </div>
                <div className="text-left">
                  <p className="text-sm text-gray-900">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
              <button
                onClick={handleRemoveFile}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                title="Remove file"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 mt-6">
        <button
          onClick={() => navigate("/budgeting")}
          className="px-6 py-2.5 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleUpload}
          disabled={!selectedFile}
          className="px-6 py-2.5 text-sm text-gray-900 rounded-md transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          style={{ backgroundColor: "#F6D400" }}
        >
          <Upload className="w-4 h-4" />
          Upload Budget
        </button>
      </div>
    </div>
  );
}