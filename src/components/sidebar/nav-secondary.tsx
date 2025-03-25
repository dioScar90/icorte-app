import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link } from "@tanstack/react-router"
import type { SidebarNavProps } from "./app-sidebar"
import { BriefcaseBusinessIcon, ContactRoundIcon } from "lucide-react"

function getItems(): SidebarNavProps[] {
  return [
    {
      title: "Fale com a gente",
      linkProps: {
        to: '/contact',
      },
      icon: ContactRoundIcon,
    },
    {
      title: "Trabalhe conosco",
      linkProps: {
        to: '/work-with-us',
      },
      icon: BriefcaseBusinessIcon,
    },
  ]
}

export function NavSecondary() {
  const items = getItems()

  return (
    <SidebarGroup className="mt-auto">
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
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
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
