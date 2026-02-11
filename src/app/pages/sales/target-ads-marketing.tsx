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

interface ProductMapping {
  id: string;
  productName: string;
  sku: string;
  category: string;
  avgUnitPerOrder: number;
  contributionPercentage: number;
  expectedRevenue: number;
}

interface CampaignData {
  id: string;
  month: string;
  year: string;
  brand: string;
  brandCode: string;
  salesChannel: string;
  adsplatform: string;
  campaignName: string;
  campaignObjective: string;
  campaignType: string;
  adsBudget: number;
  budgetType: string;
  startDate: string;
  endDate: string;
  targetROAS: number;
  targetCPA: number;
  targetCPC: number;
  targetCTR: number;
  targetConversionRate: number;
  expectedRevenue: number;
  estimatedOrder: number;
  estimatedClick: number;
  estimatedUnit: number;
  productMappings: ProductMapping[];
  notes: string;
  status: "Draft" | "Submitted";
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

const salesChannelOptions = ["Shopee", "Tokopedia", "TikTok Shop"];
const adsplatformOptions = ["Meta Ads", "TikTok Ads", "Marketplace Ads"];
const campaignObjectiveOptions = ["Awareness", "Traffic", "Conversion"];
const campaignTypeOptions = ["Always-on", "Promo", "Launch"];
const budgetTypeOptions = ["Daily", "Monthly"];
const monthOptions = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function TargetAdsMarketing() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMonth, setFilterMonth] = useState("All");
  const [filterBrand, setFilterBrand] = useState("All");
  const [filterChannel, setFilterChannel] = useState("All");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignData | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Form state
  const [campaignForm, setCampaignForm] = useState({
    month: "",
    year: "2026",
    brandCode: "",
    salesChannel: "",
    adsplatform: "",
    campaignName: "",
    campaignObjective: "",
    campaignType: "",
    adsBudget: "",
    budgetType: "",
    startDate: "",
    endDate: "",
    targetROAS: "",
    targetCPA: "",
    targetCPC: "",
    targetCTR: "",
    targetConversionRate: "",
    notes: "",
  });

  const [productMappings, setProductMappings] = useState<ProductMapping[]>([]);

  // Mock data
  const mockCampaignData: CampaignData[] = [
    {
      id: "1",
      month: "February",
      year: "2026",
      brand: "Gendes",
      brandCode: "BRD001",
      salesChannel: "Shopee",
      adsplatform: "Meta Ads",
      campaignName: "Gendes Valentine Promo 2026",
      campaignObjective: "Conversion",
      campaignType: "Promo",
      adsBudget: 50000000,
      budgetType: "Monthly",
      startDate: "2026-02-01",
      endDate: "2026-02-28",
      targetROAS: 5.0,
      targetCPA: 125000,
      targetCPC: 2500,
      targetCTR: 3.5,
      targetConversionRate: 2.0,
      expectedRevenue: 250000000,
      estimatedOrder: 400,
      estimatedClick: 20000,
      estimatedUnit: 1600,
      productMappings: [
        {
          id: "1",
          productName: "Gendes foam chocolate",
          sku: "GEN-FCH-001",
          category: "Feminine Hygiene",
          avgUnitPerOrder: 4,
          contributionPercentage: 60,
          expectedRevenue: 150000000,
        },
        {
          id: "2",
          productName: "GENDES Sweet Aromatic Feminine Hygiene Bubblegum Foam 55ml",
          sku: "GEN-SAF-002",
          category: "Feminine Hygiene",
          avgUnitPerOrder: 4,
          contributionPercentage: 40,
          expectedRevenue: 100000000,
        },
      ],
      notes: "Focus on female audience age 18-35. Creative assets ready by Jan 25.",
      status: "Submitted",
      createdBy: "Marketing Manager",
      createdDate: "2026-01-20",
    },
    {
      id: "2",
      month: "March",
      year: "2026",
      brand: "Kavela",
      brandCode: "BRD002",
      salesChannel: "TikTok Shop",
      adsplatform: "TikTok Ads",
      campaignName: "Kavela Always-On March",
      campaignObjective: "Traffic",
      campaignType: "Always-on",
      adsBudget: 30000000,
      budgetType: "Monthly",
      startDate: "2026-03-01",
      endDate: "2026-03-31",
      targetROAS: 4.0,
      targetCPA: 100000,
      targetCPC: 2000,
      targetCTR: 4.0,
      targetConversionRate: 2.5,
      expectedRevenue: 120000000,
      estimatedOrder: 300,
      estimatedClick: 15000,
      estimatedUnit: 900,
      productMappings: [
        {
          id: "3",
          productName: "Mouth Spray Berry Mood 20 ml",
          sku: "KAV-MSB-001",
          category: "Mouth Care",
          avgUnitPerOrder: 3,
          contributionPercentage: 100,
          expectedRevenue: 120000000,
        },
      ],
      notes: "TikTok native content strategy. Daily posting schedule.",
      status: "Draft",
      createdBy: "Marketing Manager",
      createdDate: "2026-02-10",
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const calculateExpectedRevenue = () => {
    const budget = parseFloat(campaignForm.adsBudget) || 0;
    const roas = parseFloat(campaignForm.targetROAS) || 0;
    return budget * roas;
  };

  const calculateEstimatedOrder = () => {
    const budget = parseFloat(campaignForm.adsBudget) || 0;
    const cpa = parseFloat(campaignForm.targetCPA) || 0;
    return cpa > 0 ? budget / cpa : 0;
  };

  const calculateEstimatedClick = () => {
    const budget = parseFloat(campaignForm.adsBudget) || 0;
    const cpc = parseFloat(campaignForm.targetCPC) || 0;
    return cpc > 0 ? budget / cpc : 0;
  };

  const calculateEstimatedUnit = () => {
    const estimatedOrder = calculateEstimatedOrder();
    const avgUnitsPerOrder = productMappings.reduce((sum, pm) => {
      const contribution = pm.contributionPercentage / 100;
      return sum + (pm.avgUnitPerOrder * contribution);
    }, 0);
    return estimatedOrder * avgUnitsPerOrder;
  };

  const getTotalContribution = () => {
    return productMappings.reduce((sum, pm) => sum + pm.contributionPercentage, 0);
  };

  const handleProductMappingChange = (index: number, field: string, value: string) => {
    const updatedMappings = [...productMappings];
    const numValue = parseFloat(value) || 0;

    if (field === "avgUnitPerOrder") {
      updatedMappings[index].avgUnitPerOrder = numValue;
    } else if (field === "contributionPercentage") {
      updatedMappings[index].contributionPercentage = numValue;
    }

    // Recalculate expected revenue per product
    const expectedRevenue = calculateExpectedRevenue();
    updatedMappings[index].expectedRevenue = expectedRevenue * (updatedMappings[index].contributionPercentage / 100);

    setProductMappings(updatedMappings);
  };

  const handleAddProductMapping = () => {
    if (!campaignForm.brandCode) {
      alert("Please select a brand first");
      return;
    }

    const availableProducts = productsByBrand[campaignForm.brandCode] || [];
    const existingProductIds = productMappings.map(pm => pm.id);
    const remainingProducts = availableProducts.filter(p => !existingProductIds.includes(p.id));

    if (remainingProducts.length === 0) {
      alert("All products for this brand have been added");
      return;
    }

    const firstProduct = remainingProducts[0];
    const newMapping: ProductMapping = {
      id: firstProduct.id,
      productName: firstProduct.name,
      sku: firstProduct.sku,
      category: firstProduct.category,
      avgUnitPerOrder: 1,
      contributionPercentage: 0,
      expectedRevenue: 0,
    };

    setProductMappings([...productMappings, newMapping]);
  };

  const handleRemoveProductMapping = (index: number) => {
    setProductMappings(productMappings.filter((_, i) => i !== index));
  };

  const handleProductSelect = (index: number, productId: string) => {
    const product = (productsByBrand[campaignForm.brandCode] || []).find(p => p.id === productId);
    if (!product) return;

    const updatedMappings = [...productMappings];
    updatedMappings[index] = {
      ...updatedMappings[index],
      id: product.id,
      productName: product.name,
      sku: product.sku,
      category: product.category,
    };

    setProductMappings(updatedMappings);
  };

  const handleSaveDraft = () => {
    if (!campaignForm.month || !campaignForm.year || !campaignForm.brandCode || !campaignForm.campaignName) {
      alert("Please fill all required fields");
      return;
    }

    if (productMappings.length === 0) {
      alert("Please add at least one product mapping");
      return;
    }

    const totalContribution = getTotalContribution();
    if (totalContribution !== 100) {
      alert(`Total contribution percentage must equal 100%. Current total: ${totalContribution}%`);
      return;
    }

    console.log("Saving draft:", { campaignForm, productMappings });
    alert("Campaign saved as draft!");
    
    // Reset and go back
    resetForm();
    setViewMode("list");
  };

  const handleSubmit = () => {
    if (!campaignForm.month || !campaignForm.year || !campaignForm.brandCode || !campaignForm.campaignName) {
      alert("Please fill all required fields");
      return;
    }

    if (productMappings.length === 0) {
      alert("Please add at least one product mapping");
      return;
    }

    const totalContribution = getTotalContribution();
    if (totalContribution !== 100) {
      alert(`Total contribution percentage must equal 100%. Current total: ${totalContribution}%`);
      return;
    }

    console.log("Submitting campaign:", { campaignForm, productMappings });
    alert("Campaign submitted successfully!");
    
    // Reset and go back
    resetForm();
    setViewMode("list");
  };

  const resetForm = () => {
    setCampaignForm({
      month: "",
      year: "2026",
      brandCode: "",
      salesChannel: "",
      adsplatform: "",
      campaignName: "",
      campaignObjective: "",
      campaignType: "",
      adsBudget: "",
      budgetType: "",
      startDate: "",
      endDate: "",
      targetROAS: "",
      targetCPA: "",
      targetCPC: "",
      targetCTR: "",
      targetConversionRate: "",
      notes: "",
    });
    setProductMappings([]);
  };

  const handleExport = () => {
    alert("Exporting campaign data to Excel...");
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

  const handleViewDetail = (campaign: CampaignData) => {
    setSelectedCampaign(campaign);
    setViewMode("detail");
  };

  const handleDelete = (campaign: CampaignData) => {
    setSelectedCampaign(campaign);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    console.log("Deleting campaign:", selectedCampaign);
    alert("Campaign deleted successfully!");
    setShowDeleteModal(false);
    setSelectedCampaign(null);
  };

  const getBrandName = (brandCode: string) => {
    return brandOptions.find(b => b.code === brandCode)?.name || brandCode;
  };

  const filteredData = mockCampaignData.filter((campaign) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      campaign.brand.toLowerCase().includes(searchLower) ||
      campaign.campaignName.toLowerCase().includes(searchLower) ||
      campaign.salesChannel.toLowerCase().includes(searchLower) ||
      campaign.month.toLowerCase().includes(searchLower);

    const matchesMonth = filterMonth === "All" || campaign.month === filterMonth;
    const matchesBrand = filterBrand === "All" || campaign.brandCode === filterBrand;
    const matchesChannel = filterChannel === "All" || campaign.salesChannel === filterChannel;

    return matchesSearch && matchesMonth && matchesBrand && matchesChannel;
  });

  const availableProductsForSelect = (currentProductId: string) => {
    const existingIds = productMappings.map(pm => pm.id).filter(id => id !== currentProductId);
    return (productsByBrand[campaignForm.brandCode] || []).filter(p => !existingIds.includes(p.id));
  };

  // LIST VIEW
  if (viewMode === "list") {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-gray-600">
            Plan and manage advertising & marketing campaigns with budget and KPI targets
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
              Create Campaign
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by campaign name, brand, channel..."
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
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Campaign Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Period</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Brand</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Channel</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Ads Platform</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-700">Ads Budget</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-700">Expected Revenue</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Status</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredData.map((campaign) => (
                    <tr key={campaign.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900 font-medium">{campaign.campaignName}</td>
                      <td className="px-4 py-3 text-gray-700">
                        {campaign.month} {campaign.year}
                      </td>
                      <td className="px-4 py-3 text-gray-900">{campaign.brand}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {campaign.salesChannel}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{campaign.adsplatform}</td>
                      <td className="px-4 py-3 text-gray-900 text-right font-medium">
                        {formatCurrency(campaign.adsBudget)}
                      </td>
                      <td className="px-4 py-3 text-gray-900 text-right font-medium">
                        {formatCurrency(campaign.expectedRevenue)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          campaign.status === "Submitted" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {campaign.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleViewDetail(campaign)}
                            className="p-1.5 text-gray-600 hover:text-[#6CC7C3] hover:bg-[#6CC7C315] rounded transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(campaign)}
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
                Showing {filteredData.length} of {mockCampaignData.length} campaigns
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#F26C8A15" }}
            >
              <Search className="w-8 h-8" style={{ color: "#F26C8A" }} />
            </div>
            <h3 className="text-base text-gray-900 mb-2">No Campaigns Found</h3>
            <p className="text-sm text-gray-600 mb-6">
              {searchTerm
                ? "Try adjusting your search or filters"
                : "Create your first campaign to get started"}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setViewMode("create")}
                className="px-4 py-2 rounded-md text-gray-900 transition-opacity hover:opacity-90 inline-flex items-center gap-2"
                style={{ backgroundColor: "#F6D400" }}
              >
                <Plus className="w-4 h-4" />
                Create Campaign
              </button>
            )}
          </div>
        )}

        {/* Delete Modal */}
        <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle>Delete Campaign</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this campaign? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            {selectedCampaign && (
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4 my-4">
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Campaign Name:</span>
                    <span className="text-gray-900 font-medium">{selectedCampaign.campaignName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Brand:</span>
                    <span className="text-gray-900 font-medium">{selectedCampaign.brand}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ads Budget:</span>
                    <span className="text-gray-900 font-medium">
                      {formatCurrency(selectedCampaign.adsBudget)}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedCampaign(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete Campaign
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Import Modal */}
        <Dialog open={showImportModal} onOpenChange={setShowImportModal}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Import Campaign Data</DialogTitle>
              <DialogDescription>
                Upload an Excel file (.xlsx, .xls) containing campaign data. Download the template for the correct format.
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
    const expectedRevenue = calculateExpectedRevenue();
    const estimatedOrder = calculateEstimatedOrder();
    const estimatedClick = calculateEstimatedClick();
    const estimatedUnit = calculateEstimatedUnit();
    const totalContribution = getTotalContribution();

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
          <h2 className="text-xl text-gray-900 mb-2">Create Ads & Marketing Campaign</h2>
          <p className="text-sm text-gray-600">
            Plan campaign budget, set KPI targets, and map product contributions
          </p>
        </div>

        {/* Campaign Header */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Campaign Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="month" className="text-xs">Month *</Label>
              <select
                id="month"
                value={campaignForm.month}
                onChange={(e) => setCampaignForm({ ...campaignForm, month: e.target.value })}
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
                value={campaignForm.year}
                onChange={(e) => setCampaignForm({ ...campaignForm, year: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="brand" className="text-xs">Brand *</Label>
              <select
                id="brand"
                value={campaignForm.brandCode}
                onChange={(e) => {
                  setCampaignForm({ ...campaignForm, brandCode: e.target.value });
                  setProductMappings([]);
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
                value={campaignForm.salesChannel}
                onChange={(e) => setCampaignForm({ ...campaignForm, salesChannel: e.target.value })}
                className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC7C3]"
              >
                <option value="">Select Channel</option>
                {salesChannelOptions.map((channel) => (
                  <option key={channel} value={channel}>{channel}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="adsplatform" className="text-xs">Ads Platform *</Label>
              <select
                id="adsplatform"
                value={campaignForm.adsplatform}
                onChange={(e) => setCampaignForm({ ...campaignForm, adsplatform: e.target.value })}
                className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC7C3]"
              >
                <option value="">Select Platform</option>
                {adsplatformOptions.map((platform) => (
                  <option key={platform} value={platform}>{platform}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="campaignName" className="text-xs">Campaign Name *</Label>
              <Input
                id="campaignName"
                type="text"
                placeholder="e.g., Valentine Promo 2026"
                value={campaignForm.campaignName}
                onChange={(e) => setCampaignForm({ ...campaignForm, campaignName: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="campaignObjective" className="text-xs">Campaign Objective *</Label>
              <select
                id="campaignObjective"
                value={campaignForm.campaignObjective}
                onChange={(e) => setCampaignForm({ ...campaignForm, campaignObjective: e.target.value })}
                className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC7C3]"
              >
                <option value="">Select Objective</option>
                {campaignObjectiveOptions.map((obj) => (
                  <option key={obj} value={obj}>{obj}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="campaignType" className="text-xs">Campaign Type *</Label>
              <select
                id="campaignType"
                value={campaignForm.campaignType}
                onChange={(e) => setCampaignForm({ ...campaignForm, campaignType: e.target.value })}
                className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC7C3]"
              >
                <option value="">Select Type</option>
                {campaignTypeOptions.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Budget Setting */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Budget Setting</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="adsBudget" className="text-xs">Ads Budget (Rp) *</Label>
              <Input
                id="adsBudget"
                type="number"
                placeholder="e.g., 50000000"
                value={campaignForm.adsBudget}
                onChange={(e) => setCampaignForm({ ...campaignForm, adsBudget: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="budgetType" className="text-xs">Budget Type *</Label>
              <select
                id="budgetType"
                value={campaignForm.budgetType}
                onChange={(e) => setCampaignForm({ ...campaignForm, budgetType: e.target.value })}
                className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC7C3]"
              >
                <option value="">Select Type</option>
                {budgetTypeOptions.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="startDate" className="text-xs">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={campaignForm.startDate}
                onChange={(e) => setCampaignForm({ ...campaignForm, startDate: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="endDate" className="text-xs">End Date *</Label>
              <Input
                id="endDate"
                type="date"
                value={campaignForm.endDate}
                onChange={(e) => setCampaignForm({ ...campaignForm, endDate: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Target KPI */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Target KPI</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="targetROAS" className="text-xs">Target ROAS</Label>
              <Input
                id="targetROAS"
                type="number"
                step="0.1"
                placeholder="e.g., 5.0"
                value={campaignForm.targetROAS}
                onChange={(e) => setCampaignForm({ ...campaignForm, targetROAS: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="targetCPA" className="text-xs">Target CPA (Rp)</Label>
              <Input
                id="targetCPA"
                type="number"
                placeholder="e.g., 125000"
                value={campaignForm.targetCPA}
                onChange={(e) => setCampaignForm({ ...campaignForm, targetCPA: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="targetCPC" className="text-xs">Target CPC (Rp)</Label>
              <Input
                id="targetCPC"
                type="number"
                placeholder="e.g., 2500"
                value={campaignForm.targetCPC}
                onChange={(e) => setCampaignForm({ ...campaignForm, targetCPC: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="targetCTR" className="text-xs">Target CTR (%)</Label>
              <Input
                id="targetCTR"
                type="number"
                step="0.1"
                placeholder="e.g., 3.5"
                value={campaignForm.targetCTR}
                onChange={(e) => setCampaignForm({ ...campaignForm, targetCTR: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="targetConversionRate" className="text-xs">Target Conversion Rate (%)</Label>
              <Input
                id="targetConversionRate"
                type="number"
                step="0.1"
                placeholder="e.g., 2.0"
                value={campaignForm.targetConversionRate}
                onChange={(e) => setCampaignForm({ ...campaignForm, targetConversionRate: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Estimated Result (Read-only) */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Estimated Result (Auto-calculated)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-md p-4">
              <p className="text-xs text-gray-600 mb-1">Expected Revenue</p>
              <p className="text-lg font-medium text-gray-900">{formatCurrency(expectedRevenue)}</p>
              <p className="text-xs text-gray-500 mt-1">Budget × ROAS</p>
            </div>
            <div className="bg-gray-50 rounded-md p-4">
              <p className="text-xs text-gray-600 mb-1">Estimated Order</p>
              <p className="text-lg font-medium text-gray-900">{formatNumber(Math.round(estimatedOrder))}</p>
              <p className="text-xs text-gray-500 mt-1">Budget ÷ CPA</p>
            </div>
            <div className="bg-gray-50 rounded-md p-4">
              <p className="text-xs text-gray-600 mb-1">Estimated Click</p>
              <p className="text-lg font-medium text-gray-900">{formatNumber(Math.round(estimatedClick))}</p>
              <p className="text-xs text-gray-500 mt-1">Budget ÷ CPC</p>
            </div>
            <div className="bg-gray-50 rounded-md p-4">
              <p className="text-xs text-gray-600 mb-1">Estimated Unit</p>
              <p className="text-lg font-medium text-gray-900">{formatNumber(Math.round(estimatedUnit))}</p>
              <p className="text-xs text-gray-500 mt-1">Order × Avg Unit</p>
            </div>
          </div>
        </div>

        {/* Product Mapping */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Product Mapping</h3>
              <p className="text-xs text-gray-600 mt-1">
                Total contribution: {totalContribution}% 
                {totalContribution !== 100 && (
                  <span className="text-red-600 ml-2">
                    (Must equal 100%)
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={handleAddProductMapping}
              disabled={!campaignForm.brandCode}
              className="px-3 py-1.5 text-xs rounded-md text-gray-900 transition-opacity hover:opacity-90 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#F6D400" }}
            >
              <Plus className="w-3 h-3" />
              Add Product
            </button>
          </div>

          {productMappings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 w-[200px]">Product</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 w-[120px]">SKU</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 w-[100px]">Category</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-700 w-[120px]">Avg Unit per Order</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-700 w-[120px]">Contribution %</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-700 w-[140px]">Expected Revenue</th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-700 w-[50px]"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {productMappings.map((product, index) => (
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
                          value={product.avgUnitPerOrder}
                          onChange={(e) => handleProductMappingChange(index, "avgUnitPerOrder", e.target.value)}
                          className="w-full text-xs text-right"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={product.contributionPercentage}
                          onChange={(e) => handleProductMappingChange(index, "contributionPercentage", e.target.value)}
                          className="w-full text-xs text-right"
                        />
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-700 text-right bg-gray-50 font-medium">
                        {formatCurrency(product.expectedRevenue)}
                      </td>
                      <td className="px-3 py-2 text-center">
                        <button
                          onClick={() => handleRemoveProductMapping(index)}
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
                style={{ backgroundColor: "#F26C8A15" }}
              >
                <Plus className="w-6 h-6" style={{ color: "#F26C8A" }} />
              </div>
              <p className="text-sm text-gray-600 mb-2">No products added yet</p>
              <p className="text-xs text-gray-500">
                {campaignForm.brandCode
                  ? "Click 'Add Product' to map campaign products"
                  : "Please select a brand first"}
              </p>
            </div>
          )}
        </div>

        {/* Notes / Assumptions */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Notes / Assumptions</h3>
          <Textarea
            placeholder="Add campaign notes, assumptions, or special considerations..."
            value={campaignForm.notes}
            onChange={(e) => setCampaignForm({ ...campaignForm, notes: e.target.value })}
            rows={4}
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
            onClick={handleSaveDraft}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Save Draft
          </button>
          <button
            onClick={handleSubmit}
            disabled={totalContribution !== 100}
            className="px-6 py-2 rounded-md text-gray-900 transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#F6D400" }}
          >
            Submit Campaign
          </button>
        </div>
      </div>
    );
  }

  // DETAIL VIEW
  if (viewMode === "detail" && selectedCampaign) {
    return (
      <div>
        <div className="mb-6">
          <button
            onClick={() => {
              setViewMode("list");
              setSelectedCampaign(null);
            }}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to List
          </button>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl text-gray-900 mb-2">Campaign Detail</h2>
              <p className="text-sm text-gray-600">
                View detailed campaign planning and KPI targets
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

        {/* Campaign Information */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Campaign Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-xs text-gray-600 mb-1">Campaign Name</p>
              <p className="text-sm font-medium text-gray-900">{selectedCampaign.campaignName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Period</p>
              <p className="text-sm font-medium text-gray-900">
                {selectedCampaign.month} {selectedCampaign.year}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Brand</p>
              <p className="text-sm font-medium text-gray-900">{selectedCampaign.brand}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Sales Channel</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {selectedCampaign.salesChannel}
              </span>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Ads Platform</p>
              <p className="text-sm font-medium text-gray-900">{selectedCampaign.adsplatform}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Campaign Objective</p>
              <p className="text-sm font-medium text-gray-900">{selectedCampaign.campaignObjective}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Campaign Type</p>
              <p className="text-sm font-medium text-gray-900">{selectedCampaign.campaignType}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Status</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                selectedCampaign.status === "Submitted" 
                  ? "bg-green-100 text-green-800" 
                  : "bg-gray-100 text-gray-800"
              }`}>
                {selectedCampaign.status}
              </span>
            </div>
          </div>
        </div>

        {/* Budget & Timeline */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Budget & Timeline</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-xs text-gray-600 mb-1">Ads Budget</p>
              <p className="text-lg font-medium text-gray-900">{formatCurrency(selectedCampaign.adsBudget)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Budget Type</p>
              <p className="text-sm font-medium text-gray-900">{selectedCampaign.budgetType}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Start Date</p>
              <p className="text-sm font-medium text-gray-900">{formatDate(selectedCampaign.startDate)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">End Date</p>
              <p className="text-sm font-medium text-gray-900">{formatDate(selectedCampaign.endDate)}</p>
            </div>
          </div>
        </div>

        {/* Target KPI */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Target KPI</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div>
              <p className="text-xs text-gray-600 mb-1">Target ROAS</p>
              <p className="text-lg font-medium text-gray-900">{selectedCampaign.targetROAS.toFixed(1)}x</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Target CPA</p>
              <p className="text-lg font-medium text-gray-900">{formatCurrency(selectedCampaign.targetCPA)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Target CPC</p>
              <p className="text-lg font-medium text-gray-900">{formatCurrency(selectedCampaign.targetCPC)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Target CTR</p>
              <p className="text-lg font-medium text-gray-900">{selectedCampaign.targetCTR}%</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Target Conversion Rate</p>
              <p className="text-lg font-medium text-gray-900">{selectedCampaign.targetConversionRate}%</p>
            </div>
          </div>
        </div>

        {/* Estimated Result */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Estimated Result</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-md p-4">
              <p className="text-xs text-gray-600 mb-1">Expected Revenue</p>
              <p className="text-lg font-medium text-gray-900">{formatCurrency(selectedCampaign.expectedRevenue)}</p>
            </div>
            <div className="bg-gray-50 rounded-md p-4">
              <p className="text-xs text-gray-600 mb-1">Estimated Order</p>
              <p className="text-lg font-medium text-gray-900">{formatNumber(selectedCampaign.estimatedOrder)}</p>
            </div>
            <div className="bg-gray-50 rounded-md p-4">
              <p className="text-xs text-gray-600 mb-1">Estimated Click</p>
              <p className="text-lg font-medium text-gray-900">{formatNumber(selectedCampaign.estimatedClick)}</p>
            </div>
            <div className="bg-gray-50 rounded-md p-4">
              <p className="text-xs text-gray-600 mb-1">Estimated Unit</p>
              <p className="text-lg font-medium text-gray-900">{formatNumber(selectedCampaign.estimatedUnit)}</p>
            </div>
          </div>
        </div>

        {/* Product Mapping */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-900">Product Mapping</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">SKU</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Category</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700">Avg Unit per Order</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700">Contribution %</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700">Expected Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {selectedCampaign.productMappings.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900 font-medium">{product.productName}</td>
                    <td className="px-4 py-3 text-gray-700 font-mono text-xs">{product.sku}</td>
                    <td className="px-4 py-3 text-gray-700">{product.category}</td>
                    <td className="px-4 py-3 text-gray-900 text-right">{product.avgUnitPerOrder}</td>
                    <td className="px-4 py-3 text-gray-900 text-right">{product.contributionPercentage}%</td>
                    <td className="px-4 py-3 text-gray-900 text-right font-medium">
                      {formatCurrency(product.expectedRevenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notes */}
        {selectedCampaign.notes && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Notes / Assumptions</h3>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedCampaign.notes}</p>
          </div>
        )}
      </div>
    );
  }

  return null;
}
