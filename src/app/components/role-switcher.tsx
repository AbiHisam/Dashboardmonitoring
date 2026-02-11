import { Check, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useRole } from "../contexts/role-context";

export function RoleSwitcher() {
  const { currentRole, setCurrentRole, availableRoles } = useRole();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6CC7C3]">
        <span className="text-gray-700">Role:</span>
        <span className="font-medium" style={{ color: "#6CC7C3" }}>
          {currentRole}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56">
        {availableRoles.map((role) => (
          <DropdownMenuItem
            key={role}
            onClick={() => setCurrentRole(role)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex flex-col">
              <span className="text-sm text-gray-900">{role}</span>
              {role === "Top Management" && (
                <span className="text-xs text-gray-500">View only</span>
              )}
            </div>
            {currentRole === role && (
              <Check className="w-4 h-4" style={{ color: "#6CC7C3" }} />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}