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
import { BarberShopDashboard } from './pages/barber-shop/barber-shop-dashboard'
import { RemoveAll } from './pages/admin/remove-all'
import { AdminDashboard } from './pages/admin/dashboard'
import { ErrorRoutePage } from './pages/error-route'
import { baseLoader } from './data/loaders/baseLoader'
import { profileLoader } from './data/loaders/profileLoader'
import { ProfileEdit } from './pages/profile/profile-edit'
import { MyProfile } from './pages/profile/my-profile'
import { barberShopLoader } from './data/loaders/barberShopLoader'
import { MyBarberShop } from './pages/barber-shop/my-barber-shop'
import { BarberShopEdit } from './pages/barber-shop/barber-shop-edit'
import { MyAppointmentsPage } from './pages/barber-schedule/dashboard'
import { AppointmentPage } from './pages/barber-schedule/appointment'
import { SchedulePage } from './pages/barber-schedule/schedule'
import { SchedulePushPage } from './pages/barber-schedule/set-appointment'
import { PopulateAll } from './pages/admin/populate-all'
import { ResetPassword } from './pages/admin/reset-password'
import { PopulateAppointments } from './pages/admin/populate-appointments'

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
              <Route path=":userId" element={<MyProfile />} />
              <Route path=":userId/edit" element={<ProfileEdit />} />
            </Route>
            
            <Route path={ROUTE_ENUM.BARBER_SCHEDULE} loader={barberShopLoader} element={<BarberScheduleLayout />}>
              <Route index action={async () => redirect(`${ROUTE_ENUM.BARBER_SCHEDULE}/dashboard`)} />
              <Route path="dashboard" element={<MyAppointmentsPage />} />
              <Route path="dashboard/:appointmentId" element={<AppointmentPage />} />
              <Route path="schedule" element={<SchedulePage />} />
              <Route path="schedule/:barberShopId" element={<SchedulePushPage />} />
            </Route>
          </Route>
          
          <Route element={<ProtectedBarberShopRoute />}>
            <Route path={ROUTE_ENUM.BARBER_SHOP} loader={barberShopLoader} element={<BarberShopLayout />}>
              <Route index loader={async ({ params }) => !params.barberShopId ? redirect(ROUTE_ENUM.HOME) : null} />
              <Route path="register" element={<RegisterBarberShop />} />
              <Route path=":barberShopId" element={<MyBarberShop />} />
              <Route path=":barberShopId/edit" element={<BarberShopEdit />} />
              <Route path=":barberShopId/dashboard" element={<BarberShopDashboard />} />
            </Route>
          </Route>
          
          <Route element={<ProtectedAdminRoute />}>
            <Route path={ROUTE_ENUM.ADMIN} element={<AdminLayout />}>
              <Route index loader={async () => redirect(`${ROUTE_ENUM.ADMIN}/dashboard`)} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="remove-all" element={<RemoveAll />} />
              <Route path="populate-all" element={<PopulateAll />} />
              <Route path="populate-appointments" element={<PopulateAppointments />} />
              <Route path="reset-password" element={<ResetPassword />} />
            </Route>
          </Route>

          <Route path="*" element={<ErrorRoutePage />} />
        </Route>
      </Route>
    )
  )

  return <RouterProvider router={browerRouter} />
}
