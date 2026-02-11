import { createBrowserRouter } from "react-router";
import Layout from "./components/layout";
import Dashboard from "./pages/dashboard";
import BudgetDashboard from "./pages/budget-dashboard";
import SalesDashboard from "./pages/sales-dashboard";
import MasterDivisi from "./pages/master-divisi";
import UserRoles from "./pages/user-roles";
import Budgeting from "./pages/budgeting";
import UploadBudget from "./pages/upload-budget";
import ActualBudget from "./pages/actual-budget";
import TargetSales from "./pages/sales/target-sales";
import TargetAdsMarketing from "./pages/sales/target-ads-marketing";
import ActualSales from "./pages/sales/actual-sales";
import MasterBrand from "./pages/master-brand";
import MasterProduct from "./pages/master-product";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "budget-dashboard", Component: BudgetDashboard },
      { path: "sales-dashboard", Component: SalesDashboard },
      { path: "budgeting", Component: Budgeting },
      { path: "budgeting/upload", Component: UploadBudget },
      { path: "actual-budget", Component: ActualBudget },
      { path: "master-divisi", Component: MasterDivisi },
      { path: "user-roles", Component: UserRoles },
      { path: "master-brand", Component: MasterBrand },
      { path: "master-product", Component: MasterProduct },
      { path: "sales/target-sales", Component: TargetSales },
      { path: "sales/target-ads-marketing", Component: TargetAdsMarketing },
      { path: "sales/actual-sales", Component: ActualSales },
    ],
  },
]);