import { Award, CalendarCheck2, ChevronDown, ChevronUp, Home, LogIn, LucideProps, Store, User, User2, UserPlus } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { useAuth } from "@/providers/authProvider"
import { ROUTE_ENUM } from "@/types/route"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"

type EnumRouteString = typeof ROUTE_ENUM[keyof typeof ROUTE_ENUM]
type RoutesThatCannotBeExpanded = typeof ROUTE_ENUM.ROOT | typeof ROUTE_ENUM.LOGIN | typeof ROUTE_ENUM.LOGOUT | typeof ROUTE_ENUM.ADMIN
type UrlType = EnumRouteString | `${Exclude<EnumRouteString, RoutesThatCannotBeExpanded>}/${string}`

type ItemsSidebarObj = {
  title: string
  url: UrlType
  icon: React.FC<LucideProps>
}

// type SidebarItems = ItemsSidebarObj[]

// console.log(ROUTE_ENUM)

const items: ItemsSidebarObj[] = [
  {
    title: "Home",
    url: ROUTE_ENUM.ROOT,
    icon: Home,
  },
  {
    title: "Login",
    url: ROUTE_ENUM.LOGIN,
    icon: LogIn,
  },
  {
    title: "Registrar",
    url: ROUTE_ENUM.REGISTER,
    icon: UserPlus,
  },
  {
    title: "Agendar",
    url: ROUTE_ENUM.BARBER_SCHEDULE,
    icon: CalendarCheck2,
  },
  // {
  //   title: "Pesquisar",
  //   url: "#",
  //   icon: Search,
  // },
  {
    title: "Minha Barbearia",
    url: ROUTE_ENUM.BARBER_SHOP,
    icon: Store,
  },
  {
    title: "Meu Perfil",
    url: ROUTE_ENUM.PROFILE,
    icon: User,
  },
  {
    title: "Admin",
    url: ROUTE_ENUM.ADMIN,
    icon: Award,
  },
];


{/* <Route path={ROUTE_ENUM.ROOT} element={<BaseLayout />}>
<Route index element={<Home />} />
<Route path="login" element={<Login />} />
<Route path="register" element={<Register />} />

<Route element={<ProtectedClientRoute />}>
  <Route path={ROUTE_ENUM.PROFILE} element={<ClientLayout />}>
    <Route path=":id" element={<p>Profile</p>} />
    <Route path=":id/edit" element={<p>Edit</p>} />
  </Route>

  <Route path={ROUTE_ENUM.BARBER_SCHEDULE} element={<BarberScheduleLayout />}>
    <Route index element={<Home />} />
    <Route path="login" element={<Login />} />
    <Route path="register" element={<Register />} />
  </Route>
</Route>

<Route element={<ProtectedBarberShopRoute />}>
  <Route path={ROUTE_ENUM.BARBER_SHOP} element={<BarberShopLayout />}>
    <Route index element={<Home />} />
    <Route path="login" element={<Login />} />
    <Route path="register" element={<Register />} />
  </Route>
</Route>

<Route element={<ProtectedAdminRoute />}>
  <Route path={ROUTE_ENUM.ADMIN} element={<AdminLayout />}>
    <Route index element={<Home />} />
    <Route path="login" element={<Login />} />
    <Route path="register" element={<Register />} />
  </Route>
</Route>
</Route> */}



export function AppSidebar() {
  const { isAuthenticated, isClient, isBarberShop, isAdmin, authUser } = useAuth()

  console.log({ isAuthenticated, isClient, isBarberShop, isAdmin, authUser })

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  Select Workspace
                  <ChevronDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem>
                  <span>Acme Inc</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Acme Corp.</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarMenuItem>
            <CollapsibleTrigger>
              Application
              <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {items.map((item) => (
                  <SidebarMenuSubItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarContent>

      {isAuthenticated && (
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <User2 /> {authUser?.profile?.firstName}
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <DropdownMenuItem>
                    <span>Account</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Billing</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      )}
    </Sidebar>
  )
}
