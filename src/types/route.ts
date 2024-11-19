
// const BASE_ROUTE = '/icorte-app' as const
const BASE_ROUTE = '' as const

export const ROUTE_ENUM = {
  ROOT: `${BASE_ROUTE}/`,
  HOME: `${BASE_ROUTE}/home`,
  REGISTER: `${BASE_ROUTE}/register`,
  LOGIN: `${BASE_ROUTE}/login`,
  LOGOUT: `${BASE_ROUTE}/logout`,
  FORGOT_PASSWORD: `${BASE_ROUTE}/forgot-password`,
  CLIENT: `${BASE_ROUTE}/client`,
  PROFILE: `${BASE_ROUTE}/profile`,
  BARBER_SHOP: `${BASE_ROUTE}/barber-shop`,
  BARBER_SCHEDULE: `${BASE_ROUTE}/barber-schedule`,
  BE_PRO: `${BASE_ROUTE}/pro`,
  CHAT: `${BASE_ROUTE}/chat`,
  CONTACT_US: `${BASE_ROUTE}/contact`,
  WORK_WITH_US: `${BASE_ROUTE}/work-with-us`,
  ADMIN: `${BASE_ROUTE}/admin`,
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
