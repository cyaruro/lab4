import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
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

describe('CreateTechnicalSupportScreen - Accesibilidad', () => {
  it('el botón Crear tiene accessibilityLabel y accessibilityRole de botón', async () => {
    await renderScreen();

    const createButton = screen.getByLabelText('Crear solicitud de soporte técnico');

    expect(createButton).toHaveProp('accessibilityLabel', 'Crear solicitud de soporte técnico');
    expect(createButton).toHaveProp('accessibilityRole', 'button');
  });

  it('los campos clave del formulario son localizables por etiquetas accesibles', async () => {
    await renderScreen();

    const fullNameInput = screen.getByLabelText('Nombre completo');
    const descriptionInput = screen.getByLabelText('Descripción');

    expect(fullNameInput).toHaveProp('accessibilityLabel', 'Nombre completo');
    expect(descriptionInput).toHaveProp('accessibilityLabel', 'Descripción');
  });
});
