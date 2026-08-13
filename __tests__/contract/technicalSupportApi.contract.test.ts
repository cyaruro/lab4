import { z } from 'zod';
import { TECHNICAL_SUPPORT_CATEGORIES } from '../../src/schemas/technicalSupportSchema';

const ISO_LOCAL_DATE_REGEX = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

function isValidIsoDate(value: string) {
  if (!ISO_LOCAL_DATE_REGEX.test(value)) return false;

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day
  );
}

const TechnicalSupportApiSchema = z.object({
  id: z.string().regex(/^\d+$/, 'El id debe ser una cadena numérica'),
  fullName: z.string().trim().min(1, 'El nombre completo es obligatorio'),
  phone: z.string().regex(/^\d+$/, 'El celular solo permite números'),
  area: z.string().trim().min(1, 'El área es obligatoria'),
  category: z.enum(TECHNICAL_SUPPORT_CATEGORIES),
  description: z.string().trim().min(10, 'La descripción debe tener al menos 10 caracteres'),
  priority: z.enum(['baja', 'media', 'alta']),
  maxSolutionDate: z.string().refine(isValidIsoDate, {
    message: 'La fecha máxima debe tener formato YYYY-MM-DD',
  }),
  status: z.enum(['abierta', 'en_ejecucion', 'cerrada', 'cancelada']),
  createdAt: z.string().datetime(),
});

const TechnicalSupportListApiSchema = z.array(TechnicalSupportApiSchema);

describe('API Contract - Technical Supports', () => {
  it('valida una respuesta correcta del endpoint POST /technical-supports', () => {
    const apiResponse = {
      id: '1',
      fullName: 'Laura Gómez',
      phone: '3001234567',
      area: 'Tecnología',
      category: 'Error de la aplicación',
      description: 'La aplicación falla al iniciar sesión',
      priority: 'alta',
      maxSolutionDate: '2026-08-20',
      status: 'abierta',
      createdAt: '2026-08-11T22:06:14.871Z',
    };

    const result = TechnicalSupportApiSchema.safeParse(apiResponse);

    expect(result.success).toBe(true);
  });

  it('valida una respuesta correcta del endpoint GET /technical-supports', () => {
    const apiResponse = [
      {
        id: '1',
        fullName: 'Laura Gómez',
        phone: '3001234567',
        area: 'Tecnología',
        category: 'Error de la aplicación',
        description: 'La aplicación falla al iniciar sesión',
        priority: 'alta',
        maxSolutionDate: '2026-08-20',
        status: 'abierta',
        createdAt: '2026-08-11T22:06:14.871Z',
      },
    ];

    const result = TechnicalSupportListApiSchema.safeParse(apiResponse);

    expect(result.success).toBe(true);
  });

  it('rechaza una respuesta inválida y expone errores de tipo, enum y formato', () => {
    const invalidResponse = {
      id: 1,
      fullName: '',
      phone: '300-123-4567',
      area: '   ',
      category: 'Hardware',
      description: 'corta',
      priority: 'urgente',
      maxSolutionDate: '20/08/2026',
      status: 'pendiente',
      createdAt: '11-08-2026',
    };

    const result = TechnicalSupportApiSchema.safeParse(invalidResponse);

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ path: ['id'] }),
          expect.objectContaining({ path: ['fullName'] }),
          expect.objectContaining({ path: ['phone'] }),
          expect.objectContaining({ path: ['area'] }),
          expect.objectContaining({ path: ['category'] }),
          expect.objectContaining({ path: ['description'] }),
          expect.objectContaining({ path: ['priority'] }),
          expect.objectContaining({ path: ['maxSolutionDate'] }),
          expect.objectContaining({ path: ['status'] }),
          expect.objectContaining({ path: ['createdAt'] }),
        ])
      );
    }
  });
});
