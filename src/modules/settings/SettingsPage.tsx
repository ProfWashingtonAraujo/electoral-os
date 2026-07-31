import { useState, useEffect } from 'react'
import { useAuthStore } from '../auth/useAuthStore'
import { useUsersStore } from './useUsersStore'
import type { SystemUser } from '../../api/user.api'
import type { AuditLogEntry } from '../../api/audit.api'
import { auditApi } from '../../api/audit.api'
import { UserFormModal } from './UserFormModal'
import { DeleteUserModal } from './DeleteUserModal'
import { toast } from '../../components/feedback/Toast'
import { formatDate } from '../../utils/formatters'
import {
  User, Users, Shield,
  Plus, Pencil, Trash2, CheckCircle2, XCircle,
} from 'lucide-react'

type Tab = 'profile' | 'users' | 'advanced'

const ROLE_LABEL: Record<string, string> = {
  admin: 'Administrador',
  coordinator: 'Coordenador',
  digitador: 'Digitador',
}
const ROLE_STYLE: Record<string, string> = {
  admin: 'bg-indigo-100 text-indigo-700',
  coordinator: 'bg-blue-100 text-blue-700',
  digitador: 'bg-amber-100 text-amber-700',
}

const AUDIT_EVENT_LABEL: Record<string, string> = {
  login_success: 'Login',
  report_export: 'Exportação de relatório',
  settings_change: 'Alteração de configuração',
  voter_created: 'Cadastro de eleitor',
  coordinator_created: 'Cadastro de coordenador',
  polling_place_created: 'Cadastro de local de votação',
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback
}

