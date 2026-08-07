import { filterTechnicalSupportByStatus } from '../../src/utils/filterTechnicalSupport';
import { TechnicalSupport } from '../../src/types';

const mockRequests: TechnicalSupport[] = [
  {
    id: '1',
    fullName: 'Ana',
    phone: '3001111111',
    area: 'TI',
    category: 'Problema de red',
    description: 'Sin internet',
    priority: 'alta',
    maxSolutionDate: '2026-08-10',
    status: 'abierta',
  },
  {
    id: '2',
    fullName: 'Luis',
    phone: '3002222222',
    area: 'RRHH',
    category: 'Acceso al sistema',
    description: 'No puede ingresar',
    priority: 'media',
    maxSolutionDate: '2026-08-12',
    status: 'en_ejecucion',
  },
  {
    id: '3',
    fullName: 'María',
    phone: '3003333333',
    area: 'Finanzas',
    category: 'Otro',
    description: 'Consulta general',
    priority: 'baja',
    maxSolutionDate: '2026-08-15',
    status: 'cerrada',
  },
  {
    id: '4',
    fullName: 'Pedro',
    phone: '3004444444',
    area: 'Operaciones',
    category: 'Problema de impresión',
    description: 'Impresora fallando',
    priority: 'media',
    maxSolutionDate: '2026-08-11',
    status: 'cancelada',
  },
];

describe('filterTechnicalSupportByStatus', () => {
  it('devuelve solo las solicitudes con el estado indicado', () => {
    const result = filterTechnicalSupportByStatus(mockRequests, 'abierta');
    expect(result).toHaveLength(1);
    expect(result[0].fullName).toBe('Ana');
  });

  it('devuelve un arreglo vacío cuando no hay coincidencias', () => {
    const onlyClosed = mockRequests.filter((r) => r.status === 'cerrada');
    const result = filterTechnicalSupportByStatus(onlyClosed, 'abierta');
    expect(result).toEqual([]);
  });

  it('devuelve todas las solicitudes cuando el estado es "all"', () => {
    const result = filterTechnicalSupportByStatus(mockRequests, 'all');
    expect(result).toHaveLength(4);
  });

  it('lanza un error cuando el estado es inválido', () => {
    // @ts-expect-error probando entrada inválida en runtime
    expect(() => filterTechnicalSupportByStatus(mockRequests, 'invalido')).toThrow();
  });
});
