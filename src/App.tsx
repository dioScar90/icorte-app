import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements, redirect } from 'react-router-dom'
import { Home } from './pages/home'
import { Login } from './pages/login'
import { BaseLayout } from './components/layouts/base-layout'
import { Register } from './pages/register'
import { ProfileLayout } from './components/layouts/profile-layout'
import { BarberShopLayout } from './components/layouts/barber-shop-layout'
import { AdminLayout } from './components/layouts/admin-layout'
import { BarberScheduleLayout } from './components/layouts/barber-schedule-layout'
import { ProtectedClientRoute } from './protectedRoutes/client-protected-route'
import { ProtectedBarberShopRoute } from './protectedRoutes/barber-shop-protected-route'
import { ProtectedAdminRoute } from './protectedRoutes/admin-protected-route'
import { ROUTE_ENUM } from './types/route'
import { RegisterBarberShop } from './pages/barber-shop/register'
import { BarberShopDashboard } from './pages/barber-shop/dashboard'
import { RemoveAll } from './pages/admin/remove-all'
import { AdminDashboard } from './pages/admin/dashboard'
import { ErrorRoutePage } from './pages/error-route'
import { baseLoader } from './data/loaders/baseLoader'
import { profileLoader } from './data/loaders/profileLoader'
import { Edit } from './pages/profile/edit'
import { MyProfile } from './pages/profile/my-profile'
import { barberShopLoader } from './data/loaders/barberShopLoader'

export function App() {
  const browerRouter = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route
          path={ROUTE_ENUM.ROOT}
          loader={baseLoader}
          element={<BaseLayout />}
          shouldRevalidate={({ currentUrl, nextUrl }) => currentUrl.pathname !== nextUrl.pathname}
        >
          <Route index loader={async () => redirect(ROUTE_ENUM.HOME)} />
          <Route path="home" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          
          <Route element={<ProtectedClientRoute />}>
            <Route path={ROUTE_ENUM.PROFILE} loader={profileLoader} element={<ProfileLayout />}>
              <Route path=":id" element={<MyProfile />} />
              <Route path=":id/edit" element={<Edit />} />
            </Route>

            <Route path={ROUTE_ENUM.BARBER_SCHEDULE} element={<BarberScheduleLayout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>
          </Route>

          <Route element={<ProtectedBarberShopRoute />}>
            <Route path={ROUTE_ENUM.BARBER_SHOP} loader={barberShopLoader} element={<BarberShopLayout />}>
              <Route index element={<Home />} />
              <Route path=":id" element={<p>Barber Shop</p>} />
              <Route path=":id/edit" element={<p>Edit Barber Shop</p>} />
              <Route path="register" element={<RegisterBarberShop />} />
              <Route path="dashboard" element={<BarberShopDashboard />} />
            </Route>
          </Route>
          
          <Route element={<ProtectedAdminRoute />}>
            <Route path={ROUTE_ENUM.ADMIN} element={<AdminLayout />}>
              <Route index loader={async () => redirect(`${ROUTE_ENUM.ADMIN}/dashboard`)} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="remove-all" element={<RemoveAll />} />
            </Route>
          </Route>

          <Route path="*" element={<ErrorRoutePage />} />
        </Route>
      </Route>
    )
  )

  return <RouterProvider router={browerRouter} />
}
