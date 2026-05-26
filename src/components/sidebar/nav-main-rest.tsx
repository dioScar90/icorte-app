import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar"
import { Link } from "@tanstack/react-router"
import { LogInIcon, UserRoundPlusIcon } from "lucide-react"
import type { SidebarNavProps } from "./app-sidebar"
import { Route } from "@/routes/__root"

function getItems(): SidebarNavProps[] {
  return [
    {
      title: "Login",
      linkProps: {
        to: '/login',
      },
      icon: LogInIcon,
    },
    {
      title: "Criar conta",
      linkProps: {
        to: '/register',
      },
      icon: UserRoundPlusIcon,
    },
  ]
}

export function NavMainRest() {
  const isAuthenticated = Route.useRouteContext({ select: (s) => s.auth.isAuthenticated })

  if (isAuthenticated) {
    return null
  }

  const items = getItems()
  
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map(item => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild size="sm" tooltip={item.title}>
              <Link { ...item.linkProps }>
                <item.icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}