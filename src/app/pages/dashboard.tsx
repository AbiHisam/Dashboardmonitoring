import { Building2, Users, LucideIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { useRole } from "../contexts/role-context";
import { useEffect } from "react";

interface AdminCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  buttonText: string;
  iconColor: string;
  onAction: () => void;
}

function AdminCard({
  title,
  description,
  icon: Icon,
  buttonText,
  iconColor,
  onAction,
}: AdminCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
      <div
        className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
        style={{ backgroundColor: `${iconColor}15` }}
      >
        <Icon className="w-6 h-6" style={{ color: iconColor }} />
      </div>
      <h3 className="text-base text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <button
        onClick={onAction}
        className="px-4 py-2 text-sm rounded-md text-gray-900 transition-opacity hover:opacity-90"
        style={{ backgroundColor: "#F6D400" }}
      >
        {buttonText}
      </button>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { currentRole } = useRole();

  // Redirect based on role
  useEffect(() => {
    if (currentRole === "Top Management") {
      navigate("/budget-dashboard");
    } else if (currentRole === "Divisi Sales Komersial") {
      navigate("/budgeting");
    } else if (currentRole !== "Admin") {
      navigate("/budgeting");
    }
  }, [currentRole, navigate]);

  // Only show for Admin
  if (currentRole !== "Admin") {
    return null;
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm text-gray-600">
          Configure system settings and manage access
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        <AdminCard
          title="Master Divisi"
          description="Manage organizational divisions, departments, and hierarchies"
          icon={Building2}
          buttonText="Manage Divisi"
          iconColor="#6CC7C3"
          onAction={() => navigate("/master-divisi")}
        />
        
        <AdminCard
          title="User & Roles"
          description="Configure user accounts, permissions, and role assignments"
          icon={Users}
          buttonText="Manage Users"
          iconColor="#F6D400"
          onAction={() => navigate("/user-roles")}
        />
      </div>
    </div>
  );
}