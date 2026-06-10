import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Zap, Shield, TrendingUp, Users, Lock, Mail, Loader2 } from 'lucide-react'
import { useAuthStore } from './useAuthStore'
import { ROUTES } from '../../constants/routes'

const schema = z.object({
  email: z.string().email('Informe um e-mail válido'),
  password: z.string().min(1, 'Senha é obrigatória'),
})

const SESSION_EXPIRED_REASON_KEY = 'electoral_session_expired_reason'

type FormData = z.infer<typeof schema>

// Static features, stats moved inside component for reactivity
const features = [
  { icon: Shield, text: 'Dados protegidos e confidenciais' },
  { icon: TrendingUp, text: 'Inteligência estratégica em tempo real' },
  { icon: Users, text: 'Gestão completa de coordenadores' },
]

export function LoginPage() {
  const { login, isLoading } = useAuthStore()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [sessionExpiredMessage, setSessionExpiredMessage] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    const reason = sessionStorage.getItem(SESSION_EXPIRED_REASON_KEY)
    if (reason === 'inactivity') {
      setSessionExpiredMessage('Sua sessão expirou por inatividade. Faça login novamente para continuar.')
    }

    sessionStorage.removeItem(SESSION_EXPIRED_REASON_KEY)
  }, [])

  const onSubmit = async (data: FormData) => {
    setLoginError('')
    setSessionExpiredMessage('')
    const ok = await login(data.email, data.password)
    if (ok) {
      const loggedUser = useAuthStore.getState().user
      navigate(loggedUser?.role === 'digitador' ? ROUTES.VOTERS_NEW : ROUTES.DASHBOARD)
    } else {
      setLoginError('E-mail ou senha inválidos. Tente novamente.')
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* ─── Left Panel ─── */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #050D1F 0%, #0F1C3F 40%, #1E3A8A 100%)',
        }}
      >
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        />

        {/* Glow orbs */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-500 rounded-full opacity-10 blur-3xl" />
        <div className="absolute bottom-1/3 left-1/3 w-48 h-48 bg-indigo-600 rounded-full opacity-15 blur-3xl" />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full px-10 py-8 lg:py-10">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/40">
              <Zap size={20} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-tight">ElectoraOS</p>
              <p className="text-slate-400 text-xs">Plataforma de Gestão Eleitoral</p>
            </div>
          </div>

          {/* Main copy */}
          <div className="flex-1 flex flex-col justify-center gap-8 lg:gap-10">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                Sistema Operacional Eleitoral
              </div>
              <h1 className="text-[2.45rem] font-black text-white leading-[1.08] tracking-[-0.02em]">
                Inteligência Estratégica
                <br />
                <span className="text-blue-400">para sua Campanha</span>
              </h1>
              <p className="text-slate-300/90 text-[15px] leading-relaxed max-w-md">
                Gerencie coordenadores, eleitores e locais de votação com visão estratégica e dados em tempo real.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3.5">
              {features.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/20 ring-1 ring-blue-400/25 flex items-center justify-center">
                    <Icon size={14} className="text-blue-400" />
                  </div>
                  <p className="text-slate-200 text-sm tracking-[0.01em]">{text}</p>
                </div>
              ))}
            </div>

          </div>

          {/* Footer */}
          <p className="text-slate-600 text-xs">
            © 2026 ElectoraOS · Todos os direitos reservados
          </p>
        </div>
      </div>

      {/* ─── Right Panel ─── */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center px-6 py-10 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 justify-center mb-8">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <Zap size={20} className="text-white" />
            </div>
            <p className="text-slate-900 font-bold text-xl">ElectoraOS</p>
          </div>

          <div className="card p-8 shadow-xl shadow-slate-200 border border-slate-200/80">
            <div className="mb-7">
              <h2 className="text-[1.75rem] font-extrabold tracking-[-0.015em] text-slate-900">Bem-vindo de volta</h2>
              <p className="text-slate-500 text-sm mt-1.5">
                Acesse sua conta para continuar
              </p>
            </div>

            {sessionExpiredMessage && (
              <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                {sessionExpiredMessage}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  E-mail
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    placeholder="Seu login ou e-mail"
                    className={`form-input pl-11 ${errors.email ? 'error' : ''}`}
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-slate-700">Senha</label>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className={`form-input pl-11 pr-10 ${errors.password ? 'error' : ''}`}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Error */}
              {loginError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                  {loginError}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full justify-center h-11 text-base mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Autenticando...
                  </>
                ) : (
                  'Entrar na Plataforma'
                )}
              </button>
            </form>


          </div>
        </div>
      </div>
    </div>
  )
}
