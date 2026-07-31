import { useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Save } from 'lucide-react'
import { usePollingPlacesStore } from './usePollingPlacesStore'
import { toast } from '../../components/feedback/Toast'
import { ROUTES } from '../../constants/routes'
import { CEARA_MUNICIPALITIES } from '../../constants/options'

const schema = z.object({
  name: z.string().min(3, 'Nome deve ter ao menos 3 caracteres'),
  address: z.string().min(5, 'Endereço inválido'),
  neighborhood: z.string().min(2, 'Informe o bairro'),
  region: z.string().min(1, 'Selecione um município'),
  electoralZone: z.string().min(1, 'Informe a zona'),
  sections: z.string().min(1, 'Informe as seções separadas por vírgula'),
})

type FormData = z.infer<typeof schema>

export function PollingPlaceFormPage() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const { add, update, getById } = usePollingPlacesStore()
  const existing = isEdit ? getById(id!) : undefined

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (existing) {
      reset({
        ...existing,
        sections: existing.sections.join(', '),
      })
    }
  }, [existing, reset])

  const onSubmit = async (data: FormData) => {
    const formattedData = {
      ...data,
      name: data.name.toUpperCase(),
      address: data.address.toUpperCase(),
      neighborhood: data.neighborhood.toUpperCase(),
      electoralZone: data.electoralZone.toUpperCase(),
      sections: data.sections.toUpperCase().split(',').map((s) => s.trim()).filter(Boolean),
    }

    try {
      if (isEdit) {
        await update(id!, formattedData)
        toast({ type: 'success', title: 'Local de votação atualizado', message: formattedData.name })
      } else {
        await add(formattedData)
        toast({ type: 'success', title: 'Local de votação cadastrado', message: formattedData.name })
      }
      navigate(ROUTES.POLLING_PLACES)
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
        <Link to={ROUTES.POLLING_PLACES} className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{isEdit ? 'Editar Local de Votação' : 'Novo Local de Votação'}</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {isEdit ? `Editando: ${existing?.name ?? ''}` : 'Preencha os dados do local de votação'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="card p-6">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wide border-b border-slate-100 pb-3 mb-5">Informações do Local</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Nome do Local *</label>
              <input placeholder="Ex: Escola Estadual Professor Fulano" className={inputCls(errors.name)} {...register('name')} />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Endereço completo *</label>
              <input placeholder="Rua, número, complemento" className={inputCls(errors.address)} {...register('address')} />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Bairro *</label>
              <input placeholder="Ex: Centro" className={inputCls(errors.neighborhood)} {...register('neighborhood')} />
              {errors.neighborhood && <p className="text-red-500 text-xs mt-1">{errors.neighborhood.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Município *</label>
              <select className={inputCls(errors.region)} {...register('region')}>
                <option value="">Selecione...</option>
                {CEARA_MUNICIPALITIES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
              {errors.region && <p className="text-red-500 text-xs mt-1">{errors.region.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Zona Eleitoral *</label>
              <input placeholder="Ex: 001" className={inputCls(errors.electoralZone)} {...register('electoralZone')} />
              {errors.electoralZone && <p className="text-red-500 text-xs mt-1">{errors.electoralZone.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Seções (separadas por vírgula) *</label>
              <input placeholder="Ex: 12, 13, 14" className={inputCls(errors.sections)} {...register('sections')} />
              {errors.sections && <p className="text-red-500 text-xs mt-1">{errors.sections.message}</p>}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button type="submit" disabled={isSubmitting} className="btn-primary disabled:opacity-50">
            <Save size={16} />
            {isSubmitting ? 'Salvando...' : isEdit ? 'Salvar Alterações' : 'Cadastrar Local'}
          </button>
          <Link to={ROUTES.POLLING_PLACES} className="btn-secondary">Cancelar</Link>
        </div>
      </form>
    </div>
  )
}
