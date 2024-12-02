import { Outlet, useLoaderData, useOutletContext } from "react-router-dom";
import { AdminRepository } from "@/data/repositories/AdminRepository";
import { lastUsersLoader } from "@/data/loaders/lastUsersLoader";
import { useAdminLayout } from "./admin-layout";

type LastUsersLayoutContextType = {
  lastUsers: Awaited<ReturnType<AdminRepository['getLastUsers']>>
  getLastUsers: AdminRepository['getLastUsers']
}

export function LastUsersLayout() {
  const { getLastUsers } = useAdminLayout()
  const lastUsers = useLoaderData() as Awaited<ReturnType<typeof lastUsersLoader>>
  
  const props: LastUsersLayoutContextType = {
    lastUsers,
    getLastUsers,
  }
  
  return (
    <Outlet context={props} />
  )
}

export function useLastUsersLayout() {
  return useOutletContext<LastUsersLayoutContextType>()
}
