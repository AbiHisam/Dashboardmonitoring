import { useState } from "react";
import { Plus, Upload, Download, Search, Edit, Trash2, X, FileUp } from "lucide-react";
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

interface BrandData {
  id: string;
  brandCode: string;
  brandName: string;
  status: "Active" | "Inactive";
  createdDate: string;
  lastUpdated: string;
  createdBy: string;
}

export default function MasterBrand() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<BrandData | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Form state
  const [brandForm, setBrandForm] = useState({
    brandCode: "",
    brandName: "",
    status: "Active" as "Active" | "Inactive",
  });

  // Mock data
  const brandData: BrandData[] = [
    {
      id: "1",
      brandCode: "BRD001",
      brandName: "Gendes",
      status: "Active",
      createdDate: "2024-01-15",
      lastUpdated: "2024-02-10",
      createdBy: "Sales Manager",
    },
    {
      id: "2",
      brandCode: "BRD002",
      brandName: "Kavela",
      status: "Active",
      createdDate: "2024-01-15",
      lastUpdated: "2024-01-15",
      createdBy: "Sales Manager",
    },
    {
      id: "3",
      brandCode: "BRD003",
      brandName: "IM Man",
      status: "Active",
      createdDate: "2024-01-20",
      lastUpdated: "2024-02-05",
      createdBy: "Sales Manager",
    },
    {
      id: "4",
      brandCode: "BRD004",
      brandName: "SYMS",
      status: "Active",
      createdDate: "2024-01-22",
      lastUpdated: "2024-01-22",
      createdBy: "Sales Manager",
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const filteredData = brandData.filter(
    (brand) =>
      brand.brandCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brand.brandName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddBrand = () => {
    console.log("Add brand:", brandForm);
    setShowAddModal(false);
    setBrandForm({ brandCode: "", brandName: "", status: "Active" });
  };

  const handleEditBrand = () => {
    console.log("Edit brand:", selectedBrand, brandForm);
    setShowEditModal(false);
    setSelectedBrand(null);
    setBrandForm({ brandCode: "", brandName: "", status: "Active" });
  };

  const handleDeleteBrand = () => {
    console.log("Delete brand:", selectedBrand);
    setShowDeleteModal(false);
    setSelectedBrand(null);
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

  const openEditModal = (brand: BrandData) => {
    setSelectedBrand(brand);
    setBrandForm({
      brandCode: brand.brandCode,
      brandName: brand.brandName,
      status: brand.status,
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (brand: BrandData) => {
    setSelectedBrand(brand);
    setShowDeleteModal(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-gray-600">
          Manage brand master data for sales tracking and analytics
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setShowImportModal(true)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Import Brand
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-md text-gray-900 transition-opacity hover:opacity-90 flex items-center gap-2"
            style={{ backgroundColor: "#F6D400" }}
          >
            <Plus className="w-4 h-4" />
            Add Brand
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by brand code or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6CC7C3]"
          />
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
                    Brand Code
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                    Brand Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                    Created Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                    Last Updated
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
                {filteredData.map((brand) => (
                  <tr key={brand.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900 font-medium">
                      {brand.brandCode}
                    </td>
                    <td className="px-4 py-3 text-gray-900">{brand.brandName}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          brand.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {brand.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {formatDate(brand.createdDate)}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {formatDate(brand.lastUpdated)}
                    </td>
                    <td className="px-4 py-3 text-gray-700 text-xs">
                      {brand.createdBy}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(brand)}
                          className="p-1.5 text-gray-600 hover:text-[#6CC7C3] hover:bg-[#6CC7C315] rounded transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(brand)}
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
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <div
            className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#6CC7C315" }}
          >
            <Download className="w-8 h-8" style={{ color: "#6CC7C3" }} />
          </div>
          <h3 className="text-base text-gray-900 mb-2">No Brand Data Found</h3>
          <p className="text-sm text-gray-600 mb-6">
            {searchTerm
              ? "Try adjusting your search criteria"
              : "Add your first brand to get started"}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-md text-gray-900 transition-opacity hover:opacity-90 inline-flex items-center gap-2"
              style={{ backgroundColor: "#F6D400" }}
            >
              <Plus className="w-4 h-4" />
              Add Brand
            </button>
          )}
        </div>
      )}

      {/* Add Brand Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Brand</DialogTitle>
            <DialogDescription>
              Create a new brand for sales tracking. Brand code must be unique.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="brandCode">Brand Code</Label>
              <Input
                id="brandCode"
                placeholder="e.g., BRD006"
                value={brandForm.brandCode}
                onChange={(e) =>
                  setBrandForm({ ...brandForm, brandCode: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="brandName">Brand Name</Label>
              <Input
                id="brandName"
                placeholder="e.g., Marui Luxury"
                value={brandForm.brandName}
                onChange={(e) =>
                  setBrandForm({ ...brandForm, brandName: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={brandForm.status}
                onChange={(e) =>
                  setBrandForm({
                    ...brandForm,
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
                setBrandForm({ brandCode: "", brandName: "", status: "Active" });
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddBrand}
              disabled={!brandForm.brandCode || !brandForm.brandName}
              className="px-4 py-2 rounded-md text-gray-900 transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#F6D400" }}
            >
              Add Brand
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Brand Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Brand</DialogTitle>
            <DialogDescription>
              Update brand information. Changes will affect all related sales data.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="editBrandCode">Brand Code</Label>
              <Input
                id="editBrandCode"
                value={brandForm.brandCode}
                onChange={(e) =>
                  setBrandForm({ ...brandForm, brandCode: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editBrandName">Brand Name</Label>
              <Input
                id="editBrandName"
                value={brandForm.brandName}
                onChange={(e) =>
                  setBrandForm({ ...brandForm, brandName: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editStatus">Status</Label>
              <select
                id="editStatus"
                value={brandForm.status}
                onChange={(e) =>
                  setBrandForm({
                    ...brandForm,
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
                setSelectedBrand(null);
                setBrandForm({ brandCode: "", brandName: "", status: "Active" });
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleEditBrand}
              disabled={!brandForm.brandCode || !brandForm.brandName}
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
            <DialogTitle>Delete Brand</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this brand? This action cannot be
              undone and will affect all related sales data.
            </DialogDescription>
          </DialogHeader>
          {selectedBrand && (
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4 my-4">
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Brand Code:</span>
                  <span className="text-gray-900 font-medium">
                    {selectedBrand.brandCode}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Brand Name:</span>
                  <span className="text-gray-900 font-medium">
                    {selectedBrand.brandName}
                  </span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <button
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedBrand(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteBrand}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Delete Brand
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Brand Modal */}
      <Dialog open={showImportModal} onOpenChange={setShowImportModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Import Brand Data</DialogTitle>
            <DialogDescription>
              Upload an Excel file (.xlsx, .xls) containing brand data. Download the
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