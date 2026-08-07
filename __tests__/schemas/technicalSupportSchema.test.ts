import { validateTechnicalSupport } from '../../src/schemas/technicalSupportSchema';

const validos = {
  fullName: 'Laura Gómez',
  phone: '3001234567',
  area: 'Tecnología',
  category: 'Error de la aplicación',
  description: 'La aplicación falla al iniciar sesión',
  priority: 'alta',
  maxSolutionDate: '2026-08-20',
};

const con = (cambios: Partial<typeof validos>) => validateTechnicalSupport({ ...validos, ...cambios });

describe('validateTechnicalSupport', () => {
  it('no reporta errores con datos válidos', () => {
    expect(validateTechnicalSupport(validos)).toEqual({});
  });

  it('acepta nombres y áreas con acentos, ñ y apóstrofes', () => {
    expect(con({ fullName: "Ñoño D'Ávila-Peña", area: 'Gestión Técnica' }).fullName).toBeUndefined();
    expect(con({ area: 'Gestión Técnica' }).area).toBeUndefined();
  });

  it.each(['Laura123', 'Laura!', '3000'])('rechaza el nombre completo %s', (fullName) => {
    expect(con({ fullName }).fullName).toBe('El nombre completo solo permite letras');
  });

  it.each(['300ABC0000', '+573001234567', '300 123 4567', '300-1234'])(
    'rechaza el celular %s',
    (phone) => {
      expect(con({ phone }).phone).toBe('El celular solo permite números');
    }
  );

  it.each(['Área 51', 'Operaciones9', 'TI!', '123'])('rechaza el área %s', (area) => {
    expect(con({ area }).area).toBe('El área solo permite letras');
  });

  it.each(['corta', '123456789'])('rechaza la descripción %s', (description) => {
    expect(con({ description }).description).toBe(
      'La descripción debe tener al menos 10 caracteres'
    );
  });

  it.each(['2026-13-20', '2026-02-30', '20-08-2026', '20260820'])(
    'rechaza la fecha %s',
    (maxSolutionDate) => {
      expect(con({ maxSolutionDate }).maxSolutionDate).toBe(
        'Ingresa una fecha válida con formato YYYY-MM-DD'
      );
    }
  );

  it('reporta todos los campos inválidos a la vez', () => {
    const errores = validateTechnicalSupport({
      fullName: 'Laura123',
      phone: '300ABC',
      area: 'Área 51',
      category: 'Error de la aplicación',
      description: 'corta',
      priority: 'alta',
      maxSolutionDate: '2026-13-20',
    });

    expect(Object.keys(errores)).toHaveLength(5);
    expect(errores).toEqual({
      fullName: 'El nombre completo solo permite letras',
      phone: 'El celular solo permite números',
      area: 'El área solo permite letras',
      description: 'La descripción debe tener al menos 10 caracteres',
      maxSolutionDate: 'Ingresa una fecha válida con formato YYYY-MM-DD',
    });
  });
});
