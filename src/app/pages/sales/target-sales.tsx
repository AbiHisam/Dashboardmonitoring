import { useState } from "react";
import { Plus, Upload, Download, Search, Edit, Trash2, X, FileUp, Eye, ArrowLeft, Filter } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

interface ProductTarget {
  id: string;
  productName: string;
  sku: string;
  category: string;
  price: number;
  targetRevenue: number;
  targetOrder: number;
  targetUnit: number;
  dailyTarget: number;
  weeklyTarget: number;
}

interface TargetSalesData {
  id: string;
  month: string;
  year: string;
  brand: string;
  brandCode: string;
  salesChannel: string;
  totalTargetRevenue: number;
  totalTargetUnit: number;
  totalTargetOrder: number;
  products: ProductTarget[];
  createdBy: string;
  createdDate: string;
}

type ViewMode = "list" | "create" | "detail";

// Mock brand data
const brandOptions = [
  { code: "BRD001", name: "Gendes" },
  { code: "BRD002", name: "Kavela" },
  { code: "BRD003", name: "IM Man" },
  { code: "BRD004", name: "SYMS" },
];

// Mock product data per brand
const productsByBrand: Record<string, any[]> = {
  BRD001: [
    { id: "1", name: "Gendes foam chocolate", sku: "GEN-FCH-001", category: "Feminine Hygiene", price: 35000 },
    { id: "2", name: "GENDES Sweet Aromatic Feminine Hygiene Bubblegum Foam 55ml", sku: "GEN-SAF-002", category: "Feminine Hygiene", price: 42000 },
  ],
  BRD002: [
    { id: "3", name: "Mouth Spray Berry Mood 20 ml", sku: "KAV-MSB-001", category: "Mouth Care", price: 28000 },
    { id: "4", name: "Mouth Spray Lychee Love 20 ml", sku: "KAV-MSL-002", category: "Mouth Care", price: 28000 },
  ],
  BRD003: [
    { id: "5", name: "I'm Man Spray Fresh Lemon", sku: "IMM-SFL-001", category: "Men's Care", price: 32000 },
    { id: "6", name: "I'm Man Spray Splash Cola", sku: "IMM-SSC-002", category: "Men's Care", price: 32000 },
  ],
  BRD004: [
    { id: "7", name: "SYMS Hair Tonic Rosemary Foam 60 ml", sku: "SYM-HTR-001", category: "Hair Care", price: 48000 },
    { id: "8", name: "SYMS Hair Serum Rosemary Oil 30 ml", sku: "SYM-HSR-002", category: "Hair Care", price: 65000 },
  ],
};

