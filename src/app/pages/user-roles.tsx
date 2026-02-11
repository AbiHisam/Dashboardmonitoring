import { useState, useEffect } from "react";
import { Plus, Pencil, Check } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useRole } from "../contexts/role-context";
import { useNavigate } from "react-router";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  divisi: string;
  status: "Active" | "Inactive";
}

export default function UserRoles() {
  const navigate = useNavigate();
  const { currentRole } = useRole();

  // All hooks must be called before any early returns
  const [userList, setUserList] = useState<User[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john@marui.com",
      role: "Admin",
      divisi: "Operations",
      status: "Active",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@marui.com",
      role: "Finance",
      divisi: "Finance",
      status: "Active",
    },
    {
      id: "3",
      name: "Bob Johnson",
      email: "bob@marui.com",
      role: "Sales MSA",
      divisi: "Sales",
      status: "Active",
    },
    {
      id: "4",
      name: "Alice Williams",
      email: "alice@marui.com",
      role: "Top Management",
      divisi: "Operations",
      status: "Inactive",
    },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    divisi: "",
  });

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
    const newUser: User = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      role: formData.role,
      divisi: formData.divisi,
      status: "Active",
    };
    setUserList([...userList, newUser]);
    setFormData({ name: "", email: "", role: "", divisi: "" });
    setIsAddDialogOpen(false);
  };

  const handleEdit = () => {
    if (!selectedUser) return;
    setUserList(
      userList.map((user) =>
        user.id === selectedUser.id
          ? {
              ...user,
              name: formData.name,
              email: formData.email,
              role: formData.role,
              divisi: formData.divisi,
            }
          : user
      )
    );
    setFormData({ name: "", email: "", role: "", divisi: "" });
    setSelectedUser(null);
    setIsEditDialogOpen(false);
  };

  const handleToggleStatus = () => {
    if (!selectedUser) return;
    setUserList(
      userList.map((user) =>
        user.id === selectedUser.id
          ? { ...user, status: user.status === "Active" ? "Inactive" : "Active" }
          : user
      )
    );
    setSelectedUser(null);
    setIsDeactivateDialogOpen(false);
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      divisi: user.divisi,
    });
    setIsEditDialogOpen(true);
  };

  const openDeactivateDialog = (user: User) => {
    setSelectedUser(user);
    setIsDeactivateDialogOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-gray-600">
          Manage user accounts, roles, and permissions
        </p>
        <button
          onClick={() => setIsAddDialogOpen(true)}
          className="px-4 py-2 rounded-md text-gray-900 transition-opacity hover:opacity-90 flex items-center gap-2"
          style={{ backgroundColor: "#F6D400" }}
        >
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                Division
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
            {userList.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{user.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{user.role}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{user.divisi}</td>
                <td className="px-6 py-4">
                  <span
                    className="inline-flex px-2 py-1 text-xs rounded-full"
                    style={{
                      backgroundColor:
                        user.status === "Active" ? "#6CC7C315" : "#f3f4f6",
                      color: user.status === "Active" ? "#6CC7C3" : "#6b7280",
                    }}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditDialog(user)}
                      className="p-1.5 hover:bg-gray-100 rounded text-gray-600 transition-colors"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openDeactivateDialog(user)}
                      className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                      style={{
                        color: user.status === "Active" ? "#F26C8A" : "#6CC7C3",
                      }}
                      title={user.status === "Active" ? "Deactivate" : "Activate"}
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
            <DialogTitle>Add User</DialogTitle>
            <DialogDescription>Create a new user account</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., John Doe"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g., john@marui.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="division">Division</Label>
              <Select
                value={formData.divisi}
                onValueChange={(value) =>
                  setFormData({ ...formData, divisi: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select division" />
                </SelectTrigger>
                <SelectContent>
                  {DIVISIONS.map((division) => (
                    <SelectItem key={division} value={division}>
                      {division}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              Add User
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-division">Division</Label>
              <Select
                value={formData.divisi}
                onValueChange={(value) =>
                  setFormData({ ...formData, divisi: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select division" />
                </SelectTrigger>
                <SelectContent>
                  {DIVISIONS.map((division) => (
                    <SelectItem key={division} value={division}>
                      {division}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              {selectedUser?.status === "Active" ? "Deactivate" : "Activate"} User
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedUser?.status === "Active"
                ? "Are you sure you want to deactivate this user? They will lose access to the system."
                : "Are you sure you want to activate this user?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleToggleStatus}
              className="text-white"
              style={{
                backgroundColor:
                  selectedUser?.status === "Active" ? "#F26C8A" : "#6CC7C3",
              }}
            >
              {selectedUser?.status === "Active" ? "Deactivate" : "Activate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}