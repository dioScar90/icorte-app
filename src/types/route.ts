
export const ROUTE_ENUM = {
  ROOT: '/',
  HOME: '/home',
  REGISTER: '/register',
  LOGIN: '/login',
  LOGOUT: '/logout',
  CLIENT: '/client',
  PROFILE: '/profile',
  BARBER_SHOP: '/barber-shop',
  BARBER_SCHEDULE: '/barber-schedule',
  BE_PRO: '/pro',
  CHAT: '/chat',
  CONTACT_US: '/contact',
  WORK_WITH_US: '/work-with-us',
  ADMIN: '/admin',
} as const

/*
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
*/

const BASE_TITLE = 'iCorte™'

export const PATHS_ENUM = {
  HOME: ROUTE_ENUM.HOME,
  LOGIN: ROUTE_ENUM.LOGIN,
  REGISTER: ROUTE_ENUM.REGISTER,
} as const

export const PAGE_DETAILS_ENUM = {
  HOME: {
    path: ROUTE_ENUM.HOME,
    title: BASE_TITLE + ' - Home'
  },

} as const
