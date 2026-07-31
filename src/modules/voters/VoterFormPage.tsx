import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Save } from 'lucide-react'
import { useVotersStore } from './useVotersStore'
import { useCoordinatorsStore } from '../coordinators/useCoordinatorsStore'
import { usePollingPlacesStore } from '../polling-places/usePollingPlacesStore'
import { toast } from '../../components/feedback/Toast'
import { ROUTES } from '../../constants/routes'
import { CEARA_MUNICIPALITIES, SUPPORT_STATUS_OPTIONS, REGISTRATION_SOURCE_OPTIONS } from '../../constants/options'
import { applyPhoneMask } from '../../utils/formatters'

const schema = z.object({
  name: z.string().min(3, 'Nome deve ter ao menos 3 caracteres'),
  whatsapp: z.string().refine((value) => value.replace(/\D/g, '').length === 11, 'WhatsApp inválido'),
  coordinatorId: z.string().min(1, 'Selecione um coordenador'),
  address: z.string().min(5, 'Endereço inválido'),
  neighborhood: z.string().min(2, 'Informe o bairro'),
  region: z.string().min(1, 'Selecione um município'),
  voterRegistration: z.string().regex(/^\d{12}$/, 'O título deve ter 12 números corridos'),
  electoralZone: z.string().min(1, 'Informe a zona'),
  electoralSection: z.string().min(1, 'Informe a seção'),
  pollingPlaceId: z.string().min(1, 'Selecione o local de votação'),
  supportStatus: z.enum(['gold', 'platinum', 'premium']),
  registrationSource: z.enum(['manual', 'event', 'referral', 'digital']),
  notes: z.string().optional(),
})
type FormData = z.infer<typeof schema>