const salesChannelOptions = ["Shopee", "Tokopedia", "TikTok Shop", "Offline"];
const monthOptions = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function TargetSales() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMonth, setFilterMonth] = useState("All");
  const [filterBrand, setFilterBrand] = useState("All");
  const [filterChannel, setFilterChannel] = useState("All");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState<TargetSalesData | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Form state for creating target sales
  const [targetForm, setTargetForm] = useState({
    month: "",
    year: "2026",
    brandCode: "",
    salesChannel: "",
  });

  const [productTargets, setProductTargets] = useState<ProductTarget[]>([]);

  // Mock data
  const mockTargetData: TargetSalesData[] = [
    {
      id: "1",
      month: "January",
      year: "2026",
      brand: "Gendes",
      brandCode: "BRD001",
      salesChannel: "Shopee",
      totalTargetRevenue: 150000000,
      totalTargetUnit: 4000,
      totalTargetOrder: 800,
      products: [
        {
          id: "1",
          productName: "Gendes foam chocolate",
          sku: "GEN-FCH-001",
          category: "Feminine Hygiene",
          price: 35000,
          targetRevenue: 70000000,
          targetOrder: 400,
          targetUnit: 2000,
          dailyTarget: 2258065,
          weeklyTarget: 17500000,
        },
        {
          id: "2",
          productName: "GENDES Sweet Aromatic Feminine Hygiene Bubblegum Foam 55ml",
          sku: "GEN-SAF-002",
          category: "Feminine Hygiene",
          price: 42000,
          targetRevenue: 80000000,
          targetOrder: 400,
          targetUnit: 2000,
          dailyTarget: 2580645,
          weeklyTarget: 20000000,
        },
      ],
      createdBy: "Sales Manager",
      createdDate: "2026-01-15",
    },
    {
      id: "2",
      month: "February",
      year: "2026",
      brand: "Kavela",
      brandCode: "BRD002",
      salesChannel: "TikTok Shop",
      totalTargetRevenue: 120000000,
      totalTargetUnit: 4500,
      totalTargetOrder: 900,
      products: [
        {
          id: "3",
          productName: "Mouth Spray Berry Mood 20 ml",
          sku: "KAV-MSB-001",
          category: "Mouth Care",
          price: 28000,
          targetRevenue: 60000000,
          targetOrder: 450,
          targetUnit: 2250,
          dailyTarget: 2142857,
          weeklyTarget: 15000000,
        },
      ],
      createdBy: "Sales Manager",
      createdDate: "2026-02-01",
    },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("id-ID").format(value);
  };

  const getDaysInMonth = (month: string, year: string) => {
    const monthIndex = monthOptions.indexOf(month);
    return new Date(parseInt(year), monthIndex + 1, 0).getDate();
  };

  const calculateDailyTarget = (revenue: number, month: string, year: string) => {
    const days = getDaysInMonth(month, year);
    return days > 0 ? revenue / days : 0;
  };

  const calculateWeeklyTarget = (revenue: number) => {
    return revenue / 4;
  };

  const handleProductTargetChange = (index: number, field: string, value: string) => {
    const updatedTargets = [...productTargets];
    const numValue = parseFloat(value) || 0;

    if (field === "targetRevenue") {
      updatedTargets[index].targetRevenue = numValue;
      updatedTargets[index].targetUnit = updatedTargets[index].price > 0 ? Math.round(numValue / updatedTargets[index].price) : 0;
    } else if (field === "targetUnit") {
      updatedTargets[index].targetUnit = numValue;
      updatedTargets[index].targetRevenue = numValue * updatedTargets[index].price;
    } else if (field === "targetOrder") {
      updatedTargets[index].targetOrder = numValue;
    } else if (field === "price") {
      updatedTargets[index].price = numValue;
      updatedTargets[index].targetRevenue = updatedTargets[index].targetUnit * numValue;
    }

    // Recalculate daily and weekly targets
    updatedTargets[index].dailyTarget = calculateDailyTarget(updatedTargets[index].targetRevenue, targetForm.month, targetForm.year);
    updatedTargets[index].weeklyTarget = calculateWeeklyTarget(updatedTargets[index].targetRevenue);

    setProductTargets(updatedTargets);
  };

  const handleAddProductRow = () => {
    if (!targetForm.brandCode) {
      alert("Please select a brand first");
      return;
    }

    const availableProducts = productsByBrand[targetForm.brandCode] || [];
    const existingProductIds = productTargets.map(pt => pt.id);
    const remainingProducts = availableProducts.filter(p => !existingProductIds.includes(p.id));

    if (remainingProducts.length === 0) {
      alert("All products for this brand have been added");
      return;
    }

    const firstProduct = remainingProducts[0];
    const newProductTarget: ProductTarget = {
      id: firstProduct.id,
      productName: firstProduct.name,
      sku: firstProduct.sku,
      category: firstProduct.category,
      price: firstProduct.price,
      targetRevenue: 0,
      targetOrder: 0,
      targetUnit: 0,
      dailyTarget: 0,
      weeklyTarget: 0,
    };

    setProductTargets([...productTargets, newProductTarget]);
  };

  const handleRemoveProductRow = (index: number) => {
    setProductTargets(productTargets.filter((_, i) => i !== index));
  };

  const handleProductSelect = (index: number, productId: string) => {
    const product = (productsByBrand[targetForm.brandCode] || []).find(p => p.id === productId);
    if (!product) return;

    const updatedTargets = [...productTargets];
    updatedTargets[index] = {
      ...updatedTargets[index],
      id: product.id,
      productName: product.name,
      sku: product.sku,
      category: product.category,
      price: product.price,
      targetRevenue: updatedTargets[index].targetUnit * product.price,
    };

    setProductTargets(updatedTargets);
  };

  const handleSaveTarget = () => {
    if (!targetForm.month || !targetForm.year || !targetForm.brandCode || !targetForm.salesChannel) {
      alert("Please fill all required fields");
      return;
    }

    if (productTargets.length === 0) {
      alert("Please add at least one product target");
      return;
    }

    console.log("Saving target:", { targetForm, productTargets });
    alert("Target Sales saved successfully!");
    
    // Reset form and go back to list
    setTargetForm({ month: "", year: "2026", brandCode: "", salesChannel: "" });
    setProductTargets([]);
    setViewMode("list");
  };

  const handleExport = () => {
    alert("Exporting target sales data to Excel...");
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

  const handleImport = () => {
    if (!uploadedFile) {
      alert("Please select a file to upload");
      return;
    }
    console.log("Importing file:", uploadedFile);
    alert("File imported successfully!");
    setShowImportModal(false);
    setUploadedFile(null);
  };

  const handleViewDetail = (target: TargetSalesData) => {
    setSelectedTarget(target);
    setViewMode("detail");
  };

  const handleDelete = (target: TargetSalesData) => {
    setSelectedTarget(target);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    console.log("Deleting target:", selectedTarget);
    alert("Target Sales deleted successfully!");
    setShowDeleteModal(false);
    setSelectedTarget(null);
  };

  const getTotalTargetRevenue = () => {
    return productTargets.reduce((sum, pt) => sum + pt.targetRevenue, 0);
  };

  const getTotalTargetUnit = () => {
    return productTargets.reduce((sum, pt) => sum + pt.targetUnit, 0);
  };

  const getTotalTargetOrder = () => {
    return productTargets.reduce((sum, pt) => sum + pt.targetOrder, 0);
  };

  const getBrandName = (brandCode: string) => {
    return brandOptions.find(b => b.code === brandCode)?.name || brandCode;
  };

  const filteredData = mockTargetData.filter((target) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      target.brand.toLowerCase().includes(searchLower) ||
      target.salesChannel.toLowerCase().includes(searchLower) ||
      target.month.toLowerCase().includes(searchLower) ||
      target.year.includes(searchLower);

    const matchesMonth = filterMonth === "All" || target.month === filterMonth;
    const matchesBrand = filterBrand === "All" || target.brandCode === filterBrand;
    const matchesChannel = filterChannel === "All" || target.salesChannel === filterChannel;

    return matchesSearch && matchesMonth && matchesBrand && matchesChannel;
  });

  const availableProductsForSelect = (currentProductId: string) => {
    const existingIds = productTargets.map(pt => pt.id).filter(id => id !== currentProductId);
    return (productsByBrand[targetForm.brandCode] || []).filter(p => !existingIds.includes(p.id));
  };

  // LIST VIEW
  if (viewMode === "list") {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-gray-600">
            Manage and set sales targets per period, brand, and channel
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={() => setShowImportModal(true)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Import Excel
            </button>
            <button
              onClick={() => setViewMode("create")}
              className="px-4 py-2 rounded-md text-gray-900 transition-opacity hover:opacity-90 flex items-center gap-2"
              style={{ backgroundColor: "#F6D400" }}
            >
              <Plus className="w-4 h-4" />
              Create Target Sales
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by brand, channel, period..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-2 py-1 text-sm border-0 focus:outline-none"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="filterMonth" className="text-xs">Month</Label>
              <select
                id="filterMonth"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC7C3]"
              >
                <option value="All">All Months</option>
                {monthOptions.map((month) => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="filterBrand" className="text-xs">Brand</Label>
              <select
                id="filterBrand"
                value={filterBrand}
                onChange={(e) => setFilterBrand(e.target.value)}
                className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC7C3]"
              >
                <option value="All">All Brands</option>
                {brandOptions.map((brand) => (
                  <option key={brand.code} value={brand.code}>{brand.name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="filterChannel" className="text-xs">Sales Channel</Label>
              <select
                id="filterChannel"
                value={filterChannel}
                onChange={(e) => setFilterChannel(e.target.value)}
                className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC7C3]"
              >
                <option value="All">All Channels</option>
                {salesChannelOptions.map((channel) => (
                  <option key={channel} value={channel}>{channel}</option>
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
                      Period
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                      Brand
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                      Channel
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-700">
                      Total Target Revenue
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-700">
                      Total Target Unit
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                      Created By
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredData.map((target) => (
                    <tr key={target.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900 font-medium">
                        {target.month} {target.year}
                      </td>
                      <td className="px-4 py-3 text-gray-900">{target.brand}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {target.salesChannel}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-900 text-right font-medium">
                        {formatCurrency(target.totalTargetRevenue)}
                      </td>
                      <td className="px-4 py-3 text-gray-900 text-right">
                        {formatNumber(target.totalTargetUnit)}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{target.createdBy}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleViewDetail(target)}
                            className="p-1.5 text-gray-600 hover:text-[#6CC7C3] hover:bg-[#6CC7C315] rounded transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(target)}
                            className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Results Summary */}
            <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
              <p className="text-xs text-gray-600">
                Showing {filteredData.length} of {mockTargetData.length} target sales
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#6CC7C315" }}
            >
              <Search className="w-8 h-8" style={{ color: "#6CC7C3" }} />
            </div>
            <h3 className="text-base text-gray-900 mb-2">No Target Sales Found</h3>
            <p className="text-sm text-gray-600 mb-6">
              {searchTerm
                ? "Try adjusting your search"
                : "Create your first target sales to get started"}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setViewMode("create")}
                className="px-4 py-2 rounded-md text-gray-900 transition-opacity hover:opacity-90 inline-flex items-center gap-2"
                style={{ backgroundColor: "#F6D400" }}
              >
                <Plus className="w-4 h-4" />
                Create Target Sales
              </button>
            )}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle>Delete Target Sales</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this target sales record? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            {selectedTarget && (
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4 my-4">
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Period:</span>
                    <span className="text-gray-900 font-medium">
                      {selectedTarget.month} {selectedTarget.year}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Brand:</span>
                    <span className="text-gray-900 font-medium">{selectedTarget.brand}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Channel:</span>
                    <span className="text-gray-900 font-medium">{selectedTarget.salesChannel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Target Revenue:</span>
                    <span className="text-gray-900 font-medium">
                      {formatCurrency(selectedTarget.totalTargetRevenue)}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedTarget(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete Target Sales
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Import Modal */}
        <Dialog open={showImportModal} onOpenChange={setShowImportModal}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Import Target Sales</DialogTitle>
              <DialogDescription>
                Upload an Excel file (.xlsx, .xls) containing target sales data. Download the template for the correct format.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
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
                  <div className="flex items-center justify-center gap-3">
                    <FileUp className="w-8 h-8 text-[#6CC7C3]" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">{uploadedFile.name}</p>
                      <p className="text-xs text-gray-500">
                        {(uploadedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <button
                      onClick={() => setUploadedFile(null)}
                      className="ml-auto p-1 hover:bg-gray-200 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-sm text-gray-600 mb-1">
                      Drag and drop your file here, or
                    </p>
                    <label className="text-sm text-[#6CC7C3] hover:underline cursor-pointer">
                      browse files
                      <input
                        type="file"
                        className="hidden"
                        accept=".xlsx,.xls"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      Supported formats: .xlsx, .xls (Max 10MB)
                    </p>
                  </>
                )}
              </div>
              <button
                onClick={() => alert("Downloading template...")}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Template
              </button>
            </div>
            <DialogFooter>
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setUploadedFile(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                disabled={!uploadedFile}
                className="px-4 py-2 rounded-md text-gray-900 transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#F6D400" }}
              >
                Import Data
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // CREATE VIEW
  if (viewMode === "create") {
    return (
      <div>
        <div className="mb-6">
          <button
            onClick={() => {
              setViewMode("list");
              setTargetForm({ month: "", year: "2026", brandCode: "", salesChannel: "" });
              setProductTargets([]);
            }}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to List
          </button>
          <h2 className="text-xl text-gray-900 mb-2">Create Target Sales</h2>
          <p className="text-sm text-gray-600">
            Set sales targets for a specific period, brand, and channel
          </p>
        </div>

        {/* Header Form */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Target Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="month" className="text-xs">Month *</Label>
              <select
                id="month"
                value={targetForm.month}
                onChange={(e) => setTargetForm({ ...targetForm, month: e.target.value })}
                className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC7C3]"
              >
                <option value="">Select Month</option>
                {monthOptions.map((month) => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="year" className="text-xs">Year *</Label>
              <Input
                id="year"
                type="text"
                value={targetForm.year}
                onChange={(e) => setTargetForm({ ...targetForm, year: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="brand" className="text-xs">Brand *</Label>
              <select
                id="brand"
                value={targetForm.brandCode}
                onChange={(e) => {
                  setTargetForm({ ...targetForm, brandCode: e.target.value });
                  setProductTargets([]);
                }}
                className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC7C3]"
              >
                <option value="">Select Brand</option>
                {brandOptions.map((brand) => (
                  <option key={brand.code} value={brand.code}>{brand.name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="channel" className="text-xs">Sales Channel *</Label>
              <select
                id="channel"
                value={targetForm.salesChannel}
                onChange={(e) => setTargetForm({ ...targetForm, salesChannel: e.target.value })}
                className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC7C3]"
              >
                <option value="">Select Channel</option>
                {salesChannelOptions.map((channel) => (
                  <option key={channel} value={channel}>{channel}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Summary Cards */}
          {productTargets.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
              <div className="bg-gray-50 rounded-md p-4">
                <p className="text-xs text-gray-600 mb-1">Total Target Revenue</p>
                <p className="text-lg font-medium text-gray-900">{formatCurrency(getTotalTargetRevenue())}</p>
              </div>
              <div className="bg-gray-50 rounded-md p-4">
                <p className="text-xs text-gray-600 mb-1">Total Target Unit</p>
                <p className="text-lg font-medium text-gray-900">{formatNumber(getTotalTargetUnit())}</p>
              </div>
              <div className="bg-gray-50 rounded-md p-4">
                <p className="text-xs text-gray-600 mb-1">Total Target Order</p>
                <p className="text-lg font-medium text-gray-900">{formatNumber(getTotalTargetOrder())}</p>
              </div>
            </div>
          )}
        </div>

        {/* Product Targets Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-900">Product Targets</h3>
            <button
              onClick={handleAddProductRow}
              disabled={!targetForm.brandCode}
              className="px-3 py-1.5 text-xs rounded-md text-gray-900 transition-opacity hover:opacity-90 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#F6D400" }}
            >
              <Plus className="w-3 h-3" />
              Add Product
            </button>
          </div>

          {productTargets.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 w-[200px]">Product</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 w-[120px]">SKU</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 w-[100px]">Category</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-700 w-[100px]">Price</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-700 w-[120px]">Target Revenue</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-700 w-[100px]">Target Unit</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-700 w-[100px]">Target Order</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-700 w-[110px]">Daily Target</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-700 w-[110px]">Weekly Target</th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-700 w-[50px]"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {productTargets.map((product, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-3 py-2">
                        <select
                          value={product.id}
                          onChange={(e) => handleProductSelect(index, e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#6CC7C3]"
                        >
                          <option value={product.id}>{product.productName}</option>
                          {availableProductsForSelect(product.id).map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-700 font-mono">{product.sku}</td>
                      <td className="px-3 py-2 text-xs text-gray-700">{product.category}</td>
                      <td className="px-3 py-2">
                        <Input
                          type="number"
                          value={product.price}
                          onChange={(e) => handleProductTargetChange(index, "price", e.target.value)}
                          className="w-full text-xs text-right"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          type="number"
                          value={product.targetRevenue || ""}
                          onChange={(e) => handleProductTargetChange(index, "targetRevenue", e.target.value)}
                          className="w-full text-xs text-right"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          type="number"
                          value={product.targetUnit || ""}
                          onChange={(e) => handleProductTargetChange(index, "targetUnit", e.target.value)}
                          className="w-full text-xs text-right"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          type="number"
                          value={product.targetOrder || ""}
                          onChange={(e) => handleProductTargetChange(index, "targetOrder", e.target.value)}
                          className="w-full text-xs text-right"
                        />
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-700 text-right bg-gray-50">
                        {formatCurrency(product.dailyTarget)}
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-700 text-right bg-gray-50">
                        {formatCurrency(product.weeklyTarget)}
                      </td>
                      <td className="px-3 py-2 text-center">
                        <button
                          onClick={() => handleRemoveProductRow(index)}
                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <div
                className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#6CC7C315" }}
              >
                <Plus className="w-6 h-6" style={{ color: "#6CC7C3" }} />
              </div>
              <p className="text-sm text-gray-600 mb-2">No products added yet</p>
              <p className="text-xs text-gray-500">
                {targetForm.brandCode
                  ? "Click 'Add Product' to add target products"
                  : "Please select a brand first"}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              setViewMode("list");
              setTargetForm({ month: "", year: "2026", brandCode: "", salesChannel: "" });
              setProductTargets([]);
            }}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveTarget}
            disabled={
              !targetForm.month ||
              !targetForm.year ||
              !targetForm.brandCode ||
              !targetForm.salesChannel ||
              productTargets.length === 0
            }
            className="px-6 py-2 rounded-md text-gray-900 transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#F6D400" }}
          >
            Save Target Sales
          </button>
        </div>
      </div>
    );
  }

  // DETAIL VIEW
  if (viewMode === "detail" && selectedTarget) {
    return (
      <div>
        <div className="mb-6">
          <button
            onClick={() => {
              setViewMode("list");
              setSelectedTarget(null);
            }}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to List
          </button>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl text-gray-900 mb-2">Target Sales Detail</h2>
              <p className="text-sm text-gray-600">
                View detailed target sales information
              </p>
            </div>
            <button
              onClick={handleExport}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export to Excel
            </button>
          </div>
        </div>

        {/* Header Information */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Target Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-xs text-gray-600 mb-1">Period</p>
              <p className="text-sm font-medium text-gray-900">
                {selectedTarget.month} {selectedTarget.year}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Brand</p>
              <p className="text-sm font-medium text-gray-900">{selectedTarget.brand}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Sales Channel</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {selectedTarget.salesChannel}
              </span>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Created By</p>
              <p className="text-sm font-medium text-gray-900">{selectedTarget.createdBy}</p>
            </div>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
            <div className="bg-gray-50 rounded-md p-4">
              <p className="text-xs text-gray-600 mb-1">Total Target Revenue</p>
              <p className="text-lg font-medium text-gray-900">
                {formatCurrency(selectedTarget.totalTargetRevenue)}
              </p>
            </div>
            <div className="bg-gray-50 rounded-md p-4">
              <p className="text-xs text-gray-600 mb-1">Total Target Unit</p>
              <p className="text-lg font-medium text-gray-900">
                {formatNumber(selectedTarget.totalTargetUnit)}
              </p>
            </div>
            <div className="bg-gray-50 rounded-md p-4">
              <p className="text-xs text-gray-600 mb-1">Total Target Order</p>
              <p className="text-lg font-medium text-gray-900">
                {formatNumber(selectedTarget.totalTargetOrder)}
              </p>
            </div>
          </div>
        </div>

        {/* Product Details Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-900">Product Targets</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">SKU</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Category</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700">Price</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700">Target Revenue</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700">Target Unit</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700">Target Order</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700">Daily Target</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700">Weekly Target</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {selectedTarget.products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900 font-medium">{product.productName}</td>
                    <td className="px-4 py-3 text-gray-700 font-mono text-xs">{product.sku}</td>
                    <td className="px-4 py-3 text-gray-700">{product.category}</td>
                    <td className="px-4 py-3 text-gray-900 text-right">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="px-4 py-3 text-gray-900 text-right font-medium">
                      {formatCurrency(product.targetRevenue)}
                    </td>
                    <td className="px-4 py-3 text-gray-900 text-right">
                      {formatNumber(product.targetUnit)}
                    </td>
                    <td className="px-4 py-3 text-gray-900 text-right">
                      {formatNumber(product.targetOrder)}
                    </td>
                    <td className="px-4 py-3 text-gray-700 text-right">
                      {formatCurrency(product.dailyTarget)}
                    </td>
                    <td className="px-4 py-3 text-gray-700 text-right">
                      {formatCurrency(product.weeklyTarget)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return null;
}