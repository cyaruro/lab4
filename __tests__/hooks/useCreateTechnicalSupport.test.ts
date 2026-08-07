import AsyncStorage from '@react-native-async-storage/async-storage';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useCreateTechnicalSupport } from '../../src/hooks/useCreateTechnicalSupport';

const sampleInput = {
  fullName: 'Juan Pérez',
  phone: '3000000000',
  area: 'Tecnología',
  category: 'Error de la aplicación' as const,
  description: 'La app se cierra al iniciar',
  priority: 'alta' as const,
  maxSolutionDate: '2026-08-20',
};

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe('useCreateTechnicalSupport', () => {
  it('crea la solicitud con estado Abierta', async () => {
    const { result } = await renderHook(() => useCreateTechnicalSupport());

    await waitFor(() => expect(result.current.requests).toEqual([]));

    await act(async () => {
      await result.current.submit(sampleInput);
    });

    expect(result.current.requests).toHaveLength(1);
    expect(result.current.requests[0].status).toBe('abierta');
    expect(result.current.requests[0].fullName).toBe('Juan Pérez');
    expect(result.current.status).toBe('success');
  });

  it('carga las solicitudes almacenadas al montar', async () => {
    await AsyncStorage.setItem(
      'technical-supports',
      JSON.stringify([
        {
          id: '1',
          ...sampleInput,
          status: 'abierta',
          createdAt: '2026-08-06T12:00:00.000Z',
        },
      ])
    );

    const { result } = await renderHook(() => useCreateTechnicalSupport());

    await waitFor(() => expect(result.current.requests).toHaveLength(1));
    expect(result.current.requests[0].fullName).toBe('Juan Pérez');
    expect(result.current.error).toBeNull();
  });

  it('persiste las solicitudes y las recarga en un nuevo montaje', async () => {
    const first = await renderHook(() => useCreateTechnicalSupport());
    await waitFor(() => expect(first.result.current.requests).toEqual([]));

    await act(async () => {
      await first.result.current.submit(sampleInput);
    });

    await waitFor(() =>
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'technical-supports',
        expect.stringContaining('Juan Pérez')
      )
    );

    const second = await renderHook(() => useCreateTechnicalSupport());
    await waitFor(() => expect(second.result.current.requests).toHaveLength(1));
    expect(second.result.current.requests[0].fullName).toBe('Juan Pérez');
  });

  it('elimina una solicitud y persiste el cambio', async () => {
    const { result } = await renderHook(() => useCreateTechnicalSupport());
    await waitFor(() => expect(result.current.requests).toEqual([]));

    await act(async () => {
      await result.current.submit(sampleInput);
    });

    const createdId = result.current.requests[0]?.id;
    expect(createdId).toBeTruthy();

    await act(async () => {
      await result.current.removeRequest(createdId!);
    });

    expect(result.current.requests).toEqual([]);
    expect(result.current.status).toBe('idle');
    expect(AsyncStorage.setItem).toHaveBeenLastCalledWith('technical-supports', '[]');
  });

  it('expone el error cuando la información guardada no tiene un formato válido', async () => {
    await AsyncStorage.setItem('technical-supports', JSON.stringify([{ id: '1' }]));

    const { result } = await renderHook(() => useCreateTechnicalSupport());

    await waitFor(() => expect(result.current.status).toBe('error'));
    expect(result.current.error).toBe('La información guardada de soporte técnico no es válida');
    expect(result.current.requests).toEqual([]);
  });
});
