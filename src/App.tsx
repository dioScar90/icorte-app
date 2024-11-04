import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import { Home } from './pages/home'
import { Login } from './pages/login'
import { BaseLayout } from './components/layouts/base-layout'
import { Register } from './pages/register'
import { ClientLayout } from './components/layouts/client-layout'
import { BarberShopLayout } from './components/layouts/barber-shop-layout'
import { AdminLayout } from './components/layouts/admin-layout'
import { BarberScheduleLayout } from './components/layouts/barber-schedule-layout'
import { ProtectedClientRoute } from './protectedRoutes/client-protected-route'
import { ProtectedBarberShopRoute } from './protectedRoutes/barber-shop-protected-route'
import { ProtectedAdminRoute } from './protectedRoutes/admin-protected-route'
import { ROUTE_ENUM } from './types/route'
import { Logout } from './pages/logout'
import { RegisterBarberShop } from './pages/barber-shop/registerBarberShop'
import { BarberShopDashboard } from './pages/barber-shop/dashboardBarberShop'

export function App() {
  const browerRouter = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path={ROUTE_ENUM.ROOT} element={<BaseLayout />}>
          <Route path="home" element={<Home />} />
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
              <Route path=":id" element={<p>Barber Shop</p>} />
              <Route path=":id/edit" element={<p>Edit Barber Shop</p>} />
              <Route path="register" element={<RegisterBarberShop />} />
              <Route path="dashboard" element={<BarberShopDashboard />} />
            </Route>
          </Route>
          
          <Route element={<ProtectedAdminRoute />}>
            <Route path={ROUTE_ENUM.ADMIN} element={<AdminLayout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>
          </Route>

          <Route path="logout" element={<Logout />} />
        </Route>
      </Route>
    )
  )

  return <RouterProvider router={browerRouter} />
}
