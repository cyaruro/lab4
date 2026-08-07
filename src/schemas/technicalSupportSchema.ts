import { z } from 'zod';

export const TECHNICAL_SUPPORT_CATEGORIES = [
  'Acceso al sistema',
  'Error de la aplicación',
  'Problema con contraseña',
  'Problema de impresión',
  'Problema de red',
  'Solicitud de información',
  'Solicitud de nueva funcionalidad',
  'Otro',
] as const;

export const TECHNICAL_SUPPORT_PRIORITIES = [
  {
    value: 'baja',
    label: 'Baja',
    description: 'No impide trabajar.',
  },
  {
    value: 'media',
    label: 'Media',
    description: 'Afecta parcialmente el trabajo.',
  },
  {
    value: 'alta',
    label: 'Alta',
    description: 'Impide continuar con la actividad.',
  },
] as const;

const ONLY_LETTERS_REGEX = /^[\p{L}\s'.-]+$/u;
const ONLY_DIGITS_REGEX = /^\d+$/;
const ISO_DATE_REGEX = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

const requiredText = (message: string) => z.string().trim().min(1, message);

function isValidIsoDate(value: string) {
  if (!ISO_DATE_REGEX.test(value)) return false;

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day
  );
}

const isoDateField = z.string().refine(isValidIsoDate, {
  message: 'Ingresa una fecha válida con formato YYYY-MM-DD',
});

export const TechnicalSupportSchema = z.object({
  id: z.string(),
  fullName: z.string().min(1),
  phone: z.string().min(1),
  area: z.string().min(1),
  category: z.enum(TECHNICAL_SUPPORT_CATEGORIES),
  description: z.string().min(1),
  priority: z.enum(['baja', 'media', 'alta']),
  maxSolutionDate: isoDateField,
  status: z.enum(['abierta', 'en_ejecucion', 'cerrada', 'cancelada']),
  createdAt: z.string().optional(),
});

export const TechnicalSupportListSchema = z.array(TechnicalSupportSchema);

export const CreateTechnicalSupportSchema = z.object({
  fullName: requiredText('El nombre completo es obligatorio').refine(
    (value) => ONLY_LETTERS_REGEX.test(value),
    { message: 'El nombre completo solo permite letras' }
  ),
  phone: requiredText('El celular es obligatorio').refine(
    (value) => ONLY_DIGITS_REGEX.test(value),
    { message: 'El celular solo permite números' }
  ),
  area: requiredText('El área es obligatoria').refine(
    (value) => ONLY_LETTERS_REGEX.test(value),
    { message: 'El área solo permite letras' }
  ),
  category: z.enum(TECHNICAL_SUPPORT_CATEGORIES, {
    errorMap: () => ({ message: 'Selecciona una categoría' }),
  }),
  description: requiredText('La descripción es obligatoria').min(
    10,
    'La descripción debe tener al menos 10 caracteres'
  ),
  priority: z.enum(['baja', 'media', 'alta'], {
    errorMap: () => ({ message: 'Selecciona una prioridad' }),
  }),
  maxSolutionDate: z
    .string()
    .min(1, 'La fecha máxima de solución es obligatoria')
    .refine(isValidIsoDate, {
      message: 'Ingresa una fecha válida con formato YYYY-MM-DD',
    }),
});

export type CreateTechnicalSupportFields = keyof z.infer<typeof CreateTechnicalSupportSchema>;

/** Devuelve { campo: mensaje } con el primer error de cada campo. Vacío = todo válido. */
export function validateTechnicalSupport(
  values: Record<string, string>
): Partial<Record<CreateTechnicalSupportFields, string>> {
  const result = CreateTechnicalSupportSchema.safeParse(values);
  if (result.success) return {};
  return Object.fromEntries(
    Object.entries(result.error.flatten().fieldErrors).map(([field, msgs]) => [field, msgs?.[0]])
  );
}
