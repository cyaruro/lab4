import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CreateTechnicalSupportInput, TechnicalSupport } from '../types';
import { TechnicalSupportListSchema } from '../schemas/technicalSupportSchema';

const STORAGE_KEY = 'technical-supports';

export function useCreateTechnicalSupport() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [requests, setRequests] = useState<TechnicalSupport[]>([]);

  const load = useCallback(async () => {
    try {
      setError(null);
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setRequests([]);
        setStatus('idle');
        return;
      }

      const parsed = TechnicalSupportListSchema.safeParse(JSON.parse(raw));
      if (!parsed.success) {
        throw new Error('La información guardada de soporte técnico no es válida');
      }

      setRequests(parsed.data);
      setStatus('idle');
    } catch (e) {
      const message =
        e instanceof Error ? e.message : 'Error al cargar las solicitudes de soporte técnico';
      setError(message);
      setStatus('error');
      setRequests([]);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const submit = async (input: CreateTechnicalSupportInput) => {
    try {
      setStatus('loading');
      setError(null);

      const created: TechnicalSupport = {
        id: Date.now().toString(),
        ...input,
        status: 'abierta',
        createdAt: new Date().toISOString(),
      };
      const nextRequests = [...requests, created];

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextRequests));
      setRequests(nextRequests);
      setStatus('success');
    } catch (e) {
      const message =
        e instanceof Error ? e.message : 'Error al guardar la solicitud de soporte técnico';
      setError(message);
      setStatus('error');
    }
  };

  const removeRequest = async (id: string) => {
    try {
      setError(null);
      const nextRequests = requests.filter((request) => request.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextRequests));
      setRequests(nextRequests);
      setStatus('idle');
    } catch (e) {
      const message =
        e instanceof Error ? e.message : 'Error al eliminar la solicitud de soporte técnico';
      setError(message);
      setStatus('error');
    }
  };

  return { status, error, requests, submit, removeRequest, load };
}
