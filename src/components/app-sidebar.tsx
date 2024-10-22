import * as React from "react"
import {
  BriefcaseBusinessIcon,
  CalendarCheck2,
  Command,
  ContactRoundIcon,
  LayoutDashboard,
  LogInIcon,
  StoreIcon,
  UserRoundPlusIcon,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
// import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { ROUTE_ENUM } from "@/types/route"
import { AuthContextType, useAuth } from "@/providers/authProvider"

function getUserInfosToSidebar({ authUser }: AuthContextType) {
  return {
    name: authUser?.profile?.firstName!,
    email: authUser?.user.email!,
    avatar: authUser?.profile?.imageUrl ?? "/avatars/shadcn.jpg",
  }
}

function getNavMainItemsToSidebar({ isClient, isBarberShop, isAdmin }: AuthContextType) {
  const vamoooo = []

  if (isBarberShop) {
    vamoooo.push({
      title: "Minha barbearia",
      url: ROUTE_ENUM.BARBER_SHOP,
      icon: StoreIcon,
      isActive: true,
      items: [
        {
          title: "Editar",
          url: ROUTE_ENUM.BARBER_SHOP,
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    })
  }
  
  if (isClient) {
    vamoooo.push({
      title: "Agenda",
      url: ROUTE_ENUM.BARBER_SCHEDULE,
      icon: CalendarCheck2,
      isActive: true,
      items: [
        {
          title: "Meus agendamentos",
          url: ROUTE_ENUM.BARBER_SCHEDULE + '/my-own',
        },
        {
          title: "Meus agendamentos",
          url: ROUTE_ENUM.BARBER_SCHEDULE + '/seach',
        },
      ],
    })
  }

  if (isAdmin) {
    vamoooo.push({
      title: "Admin",
      url: ROUTE_ENUM.ADMIN,
      icon: LayoutDashboard,
      isActive: true,
      items: [
        {
          title: "Dashboard",
          url: ROUTE_ENUM.ADMIN + '/dashboard',
        },
        {
          title: "Reset all",
          url: ROUTE_ENUM.ADMIN + '/remove-all',
        },
      ],
    })
  }

  return vamoooo
}

function getNavSecondaryItemsToSidebar() {
  return [
    {
      title: "Fale com a gente",
      url: "#",
      icon: ContactRoundIcon,
    },
    {
      title: "Trabalhe conosco",
      url: "#",
      icon: BriefcaseBusinessIcon,
    },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const userInfos = useAuth()
  
  console.log({ ...userInfos })

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">iCorte</span>
                  <span className="truncate text-xs">Agendamento de Barbearia</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {!userInfos.isAuthenticated && (
          <>
            <SidebarMenuButton asChild>
              <a href={ROUTE_ENUM.LOGIN}>
                <LogInIcon />
                <span>Login</span>
              </a>
            </SidebarMenuButton>
            
            <SidebarMenuButton asChild>
              <a href={ROUTE_ENUM.REGISTER}>
                <UserRoundPlusIcon />
                <span>Criar conta</span>
              </a>
            </SidebarMenuButton>
          </>
        )}

        <NavMain items={getNavMainItemsToSidebar({ ...userInfos })} />
        <NavSecondary items={getNavSecondaryItemsToSidebar()} className="mt-auto" />
      </SidebarContent>

      {userInfos.isAuthenticated && (
        <SidebarFooter>
          <NavUser user={getUserInfosToSidebar({ ...userInfos })} />
        </SidebarFooter>
      )}
    </Sidebar>
  )
}
