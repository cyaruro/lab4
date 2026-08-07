import { TechnicalSupport, TechnicalSupportStatus } from '../types';

export type TechnicalSupportFilterStatus = TechnicalSupportStatus | 'all';

const VALID: TechnicalSupportFilterStatus[] = [
  'abierta',
  'en_ejecucion',
  'cerrada',
  'cancelada',
  'all',
];

export function filterTechnicalSupportByStatus(
  requests: TechnicalSupport[],
  status: TechnicalSupportFilterStatus
): TechnicalSupport[] {
  if (!VALID.includes(status)) {
    throw new Error(`Estado inválido: ${status}`);
  }
  if (status === 'all') return requests;
  return requests.filter((r) => r.status === status);
}
