import { useState } from "react";
import { Plus, Upload, Download, Search, Edit, Trash2, X, FileUp, Eye, ArrowLeft } from "lucide-react";
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
import { Textarea } from "../../components/ui/textarea";

interface ProductActual {
  id: string;
  productName: string;
  sku: string;
  category: string;
  actualOrder: number;
  actualUnitSold: number;
  actualRevenue: number;
  avgUnitPerOrder: number;
  avgSellingPrice: number;
  targetRevenue?: number;
  targetOrder?: number;
  targetUnit?: number;
  achievementRevenue?: number;
  achievementOrder?: number;
  achievementUnit?: number;
}

interface ActualSalesData {
  id: string;
  month: string;
  year: string;
  brand: string;
  brandCode: string;
  salesChannel: string;
  dataSource: string;
  totalActualRevenue: number;
  totalActualOrder: number;
  totalActualUnit: number;
  totalTargetRevenue?: number;
  overallAchievement?: number;
  products: ProductActual[];
  notes: string;
  createdBy: string;
  createdDate: string;
}

type ViewMode = "list" | "create" | "detail";

// Mock data options
const brandOptions = [
  { code: "BRD001", name: "Gendes" },
  { code: "BRD002", name: "Kavela" },
  { code: "BRD003", name: "IM Man" },
  { code: "BRD004", name: "SYMS" },
];

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
const dataSourceOptions = ["Manual Input", "Marketplace Report"];
const monthOptions = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// Mock Target Sales Data (untuk comparison)
const mockTargetSalesData: Record<string, any> = {
  "January-2026-BRD001-Shopee": {
    totalTargetRevenue: 150000000,
    products: {
      "GEN-FCH-001": { targetRevenue: 70000000, targetOrder: 400, targetUnit: 2000 },
      "GEN-SAF-002": { targetRevenue: 80000000, targetOrder: 400, targetUnit: 2000 },
    },
  },
  "February-2026-BRD002-TikTok Shop": {
    totalTargetRevenue: 120000000,
    products: {
      "KAV-MSB-001": { targetRevenue: 60000000, targetOrder: 450, targetUnit: 2250 },
    },
  },
};

