import { Home, Building2, Users, BarChart3, Wallet, DollarSign, TrendingUp, Target, Megaphone, Package } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "./ui/sidebar";
import { useRole } from "../contexts/role-context";

const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    url: "/",
    roles: ["Admin"],
  },
  {
    title: "Budget Dashboard",
    icon: BarChart3,
    url: "/budget-dashboard",
    roles: ["Top Management"],
  },
  {
    title: "Sales Dashboard",
    icon: TrendingUp,
    url: "/sales-dashboard",
    roles: ["Top Management"],
  },
  {
    title: "Budgeting",
    icon: DollarSign,
    url: "/budgeting",
    roles: ["Admin", "Finance", "Divisi User", "Top Management", "Divisi Sales Komersial"],
  },
  {
    title: "Actual Budget",
    icon: Wallet,
    url: "/actual-budget",
    roles: ["Admin", "Finance", "Divisi User", "Top Management", "Divisi Sales Komersial"],
  },
];

const salesMenuItems = [
  {
    title: "Target Sales",
    icon: Target,
    url: "/sales/target-sales",
  },
  {
    title: "Target Ads & Marketing",
    icon: Megaphone,
    url: "/sales/target-ads-marketing",
  },
  {
    title: "Actual Sales",
    icon: TrendingUp,
    url: "/sales/actual-sales",
  },
];

const salesMasterDataItems = [
  {
    title: "Master Data Brand",
    icon: Building2,
    url: "/master-brand",
  },
  {
    title: "Master Data Produk",
    icon: Package,
    url: "/master-product",
  },
];

const adminMenuItems = [
  {
    title: "Master Divisi",
    icon: Building2,
    url: "/master-divisi",
  },
  {
    title: "User & Roles",
    icon: Users,
    url: "/user-roles",
    roles: ["Admin"],
  },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentRole } = useRole();

  const isAdmin = currentRole === "Admin";
  const isSalesKomersial = currentRole === "Divisi Sales Komersial";

  // Filter menu items based on role
  const visibleMenuItems = menuItems.filter((item) =>
    item.roles.includes(currentRole)
  );

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-gray-200 p-6">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "#F6D400" }}
          >
            <span className="text-gray-900 font-bold text-lg">M</span>
          </div>
          <div>
            <h1 className="text-base text-gray-900">MARUI</h1>
            <p className="text-xs text-gray-500">Admin Portal</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs text-gray-500 px-3 py-2">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleMenuItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      onClick={() => navigate(item.url)}
                      className={`cursor-pointer ${
                        isActive
                          ? "bg-[#6CC7C315] text-[#6CC7C3]"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isSalesKomersial && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs text-gray-500 px-3 py-2">
              Master Data
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {salesMasterDataItems.map((item) => {
                  const isActive = location.pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        onClick={() => navigate(item.url)}
                        className={`cursor-pointer ${
                          isActive
                            ? "bg-[#6CC7C315] text-[#6CC7C3]"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {isSalesKomersial && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs text-gray-500 px-3 py-2">
              Sales
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {salesMenuItems.map((item) => {
                  const isActive = location.pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        onClick={() => navigate(item.url)}
                        className={`cursor-pointer ${
                          isActive
                            ? "bg-[#6CC7C315] text-[#6CC7C3]"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs text-gray-500 px-3 py-2">
              Admin Settings
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminMenuItems.map((item) => {
                  const isActive = location.pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        onClick={() => navigate(item.url)}
                        className={`cursor-pointer ${
                          isActive
                            ? "bg-[#6CC7C315] text-[#6CC7C3]"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
