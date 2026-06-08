import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Save } from 'lucide-react'
import { useCoordinatorsStore } from './useCoordinatorsStore'
import { voterApi } from '../../api/voter.api'
import { usePollingPlacesStore } from '../polling-places/usePollingPlacesStore'
import { toast } from '../../components/feedback/Toast'
import { ROUTES } from '../../constants/routes'
import { CEARA_MUNICIPALITIES, COORDINATOR_STATUS_OPTIONS } from '../../constants/options'
import { applyPhoneMask } from '../../utils/formatters'

const schema = z.object({
  name: z.string().min(3, 'Nome deve ter ao menos 3 caracteres'),
  phone: z.string().refine((value) => value.replace(/\D/g, '').length === 11, 'Telefone inválido'),
  whatsapp: z.string().refine((value) => value.replace(/\D/g, '').length === 11, 'WhatsApp inválido'),

  region: z.string().min(1, 'Selecione um município'),
  neighborhood: z.string().min(2, 'Informe o bairro'),
  voterRegistration: z.string().min(12, 'Título inválido (ex: 1234 5678 9012)'),
  pollingPlaceId: z.string().min(1, 'Selecione o local de votação'),
  electoralZone: z.string().min(1, 'Informe a zona eleitoral'),
  electoralSection: z.string().min(1, 'Informe a seção eleitoral'),
  status: z.enum(['gold', 'platinum', 'premium']),
  notes: z.string().optional(),
})
type FormData = z.infer<typeof schema>

const normalizeVoterRegistration = (value: string) => value.replace(/\D/g, '')

