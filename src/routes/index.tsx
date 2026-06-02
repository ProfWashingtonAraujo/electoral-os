import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '../layouts/AppLayout'
import { ProtectedRoute } from './ProtectedRoute'
import { GuestRoute } from './GuestRoute'
import { RoleRoute } from './RoleRoute'
import { DefaultRouteRedirect } from './DefaultRouteRedirect'
import { LoginPage } from '../modules/auth/LoginPage'
import { AccessDeniedPage } from '../modules/auth/AccessDeniedPage'
import { DashboardPage } from '../modules/dashboard/DashboardPage'
import { CoordinatorsPage } from '../modules/coordinators/CoordinatorsPage'
import { CoordinatorFormPage } from '../modules/coordinators/CoordinatorFormPage'
import { CoordinatorDetailPage } from '../modules/coordinators/CoordinatorDetailPage'
import { VotersPage } from '../modules/voters/VotersPage'
import { VoterFormPage } from '../modules/voters/VoterFormPage'
import { VoterDetailPage } from '../modules/voters/VoterDetailPage'
import { PollingPlacesPage } from '../modules/polling-places/PollingPlacesPage'
import { PollingPlaceFormPage } from '../modules/polling-places/PollingPlaceFormPage'
import { PollingPlaceDetailPage } from '../modules/polling-places/PollingPlaceDetailPage'
import { ReportsPage } from '../modules/reports/ReportsPage'
import { SettingsPage } from '../modules/settings/SettingsPage'

export const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    children: [{ path: '/login', element: <LoginPage /> }],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/', element: <DefaultRouteRedirect /> },
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/access-denied', element: <AccessDeniedPage /> },
          { path: '/voters', element: <VotersPage /> },
          { path: '/voters/new', element: <VoterFormPage /> },
          { path: '/voters/:id', element: <VoterDetailPage /> },
          { path: '/voters/:id/edit', element: <VoterFormPage /> },
          {
            element: <RoleRoute allowedRoles={['admin', 'coordinator']} />,
            children: [
              { path: '/coordinators', element: <CoordinatorsPage /> },
              { path: '/coordinators/:id', element: <CoordinatorDetailPage /> },
            ],
          },
          {
            element: <RoleRoute allowedRoles={['admin']} />,
            children: [
              { path: '/coordinators/new', element: <CoordinatorFormPage /> },
              { path: '/coordinators/:id/edit', element: <CoordinatorFormPage /> },
            ],
          },
          {
            element: <RoleRoute allowedRoles={['admin', 'coordinator']} />,
            children: [
              { path: '/polling-places', element: <PollingPlacesPage /> },
              { path: '/polling-places/new', element: <PollingPlaceFormPage /> },
              { path: '/polling-places/:id', element: <PollingPlaceDetailPage /> },
              { path: '/polling-places/:id/edit', element: <PollingPlaceFormPage /> },
            ],
          },
          {
            element: <RoleRoute allowedRoles={['admin']} />,
            children: [
              { path: '/reports', element: <ReportsPage /> },
              { path: '/settings', element: <SettingsPage /> },
            ],
          },
        ],
      },
    ],
  },
  { path: '*', element: <DefaultRouteRedirect /> },
])
