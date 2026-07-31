import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, MapPin, Users } from 'lucide-react'
import { usePollingPlacesStore } from './usePollingPlacesStore'
import { ROUTES } from '../../constants/routes'
import { CEARA_MUNICIPALITIES } from '../../constants/options'

export function PollingPlacesPage() {
  const pollingPlaces = usePollingPlacesStore((s) => s.pollingPlaces)
  const [search, setSearch] = useState('')
  const [regionFilter, setRegionFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  const places = pollingPlaces
    .filter((p) => {
      const matchSearch = !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.neighborhood.toLowerCase().includes(search.toLowerCase())
      const matchRegion = !regionFilter || p.region === regionFilter
      return matchSearch && matchRegion
    })

  const totalPages = Math.ceil(places.length / itemsPerPage)
  const paginatedPlaces = places.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Locais de Votação</h1>
          <p className="text-slate-500 text-sm mt-0.5">{pollingPlaces.length} locais cadastrados</p>
        </div>
        <Link to={ROUTES.POLLING_PLACES_NEW} className="btn-primary">
          <Plus size={16} /> Novo Local
        </Link>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou bairro..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
            className="form-input pl-11 h-10 text-sm"
          />
        </div>
        <select
          value={regionFilter}
          onChange={(e) => {
            setRegionFilter(e.target.value)
            setCurrentPage(1)
          }}
          className="form-input h-10 text-sm min-w-36 appearance-none"
        >
          <option value="">Todos os municípios</option>
          {CEARA_MUNICIPALITIES.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {paginatedPlaces.map((place) => (
          <Link
            key={place.id}
            to={ROUTES.POLLING_PLACE_DETAIL(place.id)}
            className="card p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <MapPin size={18} className="text-blue-600" />
              </div>
              <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                Zona {place.electoralZone}
              </span>
            </div>
            <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-blue-700 transition-colors">
              {place.name}
            </h3>
            <p className="text-slate-500 text-xs mb-3">{place.address}</p>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-slate-500">
                <MapPin size={11} /> {place.neighborhood} · {place.region}
              </span>
              <span className="flex items-center gap-1 font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                <Users size={11} /> {place.sections.length} seções
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {place.sections.slice(0, 4).map((s) => (
                <span key={s} className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                  Seção {s}
                </span>
              ))}
              {place.sections.length > 4 && (
                <span className="text-xs text-slate-400">+{place.sections.length - 4}</span>
              )}
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="card px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-sm text-slate-500">
            Mostrando {(currentPage - 1) * itemsPerPage + 1} a {Math.min(currentPage * itemsPerPage, places.length)} de {places.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm font-medium rounded-md text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <span className="text-sm font-medium text-slate-700 px-3">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-sm font-medium rounded-md text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próximo
            </button>
          </div>
        </div>
      )}

      {places.length === 0 && (
        <div className="card flex flex-col items-center justify-center py-16 text-center">
          <MapPin size={40} className="text-slate-300 mb-3" />
          <p className="text-slate-500 font-medium">Nenhum local encontrado</p>
        </div>
      )}
    </div>
  )
}
