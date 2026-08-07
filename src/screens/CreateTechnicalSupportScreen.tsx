import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, InputAccessoryView, Keyboard, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ConfirmDeleteDialog } from '../components/ConfirmDeleteDialog';
import { TechnicalSupportForm } from '../components/TechnicalSupportForm';
import { TechnicalSupportList } from '../components/TechnicalSupportList';
import { KEYBOARD_ACCESSORY_ID } from '../components/LabeledInput';
import { useCreateTechnicalSupport } from '../hooks/useCreateTechnicalSupport';
import {
  filterTechnicalSupportByStatus,
  TechnicalSupportFilterStatus,
} from '../utils/filterTechnicalSupport';

const FILTERS: { value: TechnicalSupportFilterStatus; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'abierta', label: 'Abierta' },
  { value: 'en_ejecucion', label: 'En ejecución' },
  { value: 'cerrada', label: 'Cerrada' },
  { value: 'cancelada', label: 'Cancelada' },
];

export function CreateTechnicalSupportScreen() {
  const { status, error, requests, submit, removeRequest } = useCreateTechnicalSupport();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<TechnicalSupportFilterStatus>('all');
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const visibleRequests = filterTechnicalSupportByStatus(requests, filter);
  const pendingRequest = requests.find((request) => request.id === pendingDelete);

  return (
    <>
      <ScrollView
        className="flex-1 bg-gray-50"
        contentContainerClassName="gap-4 p-4"
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 24,
        }}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
      >
        <View className="gap-4 rounded-3xl bg-white p-4 shadow-sm shadow-violet-200/50">
          <Text className="text-lg font-semibold text-gray-900">
            Crear Solicitud de Soporte Técnico
          </Text>
          <TechnicalSupportForm onSubmit={submit} disabled={status === 'loading'} />
        </View>

        {status === 'success' && (
          <Text
            testID="support-success"
            className="rounded-2xl bg-emerald-100 px-4 py-3 text-sm font-medium text-emerald-800"
          >
            Solicitud de soporte técnico creada exitosamente
          </Text>
        )}
        {status === 'error' && error && (
          <Text
            testID="support-error"
            className="rounded-2xl bg-red-100 px-4 py-3 text-sm font-medium text-red-800"
          >
            {error}
          </Text>
        )}

        <View className="gap-3 rounded-3xl bg-white p-4 shadow-sm shadow-violet-200/50">
          <Text className="text-sm font-semibold text-gray-700">
            Filtrar por estado
          </Text>
          <View className="flex-row flex-wrap gap-2">
          {FILTERS.map((f) => {
            const active = filter === f.value;
            return (
              <Pressable
                key={f.value}
                testID={`filter-${f.value}`}
                onPress={() => setFilter(f.value)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                accessibilityLabel={`Filtrar por ${f.label}`}
                className={`rounded-full px-4 py-2 ${
                  active ? 'bg-violet-600' : 'bg-violet-100'
                }`}
              >
                <Text
                  className={`text-sm font-medium ${active ? 'text-white' : 'text-violet-800'}`}
                >
                  {f.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
        </View>

        <TechnicalSupportList
          requests={visibleRequests}
          totalCount={requests.length}
          onDelete={setPendingDelete}
        />
      </ScrollView>

      <ConfirmDeleteDialog
        visible={pendingDelete !== null}
        title="Eliminar solicitud"
        message={`¿Seguro que quieres eliminar ${
          pendingRequest ? `"${pendingRequest.fullName}"` : 'esta solicitud'
        }? Esta acción no se puede deshacer.`}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) {
            void removeRequest(pendingDelete);
          }
          setPendingDelete(null);
        }}
      />

      {Platform.OS === 'ios' && (
        <InputAccessoryView nativeID={KEYBOARD_ACCESSORY_ID}>
          <View className="flex-row justify-end border-t border-gray-200 bg-gray-100 px-4 py-2">
            <Pressable onPress={() => Keyboard.dismiss()} accessibilityRole="button">
              <Text className="text-base font-semibold text-blue-600">Listo</Text>
            </Pressable>
          </View>
        </InputAccessoryView>
      )}
    </>
  );
}
