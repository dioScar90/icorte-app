import { Outlet } from "react-router-dom";

export function AdminLayout() {
  return (
    <>
      <h3>Admin's space</h3>
      <Outlet />
    </>
  )
}
