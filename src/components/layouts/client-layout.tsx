import { Outlet } from "react-router-dom";

export function ClientLayout() {
  return (
    <>
      <div className="flex-1 flex flex-col h-full">
        <Outlet />
      </div>
    </>
  )
}
