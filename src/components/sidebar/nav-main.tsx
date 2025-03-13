import { CalendarCheck2, ChevronRight, HomeIcon, LayoutDashboard, StoreIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Link } from "@tanstack/react-router"
import { SidebarNavProps } from "./app-sidebar"
import { AuthContextType, useAuth } from "@/providers/authProvider"
import { useEffect, useState } from "react"

function getNavMainItemsToSidebar({ isClient, isBarberShop, isAdmin, user }: AuthContextType) {
  const items: SidebarNavProps[] = []

  items.push({
    title: 'Home',
    icon: HomeIcon,
    isActive: true,
    linkProps: {
      to: '/',
    },
  })
  
  if (isBarberShop) {
    const barberShopId = user?.barberShop?.id!

    items.push({
      title: "Minha barbearia",
      linkProps: {
        to: '/barber-shop/$barberShopId',
        params: { barberShopId },
      },
      icon: StoreIcon,
      isActive: true,
      items: [
        {
          title: "Dashboard",
          linkProps: {
            to: '/barber-shop/$barberShopId/dashboard',
            params: { barberShopId },
          }
        },
        {
          title: "Serviços",
          linkProps: {
            to: '/barber-shop/$barberShopId/services',
            params: { barberShopId },
          }
        },
        {
          title: "Horários",
          linkProps: {
            to: '/barber-shop/$barberShopId/schedules',
            params: { barberShopId },
          }
        },
        {
          title: "Editar",
          linkProps: {
            to: '/barber-shop/$barberShopId/edit',
            params: { barberShopId },
          }
        },
      ],
    })
  }
  
  if (isClient) {
    items.push({
      title: "Agenda",
      linkProps: {
        to: '/barber-schedule',
      },
      icon: CalendarCheck2,
      isActive: true,
      items: [
        {
          title: "Meus agendamentos",
          linkProps: {
            to: '/barber-schedule/dashboard',
          },
        },
        {
          title: "Marcar um corte",
          linkProps: {
            to: '/barber-schedule/new-appointment',
          },
        },
      ],
    })
  }

  if (isAdmin) {
    items.push({
      title: "Admin",
      linkProps: {
        to: '/admin',
      },
      icon: LayoutDashboard,
      isActive: true,
      items: [
        {
          title: "Dashboard",
          linkProps: {
            to: '/admin/dashboard',
          }
        },
        {
          title: "Remove all",
          linkProps: {
            to: '/admin/remove-all',
          }
        },
        {
          title: "Populate all",
          linkProps: {
            to: '/admin/populate-all',
          }
        },
        {
          title: "Populate appointments",
          linkProps: {
            to: '/admin/populate-appointments',
          }
        },
        {
          title: "Reset password",
          linkProps: {
            to: '/admin/reset-password',
          }
        },
        {
          title: "Search users",
          linkProps: {
            to: '/admin/search-users',
          }
        },
      ],
    })
  }

  return items
}

export function NavMain() {
  const authInfos = useAuth()

  const [items, setItems] = useState(getNavMainItemsToSidebar(authInfos))

  useEffect(() => {
    setItems(getNavMainItemsToSidebar(authInfos))
  }, [authInfos])
  
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Geral</SidebarGroupLabel>
      
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={item.title}>
                <Link { ...item.linkProps }>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
              {!!item.items?.length && (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction className="data-[state=open]:rotate-90">
                      <ChevronRight />
                      <span className="sr-only">Toggle</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <Link { ...item.linkProps }>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              )}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
