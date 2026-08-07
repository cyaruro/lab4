import { http, HttpResponse } from 'msw';
import { server } from '../../src/mocks/server';
import {
  createTechnicalSupport,
  fetchTechnicalSupports,
} from '../../src/services/technicalSupportService';

const API_URL = 'https://api.taskmanager.com';

const sampleInput = {
  fullName: 'Juan Pérez',
  phone: '3000000000',
  area: 'Tecnología',
  category: 'Error de la aplicación' as const,
  description: 'La app se cierra al iniciar',
  priority: 'alta' as const,
  maxSolutionDate: '2026-08-20',
};

describe('technicalSupportService contra la API falsa', () => {
  it('crea la solicitud con estado Abierta', async () => {
    const support = await createTechnicalSupport(sampleInput);
    expect(support).toMatchObject({
      ...sampleInput,
      status: 'abierta',
    });
    expect(support.id).toBeTruthy();
  });

  it('la solicitud creada aparece en el GET', async () => {
    await createTechnicalSupport(sampleInput);
    await expect(fetchTechnicalSupports()).resolves.toHaveLength(1);
  });

  it('lanza error cuando POST /technical-supports falla', async () => {
    server.use(
      http.post(`${API_URL}/technical-supports`, () => new HttpResponse(null, { status: 500 }))
    );
    await expect(createTechnicalSupport(sampleInput)).rejects.toThrow(
      'Error al crear la solicitud de soporte técnico'
    );
  });

  it('lanza error cuando GET /technical-supports falla', async () => {
    server.use(
      http.get(`${API_URL}/technical-supports`, () => new HttpResponse(null, { status: 500 }))
    );
    await expect(fetchTechnicalSupports()).rejects.toThrow(
      'Error al obtener las solicitudes de soporte técnico'
    );
  });
});
