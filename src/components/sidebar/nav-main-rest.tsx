import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar"
import { Link, useRouteContext } from "@tanstack/react-router"
import { LogInIcon, UserRoundPlusIcon } from "lucide-react"
import { SidebarNavProps } from "./app-sidebar"

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
  const isAuthenticated = useRouteContext({ from: '/', select: (s) => s.auth.isAuthenticated })

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