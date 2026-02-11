import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "Admin" | "Finance" | "Divisi User" | "Top Management" | "Divisi Sales Komersial";

interface RoleContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  availableRoles: UserRole[];
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>("Admin");
  
  // In a real app, this would come from user permissions
  // Note: "Divisi Sales Komersial" has same permission level as "Divisi User"
  // (can upload/input, but only view their own division data - Sales Commercial)
  const availableRoles: UserRole[] = ["Admin", "Finance", "Divisi User", "Top Management", "Divisi Sales Komersial"];

  return (
    <RoleContext.Provider value={{ currentRole, setCurrentRole, availableRoles }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}