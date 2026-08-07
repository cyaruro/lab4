import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { TechnicalSupportList } from '../../src/components/TechnicalSupportList';
import { TechnicalSupport } from '../../src/types';

const mockRequest: TechnicalSupport = {
  id: '1',
  fullName: 'Juan Pérez',
  phone: '3000000000',
  area: 'Tecnología',
  category: 'Error de la aplicación',
  description: 'Falla al iniciar',
  priority: 'alta',
  maxSolutionDate: '2026-08-20',
  status: 'abierta',
};

describe('TechnicalSupportList', () => {
  it('muestra un mensaje cuando la lista está vacía', async () => {
    await render(<TechnicalSupportList requests={[]} />);
    expect(screen.getByText('No hay solicitudes de soporte técnico')).toBeTruthy();
    expect(screen.getByText('0 solicitudes registradas')).toBeTruthy();
  });

  it('no muestra el mensaje de lista vacía cuando hay solicitudes', async () => {
    await render(<TechnicalSupportList requests={[mockRequest]} />);
    expect(screen.queryByText('No hay solicitudes de soporte técnico')).toBeNull();
  });

  it('muestra el contador total de solicitudes correctamente', async () => {
    await render(
      <TechnicalSupportList
        requests={[mockRequest]}
        totalCount={5}
      />
    );
    expect(screen.getByText('5 solicitudes registradas')).toBeTruthy();
  });

  it('propaga la acción de eliminar desde la tarjeta', async () => {
    const onDelete = jest.fn();
    await render(<TechnicalSupportList requests={[mockRequest]} onDelete={onDelete} />);

    await fireEvent.press(screen.getByLabelText('Eliminar solicitud de soporte de Juan Pérez'));

    expect(onDelete).toHaveBeenCalledWith('1');
  });
});
