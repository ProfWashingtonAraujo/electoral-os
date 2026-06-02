import { AlertTriangle, X } from 'lucide-react'
import type { SystemUser } from './useUsersStore'

interface DeleteUserModalProps {
  user: SystemUser
  isLastAdmin: boolean
  isSelf: boolean
  onConfirm: () => void
  onClose: () => void
}

export function DeleteUserModal({ user, isLastAdmin, isSelf, onConfirm, onClose }: DeleteUserModalProps) {
  const isBlocked = isLastAdmin || isSelf

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isBlocked ? 'bg-amber-50' : 'bg-red-50'}`}>
              <AlertTriangle size={17} className={isBlocked ? 'text-amber-500' : 'text-red-500'} />
            </div>
            <h2 className="font-bold text-slate-900 text-base">Excluir Usuário</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* User Preview */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-sm">{user.name}</p>
              <p className="text-slate-500 text-xs">{user.email}</p>
            </div>
          </div>

          {/* Blocked warning */}
          {isBlocked ? (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
              <strong>Ação não permitida:</strong>{' '}
              {isSelf
                ? 'Você não pode excluir o seu próprio perfil.'
                : 'Este é o único administrador do sistema. Adicione outro admin antes de excluí-lo.'}
            </div>
          ) : (
            <p className="text-slate-600 text-sm">
              Tem certeza que deseja excluir permanentemente o usuário{' '}
              <strong className="text-slate-900">{user.name}</strong>? Esta ação não poderá ser desfeita.
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <button onClick={onClose} className="btn-secondary">
              {isBlocked ? 'Fechar' : 'Cancelar'}
            </button>
            {!isBlocked && (
              <button onClick={onConfirm} className="btn-danger">
                Sim, Excluir Usuário
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