export default function ActualSales() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMonth, setFilterMonth] = useState("All");
  const [filterBrand, setFilterBrand] = useState("All");
  const [filterChannel, setFilterChannel] = useState("All");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedActual, setSelectedActual] = useState<ActualSalesData | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Form state
  const [actualForm, setActualForm] = useState({
    month: "",
    year: "2026",
    brandCode: "",
    salesChannel: "",
    dataSource: "",
    notes: "",
  });

  const [productActuals, setProductActuals] = useState<ProductActual[]>([]);

  // Mock data
  const mockActualData: ActualSalesData[] = [
    {
      id: "1",
      month: "January",
      year: "2026",
      brand: "Gendes",
      brandCode: "BRD001",
      salesChannel: "Shopee",
      dataSource: "Marketplace Report",
      totalActualRevenue: 165000000,
      totalActualOrder: 900,
      totalActualUnit: 4400,
      totalTargetRevenue: 150000000,
      overallAchievement: 110,
      products: [
        {
          id: "1",
          productName: "Gendes foam chocolate",
          sku: "GEN-FCH-001",
          category: "Feminine Hygiene",
          actualOrder: 450,
          actualUnitSold: 2200,
          actualRevenue: 77000000,
          avgUnitPerOrder: 4.89,
          avgSellingPrice: 35000,
          targetRevenue: 70000000,
          targetOrder: 400,
          targetUnit: 2000,
          achievementRevenue: 110,
          achievementOrder: 112.5,
          achievementUnit: 110,
        },
        {
          id: "2",
          productName: "GENDES Sweet Aromatic Feminine Hygiene Bubblegum Foam 55ml",
          sku: "GEN-SAF-002",
          category: "Feminine Hygiene",
          actualOrder: 450,
          actualUnitSold: 2200,
          actualRevenue: 88000000,
          avgUnitPerOrder: 4.89,
          avgSellingPrice: 40000,
          targetRevenue: 80000000,
          targetOrder: 400,
          targetUnit: 2000,
          achievementRevenue: 110,
          achievementOrder: 112.5,
          achievementUnit: 110,
        },
      ],
      notes: "Strong performance in January, exceeded all targets.",
      createdBy: "Sales Manager",
      createdDate: "2026-02-01",
    },
    {
      id: "2",
      month: "February",
      year: "2026",
      brand: "Kavela",
      brandCode: "BRD002",
      salesChannel: "TikTok Shop",
      dataSource: "Manual Input",
      totalActualRevenue: 105000000,
      totalActualOrder: 2100,
      totalActualUnit: 6300,
      totalTargetRevenue: 120000000,
      overallAchievement: 87.5,
      products: [
        {
          id: "3",
          productName: "Mouth Spray Berry Mood 20 ml",
          sku: "KAV-MSB-001",
          category: "Mouth Care",
          actualOrder: 2100,
          actualUnitSold: 6300,
          actualRevenue: 105000000,
          avgUnitPerOrder: 3.0,
          avgSellingPrice: 16667,
          targetRevenue: 120000000,
          targetOrder: 2250,
          targetUnit: 6750,
          achievementRevenue: 87.5,
          achievementOrder: 93.3,
          achievementUnit: 93.3,
        },
      ],
      notes: "Below target due to promotional discount strategy.",
      createdBy: "Sales Manager",
      createdDate: "2026-03-05",
    },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number, decimals: number = 0) => {
    return new Intl.NumberFormat("id-ID", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  };

  const calculateAvgUnitPerOrder = (actualUnit: number, actualOrder: number) => {
    return actualOrder > 0 ? actualUnit / actualOrder : 0;
  };

  const calculateAvgSellingPrice = (actualRevenue: number, actualUnit: number) => {
    return actualUnit > 0 ? actualRevenue / actualUnit : 0;
  };

  const getTargetData = () => {
    const key = `${actualForm.month}-${actualForm.year}-${actualForm.brandCode}-${actualForm.salesChannel}`;
    return mockTargetSalesData[key];
  };

  const handleProductActualChange = (index: number, field: string, value: string) => {
    const updatedActuals = [...productActuals];
    const numValue = parseFloat(value) || 0;

    if (field === "actualOrder") {
      updatedActuals[index].actualOrder = numValue;
    } else if (field === "actualUnitSold") {
      updatedActuals[index].actualUnitSold = numValue;
    } else if (field === "actualRevenue") {
      updatedActuals[index].actualRevenue = numValue;
    }

    // Recalculate auto fields
    updatedActuals[index].avgUnitPerOrder = calculateAvgUnitPerOrder(
      updatedActuals[index].actualUnitSold,
      updatedActuals[index].actualOrder
    );
    updatedActuals[index].avgSellingPrice = calculateAvgSellingPrice(
      updatedActuals[index].actualRevenue,
      updatedActuals[index].actualUnitSold
    );

    // Calculate achievement if target exists
    const targetData = getTargetData();
    if (targetData && targetData.products[updatedActuals[index].sku]) {
      const target = targetData.products[updatedActuals[index].sku];
      updatedActuals[index].targetRevenue = target.targetRevenue;
      updatedActuals[index].targetOrder = target.targetOrder;
      updatedActuals[index].targetUnit = target.targetUnit;
      updatedActuals[index].achievementRevenue = (updatedActuals[index].actualRevenue / target.targetRevenue) * 100;
      updatedActuals[index].achievementOrder = (updatedActuals[index].actualOrder / target.targetOrder) * 100;
      updatedActuals[index].achievementUnit = (updatedActuals[index].actualUnitSold / target.targetUnit) * 100;
    }

    setProductActuals(updatedActuals);
  };

  const handleAddProductRow = () => {
    if (!actualForm.brandCode) {
      alert("Please select a brand first");
      return;
    }

    const availableProducts = productsByBrand[actualForm.brandCode] || [];
    const existingProductIds = productActuals.map(pa => pa.id);
    const remainingProducts = availableProducts.filter(p => !existingProductIds.includes(p.id));

    if (remainingProducts.length === 0) {
      alert("All products for this brand have been added");
      return;
    }

    const firstProduct = remainingProducts[0];
    
    // Check if there's a target for this product
    const targetData = getTargetData();
    const productTarget = targetData?.products?.[firstProduct.sku];

    const newProductActual: ProductActual = {
      id: firstProduct.id,
      productName: firstProduct.name,
      sku: firstProduct.sku,
      category: firstProduct.category,
      actualOrder: 0,
      actualUnitSold: 0,
      actualRevenue: 0,
      avgUnitPerOrder: 0,
      avgSellingPrice: 0,
      targetRevenue: productTarget?.targetRevenue,
      targetOrder: productTarget?.targetOrder,
      targetUnit: productTarget?.targetUnit,
    };

    setProductActuals([...productActuals, newProductActual]);
  };

  const handleRemoveProductRow = (index: number) => {
    setProductActuals(productActuals.filter((_, i) => i !== index));
  };

  const handleProductSelect = (index: number, productId: string) => {
    const product = (productsByBrand[actualForm.brandCode] || []).find(p => p.id === productId);
    if (!product) return;

    const targetData = getTargetData();
    const productTarget = targetData?.products?.[product.sku];

    const updatedActuals = [...productActuals];
    updatedActuals[index] = {
      ...updatedActuals[index],
      id: product.id,
      productName: product.name,
      sku: product.sku,
      category: product.category,
      targetRevenue: productTarget?.targetRevenue,
      targetOrder: productTarget?.targetOrder,
      targetUnit: productTarget?.targetUnit,
    };

    setProductActuals(updatedActuals);
  };

  const getTotalActualRevenue = () => {
    return productActuals.reduce((sum, pa) => sum + pa.actualRevenue, 0);
  };

  const getTotalActualOrder = () => {
    return productActuals.reduce((sum, pa) => sum + pa.actualOrder, 0);
  };

  const getTotalActualUnit = () => {
    return productActuals.reduce((sum, pa) => sum + pa.actualUnitSold, 0);
  };

  const getOverallAchievement = () => {
    const totalRevenue = getTotalActualRevenue();
    const targetData = getTargetData();
    if (targetData && targetData.totalTargetRevenue > 0) {
      return (totalRevenue / targetData.totalTargetRevenue) * 100;
    }
    return null;
  };

  const handleSaveActualSales = () => {
    if (!actualForm.month || !actualForm.year || !actualForm.brandCode || !actualForm.salesChannel) {
      alert("Please fill all required fields");
      return;
    }

    if (productActuals.length === 0) {
      alert("Please add at least one product actual");
      return;
    }

    console.log("Saving actual sales:", { actualForm, productActuals });
    alert("Actual Sales saved successfully!");
    
    resetForm();
    setViewMode("list");
  };

  const resetForm = () => {
    setActualForm({
      month: "",
      year: "2026",
      brandCode: "",
      salesChannel: "",
      dataSource: "",
      notes: "",
    });
    setProductActuals([]);
  };

  const handleExport = () => {
    alert("Exporting actual sales data to Excel...");
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

  const handleViewDetail = (actual: ActualSalesData) => {
    setSelectedActual(actual);
    setViewMode("detail");
  };

  const handleDelete = (actual: ActualSalesData) => {
    setSelectedActual(actual);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    console.log("Deleting actual sales:", selectedActual);
    alert("Actual Sales deleted successfully!");
    setShowDeleteModal(false);
    setSelectedActual(null);
  };

  const getBrandName = (brandCode: string) => {
    return brandOptions.find(b => b.code === brandCode)?.name || brandCode;
  };

  const getAchievementStatus = (achievement: number | undefined) => {
    if (!achievement) return null;
    if (achievement >= 100) return "Achieved";
    if (achievement >= 90) return "Near Target";
    return "Underperform";
  };

  const getAchievementColor = (achievement: number | undefined) => {
    if (!achievement) return "bg-gray-100 text-gray-800";
    if (achievement >= 100) return "bg-green-100 text-green-800";
    if (achievement >= 90) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const filteredData = mockActualData.filter((actual) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      actual.brand.toLowerCase().includes(searchLower) ||
      actual.salesChannel.toLowerCase().includes(searchLower) ||
      actual.month.toLowerCase().includes(searchLower);

    const matchesMonth = filterMonth === "All" || actual.month === filterMonth;
    const matchesBrand = filterBrand === "All" || actual.brandCode === filterBrand;
    const matchesChannel = filterChannel === "All" || actual.salesChannel === filterChannel;

    return matchesSearch && matchesMonth && matchesBrand && matchesChannel;
  });

  const availableProductsForSelect = (currentProductId: string) => {
    const existingIds = productActuals.map(pa => pa.id).filter(id => id !== currentProductId);
    return (productsByBrand[actualForm.brandCode] || []).filter(p => !existingIds.includes(p.id));
  };

  // LIST VIEW
  if (viewMode === "list") {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-gray-600">
            Input and manage actual sales performance vs targets
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
              Input Actual Sales
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
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Period</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Brand</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Channel</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-700">Actual Revenue</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-700">Target Revenue</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-700">Achievement</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredData.map((actual) => (
                    <tr key={actual.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900 font-medium">
                        {actual.month} {actual.year}
                      </td>
                      <td className="px-4 py-3 text-gray-900">{actual.brand}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {actual.salesChannel}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-900 text-right font-medium">
                        {formatCurrency(actual.totalActualRevenue)}
                      </td>
                      <td className="px-4 py-3 text-gray-700 text-right">
                        {actual.totalTargetRevenue ? formatCurrency(actual.totalTargetRevenue) : "-"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {actual.overallAchievement ? (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAchievementColor(actual.overallAchievement)}`}>
                            {formatNumber(actual.overallAchievement, 1)}%
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">No Target</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleViewDetail(actual)}
                            className="p-1.5 text-gray-600 hover:text-[#6CC7C3] hover:bg-[#6CC7C315] rounded transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(actual)}
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
                Showing {filteredData.length} of {mockActualData.length} actual sales records
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#9BC53D15" }}
            >
              <Search className="w-8 h-8" style={{ color: "#9BC53D" }} />
            </div>
            <h3 className="text-base text-gray-900 mb-2">No Actual Sales Found</h3>
            <p className="text-sm text-gray-600 mb-6">
              {searchTerm
                ? "Try adjusting your search or filters"
                : "Input your first actual sales data to get started"}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setViewMode("create")}
                className="px-4 py-2 rounded-md text-gray-900 transition-opacity hover:opacity-90 inline-flex items-center gap-2"
                style={{ backgroundColor: "#F6D400" }}
              >
                <Plus className="w-4 h-4" />
                Input Actual Sales
              </button>
            )}
          </div>
        )}

        {/* Delete Modal */}
        <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle>Delete Actual Sales</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this actual sales record? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            {selectedActual && (
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4 my-4">
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Period:</span>
                    <span className="text-gray-900 font-medium">
                      {selectedActual.month} {selectedActual.year}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Brand:</span>
                    <span className="text-gray-900 font-medium">{selectedActual.brand}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Actual Revenue:</span>
                    <span className="text-gray-900 font-medium">
                      {formatCurrency(selectedActual.totalActualRevenue)}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedActual(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete Record
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Import Modal */}
        <Dialog open={showImportModal} onOpenChange={setShowImportModal}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Import Actual Sales</DialogTitle>
              <DialogDescription>
                Upload an Excel file (.xlsx, .xls) containing actual sales data. Download the template for the correct format.
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
    const totalActualRevenue = getTotalActualRevenue();
    const totalActualOrder = getTotalActualOrder();
    const totalActualUnit = getTotalActualUnit();
    const overallAchievement = getOverallAchievement();
    const targetData = getTargetData();
    const hasTarget = !!targetData;

    return (
      <div>
        <div className="mb-6">
          <button
            onClick={() => {
              setViewMode("list");
              resetForm();
            }}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to List
          </button>
          <h2 className="text-xl text-gray-900 mb-2">Input Actual Sales</h2>
          <p className="text-sm text-gray-600">
            Record actual sales performance and compare with targets
          </p>
        </div>

        {/* Header Information */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Sales Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="month" className="text-xs">Month *</Label>
              <select
                id="month"
                value={actualForm.month}
                onChange={(e) => {
                  setActualForm({ ...actualForm, month: e.target.value });
                  setProductActuals([]);
                }}
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
                value={actualForm.year}
                onChange={(e) => {
                  setActualForm({ ...actualForm, year: e.target.value });
                  setProductActuals([]);
                }}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="brand" className="text-xs">Brand *</Label>
              <select
                id="brand"
                value={actualForm.brandCode}
                onChange={(e) => {
                  setActualForm({ ...actualForm, brandCode: e.target.value });
                  setProductActuals([]);
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
              <Label htmlFor="salesChannel" className="text-xs">Sales Channel *</Label>
              <select
                id="salesChannel"
                value={actualForm.salesChannel}
                onChange={(e) => {
                  setActualForm({ ...actualForm, salesChannel: e.target.value });
                  setProductActuals([]);
                }}
                className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC7C3]"
              >
                <option value="">Select Channel</option>
                {salesChannelOptions.map((channel) => (
                  <option key={channel} value={channel}>{channel}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="dataSource" className="text-xs">Data Source *</Label>
              <select
                id="dataSource"
                value={actualForm.dataSource}
                onChange={(e) => setActualForm({ ...actualForm, dataSource: e.target.value })}
                className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC7C3]"
              >
                <option value="">Select Source</option>
                {dataSourceOptions.map((source) => (
                  <option key={source} value={source}>{source}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Target Status Alert - No Target */}
          {actualForm.month && actualForm.year && actualForm.brandCode && actualForm.salesChannel && !hasTarget && (
            <div className="mt-4 p-3 rounded-md bg-yellow-50 border border-yellow-200">
              <p className="text-xs font-medium mb-1">
                <span className="text-yellow-800">⚠ No Target Sales data found for this period</span>
              </p>
              <p className="text-xs text-yellow-700">
                You can still input actual sales, but achievement calculation will not be available
              </p>
            </div>
          )}

          {/* Target Sales Detail - Show when target data is found */}
          {actualForm.month && actualForm.year && actualForm.brandCode && actualForm.salesChannel && hasTarget && (
            <div className="mt-4 border border-green-200 rounded-md overflow-hidden">
              <div className="bg-green-50 px-4 py-3 border-b border-green-200">
                <p className="text-xs font-medium text-green-800">
                  ✓ Target Sales Data Found
                </p>
                <p className="text-xs text-green-700 mt-0.5">
                  Achievement will be calculated automatically as you input actual sales
                </p>
              </div>
              <div className="bg-white p-4">
                <h4 className="text-xs font-medium text-gray-900 mb-3">Target Summary</h4>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-blue-50 rounded-md p-3 border border-blue-100">
                    <p className="text-xs text-gray-600 mb-1">Target Revenue</p>
                    <p className="text-base font-semibold text-blue-900">
                      {formatCurrency(targetData.totalTargetRevenue)}
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-md p-3 border border-blue-100">
                    <p className="text-xs text-gray-600 mb-1">Total Products</p>
                    <p className="text-base font-semibold text-blue-900">
                      {Object.keys(targetData.products).length}
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-md p-3 border border-blue-100">
                    <p className="text-xs text-gray-600 mb-1">Period</p>
                    <p className="text-base font-semibold text-blue-900">
                      {actualForm.month} {actualForm.year}
                    </p>
                  </div>
                </div>
                
                <h4 className="text-xs font-medium text-gray-900 mb-2">Product Targets</h4>
                <div className="border border-gray-200 rounded-md overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium text-gray-700">SKU</th>
                        <th className="px-3 py-2 text-right font-medium text-gray-700">Target Order</th>
                        <th className="px-3 py-2 text-right font-medium text-gray-700">Target Unit</th>
                        <th className="px-3 py-2 text-right font-medium text-gray-700">Target Revenue</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {Object.entries(targetData.products).map(([sku, data]: [string, any]) => (
                        <tr key={sku} className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-gray-900 font-mono">{sku}</td>
                          <td className="px-3 py-2 text-right text-gray-900">
                            {formatNumber(data.targetOrder)}
                          </td>
                          <td className="px-3 py-2 text-right text-gray-900">
                            {formatNumber(data.targetUnit)}
                          </td>
                          <td className="px-3 py-2 text-right text-gray-900 font-medium">
                            {formatCurrency(data.targetRevenue)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Summary */}
          {productActuals.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
              <div className="bg-gray-50 rounded-md p-4">
                <p className="text-xs text-gray-600 mb-1">Total Actual Revenue</p>
                <p className="text-lg font-medium text-gray-900">{formatCurrency(totalActualRevenue)}</p>
              </div>
              <div className="bg-gray-50 rounded-md p-4">
                <p className="text-xs text-gray-600 mb-1">Total Actual Order</p>
                <p className="text-lg font-medium text-gray-900">{formatNumber(totalActualOrder)}</p>
              </div>
              <div className="bg-gray-50 rounded-md p-4">
                <p className="text-xs text-gray-600 mb-1">Total Actual Unit</p>
                <p className="text-lg font-medium text-gray-900">{formatNumber(totalActualUnit)}</p>
              </div>
              {hasTarget && overallAchievement !== null && (
                <div className={`rounded-md p-4 ${
                  overallAchievement >= 100 ? "bg-green-50" : overallAchievement >= 90 ? "bg-yellow-50" : "bg-red-50"
                }`}>
                  <p className="text-xs text-gray-600 mb-1">Overall Achievement</p>
                  <p className={`text-lg font-medium ${
                    overallAchievement >= 100 ? "text-green-800" : overallAchievement >= 90 ? "text-yellow-800" : "text-red-800"
                  }`}>
                    {formatNumber(overallAchievement, 1)}%
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Product Actuals Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-900">Product Actual Sales</h3>
            <button
              onClick={handleAddProductRow}
              disabled={!actualForm.brandCode || !actualForm.month || !actualForm.year || !actualForm.salesChannel}
              className="px-3 py-1.5 text-xs rounded-md text-gray-900 transition-opacity hover:opacity-90 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#F6D400" }}
            >
              <Plus className="w-3 h-3" />
              Add Product
            </button>
          </div>

          {productActuals.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 w-[180px]">Product</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 w-[100px]">SKU</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 w-[90px]">Category</th>
                    {hasTarget && (
                      <>
                        <th className="px-3 py-2 text-right text-xs font-medium text-blue-700 bg-blue-50 w-[90px]">Target Order</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-blue-700 bg-blue-50 w-[90px]">Target Unit</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-blue-700 bg-blue-50 w-[110px]">Target Revenue</th>
                      </>
                    )}
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-700 w-[100px]">Actual Order</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-700 w-[100px]">Actual Unit</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-700 w-[120px]">Actual Revenue</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-700 w-[100px]">Avg Unit/Order</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-700 w-[110px]">Avg Price</th>
                    {hasTarget && (
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-700 w-[100px]">Achievement</th>
                    )}
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-700 w-[50px]"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {productActuals.map((product, index) => (
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
                      {hasTarget && (
                        <>
                          <td className="px-3 py-2 text-xs text-blue-900 text-right bg-blue-50 font-medium">
                            {product.targetOrder ? formatNumber(product.targetOrder) : '-'}
                          </td>
                          <td className="px-3 py-2 text-xs text-blue-900 text-right bg-blue-50 font-medium">
                            {product.targetUnit ? formatNumber(product.targetUnit) : '-'}
                          </td>
                          <td className="px-3 py-2 text-xs text-blue-900 text-right bg-blue-50 font-medium">
                            {product.targetRevenue ? formatCurrency(product.targetRevenue) : '-'}
                          </td>
                        </>
                      )}
                      <td className="px-3 py-2">
                        <Input
                          type="number"
                          value={product.actualOrder || ""}
                          onChange={(e) => handleProductActualChange(index, "actualOrder", e.target.value)}
                          className="w-full text-xs text-right"
                          placeholder={product.targetOrder ? String(product.targetOrder) : "0"}
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          type="number"
                          value={product.actualUnitSold || ""}
                          onChange={(e) => handleProductActualChange(index, "actualUnitSold", e.target.value)}
                          className="w-full text-xs text-right"
                          placeholder={product.targetUnit ? String(product.targetUnit) : "0"}
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          type="number"
                          value={product.actualRevenue || ""}
                          onChange={(e) => handleProductActualChange(index, "actualRevenue", e.target.value)}
                          className="w-full text-xs text-right"
                          placeholder={product.targetRevenue ? String(product.targetRevenue) : "0"}
                        />
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-700 text-right bg-gray-50">
                        {formatNumber(product.avgUnitPerOrder, 2)}
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-700 text-right bg-gray-50">
                        {formatCurrency(product.avgSellingPrice)}
                      </td>
                      {hasTarget && (
                        <td className="px-3 py-2 text-right bg-gray-50">
                          {product.achievementRevenue ? (
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getAchievementColor(product.achievementRevenue)}`}>
                              {formatNumber(product.achievementRevenue, 1)}%
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">-</span>
                          )}
                        </td>
                      )}
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
                style={{ backgroundColor: "#9BC53D15" }}
              >
                <Plus className="w-6 h-6" style={{ color: "#9BC53D" }} />
              </div>
              <p className="text-sm text-gray-600 mb-2">No products added yet</p>
              <p className="text-xs text-gray-500">
                {actualForm.brandCode && actualForm.month && actualForm.year && actualForm.salesChannel
                  ? "Click 'Add Product' to input actual sales"
                  : "Please complete header information first"}
              </p>
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Notes</h3>
          <Textarea
            placeholder="Add notes about this sales data (optional)..."
            value={actualForm.notes}
            onChange={(e) => setActualForm({ ...actualForm, notes: e.target.value })}
            rows={3}
            className="w-full"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              setViewMode("list");
              resetForm();
            }}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveActualSales}
            disabled={productActuals.length === 0}
            className="px-6 py-2 rounded-md text-gray-900 transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#F6D400" }}
          >
            Save Actual Sales
          </button>
        </div>
      </div>
    );
  }

  // DETAIL VIEW
  if (viewMode === "detail" && selectedActual) {
    const hasTarget = !!selectedActual.totalTargetRevenue;

    return (
      <div>
        <div className="mb-6">
          <button
            onClick={() => {
              setViewMode("list");
              setSelectedActual(null);
            }}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to List
          </button>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl text-gray-900 mb-2">Actual Sales Detail</h2>
              <p className="text-sm text-gray-600">
                View actual sales performance vs targets
              </p>
            </div>
            <button
              onClick={handleExport}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Header Information */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Sales Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-xs text-gray-600 mb-1">Period</p>
              <p className="text-sm font-medium text-gray-900">
                {selectedActual.month} {selectedActual.year}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Brand</p>
              <p className="text-sm font-medium text-gray-900">{selectedActual.brand}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Sales Channel</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {selectedActual.salesChannel}
              </span>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Data Source</p>
              <p className="text-sm font-medium text-gray-900">{selectedActual.dataSource}</p>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
            <div className="bg-gray-50 rounded-md p-4">
              <p className="text-xs text-gray-600 mb-1">Actual Revenue</p>
              <p className="text-lg font-medium text-gray-900">
                {formatCurrency(selectedActual.totalActualRevenue)}
              </p>
              {hasTarget && (
                <p className="text-xs text-gray-500 mt-1">
                  Target: {formatCurrency(selectedActual.totalTargetRevenue!)}
                </p>
              )}
            </div>
            <div className="bg-gray-50 rounded-md p-4">
              <p className="text-xs text-gray-600 mb-1">Actual Order</p>
              <p className="text-lg font-medium text-gray-900">
                {formatNumber(selectedActual.totalActualOrder)}
              </p>
            </div>
            <div className="bg-gray-50 rounded-md p-4">
              <p className="text-xs text-gray-600 mb-1">Actual Unit</p>
              <p className="text-lg font-medium text-gray-900">
                {formatNumber(selectedActual.totalActualUnit)}
              </p>
            </div>
            {hasTarget && selectedActual.overallAchievement !== undefined && (
              <div className={`rounded-md p-4 ${
                selectedActual.overallAchievement >= 100 
                  ? "bg-green-50" 
                  : selectedActual.overallAchievement >= 90 
                  ? "bg-yellow-50" 
                  : "bg-red-50"
              }`}>
                <p className="text-xs text-gray-600 mb-1">Overall Achievement</p>
                <p className={`text-lg font-medium ${
                  selectedActual.overallAchievement >= 100 
                    ? "text-green-800" 
                    : selectedActual.overallAchievement >= 90 
                    ? "text-yellow-800" 
                    : "text-red-800"
                }`}>
                  {formatNumber(selectedActual.overallAchievement, 1)}%
                </p>
                <p className="text-xs mt-1">
                  <span className={
                    selectedActual.overallAchievement >= 100 
                      ? "text-green-700" 
                      : selectedActual.overallAchievement >= 90 
                      ? "text-yellow-700" 
                      : "text-red-700"
                  }>
                    {getAchievementStatus(selectedActual.overallAchievement)}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-900">Product Actual Sales</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">SKU</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Category</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700">Actual Order</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700">Actual Unit</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700">Actual Revenue</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700">Avg Unit/Order</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700">Avg Price</th>
                  {hasTarget && (
                    <>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-700">Target Revenue</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-700">Achievement</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {selectedActual.products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900 font-medium">{product.productName}</td>
                    <td className="px-4 py-3 text-gray-700 font-mono text-xs">{product.sku}</td>
                    <td className="px-4 py-3 text-gray-700">{product.category}</td>
                    <td className="px-4 py-3 text-gray-900 text-right">
                      {formatNumber(product.actualOrder)}
                    </td>
                    <td className="px-4 py-3 text-gray-900 text-right">
                      {formatNumber(product.actualUnitSold)}
                    </td>
                    <td className="px-4 py-3 text-gray-900 text-right font-medium">
                      {formatCurrency(product.actualRevenue)}
                    </td>
                    <td className="px-4 py-3 text-gray-700 text-right">
                      {formatNumber(product.avgUnitPerOrder, 2)}
                    </td>
                    <td className="px-4 py-3 text-gray-700 text-right">
                      {formatCurrency(product.avgSellingPrice)}
                    </td>
                    {hasTarget && (
                      <>
                        <td className="px-4 py-3 text-gray-700 text-right">
                          {product.targetRevenue ? formatCurrency(product.targetRevenue) : "-"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {product.achievementRevenue ? (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAchievementColor(product.achievementRevenue)}`}>
                              {formatNumber(product.achievementRevenue, 1)}%
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notes */}
        {selectedActual.notes && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Notes</h3>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedActual.notes}</p>
          </div>
        )}
      </div>
    );
  }

  return null;
}
