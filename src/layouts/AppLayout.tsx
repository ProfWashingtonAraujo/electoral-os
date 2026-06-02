import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { AppSidebar } from '../components/layout/AppSidebar'
import { Topbar } from '../components/layout/Topbar'
import { useCoordinatorsStore } from '../modules/coordinators/useCoordinatorsStore'
import { usePollingPlacesStore } from '../modules/polling-places/usePollingPlacesStore'
import { useVotersStore } from '../modules/voters/useVotersStore'

export function AppLayout() {
  const fetchCoordinators = useCoordinatorsStore((s) => s.fetch)
  const fetchPollingPlaces = usePollingPlacesStore((s) => s.fetch)
  const fetchVotersStats = useVotersStore((s) => s.fetchStats)

  useEffect(() => {
    fetchCoordinators()
    fetchPollingPlaces()
    fetchVotersStats('all')
  }, [fetchCoordinators, fetchPollingPlaces, fetchVotersStats])

  return (
    <div className="min-h-screen flex" style={{ background: '#F1F5F9' }}>
      <AppSidebar />
      <div className="flex-1 flex flex-col ml-64 print:ml-0">
        <div className="print-hidden">
          <Topbar />
        </div>
        <main className="flex-1 pt-24 pb-8 print:pt-0 print:pb-0 px-6 overflow-y-auto">
          <div className="max-w-screen-xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
