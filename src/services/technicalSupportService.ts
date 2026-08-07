import { CreateTechnicalSupportInput, TechnicalSupport } from '../types';

const API_URL = 'https://api.taskmanager.com';

export async function fetchTechnicalSupports(): Promise<TechnicalSupport[]> {
  const res = await fetch(`${API_URL}/technical-supports`);
  if (!res.ok) throw new Error('Error al obtener las solicitudes de soporte técnico');
  return res.json();
}

export async function createTechnicalSupport(
  input: CreateTechnicalSupportInput
): Promise<TechnicalSupport> {
  const res = await fetch(`${API_URL}/technical-supports`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error('Error al crear la solicitud de soporte técnico');
  return res.json();
}
