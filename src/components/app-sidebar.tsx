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
import { GenderEnum } from "@/schemas/profile"

function getRandomInt(seed: number) {
  // Usa o seed de entrada para gerar um número pseudo-aleatório entre 1 e 99
  return (Math.abs(Math.sin(seed)) * 99 + 1) | 2;
}

function getImageUrl(user: AuthContextType['user']) {
  if (user?.profile?.imageUrl) {
    return user.profile.imageUrl
  }
  
  if (user?.profile?.gender === undefined || user?.profile?.gender === null) {
    return undefined
  }
  
  const gender = user.profile.gender === GenderEnum.Masculino ? 'men' : 'women'
  const imageId = getRandomInt(user.id)
  return `https://randomuser.me/api/portraits/${gender}/${imageId}.jpg`
}

function getUserInfosToSidebar({ user }: AuthContextType) {
  const imageUrl = getImageUrl(user)

  console.log('imageUrl', imageUrl)
  return {
    id: user?.profile?.id!,
    name: user?.profile?.firstName ?? 'Diogo',
    email: user?.email ?? 'diogols@live.com',
    avatar: imageUrl,
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
  
  if (isBarberShop) {
    const barberShopId = user?.barberShop?.id!

    items.push({
      title: "Minha barbearia",
      url: `${ROUTE_ENUM.BARBER_SHOP}/${barberShopId}`,
      icon: StoreIcon,
      isActive: true,
      items: [
        {
          title: "Dashboard",
          url: `${ROUTE_ENUM.BARBER_SHOP}/${barberShopId}/dashboard`,
        },
        {
          title: "Editar",
          url: `${ROUTE_ENUM.BARBER_SHOP}/${barberShopId}/edit`,
        },
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
          url: ROUTE_ENUM.BARBER_SCHEDULE + '/dashboard',
        },
        {
          title: "Pesquisar",
          url: ROUTE_ENUM.BARBER_SCHEDULE + '/schedule',
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
        {
          title: "Populate all",
          url: ROUTE_ENUM.ADMIN + '/populate-all',
        },
        {
          title: "Populate appointments",
          url: ROUTE_ENUM.ADMIN + '/populate-appointments',
        },
        {
          title: "Reset password",
          url: ROUTE_ENUM.ADMIN + '/reset-password',
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
    icon: 'question',
    title: 'Logout',
    text: 'Deseja realmente sair do sistema?',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sim, sair',
    cancelButtonText: 'Cancelar',
  }).then(async ({ isConfirmed }) => {
    if (isConfirmed) {
      userInfos.logout()
        .then(({ isSuccess }) => isSuccess ? navigate(`${ROUTE_ENUM.LOGIN}`) : null)
    }
  }), [])
  
  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to={ROUTE_ENUM.ROOT} state={{ test: 'to root' }}>
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
                  <Link to={ROUTE_ENUM.LOGIN} state={{ test: 'to login' }}>
                    <LogInIcon />
                    <span>Login</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Criar conta">
                  <Link to={ROUTE_ENUM.REGISTER} state={{ test: 'to register' }}>
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
