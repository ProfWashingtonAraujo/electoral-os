/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState } from 'react'
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react'

export interface ToastOptions {
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message?: string
  duration?: number
}

interface ToastItem extends ToastOptions {
  id: string
}

let addToastFn: ((opts: ToastOptions) => void) | null = null

export function toast(opts: ToastOptions) {
  addToastFn?.(opts)
}

const iconMap = {
  success: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
  error: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
  info: { icon: Info, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
  warning: { icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200' },
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  useEffect(() => {
    addToastFn = (opts: ToastOptions) => {
      const id = Math.random().toString(36).slice(2)
      const item: ToastItem = { ...opts, id }
      setToasts((prev) => [...prev, item])
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, opts.duration ?? 4000)
    }

    return () => {
      addToastFn = null
    }
  }, [])

  const dismiss = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id))

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 w-80">
      {toasts.map((t) => {
        const { icon: Icon, color, bg } = iconMap[t.type]
        return (
          <div
            key={t.id}
            className={`card border ${bg} px-4 py-3 shadow-lg animate-slide-in flex items-start gap-3`}
          >
            <Icon size={18} className={`${color} shrink-0 mt-0.5`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800">{t.title}</p>
              {t.message && <p className="text-xs text-slate-500 mt-0.5">{t.message}</p>}
            </div>
            <button onClick={() => dismiss(t.id)} className="text-slate-400 hover:text-slate-600 shrink-0">
              <X size={14} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
