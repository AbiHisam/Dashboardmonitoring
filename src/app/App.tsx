import { RouterProvider } from "react-router";
import { router } from "./routes";
import { RoleProvider } from "./contexts/role-context";

export default function App() {
  return (
    <RoleProvider>
      <RouterProvider router={router} />
    </RoleProvider>
  );
}