import * as React from "react"
import logoImgUrl from '/barber.png'
import {
  BriefcaseBusinessIcon,
  CalendarCheck2,
  ContactRoundIcon,
  LayoutDashboard,
  LogInIcon,
  StoreIcon,
  UserRoundPlusIcon,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { ROUTE_ENUM } from "@/types/route"
import { AuthContextType, useAuth } from "@/providers/authProvider"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Link } from "react-router-dom"

function getUserInfosToSidebar({ authUser }: AuthContextType) {
  // return {
  //   name: authUser?.profile?.firstName!,
  //   email: authUser?.user.email!,
  //   avatar: authUser?.profile?.imageUrl ?? "/avatars/shadcn.jpg",
  // }
  return {
    name: authUser?.profile?.firstName ?? 'Diogo',
    email: authUser?.user.email ?? 'diogols@live.com',
    avatar: authUser?.profile?.imageUrl ?? "https://randomuser.me/api/portraits/men/9.jpg",
  }
}

function getNavMainItemsToSidebar({ isClient, isBarberShop, isAdmin, authUser }: AuthContextType) {
  const items = []

  if (!isBarberShop) {
    items.push({
      title: "Minha barbearia",
      url: ROUTE_ENUM.BARBER_SHOP,
      icon: StoreIcon,
      isActive: true,
      items: [
        {
          title: "Dashboard",
          url: ROUTE_ENUM.BARBER_SHOP + '/dashboard',
        },
        {
          title: "Editar",
          url: ROUTE_ENUM.BARBER_SHOP + '/edit',
        },
        // {
        //   title: "Dashboard",
        //   url: ROUTE_ENUM.BARBER_SHOP + '/' + authUser!.barberShop!.id + '/dashboard',
        // },
        // {
        //   title: "Editar",
        //   url: ROUTE_ENUM.BARBER_SHOP + '/' + authUser!.barberShop!.id + '/edit',
        // },
      ],
    })
  }
  
  if (!isClient) {
    items.push({
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
    items.push({
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

  return items
}

function getNavSecondaryItemsToSidebar() {
  return [
    {
      title: "Fale com a gente",
      url: ROUTE_ENUM.CONTACT_US,
      icon: ContactRoundIcon,
    },
    {
      title: "Trabalhe conosco",
      url: ROUTE_ENUM.WORK_WITH_US,
      icon: BriefcaseBusinessIcon,
    },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const userInfos = useAuth()
  
  console.log({ ...userInfos })

  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to={ROUTE_ENUM.ROOT}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
                  <Avatar>
                    <AvatarImage src={logoImgUrl} />
                    <AvatarFallback>iCorte</AvatarFallback>
                  </Avatar>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">iCorte</span>
                  <span className="truncate text-xs">Sua agenda online</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={getNavMainItemsToSidebar({ ...userInfos })} />

        {userInfos.isAuthenticated && (
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Login">
                  <Link to={ROUTE_ENUM.LOGIN}>
                    <LogInIcon />
                    <span>Login</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Criar conta">
                  <Link to={ROUTE_ENUM.REGISTER}>
                    <UserRoundPlusIcon />
                    <span>Criar conta</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        )}

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