export function SettingsPage() {
  const authUser = useAuthStore((s) => s.user)
  const { users, fetch, addUser, updateUser, deleteUser } = useUsersStore()

  const [activeTab, setActiveTab] = useState<Tab>('profile')
  const [profileName, setProfileName] = useState(authUser?.name ?? '')
  const [profileEmail, setProfileEmail] = useState(authUser?.email ?? '')
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([])
  const [notifyLogin, setNotifyLogin] = useState(localStorage.getItem('notify_login') !== 'false')
  const [notifyExport, setNotifyExport] = useState(localStorage.getItem('notify_export') !== 'false')

  // Modal state
  const [formTarget, setFormTarget] = useState<SystemUser | null | undefined>(undefined)
  const [deleteTarget, setDeleteTarget] = useState<SystemUser | null>(null)

  // Load users when tab opens
  useEffect(() => {
    if (activeTab === 'users') {
      fetch()
    }
  }, [activeTab, fetch])

  useEffect(() => {
    if (activeTab === 'advanced' && authUser?.role === 'admin') {
      auditApi.list(300).then(setAuditLogs).catch(() => setAuditLogs([]))
    }
  }, [activeTab, authUser?.role])

  const adminCount = users.filter((u) => u.role === 'admin').length

  const handleSaveUser = async (data: {
    name: string; email: string; password?: string;
    role: 'admin' | 'coordinator' | 'digitador'; active: boolean;
  }) => {
    try {
      if (formTarget) {
        await updateUser(formTarget.id, data)
        toast({ type: 'success', title: 'Usuário atualizado', message: `${data.name} foi atualizado com sucesso.` })
      } else {
        await addUser(data as Required<typeof data>)
        toast({ type: 'success', title: 'Usuário criado', message: `${data.name} foi adicionado ao sistema.` })
      }
      setFormTarget(undefined)
    } catch (err: unknown) {
      toast({ type: 'error', title: 'Erro ao salvar', message: getErrorMessage(err, 'Verifique os dados e tente novamente.') })
    }
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteUser(deleteTarget.id)
      toast({ type: 'success', title: 'Usuário excluído', message: `${deleteTarget.name} foi removido.` })
    } catch (err: unknown) {
      toast({ type: 'error', title: 'Erro ao excluir', message: getErrorMessage(err, 'Operação não permitida.') })
    }
    setDeleteTarget(null)
  }

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'profile', label: 'Meu Perfil', icon: User },
    { key: 'users', label: 'Usuários do Sistema', icon: Users },
    ...(authUser?.role === 'admin' ? [{ key: 'advanced' as const, label: 'Avançado', icon: Shield }] : []),
  ]

  const saveNotificationPrefs = async () => {
    localStorage.setItem('notify_login', String(notifyLogin))
    localStorage.setItem('notify_export', String(notifyExport))
    toast({ type: 'success', title: 'Preferências salvas', message: 'Configurações de notificação atualizadas.' })

    try {
      await auditApi.create({
        type: 'settings_change',
        message: 'Preferências de notificação alteradas',
        metadata: { notifyLogin, notifyExport },
        userName: authUser?.name,
        userEmail: authUser?.email,
      })
    } catch {
      // non-blocking
    }
  }

  return (
    <div className="space-y-6 animate-fade-in w-full">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Configurações</h1>
        <p className="text-slate-500 text-sm mt-0.5">Gerencie perfis, acessos e preferências da plataforma</p>
      </div>

      {/* Tab Bar */}
      <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 w-fit">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === key
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* ─── Tab: Meu Perfil ─── */}
      {activeTab === 'profile' && (
        <div className="space-y-5 max-w-5xl">
          <div className="card p-6 space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <User size={16} className="text-slate-400" />
              <h2 className="font-semibold text-slate-900">Perfil do Usuário</h2>
            </div>

            {/* Avatar block */}
            <div className="flex items-center gap-5 p-4 bg-slate-50 rounded-xl">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shrink-0">
                {authUser?.name?.slice(0, 2).toUpperCase() ?? 'AS'}
              </div>
              <div>
                <p className="font-bold text-slate-900">{authUser?.name}</p>
                <p className="text-slate-500 text-sm">{authUser?.email}</p>
                <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full mt-1 inline-block capitalize">
                  {authUser?.role ? ROLE_LABEL[authUser.role] : 'Usuário'}
                </span>
                {authUser?.role === 'digitador' && (
                  <p className="text-xs text-amber-700 mt-2 font-medium">
                    Permissões: cadastro, consulta e edição de eleitores
                  </p>
                )}
              </div>
            </div>

            {/* Edit fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nome completo</label>
                <input
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value.toUpperCase())}
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">E-mail</label>
                <input
                  type="email"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            <button
              onClick={() => toast({ type: 'success', title: 'Perfil atualizado', message: 'Alterações salvas com sucesso' })}
              className="btn-primary"
            >
              Salvar Perfil
            </button>
          </div>

        </div>
      )}

      {/* ─── Tab: Usuários do Sistema ─── */}
      {activeTab === 'users' && (
        <div className="space-y-4 w-full">
          {/* Header */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              {users.length} {users.length === 1 ? 'usuário cadastrado' : 'usuários cadastrados'}
            </p>
            <button onClick={() => setFormTarget(null)} className="btn-primary">
              <Plus size={15} /> Novo Usuário
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="card p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Total</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{users.length}</p>
            </div>
            <div className="card p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Administradores</p>
              <p className="text-2xl font-bold text-indigo-700 mt-1">{adminCount}</p>
            </div>
            <div className="card p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Ativos</p>
              <p className="text-2xl font-bold text-emerald-700 mt-1">{users.filter((u) => u.active).length}</p>
            </div>
          </div>

          {/* Table */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto min-h-[460px]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Usuário</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">E-mail</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Perfil</th>
                    <th className="text-center px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Cadastrado em</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => {
                    const isSelf = u.id === authUser?.id
                    return (
                      <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                              {u.name.slice(0, 2).toUpperCase()}
                            </div>
                            <p className="font-semibold text-slate-900 whitespace-nowrap">
                              {u.name}
                              {isSelf && (
                                <span className="ml-2 text-[10px] bg-green-100 text-green-700 font-semibold px-1.5 py-0.5 rounded-full">
                                  Você
                                </span>
                              )}
                            </p>
                          </div>
                        </td>

                        <td className="px-5 py-3.5 text-slate-700 text-sm min-w-[260px]">{u.email}</td>

                        <td className="px-5 py-3.5">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${ROLE_STYLE[u.role]}`}>
                            {ROLE_LABEL[u.role]}
                          </span>
                        </td>

                        <td className="px-5 py-3.5 text-center">
                          {u.active ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
                              <CheckCircle2 size={11} /> Ativo
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                              <XCircle size={11} /> Inativo
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-3.5 text-slate-500 text-sm whitespace-nowrap">
                          {formatDate(u.createdAt)}
                        </td>

                        <td className="px-5 py-3.5">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setFormTarget(u)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"
                              title="Editar"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(u)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                              title="Excluir"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              {users.length === 0 && (
                <div className="py-12 text-center">
                  <Users size={36} className="text-slate-200 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">Nenhum usuário encontrado</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'advanced' && authUser?.role === 'admin' && (
        <div className="space-y-4 w-full max-w-7xl">
          <div className="card p-6 space-y-4">
            <div>
              <h2 className="font-semibold text-slate-900">Notificações Administrativas</h2>
              <p className="text-sm text-slate-500 mt-0.5">Controle alertas de eventos críticos e exportações.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
                <span className="text-sm text-slate-700">Notificar logins no sistema</span>
                <input type="checkbox" checked={notifyLogin} onChange={(e) => setNotifyLogin(e.target.checked)} />
              </label>
              <label className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
                <span className="text-sm text-slate-700">Notificar exportações de relatório</span>
                <input type="checkbox" checked={notifyExport} onChange={(e) => setNotifyExport(e.target.checked)} />
              </label>
            </div>
            <button onClick={saveNotificationPrefs} className="btn-primary">Salvar Preferências</button>
          </div>

          <div className="card overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-900">Auditoria de Acessos e Exportações</h2>
              <p className="text-xs text-slate-500 mt-0.5">Rastro de login e exportação de PDF por usuário</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Data/Hora</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Usuário</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Evento</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Mensagem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {auditLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">{new Date(log.createdAt).toLocaleString('pt-BR')}</td>
                      <td className="px-5 py-3.5 text-slate-700">{log.userName ?? log.userEmail ?? log.userId}</td>
                      <td className="px-5 py-3.5 text-slate-700">{AUDIT_EVENT_LABEL[log.type] ?? log.type}</td>
                      <td className="px-5 py-3.5 text-slate-700">{log.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {auditLogs.length === 0 && (
                <div className="py-10 text-center text-slate-400 text-sm">Nenhum evento de auditoria encontrado</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── Modals ─── */}
      {formTarget !== undefined && (
        <UserFormModal
          user={formTarget}
          onSave={handleSaveUser}
          onClose={() => setFormTarget(undefined)}
        />
      )}

      {deleteTarget && (
        <DeleteUserModal
          user={deleteTarget}
          isLastAdmin={deleteTarget.role === 'admin' && adminCount <= 1}
          isSelf={deleteTarget.id === authUser?.id}
          onConfirm={handleConfirmDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}
