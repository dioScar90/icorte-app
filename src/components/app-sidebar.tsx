import * as React from "react"
import logoImgUrl from '/barber.png'
import {
  BriefcaseBusinessIcon,
  CalendarCheck2,
  ContactRoundIcon,
  HomeIcon,
  LayoutDashboard,
  LogInIcon,
  StoreIcon,
  UserRoundPlusIcon,
  type LucideIcon,
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
import { Link, useNavigate } from "react-router-dom"
import Swal from "sweetalert2"

function getUserInfosToSidebar({ user }: AuthContextType) {
  return {
    name: user?.profile?.firstName ?? 'Diogo',
    email: user?.email ?? 'diogols@live.com',
    avatar: user?.profile?.imageUrl ?? "https://randomuser.me/api/portraits/men/9.jpg",
    isBarber: !!user?.barberShop,
  }
}

function getNavMainItemsToSidebar({ isClient, isBarberShop, isAdmin, user }: AuthContextType) {
  const items = [{
    title: "Home",
    url: ROUTE_ENUM.HOME,
    icon: HomeIcon,
    isActive: true,
    items: [],
  }] as {
    title: string,
    url: string,
    icon: LucideIcon,
    isActive?: boolean,
    items: any[],
  }[]

  
//   <SidebarMenuItem>
//   <SidebarMenuButton asChild tooltip="Login">
//     <Link to={ROUTE_ENUM.LOGIN}>
//       <LogInIcon />
//       <span>Login</span>
//     </Link>
//   </SidebarMenuButton>
// </SidebarMenuItem>

  if (isBarberShop) {
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
        //   url: ROUTE_ENUM.BARBER_SHOP + '/' + user!.barberShop!.id + '/dashboard',
        // },
        // {
        //   title: "Editar",
        //   url: ROUTE_ENUM.BARBER_SHOP + '/' + user!.barberShop!.id + '/edit',
        // },
      ],
    })
  }
  
  if (isClient) {
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
          title: "Pesquisar",
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
          title: "Remove all",
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
  const navigate = useNavigate()

  const onClickLogout = React.useCallback(() => Swal.fire({
    title: 'Logout',
    text: 'Deseja realmente sair do sistema?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sim, sair',
    cancelButtonText: 'Cancelar',
  }).then(async (result) => {
    if (result.isConfirmed) {
      userInfos.logout()
        .then(({ isSuccess }) => isSuccess ? navigate(`${ROUTE_ENUM.LOGIN}`, { state: { message: 'Logout realizado com sucesso' } }) : null)
    }
  }), [])
  
  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
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

        {!userInfos.isAuthenticated && (
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
          <NavUser user={getUserInfosToSidebar({ ...userInfos })} onClickLogout={onClickLogout} />
        </SidebarFooter>
      )}
    </Sidebar>
  )
}
