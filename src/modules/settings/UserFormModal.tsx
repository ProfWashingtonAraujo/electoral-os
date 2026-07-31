import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, User, Mail, Shield, Lock, Activity } from 'lucide-react'
import type { SystemUser } from '../../api/user.api'

const createSchema = z.object({
  name: z.string().min(3, 'Nome deve ter ao menos 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
  role: z.enum(['admin', 'coordinator', 'digitador']),
  active: z.boolean(),
})

const editSchema = z.object({
  name: z.string().min(3, 'Nome deve ter ao menos 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().optional(),
  role: z.enum(['admin', 'coordinator', 'digitador']),
  active: z.boolean(),
})

type FormData = {
  name: string
  email: string
  password?: string
  role: 'admin' | 'coordinator' | 'digitador'
  active: boolean
}

interface UserFormModalProps {
  user: SystemUser | null
  onSave: (data: FormData) => void
  onClose: () => void
}

export function UserFormModal({ user, onSave, onClose }: UserFormModalProps) {
  const isEdit = !!user

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(isEdit ? editSchema : createSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'coordinator',
      active: true,
    },
  })

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role,
        active: user.active,
      })
    } else {
      reset({ name: '', email: '', password: '', role: 'coordinator', active: true })
    }
  }, [user, reset])

  const onSubmit = (data: FormData) => {
    const uppercaseData = {
      ...data,
      name: data.name.toUpperCase(),
    }
    // Don't send empty password on edit
    if (isEdit && !uppercaseData.password) {
      const rest = { ...uppercaseData }
      delete rest.password
      onSave(rest as FormData)
    } else {
      onSave(uppercaseData)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal wrapper */}
      <div className="relative min-h-dvh flex items-start sm:items-center justify-center p-4 py-10 sm:py-12">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
              <User size={17} className="text-blue-600" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base">
                {isEdit ? 'Editar Usuário' : 'Novo Usuário'}
              </h2>
              <p className="text-xs text-slate-500">
                {isEdit ? 'Altere os dados do perfil' : 'Preencha os dados do novo acesso'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Nome completo *</label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input {...register('name')} placeholder="Ex: João da Silva" className="form-input pl-10" />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">E-mail *</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input {...register('email')} type="email" placeholder="usuario@dominio.com.br" className="form-input pl-10" />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Senha {isEdit ? '(deixe em branco para não alterar)' : '*'}
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                {...register('password')}
                type="password"
                placeholder={isEdit ? '••••••••' : 'Mínimo 6 caracteres'}
                className="form-input pl-10"
              />
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                <span className="flex items-center gap-1.5"><Shield size={13} /> Perfil de Acesso</span>
              </label>
              <select {...register('role')} className="form-input">
                <option value="coordinator">Coordenador</option>
                <option value="digitador">Digitador</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                <span className="flex items-center gap-1.5"><Activity size={13} /> Status</span>
              </label>
              <select
                {...register('active', { setValueAs: (v) => v === 'true' || v === true })}
                className="form-input"
              >
                <option value="true">Ativo</option>
                <option value="false">Inativo</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 mt-2">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting} className="btn-primary disabled:opacity-50">
              {isSubmitting ? 'Salvando...' : isEdit ? 'Salvar Alterações' : 'Criar Usuário'}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  )
}
