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
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import { Link, useNavigate, useRouteContext } from "@tanstack/react-router"
import type { AuthContext } from "@/hooks/use-auth"
import { Route } from "@/routes/__root"

function getInfos(user: NonNullable<SidebarFooterItselfProps['user']>) {
  return {
    id: user?.profile?.id!,
    name: user?.profile?.firstName,
    email: user?.email,
    avatar: user?.profile?.imageUrl,
    isBarber: !!user?.barberShop,
  }
}

type SidebarFooterItselfProps =
  & Pick<AuthContext, 'user' | 'logout'>
  & NavUserProps

function SidebarFooterItself({ user: userFromUseAuth, logout, closeSidebar }: SidebarFooterItselfProps) {
  const { isMobile } = useSidebar()
  const navigate = useNavigate()

  const [user, setUser] = useState(getInfos(userFromUseAuth!))

  function onClickLogout() {
    closeSidebar()
    
    Swal.fire({
      icon: 'question',
      title: 'Logout',
      text: 'Deseja realmente sair do sistema?',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, sair',
      cancelButtonText: 'Cancelar',
    })
      .then(async ({ isConfirmed }) => {
        if (isConfirmed) {
          logout()
            .then(({ isSuccess }) => isSuccess ? navigate({ to: '/login' }) : null)
        }
      })
  }

  useEffect(() => {
    setUser(getInfos(userFromUseAuth!))
  }, [userFromUseAuth])
  
  return (
    <SidebarFooter>
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
                <Link to="/be-pro">
                  <DropdownMenuItem className="cursor-pointer">
                    <Sparkles />
                    Seja Pro
                  </DropdownMenuItem>
                </Link>

                {!user.isBarber && (
                  <Link to="/barber-shop/register">
                    <DropdownMenuItem className="cursor-pointer">
                      <StoreIcon />
                      Cadastrar Barbearia
                    </DropdownMenuItem>
                  </Link>
                )}
              </DropdownMenuGroup>
              
              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <Link to="/profile/$userId" params={{ userId: user.id }}>
                  <DropdownMenuItem className="cursor-pointer">
                    <BadgeCheck />
                    Minha conta
                  </DropdownMenuItem>
                </Link>
                
                <Link to="/chat">
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
    </SidebarFooter>
  )
}

type NavUserProps = {
  closeSidebar: () => void,
}

export function NavUserFooter({ closeSidebar }: NavUserProps) {
  const { isAuthenticated, ...rest } = Route.useRouteContext({ select: (s) => s.auth })

  if (!isAuthenticated) {
    return null
  }

  return (
    <SidebarFooterItself { ...rest } closeSidebar={closeSidebar} />
  )
}
