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
import { MyAppointmentsPage } from './pages/barber-schedule/my-appointments'
import { AppointmentPage } from './pages/barber-schedule/appointment'
import { NewAppointmentPage } from './pages/barber-schedule/new-appointment'
import { PopulateAll } from './pages/admin/populate-all'
import { ResetPassword } from './pages/admin/reset-password'
import { PopulateAppointments } from './pages/admin/populate-appointments'
import { BarberShopServices } from './pages/barber-shop/barber-shop-services'
import { servicesLoader } from './data/loaders/servicesLoader'
import { BarberShopServicesLayout } from './components/layouts/barber-shop-services-layout'
import { BarberShopSchedules } from './pages/barber-shop/barber-shop-schedules'
import { schedulesLoader } from './data/loaders/schedulesLoader'
import { BarberShopSchedulesLayout } from './components/layouts/barber-shop-schedules-layout'
import { barberScheduleLoader } from './data/loaders/barberScheduleLoader'
import { SearchUsersByNamePage } from './pages/admin/search-users'
import { LastUsersPage } from './pages/admin/last-users'
import { LastUsersLayout } from './components/layouts/last-users-layout'
import { lastUsersLoader } from './data/loaders/lastUsersLoader'

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
            
            <Route path={ROUTE_ENUM.BARBER_SCHEDULE} loader={barberScheduleLoader} element={<BarberScheduleLayout />}>
              <Route index action={async () => redirect(`${ROUTE_ENUM.BARBER_SCHEDULE}/dashboard`)} />
              <Route path="dashboard" element={<MyAppointmentsPage />} />
              
              <Route
                path="dashboard/:appointmentId"
                loader={async ({ params: { appointmentId } }) => +appointmentId! || undefined}
                element={<AppointmentPage />}
              />

              <Route path="new-appointment" element={<NewAppointmentPage />} />
            </Route>
          </Route>
          
          <Route loader={async ({ params: { barberShopId } }) => ({ barberShopId })} element={<ProtectedBarberShopRoute />}>
            <Route path={ROUTE_ENUM.BARBER_SHOP} loader={barberShopLoader} element={<BarberShopLayout />}>
              <Route index loader={async ({ params }) => !params.barberShopId ? redirect(ROUTE_ENUM.HOME) : null} />
              <Route path="register" element={<RegisterBarberShop />} />
              <Route path=":barberShopId" element={<MyBarberShop />} />
              <Route path=":barberShopId/edit" element={<BarberShopEdit />} />

              <Route path=":barberShopId/services" loader={servicesLoader} element={<BarberShopServicesLayout />}>
                <Route index element={<BarberShopServices />} />
              </Route>

              <Route path=":barberShopId/schedules" loader={schedulesLoader} element={<BarberShopSchedulesLayout />}>
                <Route index element={<BarberShopSchedules />} />
              </Route>
              
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

              <Route path="last-users" loader={lastUsersLoader} element={<LastUsersLayout />}>
                <Route index element={<LastUsersPage />} />
              </Route>
              
              <Route path="search-users" element={<SearchUsersByNamePage />} />
            </Route>
          </Route>

          <Route path="*" element={<ErrorRoutePage />} />
        </Route>
      </Route>
    )
  )

  return <RouterProvider router={browerRouter} />
}
