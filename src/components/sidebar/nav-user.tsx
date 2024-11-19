import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  LogOut,
  Sparkles,
  StoreIcon,
} from "lucide-react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Link } from "react-router-dom"
import { ROUTE_ENUM } from "@/types/route"
import { Button } from "../ui/button"

export function NavUser({
  user,
  onClickLogout
}: {
  user: {
    id: number
    name: string
    email: string
    avatar?: string
    isBarber: boolean
  },
  onClickLogout: () => void,
}) {
  const { isMobile } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <Link to={ROUTE_ENUM.BE_PRO}>
                <DropdownMenuItem className="cursor-pointer">
                  <Sparkles />
                  Seja Pro
                </DropdownMenuItem>
              </Link>

              {!user.isBarber && (
                <Link to={`${ROUTE_ENUM.BARBER_SHOP}/register`}>
                  <DropdownMenuItem className="cursor-pointer">
                    <StoreIcon />
                    Cadastrar Barbearia
                  </DropdownMenuItem>
                </Link>
              )}
            </DropdownMenuGroup>
            
            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <Link to={`${ROUTE_ENUM.PROFILE}/${user.id}`}>
                <DropdownMenuItem className="cursor-pointer">
                  <BadgeCheck />
                  Minha conta
                </DropdownMenuItem>
              </Link>
              
              <Link to={ROUTE_ENUM.CHAT}>
                <DropdownMenuItem className="cursor-pointer">
                  <Bell />
                  Chat
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <Button
                onClick={onClickLogout}
                className="p-0 w-full block"
                variant="ghost"
              >
                <DropdownMenuItem className="cursor-pointer">
                  <LogOut />
                  Logout
                </DropdownMenuItem>
              </Button>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
