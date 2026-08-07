export type TaskStatus = 'pending' | 'completed';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  createdAt?: string;
}

export type TechnicalSupportStatus = 'abierta' | 'en_ejecucion' | 'cerrada' | 'cancelada';

export type TechnicalSupportPriority = 'baja' | 'media' | 'alta';

export type TechnicalSupportCategory =
  | 'Acceso al sistema'
  | 'Error de la aplicación'
  | 'Problema con contraseña'
  | 'Problema de impresión'
  | 'Problema de red'
  | 'Solicitud de información'
  | 'Solicitud de nueva funcionalidad'
  | 'Otro';

export interface TechnicalSupport {
  id: string;
  fullName: string;
  phone: string;
  area: string;
  category: TechnicalSupportCategory;
  description: string;
  priority: TechnicalSupportPriority;
  maxSolutionDate: string;
  status: TechnicalSupportStatus;
  createdAt?: string;
}

export type CreateTechnicalSupportInput = Omit<
  TechnicalSupport,
  'id' | 'status' | 'createdAt'
>;
