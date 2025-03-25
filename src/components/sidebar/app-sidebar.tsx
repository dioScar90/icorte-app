import { type ComponentProps, useLayoutEffect, useState } from "react"
import logoImgUrl from '/barber.png'
import { type LucideIcon } from "lucide-react"

import { NavMain } from "@/components/sidebar/nav-main"
import { NavSecondary } from "@/components/sidebar/nav-secondary"
import { NavUserFooter } from "@/components/sidebar/nav-user-footer"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Link, type LinkProps, useLocation } from "@tanstack/react-router"
import { NavMainRest } from "./nav-main-rest"

type BaseNavMainItem = {
  title: string,
  linkProps: LinkProps
}

export type SidebarNavProps = {
  icon: LucideIcon,
  isActive?: boolean,
} & BaseNavMainItem & {
  items?: [BaseNavMainItem, ...BaseNavMainItem[]],
}

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const { setOpen, setOpenMobile, isMobile } = useSidebar()
  const { pathname } = useLocation()
  const [closeSidebarEverytimeThisIncrements, setCloseSidebarEverytimeThisIncrements] = useState(0)

  const closeSidebar = () => setCloseSidebarEverytimeThisIncrements(prev => prev + 1)
  
  useLayoutEffect(() => {
    if (isMobile) {
      setOpenMobile(false)
    } else {
      setOpen(pathname === '/')
    }
  }, [isMobile, pathname, closeSidebarEverytimeThisIncrements])
  
  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
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
        <NavMain />
        
        <NavMainRest />
        
        <NavSecondary />
      </SidebarContent>
      
      <NavUserFooter closeSidebar={closeSidebar} />
    </Sidebar>
  )
}
