import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { LabeledInput } from './LabeledInput';
import {
  TECHNICAL_SUPPORT_CATEGORIES,
  TECHNICAL_SUPPORT_PRIORITIES,
  validateTechnicalSupport,
} from '../schemas/technicalSupportSchema';
import {
  CreateTechnicalSupportInput,
  TechnicalSupportCategory,
  TechnicalSupportPriority,
} from '../types';

interface TechnicalSupportFormProps {
  onSubmit: (input: CreateTechnicalSupportInput) => void;
  disabled?: boolean;
}

const emptyForm = {
  fullName: '',
  phone: '',
  area: '',
  category: '' as TechnicalSupportCategory | '',
  description: '',
  priority: '' as TechnicalSupportPriority | '',
  maxSolutionDate: '',
};

function formatMaxSolutionDate(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 4) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
}

export function TechnicalSupportForm({ onSubmit, disabled = false }: TechnicalSupportFormProps) {
  const [values, setValues] = useState(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  const setField = (field: keyof typeof emptyForm, value: string) => {
    setValues((prev) => ({
      ...prev,
      [field]: field === 'maxSolutionDate' ? formatMaxSolutionDate(value) : value,
    }));
  };

  const handleSubmit = () => {
    const found = validateTechnicalSupport(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    onSubmit({
      fullName: values.fullName.trim(),
      phone: values.phone.trim(),
      area: values.area.trim(),
      category: values.category as TechnicalSupportCategory,
      description: values.description.trim(),
      priority: values.priority as TechnicalSupportPriority,
      maxSolutionDate: values.maxSolutionDate.trim(),
    });
    setValues(emptyForm);
    setErrors({});
  };

  return (
    <View className="gap-4">
      <LabeledInput
        label="Nombre completo"
        testID="input-nombre-completo"
        placeholder="Juan Pérez"
        value={values.fullName}
        error={errors.fullName}
        onChangeText={(t) => setField('fullName', t)}
        accessibilityLabel="Nombre completo"
      />
      <LabeledInput
        label="Celular"
        testID="input-celular"
        placeholder="3000000000"
        keyboardType="phone-pad"
        value={values.phone}
        error={errors.phone}
        onChangeText={(t) => setField('phone', t)}
        accessibilityLabel="Celular"
      />
      <LabeledInput
        label="Área"
        testID="input-area"
        placeholder="Tecnología"
        value={values.area}
        error={errors.area}
        onChangeText={(t) => setField('area', t)}
        accessibilityLabel="Área"
      />

      <View className="gap-2">
        <Text className="text-sm font-medium text-gray-700">Categoría</Text>
        <View className="flex-row flex-wrap gap-2">
          {TECHNICAL_SUPPORT_CATEGORIES.map((category) => {
            const active = values.category === category;
            return (
              <Pressable
                key={category}
                testID={`category-${category}`}
                onPress={() => setField('category', category)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                accessibilityLabel={`Categoría ${category}`}
                className={`rounded-full px-3 py-2 ${
                  active ? 'bg-violet-600' : 'bg-violet-100'
                }`}
              >
                <Text
                  className={`text-xs font-medium ${active ? 'text-white' : 'text-violet-800'}`}
                >
                  {category}
                </Text>
              </Pressable>
            );
          })}
        </View>
        {errors.category && <Text className="text-sm text-red-600">{errors.category}</Text>}
      </View>

      <LabeledInput
        label="Descripción"
        testID="input-descripcion"
        placeholder="Describe el problema o la solicitud"
        value={values.description}
        error={errors.description}
        onChangeText={(t) => setField('description', t)}
        accessibilityLabel="Descripción"
        multiline
        numberOfLines={3}
        textAlignVertical="top"
      />

      <View className="gap-2">
        <Text className="text-sm font-medium text-gray-700">
          Prioridad de la solicitud
        </Text>
        <View className="gap-2">
          {TECHNICAL_SUPPORT_PRIORITIES.map((priority) => {
            const active = values.priority === priority.value;
            return (
              <Pressable
                key={priority.value}
                testID={`priority-${priority.value}`}
                onPress={() => setField('priority', priority.value)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                accessibilityLabel={`Prioridad ${priority.label}`}
                className={`rounded-lg border p-3 ${
                  active ? 'border-violet-600 bg-violet-50' : 'border-gray-200 bg-white'
                }`}
              >
                <Text
                  className={`text-sm font-semibold ${active ? 'text-violet-700' : 'text-gray-900'}`}
                >
                  {priority.label}
                </Text>
                <Text className="mt-0.5 text-xs text-gray-500">{priority.description}</Text>
              </Pressable>
            );
          })}
        </View>
        {errors.priority && <Text className="text-sm text-red-600">{errors.priority}</Text>}
      </View>

      <LabeledInput
        label="Fecha máxima de solución"
        testID="input-fecha-maxima"
        placeholder="YYYY-MM-DD"
        value={values.maxSolutionDate}
        error={errors.maxSolutionDate}
        onChangeText={(t) => setField('maxSolutionDate', t)}
        accessibilityLabel="Fecha máxima de solución"
        autoCapitalize="none"
        autoCorrect={false}
        inputMode="numeric"
        keyboardType="number-pad"
        maxLength={10}
      />

      <Pressable
        testID="btn-crear-soporte"
        onPress={handleSubmit}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel="Crear solicitud de soporte técnico"
        className={`rounded-xl py-3 ${
          disabled ? 'bg-violet-300' : 'bg-violet-600 active:bg-violet-700'
        }`}
      >
        <Text className="text-center text-base font-semibold text-white">Crear</Text>
      </Pressable>
    </View>
  );
}
