import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { TechnicalSupport, TechnicalSupportStatus } from '../types';
import { TECHNICAL_SUPPORT_PRIORITIES } from '../schemas/technicalSupportSchema';

interface TechnicalSupportCardProps {
  request: TechnicalSupport;
  onDelete?: (id: string) => void;
}

const STATUS_LABELS: Record<TechnicalSupportStatus, string> = {
  abierta: 'Abierta',
  en_ejecucion: 'En ejecución',
  cerrada: 'Cerrada',
  cancelada: 'Cancelada',
};

const STATUS_COLORS: Record<TechnicalSupportStatus, string> = {
  abierta: 'bg-violet-100 text-violet-800',
  en_ejecucion: 'bg-amber-100 text-amber-800',
  cerrada: 'bg-green-100 text-green-800',
  cancelada: 'bg-gray-100 text-gray-700',
};

export function TechnicalSupportCard({
  request,
  onDelete = () => {},
}: TechnicalSupportCardProps) {
  const priority = TECHNICAL_SUPPORT_PRIORITIES.find((p) => p.value === request.priority);
  const statusClass = STATUS_COLORS[request.status];

  return (
    <View
      testID={`support-card-${request.id}`}
      className="mb-2 rounded-2xl border border-gray-200 bg-white p-4"
    >
      <View className="mb-2 flex-row items-start justify-between gap-2">
        <Text className="flex-1 text-base font-semibold text-gray-900">{request.fullName}</Text>
        <View className={`rounded-full px-3 py-1 ${statusClass.split(' ')[0]}`}>
          <Text className={`text-xs font-semibold ${statusClass.split(' ')[1]}`}>
            {STATUS_LABELS[request.status]}
          </Text>
        </View>
      </View>

      <Text className="text-sm text-gray-600">Celular: {request.phone}</Text>
      <Text className="text-sm text-gray-600">Área: {request.area}</Text>
      <Text className="mt-1 text-sm font-medium text-gray-800">Categoría: {request.category}</Text>
      <Text className="mt-1 text-sm text-gray-700">{request.description}</Text>
      <Text className="mt-2 text-sm text-gray-600">
        Prioridad: {priority?.label ?? request.priority}
        {priority ? ` — ${priority.description}` : ''}
      </Text>
      <Text className="mt-1 text-sm text-gray-500">
        Fecha máxima de solución: {request.maxSolutionDate}
      </Text>
      <Pressable
        onPress={() => onDelete(request.id)}
        accessibilityRole="button"
        accessibilityLabel={`Eliminar solicitud de soporte de ${request.fullName}`}
      >
        <Text className="mt-3 text-sm font-medium text-red-600">Eliminar</Text>
      </Pressable>
    </View>
  );
}
