import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CreateTechnicalSupportScreen } from '../../src/screens/CreateTechnicalSupportScreen';

const metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

const renderScreen = () =>
  render(
    <SafeAreaProvider initialMetrics={metrics}>
      <CreateTechnicalSupportScreen />
    </SafeAreaProvider>
  );

const fill = (testID: string, value: string) =>
  fireEvent.changeText(screen.getByTestId(testID), value);

const fillValidForm = async () => {
  await fill('input-nombre-completo', 'Juan Pérez');
  await fill('input-celular', '3000000000');
  await fill('input-area', 'Tecnología');
  await fireEvent.press(screen.getByText('Error de la aplicación'));
  await fill('input-descripcion', 'La aplicación se cierra al iniciar sesión');
  await fireEvent.press(screen.getByText('Alta'));
  await fill('input-fecha-maxima', '2026-08-20');
};

const fillInvalidFormatForm = async () => {
  await fill('input-nombre-completo', 'Laura123');
  await fill('input-celular', '300ABC0000');
  await fill('input-area', 'Área 51');
  await fireEvent.press(screen.getByText('Error de la aplicación'));
  await fill('input-descripcion', 'corta');
  await fireEvent.press(screen.getByText('Alta'));
  await fill('input-fecha-maxima', '20261340');
};

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe('CreateTechnicalSupportScreen - Integración', () => {
  it('mantiene en el cuerpo la estructura desde crear solicitud sin repetir el título del flujo', async () => {
    await renderScreen();

    await waitFor(() => {
      expect(screen.getByText('Crear Solicitud de Soporte Técnico')).toBeTruthy();
    });

    expect(screen.queryByText('Flujo de Soporte Técnico')).toBeNull();
  });

  it('registra una solicitud exitosamente con estado Abierta y actualiza el total', async () => {
    await renderScreen();

    await waitFor(() => {
      expect(screen.getByTestId('support-total')).toBeTruthy();
    });
    expect(screen.getByText('0 solicitudes registradas')).toBeTruthy();

    await fillValidForm();
    await fireEvent.press(screen.getByText('Crear'));

    await waitFor(() => {
      expect(screen.getByText('Solicitud de soporte técnico creada exitosamente')).toBeTruthy();
    });

    // "Abierta" aparece en el filtro y en el badge de la tarjeta
    expect(screen.getAllByText('Abierta').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('Juan Pérez')).toBeTruthy();
    expect(screen.getByText('1 solicitud registrada')).toBeTruthy();
    await waitFor(() =>
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'technical-supports',
        expect.stringContaining('Juan Pérez')
      )
    );
  });

  it('no muestra error al entrar cuando no hay solicitudes registradas', async () => {
    await renderScreen();

    await waitFor(() => {
      expect(screen.getByTestId('support-total')).toBeTruthy();
    });

    expect(screen.queryByTestId('support-error')).toBeNull();
    expect(screen.getByText('0 solicitudes registradas')).toBeTruthy();
  });

  it('muestra un error por cada campo con formato inválido y no crea la solicitud', async () => {
    await renderScreen();

    await fillInvalidFormatForm();
    await fireEvent.press(screen.getByText('Crear'));

    expect(screen.getByText('El nombre completo solo permite letras')).toBeTruthy();
    expect(screen.getByText('El celular solo permite números')).toBeTruthy();
    expect(screen.getByText('El área solo permite letras')).toBeTruthy();
    expect(screen.getByText('La descripción debe tener al menos 10 caracteres')).toBeTruthy();
    expect(screen.getByText('Ingresa una fecha válida con formato YYYY-MM-DD')).toBeTruthy();
    expect(screen.queryByText('Solicitud de soporte técnico creada exitosamente')).toBeNull();
  });

  it('limpia los errores a medida que se corrige cada campo hasta crear la solicitud', async () => {
    await renderScreen();

    await fillInvalidFormatForm();
    await fireEvent.press(screen.getByText('Crear'));

    expect(screen.getByText('El nombre completo solo permite letras')).toBeTruthy();

    await fill('input-nombre-completo', 'Laura Gómez');
    await fireEvent.press(screen.getByText('Crear'));
    await waitFor(() => {
      expect(screen.queryByText('El nombre completo solo permite letras')).toBeNull();
    });
    expect(screen.getByText('El celular solo permite números')).toBeTruthy();

    await fill('input-celular', '3001234567');
    await fireEvent.press(screen.getByText('Crear'));
    await waitFor(() => {
      expect(screen.queryByText('El celular solo permite números')).toBeNull();
    });
    expect(screen.getByText('El área solo permite letras')).toBeTruthy();

    await fill('input-area', 'Tecnología');
    await fireEvent.press(screen.getByText('Crear'));
    await waitFor(() => {
      expect(screen.queryByText('El área solo permite letras')).toBeNull();
    });
    expect(screen.getByText('La descripción debe tener al menos 10 caracteres')).toBeTruthy();

    await fill('input-descripcion', 'La aplicación falla al iniciar sesión');
    await fireEvent.press(screen.getByText('Crear'));
    await waitFor(() => {
      expect(screen.queryByText('La descripción debe tener al menos 10 caracteres')).toBeNull();
    });
    expect(screen.getByText('Ingresa una fecha válida con formato YYYY-MM-DD')).toBeTruthy();

    await fill('input-fecha-maxima', '2026-08-20');
    await fireEvent.press(screen.getByText('Crear'));

    await waitFor(() => {
      expect(screen.getByText('Solicitud de soporte técnico creada exitosamente')).toBeTruthy();
    });
    expect(screen.queryByText('El nombre completo solo permite letras')).toBeNull();
    expect(screen.queryByText('El celular solo permite números')).toBeNull();
    expect(screen.queryByText('El área solo permite letras')).toBeNull();
    expect(screen.queryByText('La descripción debe tener al menos 10 caracteres')).toBeNull();
    expect(screen.queryByText('Ingresa una fecha válida con formato YYYY-MM-DD')).toBeNull();
  });

  it('solicita confirmación antes de eliminar y borra la solicitud al confirmar', async () => {
    await renderScreen();

    await fillValidForm();
    await fireEvent.press(screen.getByText('Crear'));

    await waitFor(() => {
      expect(screen.getByText('Juan Pérez')).toBeTruthy();
    });

    await fireEvent.press(screen.getByLabelText('Eliminar solicitud de soporte de Juan Pérez'));

    expect(screen.getByText('Eliminar solicitud')).toBeTruthy();
    expect(
      screen.getByText(
        '¿Seguro que quieres eliminar "Juan Pérez"? Esta acción no se puede deshacer.'
      )
    ).toBeTruthy();

    await fireEvent.press(screen.getByLabelText('Confirmar eliminación'));

    await waitFor(() => {
      expect(screen.queryByText('Juan Pérez')).toBeNull();
    });
    expect(screen.getByText('0 solicitudes registradas')).toBeTruthy();
  });

  it('bloquea letras en la fecha máxima de solución y exige un formato válido', async () => {
    await renderScreen();

    fireEvent.changeText(screen.getByTestId('input-fecha-maxima'), 'abcd20260820');
    await waitFor(() => {
      expect(screen.getByTestId('input-fecha-maxima').props.value).toBe('2026-08-20');
    });

    await fillValidForm();
    fireEvent.changeText(screen.getByTestId('input-fecha-maxima'), '123');
    await waitFor(() => {
      expect(screen.getByTestId('input-fecha-maxima').props.value).toBe('123');
    });
    fireEvent.press(screen.getByText('Crear'));

    await waitFor(() => {
      expect(screen.getByText('Ingresa una fecha válida con formato YYYY-MM-DD')).toBeTruthy();
    });
  });
});
