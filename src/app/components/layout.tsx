import { Outlet, useLocation } from "react-router";
import { AppSidebar } from "./app-sidebar";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "./ui/sidebar";
import { RoleSwitcher } from "./role-switcher";

const PAGE_TITLES: Record<string, string> = {
  "/": "Admin Settings",
  "/budget-dashboard": "Budget Dashboard",
  "/sales-dashboard": "Sales Performance Dashboard",
  "/master-divisi": "Master Divisi",
  "/user-roles": "User & Roles",
  "/budgeting": "Budgeting",
  "/budgeting/upload": "Upload Budget",
  "/actual-budget": "Actual Budget",
  "/master-brand": "Master Data Brand",
  "/master-product": "Master Data Produk",
  "/sales/target-sales": "Target Sales",
  "/sales/target-ads-marketing": "Target Ads & Marketing",
  "/sales/actual-sales": "Actual Sales",
};

export default function Layout() {
  const location = useLocation();
  const pageTitle = PAGE_TITLES[location.pathname] || "Admin";

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-gray-600" />
              <div className="flex-1">
                <h1 className="text-xl text-gray-900">{pageTitle}</h1>
              </div>
              <RoleSwitcher />
            </div>
          </header>

          <main className="p-8">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}