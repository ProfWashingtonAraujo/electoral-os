import type { Activity } from '../types/common.types'

export const mockActivities: Activity[] = [
  { id: 'act-001', type: 'voter_added', description: 'Novo eleitor cadastrado', entityName: 'Priscila Santos Mota', userId: 'user-admin', createdAt: '2024-04-22T10:15:00Z' },
  { id: 'act-002', type: 'voter_added', description: 'Novo eleitor cadastrado', entityName: 'Roberto Campos Filho', userId: 'user-admin', createdAt: '2024-04-20T14:20:00Z' },
  { id: 'act-003', type: 'coordinator_added', description: 'Novo coordenador cadastrado', entityName: 'Camila Rodrigues Castro', userId: 'user-admin', createdAt: '2024-04-18T09:05:00Z' },
  { id: 'act-004', type: 'voter_added', description: 'Novo eleitor cadastrado', entityName: 'Tatiana Moura Gomes', userId: 'user-admin', createdAt: '2024-04-18T09:30:00Z' },
  { id: 'act-005', type: 'voter_edited', description: 'Eleitor atualizado', entityName: 'Eduardo Bastos Alves', userId: 'user-admin', createdAt: '2024-04-15T11:45:00Z' },
  { id: 'act-006', type: 'voter_added', description: 'Novo eleitor cadastrado', entityName: 'André Luiz Fonseca', userId: 'user-admin', createdAt: '2024-04-15T11:00:00Z' },
  { id: 'act-007', type: 'coordinator_edited', description: 'Coordenador atualizado', entityName: 'Marcos Vinícius Rocha', userId: 'user-admin', createdAt: '2024-04-12T10:00:00Z' },
  { id: 'act-008', type: 'voter_added', description: 'Novo eleitor cadastrado', entityName: 'Carolina Azevedo Lima', userId: 'user-admin', createdAt: '2024-04-12T10:15:00Z' },
]