export function VoterFormPage() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const { add, update, getById } = useVotersStore()
  const coordinators = useCoordinatorsStore((s) => s.coordinators)
  const pollingPlaces = usePollingPlacesStore((s) => s.pollingPlaces)
  const existing = isEdit ? getById(id!) : undefined
  const [pollingPlaceSearch, setPollingPlaceSearch] = useState('')

  const { register, handleSubmit, control, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { supportStatus: 'platinum', registrationSource: 'manual' },
  })

  // Auto-fill polling place based on voter registration (first 12 digits)
  const voterReg = useWatch({ control, name: 'voterRegistration' })
  useEffect(() => {
    if (voterReg && voterReg.length === 12) {
      // Example: assume electoral zone is digits 7-9 of the registration number
      const zone = voterReg.slice(6, 9);
      const matchingPlace = pollingPlaces.find((p) => p.electoralZone === zone);
      if (matchingPlace) {
        setValue('pollingPlaceId', matchingPlace.id, { shouldValidate: true });
        const timeoutId = window.setTimeout(() => {
          setPollingPlaceSearch(`${matchingPlace.name} — ${matchingPlace.neighborhood}`)
        }, 0)
        return () => window.clearTimeout(timeoutId)
      }
    }
  }, [voterReg, pollingPlaces, setValue])


  // Auto-fill zone from polling place
  const selectedPlaceId = useWatch({ control, name: 'pollingPlaceId' })
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
    if (!selectedPlace) return
    const timeoutId = window.setTimeout(() => {
      setPollingPlaceSearch(`${selectedPlace.name} — ${selectedPlace.neighborhood}`)
    }, 0)
    return () => window.clearTimeout(timeoutId)
  }, [selectedPlace])

  const onSubmit = async (data: FormData) => {
    const uppercaseData = {
      ...data,
      name: data.name.toUpperCase(),
      address: data.address.toUpperCase(),
      neighborhood: data.neighborhood.toUpperCase(),
      voterRegistration: data.voterRegistration.toUpperCase(),
      electoralZone: data.electoralZone.toUpperCase(),
      notes: data.notes ? data.notes.toUpperCase() : undefined,
    }

    try {
      if (isEdit) {
        await update(id!, uppercaseData)
        toast({ type: 'success', title: 'Eleitor atualizado', message: uppercaseData.name })
      } else {
        await add(uppercaseData)
        toast({ type: 'success', title: 'Eleitor cadastrado', message: uppercaseData.name })
      }
      navigate(ROUTES.VOTERS)
    } catch {
      toast({ type: 'error', title: 'Erro ao salvar', message: 'Verifique os dados e tente novamente' })
    }
  }

  const inputCls = (err?: { message?: string }) =>
    `form-input ${err ? 'error' : ''}`

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to={ROUTES.VOTERS} className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{isEdit ? 'Editar Eleitor' : 'Novo Eleitor'}</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {isEdit ? `Editando: ${existing?.name ?? ''}` : 'Preencha os dados do eleitor'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Dados Pessoais */}
        <div className="card p-6">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wide border-b border-slate-100 pb-3 mb-5">Dados Pessoais</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Nome completo *</label>
              <input placeholder="Nome completo do eleitor" className={inputCls(errors.name)} {...register('name')} />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">WhatsApp *</label>
              <input
                placeholder="(85) 99999-0000"
                className={inputCls(errors.whatsapp)}
                {...register('whatsapp', {
                  onChange: (event) => {
                    event.target.value = applyPhoneMask(event.target.value)
                  },
                })}
              />
              {errors.whatsapp && <p className="text-red-500 text-xs mt-1">{errors.whatsapp.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Coordenador Responsável *</label>
              <select className={inputCls(errors.coordinatorId)} {...register('coordinatorId')}>
                <option value="">Selecione...</option>
                {coordinators.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} — {c.region}</option>
                ))}
              </select>
              {errors.coordinatorId && <p className="text-red-500 text-xs mt-1">{errors.coordinatorId.message}</p>}
            </div>
          </div>
        </div>

        {/* Endereço */}
        <div className="card p-6">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wide border-b border-slate-100 pb-3 mb-5">Endereço</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Endereço completo *</label>
              <input placeholder="Rua, número, complemento" className={inputCls(errors.address)} {...register('address')} />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Bairro *</label>
              <input placeholder="Ex: Aldeota" className={inputCls(errors.neighborhood)} {...register('neighborhood')} />
              {errors.neighborhood && <p className="text-red-500 text-xs mt-1">{errors.neighborhood.message}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Município *</label>
              <select className={inputCls(errors.region)} {...register('region')}>
                <option value="">Selecione...</option>
                {CEARA_MUNICIPALITIES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
              {errors.region && <p className="text-red-500 text-xs mt-1">{errors.region.message}</p>}
            </div>
          </div>
        </div>

        {/* Dados Eleitorais */}
        <div className="card p-6">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wide border-b border-slate-100 pb-3 mb-5">Dados Eleitorais</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Título de Eleitor *</label>
              <input
                placeholder="123456789012"
                className={inputCls(errors.voterRegistration)}
                {...register('voterRegistration', {
                  onChange: (event) => {
                    event.target.value = event.target.value.replace(/\D/g, '').slice(0, 12);
                  },
                })}
              />
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
                className={inputCls(errors.pollingPlaceId)}
              />
              {!!pollingPlaceSearch && !shouldFilterPollingPlaces && !selectedPlaceId && (
                <p className="text-slate-500 text-xs mt-1">Digite ao menos 3 letras para iniciar a busca</p>
              )}
              {shouldFilterPollingPlaces && filteredPollingPlaces.length > 0 && (
                <div className="mt-2 max-h-44 overflow-auto rounded-lg border border-slate-200 bg-white">
                  {filteredPollingPlaces.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                      onClick={() => {
                        setValue('pollingPlaceId', p.id, { shouldValidate: true })
                        setPollingPlaceSearch(`${p.name} — ${p.neighborhood}`)
                      }}
                    >
                      {p.name} — {p.neighborhood} (Zona {p.electoralZone})
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
              <input
                placeholder={selectedPlace?.electoralZone ?? 'Ex: 001'}
                className={inputCls(errors.electoralZone)}
                {...register('electoralZone')}
              />
              {errors.electoralZone && <p className="text-red-500 text-xs mt-1">{errors.electoralZone.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Seção Eleitoral *</label>
              <select className={inputCls(errors.electoralSection)} {...register('electoralSection')}>
                <option value="">Selecione...</option>
                {(selectedPlace?.sections ?? []).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
                {!selectedPlace && <option disabled>Selecione um local primeiro</option>}
              </select>
              {errors.electoralSection && <p className="text-red-500 text-xs mt-1">{errors.electoralSection.message}</p>}
            </div>
          </div>
        </div>

        {/* Status e Origem */}
        <div className="card p-6">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wide border-b border-slate-100 pb-3 mb-5">Posicionamento e Origem</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">Status de Apoio *</label>
              <div className="flex gap-3">
                {SUPPORT_STATUS_OPTIONS.map((opt) => {
                  const colors = {
                    gold: 'checked:bg-amber-500 checked:border-amber-500',
                    platinum: 'checked:bg-slate-400 checked:border-slate-400',
                    premium: 'checked:bg-blue-500 checked:border-blue-500',
                  }
                  return (
                    <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value={opt.value}
                        className={`w-4 h-4 border-2 border-slate-300 ${colors[opt.value as keyof typeof colors]}`}
                        {...register('supportStatus')}
                      />
                      <span className="text-sm text-slate-700">{opt.label}</span>
                    </label>
                  )
                })}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Origem do Cadastro *</label>
              <select className="form-input" {...register('registrationSource')}>
                {REGISTRATION_SOURCE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
          <div className="mt-5">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Observações</label>
            <textarea rows={3} placeholder="Informações adicionais sobre o eleitor..." className="form-input resize-none" {...register('notes')} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button type="submit" disabled={isSubmitting} className="btn-primary disabled:opacity-50">
            <Save size={16} />
            {isSubmitting ? 'Salvando...' : isEdit ? 'Salvar Alterações' : 'Cadastrar Eleitor'}
          </button>
          <Link to={ROUTES.VOTERS} className="btn-secondary">Cancelar</Link>
        </div>
      </form>
    </div>
  )
}