export function CoordinatorFormPage() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const { add, update, getById, fetchById } = useCoordinatorsStore()
  const pollingPlaces = usePollingPlacesStore((s) => s.pollingPlaces)

  const existing = isEdit ? getById(id!) : undefined
  const [isLoadingCoordinator, setIsLoadingCoordinator] = useState(isEdit)
  const [isLoadingVoterData, setIsLoadingVoterData] = useState(false)

  const [pollingPlaceSearch, setPollingPlaceSearch] = useState('')
  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { status: 'gold' },
  })

  const selectedPlaceId = watch('pollingPlaceId')
  const selectedPlace = pollingPlaces.find((p) => p.id === selectedPlaceId)
  const searchTerm = pollingPlaceSearch.trim().toLowerCase()
  const shouldFilterPollingPlaces = searchTerm.length >= 3
  const filteredPollingPlaces = pollingPlaces.filter((place) => {
    if (!shouldFilterPollingPlaces) return true
    return (
      place.name.toLowerCase().includes(searchTerm)
      || place.neighborhood.toLowerCase().includes(searchTerm)
      || place.electoralZone.toLowerCase().includes(searchTerm)
    )
  })

  useEffect(() => {
    if (existing) reset(existing)
  }, [existing, reset])

  useEffect(() => {
    if (!isEdit || !id) {
      setIsLoadingCoordinator(false)
      return
    }

    let isMounted = true

    fetchById(id)
      .catch(() => {
        if (isMounted) {
          toast({ type: 'error', title: 'Erro ao carregar', message: 'Não foi possível carregar o coordenador' })
          navigate(ROUTES.COORDINATORS)
        }
      })
      .finally(() => {
        if (isMounted) setIsLoadingCoordinator(false)
      })

    return () => {
      isMounted = false
    }
  }, [fetchById, id, isEdit, navigate])

  useEffect(() => {
    if (!selectedPlace) return
    setPollingPlaceSearch(`${selectedPlace.name} - ${selectedPlace.neighborhood}`)
  }, [selectedPlace])

  useEffect(() => {
    if (!selectedPlace) return
    setValue('electoralZone', selectedPlace.electoralZone, { shouldValidate: true })
    const sections = selectedPlace.sections ?? []
    if (sections.length === 1) {
      setValue('electoralSection', sections[0], { shouldValidate: true })
      return
    }
    if (sections.length > 1) {
      const currentSection = watch('electoralSection')
      if (!sections.includes(currentSection)) {
        setValue('electoralSection', '', { shouldValidate: true })
      }
    }
  }, [selectedPlace, setValue, watch])

  const fillFromVoterRegistration = async (value: string) => {
    const rawValue = value.trim()
    const normalizedValue = normalizeVoterRegistration(rawValue)
    if (normalizedValue.length < 12) return

    setIsLoadingVoterData(true)

    try {
      const searches = Array.from(new Set([rawValue, normalizedValue])).filter(Boolean)
      let matchedVoter: Awaited<ReturnType<typeof voterApi.getAll>>['items'][number] | undefined

      for (const search of searches) {
        const response = await voterApi.getAll({ search, page: 1, perPage: 20 })
        matchedVoter = response.items.find((voter) => normalizeVoterRegistration(voter.voterRegistration) === normalizedValue)
        if (matchedVoter) break
      }

      if (!matchedVoter) return

      const currentName = watch('name')
      const currentWhatsapp = watch('whatsapp')
      const currentRegion = watch('region')
      const currentNeighborhood = watch('neighborhood')

      if (!currentName.trim()) setValue('name', matchedVoter.name, { shouldValidate: true })
      if (!currentWhatsapp.trim()) setValue('whatsapp', matchedVoter.whatsapp, { shouldValidate: true })
      if (!currentRegion.trim()) setValue('region', matchedVoter.region, { shouldValidate: true })
      if (!currentNeighborhood.trim()) setValue('neighborhood', matchedVoter.neighborhood, { shouldValidate: true })

      setValue('pollingPlaceId', matchedVoter.pollingPlaceId, { shouldValidate: true })
      setValue('electoralZone', matchedVoter.electoralZone, { shouldValidate: true })
      setValue('electoralSection', matchedVoter.electoralSection, { shouldValidate: true })

      const matchedPlace = pollingPlaces.find((place) => place.id === matchedVoter.pollingPlaceId)
      if (matchedPlace) {
        setPollingPlaceSearch(`${matchedPlace.name} - ${matchedPlace.neighborhood}`)
      }

      toast({ type: 'info', title: 'Dados do eleitor carregados', message: matchedVoter.name })
    } catch {
      toast({ type: 'warning', title: 'Consulta indisponível', message: 'Não foi possível buscar os dados do eleitor agora' })
    } finally {
      setIsLoadingVoterData(false)
    }
  }

  const onSubmit = async (data: FormData) => {
    const uppercaseData = {
      ...data,
      name: data.name.toUpperCase(),
      neighborhood: data.neighborhood.toUpperCase(),
      voterRegistration: data.voterRegistration.toUpperCase(),
      electoralZone: data.electoralZone.toUpperCase(),
      notes: data.notes ? data.notes.toUpperCase() : undefined,
    }

    try {
      if (isEdit) {
        await update(id!, uppercaseData)
        toast({ type: 'success', title: 'Coordenador atualizado', message: uppercaseData.name })
      } else {
        await add(uppercaseData)
        toast({ type: 'success', title: 'Coordenador cadastrado', message: uppercaseData.name })
      }
      navigate(ROUTES.COORDINATORS)
    } catch (error) {
      toast({ type: 'error', title: 'Erro ao salvar', message: 'Verifique os dados e tente novamente' })
    }
  }

  if (isLoadingCoordinator) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-500">
        Carregando coordenador...
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to={ROUTES.COORDINATORS} className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isEdit ? 'Editar Coordenador' : 'Novo Coordenador'}
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {isEdit ? `Editando: ${existing?.name ?? ''}` : 'Preencha os dados do coordenador'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Dados pessoais */}
        <div className="card p-6 space-y-5">
          <h2 className="font-semibold text-slate-900 text-sm uppercase tracking-wide text-slate-400 border-b border-slate-100 pb-3">
            Dados Pessoais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Nome completo *</label>
              <input placeholder="Ex: João da Silva Santos" className={`form-input ${errors.name ? 'error' : ''}`} {...register('name')} />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Telefone *</label>
              <input
                placeholder="(85) 99999-0000"
                className={`form-input ${errors.phone ? 'error' : ''}`}
                {...register('phone', {
                  onChange: (event) => {
                    event.target.value = applyPhoneMask(event.target.value)
                  },
                })}
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">WhatsApp *</label>
              <input
                placeholder="(85) 99999-0000"
                className={`form-input ${errors.whatsapp ? 'error' : ''}`}
                {...register('whatsapp', {
                  onChange: (event) => {
                    event.target.value = applyPhoneMask(event.target.value)
                  },
                })}
              />
              {errors.whatsapp && <p className="text-red-500 text-xs mt-1">{errors.whatsapp.message}</p>}
            </div>

          </div>
        </div>

        {/* Localização e status */}
        <div className="card p-6 space-y-5">
          <h2 className="font-semibold text-slate-900 text-sm uppercase tracking-wide text-slate-400 border-b border-slate-100 pb-3">
            Localização e Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Município *</label>
              <select className={`form-input ${errors.region ? 'error' : ''}`} {...register('region')}>
                <option value="">Selecione...</option>
                {CEARA_MUNICIPALITIES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
              {errors.region && <p className="text-red-500 text-xs mt-1">{errors.region.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Bairro principal *</label>
              <input placeholder="Ex: Aldeota" className={`form-input ${errors.neighborhood ? 'error' : ''}`} {...register('neighborhood')} />
              {errors.neighborhood && <p className="text-red-500 text-xs mt-1">{errors.neighborhood.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Status *</label>
              <select className="form-input" {...register('status')}>
                {COORDINATOR_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Dados Eleitorais */}
        <div className="card p-6 space-y-5">
          <h2 className="font-semibold text-slate-900 text-sm uppercase tracking-wide text-slate-400 border-b border-slate-100 pb-3">
            Dados Eleitorais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Título de Eleitor *</label>
              <input
                placeholder="1234 5678 9012"
                className={`form-input ${errors.voterRegistration ? 'error' : ''}`}
                {...register('voterRegistration', {
                  onBlur: (event) => {
                    void fillFromVoterRegistration(event.target.value)
                  },
                })}
              />
              {isLoadingVoterData && <p className="text-slate-500 text-xs mt-1">Buscando dados do eleitor...</p>}
              {errors.voterRegistration && <p className="text-red-500 text-xs mt-1">{errors.voterRegistration.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Local de Votação *</label>
              <input
                value={pollingPlaceSearch}
                onChange={(event) => {
                  setPollingPlaceSearch(event.target.value)
                  setValue('pollingPlaceId', '')
                }}
                placeholder="Digite ao menos 3 letras"
                className={`form-input ${errors.pollingPlaceId ? 'error' : ''}`}
              />
              {!!pollingPlaceSearch && !shouldFilterPollingPlaces && !selectedPlaceId && (
                <p className="text-slate-500 text-xs mt-1">Digite ao menos 3 letras para iniciar a busca</p>
              )}
              {shouldFilterPollingPlaces && filteredPollingPlaces.length > 0 && (
                <div className="mt-2 max-h-44 overflow-auto rounded-lg border border-slate-200 bg-white">
                  {filteredPollingPlaces.map((place) => (
                    <button
                      key={place.id}
                      type="button"
                      className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                      onClick={() => {
                        setValue('pollingPlaceId', place.id, { shouldValidate: true })
                        setPollingPlaceSearch(`${place.name} - ${place.neighborhood}`)
                      }}
                    >
                      {place.name} - {place.neighborhood} (Zona {place.electoralZone})
                    </button>
                  ))}
                </div>
              )}
              {shouldFilterPollingPlaces && filteredPollingPlaces.length === 0 && !selectedPlaceId && (
                <p className="text-slate-500 text-xs mt-1">Nenhum local encontrado para essa pesquisa</p>
              )}
              <input type="hidden" {...register('pollingPlaceId')} />
              {errors.pollingPlaceId && <p className="text-red-500 text-xs mt-1">{errors.pollingPlaceId.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Zona Eleitoral *</label>
              <input placeholder="Ex: 001" className={`form-input ${errors.electoralZone ? 'error' : ''}`} {...register('electoralZone')} />
              {errors.electoralZone && <p className="text-red-500 text-xs mt-1">{errors.electoralZone.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Seção Eleitoral *</label>
              <select className={`form-input ${errors.electoralSection ? 'error' : ''}`} {...register('electoralSection')}>
                <option value="">Selecione...</option>
                {(selectedPlace?.sections ?? []).map((section) => (
                  <option key={section} value={section}>{section}</option>
                ))}
                {!selectedPlace && <option disabled>Selecione um local primeiro</option>}
              </select>
              {errors.electoralSection && <p className="text-red-500 text-xs mt-1">{errors.electoralSection.message}</p>}
            </div>
          </div>
        </div>

        {/* Observações */}
        <div className="card p-6">
          <h2 className="font-semibold text-slate-900 text-sm uppercase tracking-wide text-slate-400 border-b border-slate-100 pb-3 mb-5">
            Observações
          </h2>
          <textarea
            rows={3}
            placeholder="Anotações internas sobre o coordenador..."
            className="form-input resize-none"
            {...register('notes')}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button type="submit" disabled={isSubmitting} className="btn-primary disabled:opacity-50">
            <Save size={16} />
            {isSubmitting ? 'Salvando...' : isEdit ? 'Salvar Alterações' : 'Cadastrar Coordenador'}
          </button>
          <Link to={ROUTES.COORDINATORS} className="btn-secondary">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}
