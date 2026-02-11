import { useState } from "react";
import { Plus, Upload, Download, Search, Edit, Trash2, X, FileUp, Filter } from "lucide-react";
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

interface ProductData {
  id: string;
  brandCode: string;
  brandName: string;
  productName: string;
  sku: string;
  price: number;
  status: "Active" | "Inactive";
  lastUpdated: string;
  createdBy: string;
}

// Mock brand data - should match Master Brand
const brandOptions = [
  { code: "BRD001", name: "Gendes" },
  { code: "BRD002", name: "Kavela" },
  { code: "BRD003", name: "IM Man" },
  { code: "BRD004", name: "SYMS" },
];

export default function MasterProduct() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Form state
  const [productForm, setProductForm] = useState({
    brandCode: "",
    productName: "",
    sku: "",
    price: "",
    status: "Active" as "Active" | "Inactive",
  });

  // Mock data
  const productData: ProductData[] = [
    {
      id: "1",
      brandCode: "BRD001",
      brandName: "Gendes",
      productName: "Gendes foam chocolate",
      sku: "GEN-FCH-001",
      price: 35000,
      status: "Active",
      lastUpdated: "2024-02-10",
      createdBy: "Sales Manager",
    },
    {
      id: "2",
      brandCode: "BRD001",
      brandName: "Gendes",
      productName: "GENDES Sweet Aromatic Feminine Hygiene Bubblegum Foam 55ml",
      sku: "GEN-SAF-002",
      price: 42000,
      status: "Active",
      lastUpdated: "2024-02-10",
      createdBy: "Sales Manager",
    },
    {
      id: "3",
      brandCode: "BRD002",
      brandName: "Kavela",
      productName: "Mouth Spray Berry Mood 20 ml",
      sku: "KAV-MSB-001",
      price: 28000,
      status: "Active",
      lastUpdated: "2024-02-08",
      createdBy: "Sales Manager",
    },
    {
      id: "4",
      brandCode: "BRD002",
      brandName: "Kavela",
      productName: "Mouth Spray Lychee Love 20 ml",
      sku: "KAV-MSL-002",
      price: 28000,
      status: "Active",
      lastUpdated: "2024-02-08",
      createdBy: "Sales Manager",
    },
    {
      id: "5",
      brandCode: "BRD003",
      brandName: "IM Man",
      productName: "I'm Man Spray Fresh Lemon",
      sku: "IMM-SFL-001",
      price: 32000,
      status: "Active",
      lastUpdated: "2024-02-09",
      createdBy: "Sales Manager",
    },
    {
      id: "6",
      brandCode: "BRD003",
      brandName: "IM Man",
      productName: "I'm Man Spray Splash Cola",
      sku: "IMM-SSC-002",
      price: 32000,
      status: "Active",
      lastUpdated: "2024-02-09",
      createdBy: "Sales Manager",
    },
    {
      id: "7",
      brandCode: "BRD004",
      brandName: "SYMS",
      productName: "SYMS Hair Tonic Rosemary Foam 60 ml",
      sku: "SYM-HTR-001",
      price: 48000,
      status: "Active",
      lastUpdated: "2024-02-07",
      createdBy: "Sales Manager",
    },
    {
      id: "8",
      brandCode: "BRD004",
      brandName: "SYMS",
      productName: "SYMS Hair Serum Rosemary Oil 30 ml",
      sku: "SYM-HSR-002",
      price: 65000,
      status: "Active",
      lastUpdated: "2024-02-07",
      createdBy: "Sales Manager",
    },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const filteredData = productData.filter((product) => {
    const matchesSearch =
      product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brandName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBrand =
      selectedBrand === "All" || product.brandCode === selectedBrand;

    return matchesSearch && matchesBrand;
  });

  const handleAddProduct = () => {
    console.log("Add product:", productForm);
    setShowAddModal(false);
    setProductForm({
      brandCode: "",
      productName: "",
      sku: "",
      price: "",
      status: "Active",
    });
  };

  const handleEditProduct = () => {
    console.log("Edit product:", selectedProduct, productForm);
    setShowEditModal(false);
    setSelectedProduct(null);
    setProductForm({
      brandCode: "",
      productName: "",
      sku: "",
      price: "",
      status: "Active",
    });
  };

  const handleDeleteProduct = () => {
    console.log("Delete product:", selectedProduct);
    setShowDeleteModal(false);
    setSelectedProduct(null);
  };

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
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
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleImport = () => {
    console.log("Import file:", uploadedFile);
    setShowImportModal(false);
    setUploadedFile(null);
  };

  const handleExport = () => {
    console.log("Exporting products...", filteredData);
    // Mock export functionality
    alert(`Exporting ${filteredData.length} products to Excel...`);
  };

  const openEditModal = (product: ProductData) => {
    setSelectedProduct(product);
    setProductForm({
      brandCode: product.brandCode,
      productName: product.productName,
      sku: product.sku,
      price: product.price.toString(),
      status: product.status,
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (product: ProductData) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const getBrandName = (brandCode: string) => {
    return brandOptions.find((b) => b.code === brandCode)?.name || brandCode;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-gray-600">
          Manage product master data for sales tracking and analytics
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Product
          </button>
          <button
            onClick={() => setShowImportModal(true)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Import Product
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-md text-gray-900 transition-opacity hover:opacity-90 flex items-center gap-2"
            style={{ backgroundColor: "#F6D400" }}
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Brand Filter */}
          <div>
            <label className="block text-xs text-gray-600 mb-2 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Filter by Brand
            </label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC7C3]"
            >
              <option value="All">All Brands</option>
              {brandOptions.map((brand) => (
                <option key={brand.code} value={brand.code}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div>
            <label className="block text-xs text-gray-600 mb-2 flex items-center gap-1">
              <Search className="w-3 h-3" />
              Search
            </label>
            <input
              type="text"
              placeholder="Search by product name, SKU, or brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC7C3]"
            />
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
                    Brand
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                    Product Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                    SKU
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                    Last Updated
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900 font-medium">
                      {product.brandName}
                    </td>
                    <td className="px-4 py-3 text-gray-900">{product.productName}</td>
                    <td className="px-4 py-3 text-gray-700 font-mono text-xs">
                      {product.sku}
                    </td>
                    <td className="px-4 py-3 text-gray-900 text-right font-medium">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {formatDate(product.lastUpdated)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-1.5 text-gray-600 hover:text-[#6CC7C3] hover:bg-[#6CC7C315] rounded transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(product)}
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
              Showing {filteredData.length} of {productData.length} products
              {selectedBrand !== "All" && ` in ${getBrandName(selectedBrand)}`}
            </p>
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
          <h3 className="text-base text-gray-900 mb-2">No Product Data Found</h3>
          <p className="text-sm text-gray-600 mb-6">
            {searchTerm || selectedBrand !== "All"
              ? "Try adjusting your filters"
              : "Add your first product to get started"}
          </p>
          {!searchTerm && selectedBrand === "All" && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-md text-gray-900 transition-opacity hover:opacity-90 inline-flex items-center gap-2"
              style={{ backgroundColor: "#F6D400" }}
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          )}
        </div>
      )}

      {/* Add Product Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Create a new product. SKU must be unique across all products.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="brand">Brand</Label>
              <select
                id="brand"
                value={productForm.brandCode}
                onChange={(e) =>
                  setProductForm({ ...productForm, brandCode: e.target.value })
                }
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6CC7C3]"
              >
                <option value="">Select Brand</option>
                {brandOptions.map((brand) => (
                  <option key={brand.code} value={brand.code}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="productName">Product Name</Label>
              <Input
                id="productName"
                placeholder="e.g., Premium Blazer Black"
                value={productForm.productName}
                onChange={(e) =>
                  setProductForm({ ...productForm, productName: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                placeholder="e.g., PRE-BLZ-001"
                value={productForm.sku}
                onChange={(e) =>
                  setProductForm({ ...productForm, sku: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Price (IDR)</Label>
              <Input
                id="price"
                type="number"
                placeholder="e.g., 1250000"
                value={productForm.price}
                onChange={(e) =>
                  setProductForm({ ...productForm, price: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={productForm.status}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    status: e.target.value as "Active" | "Inactive",
                  })
                }
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6CC7C3]"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={() => {
                setShowAddModal(false);
                setProductForm({
                  brandCode: "",
                  productName: "",
                  sku: "",
                  price: "",
                  status: "Active",
                });
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddProduct}
              disabled={
                !productForm.brandCode ||
                !productForm.productName ||
                !productForm.sku ||
                !productForm.price
              }
              className="px-4 py-2 rounded-md text-gray-900 transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#F6D400" }}
            >
              Add Product
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update product information. Changes will affect all related sales data.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="editBrand">Brand</Label>
              <select
                id="editBrand"
                value={productForm.brandCode}
                onChange={(e) =>
                  setProductForm({ ...productForm, brandCode: e.target.value })
                }
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6CC7C3]"
              >
                {brandOptions.map((brand) => (
                  <option key={brand.code} value={brand.code}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editProductName">Product Name</Label>
              <Input
                id="editProductName"
                value={productForm.productName}
                onChange={(e) =>
                  setProductForm({ ...productForm, productName: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editSku">SKU</Label>
              <Input
                id="editSku"
                value={productForm.sku}
                onChange={(e) =>
                  setProductForm({ ...productForm, sku: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editPrice">Price (IDR)</Label>
              <Input
                id="editPrice"
                type="number"
                value={productForm.price}
                onChange={(e) =>
                  setProductForm({ ...productForm, price: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editStatus">Status</Label>
              <select
                id="editStatus"
                value={productForm.status}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    status: e.target.value as "Active" | "Inactive",
                  })
                }
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6CC7C3]"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={() => {
                setShowEditModal(false);
                setSelectedProduct(null);
                setProductForm({
                  brandCode: "",
                  productName: "",
                  sku: "",
                  price: "",
                  status: "Active",
                });
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleEditProduct}
              disabled={
                !productForm.brandCode ||
                !productForm.productName ||
                !productForm.sku ||
                !productForm.price
              }
              className="px-4 py-2 rounded-md text-gray-900 transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#F6D400" }}
            >
              Save Changes
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be
              undone and will affect all related sales data.
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4 my-4">
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Brand:</span>
                  <span className="text-gray-900 font-medium">
                    {selectedProduct.brandName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Product Name:</span>
                  <span className="text-gray-900 font-medium">
                    {selectedProduct.productName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">SKU:</span>
                  <span className="text-gray-900 font-medium font-mono text-xs">
                    {selectedProduct.sku}
                  </span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <button
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedProduct(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteProduct}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Delete Product
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Product Modal */}
      <Dialog open={showImportModal} onOpenChange={setShowImportModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Import Product Data</DialogTitle>
            <DialogDescription>
              Upload an Excel file (.xlsx, .xls) containing product data. Download the
              template for the correct format.
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
                    <p className="text-sm font-medium text-gray-900">
                      {uploadedFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(uploadedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <button
                    onClick={() => setUploadedFile(null)}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-sm text-gray-700 mb-1">
                    Drag and drop your file here, or{" "}
                    <label className="text-[#6CC7C3] hover:underline cursor-pointer">
                      browse
                      <input
                        type="file"
                        className="hidden"
                        accept=".xlsx,.xls"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleFileUpload(e.target.files[0]);
                          }
                        }}
                      />
                    </label>
                  </p>
                  <p className="text-xs text-gray-500">Excel files only (.xlsx, .xls)</p>
                </>
              )}
            </div>

            <button
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
              Import
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}