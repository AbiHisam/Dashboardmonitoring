import { useState, useEffect } from "react";
import { Plus, Pencil, Check, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useRole } from "../contexts/role-context";
import { useNavigate } from "react-router";

interface Divisi {
  id: string;
  code: string;
  name: string;
  description: string;
  status: "Active" | "Inactive";
}

export default function MasterDivisi() {
  const navigate = useNavigate();
  const { currentRole } = useRole();

  // All hooks must be called before any early returns
  const [divisiList, setDivisiList] = useState<Divisi[]>([
    { id: "1", code: "FIN", name: "Finance", description: "Financial Department", status: "Active" },
    { id: "2", code: "SAL", name: "Sales", description: "Sales Department", status: "Active" },
    { id: "3", code: "OPS", name: "Operations", description: "Operations Department", status: "Active" },
    { id: "4", code: "HR", name: "Human Resources", description: "Human Resources Department", status: "Inactive" },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
  const [selectedDivisi, setSelectedDivisi] = useState<Divisi | null>(null);
  const [formData, setFormData] = useState({ code: "", name: "", description: "" });

  // Redirect non-admin users
  useEffect(() => {
    if (currentRole !== "Admin") {
      navigate("/budgeting");
    }
  }, [currentRole, navigate]);

  // Only show for Admin
  if (currentRole !== "Admin") {
    return null;
  }

  const handleAdd = () => {
    const newDivisi: Divisi = {
      id: Date.now().toString(),
      code: formData.code,
      name: formData.name,
      description: formData.description,
      status: "Active",
    };
    setDivisiList([...divisiList, newDivisi]);
    setFormData({ code: "", name: "", description: "" });
    setIsAddDialogOpen(false);
  };

  const handleEdit = () => {
    if (!selectedDivisi) return;
    setDivisiList(
      divisiList.map((div) =>
        div.id === selectedDivisi.id
          ? { ...div, code: formData.code, name: formData.name, description: formData.description }
          : div
      )
    );
    setFormData({ code: "", name: "", description: "" });
    setSelectedDivisi(null);
    setIsEditDialogOpen(false);
  };

  const handleToggleStatus = () => {
    if (!selectedDivisi) return;
    setDivisiList(
      divisiList.map((div) =>
        div.id === selectedDivisi.id
          ? { ...div, status: div.status === "Active" ? "Inactive" : "Active" }
          : div
      )
    );
    setSelectedDivisi(null);
    setIsDeactivateDialogOpen(false);
  };

  const openEditDialog = (divisi: Divisi) => {
    setSelectedDivisi(divisi);
    setFormData({ code: divisi.code, name: divisi.name, description: divisi.description });
    setIsEditDialogOpen(true);
  };

  const openDeactivateDialog = (divisi: Divisi) => {
    setSelectedDivisi(divisi);
    setIsDeactivateDialogOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-gray-600">
          Manage organizational divisions and departments
        </p>
        <button
          onClick={() => setIsAddDialogOpen(true)}
          className="px-4 py-2 rounded-md text-gray-900 transition-opacity hover:opacity-90 flex items-center gap-2"
          style={{ backgroundColor: "#F6D400" }}
        >
          <Plus className="w-4 h-4" />
          Add Division
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                Division Code
              </th>
              <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                Division Name
              </th>
              <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {divisiList.map((divisi) => (
              <tr key={divisi.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{divisi.code}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{divisi.name}</td>
                <td className="px-6 py-4">
                  <span
                    className="inline-flex px-2 py-1 text-xs rounded-full"
                    style={{
                      backgroundColor:
                        divisi.status === "Active" ? "#6CC7C315" : "#f3f4f6",
                      color: divisi.status === "Active" ? "#6CC7C3" : "#6b7280",
                    }}
                  >
                    {divisi.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditDialog(divisi)}
                      className="p-1.5 hover:bg-gray-100 rounded text-gray-600 transition-colors"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openDeactivateDialog(divisi)}
                      className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                      style={{
                        color: divisi.status === "Active" ? "#F26C8A" : "#6CC7C3",
                      }}
                      title={divisi.status === "Active" ? "Deactivate" : "Activate"}
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Division</DialogTitle>
            <DialogDescription>
              Create a new division for your organization
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="code">Division Code</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g., FIN"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Division Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Finance"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="e.g., Financial Department"
              />
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={() => setIsAddDialogOpen(false)}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              className="px-4 py-2 text-sm text-gray-900 rounded-md transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#F6D400" }}
            >
              Add Division
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Division</DialogTitle>
            <DialogDescription>Update division information</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-code">Division Code</Label>
              <Input
                id="edit-code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Division Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={() => setIsEditDialogOpen(false)}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleEdit}
              className="px-4 py-2 text-sm text-gray-900 rounded-md transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#6CC7C3" }}
            >
              Save Changes
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deactivate/Activate Dialog */}
      <AlertDialog
        open={isDeactivateDialogOpen}
        onOpenChange={setIsDeactivateDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedDivisi?.status === "Active" ? "Deactivate" : "Activate"}{" "}
              Division
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedDivisi?.status === "Active"
                ? "Are you sure you want to deactivate this division? Users assigned to this division may lose access."
                : "Are you sure you want to activate this division?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleToggleStatus}
              className="text-white"
              style={{
                backgroundColor:
                  selectedDivisi?.status === "Active" ? "#F26C8A" : "#6CC7C3",
              }}
            >
              {selectedDivisi?.status === "Active" ? "Deactivate" : "Activate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}