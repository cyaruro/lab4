import React from 'react';
import { View, Text } from 'react-native';
import { TechnicalSupport } from '../types';
import { TechnicalSupportCard } from './TechnicalSupportCard';

interface TechnicalSupportListProps {
  requests: TechnicalSupport[];
  /** Total de solicitudes registradas (sin filtrar). */
  totalCount?: number;
  onDelete?: (id: string) => void;
}

export function TechnicalSupportList({
  requests,
  totalCount,
  onDelete = () => {},
}: TechnicalSupportListProps) {
  const total = totalCount ?? requests.length;

  return (
    <View className="gap-3">
      <View className="rounded-3xl bg-violet-50 p-4">
        <Text testID="support-total" className="text-sm font-medium text-violet-700">
          Total de solicitudes registradas
        </Text>
        <Text className="mt-1 text-2xl font-bold text-violet-900">
          {total === 1 ? '1 solicitud registrada' : `${total} solicitudes registradas`}
        </Text>
      </View>

      {requests.length === 0 ? (
        <Text
          testID="support-empty"
          className="rounded-3xl bg-white py-6 text-center text-base text-gray-500"
        >
          No hay solicitudes de soporte técnico
        </Text>
      ) : (
        <View className="gap-2">
          {requests.map((request) => (
            <TechnicalSupportCard key={request.id} request={request} onDelete={onDelete} />
          ))}
        </View>
      )}
    </View>
  );
}
