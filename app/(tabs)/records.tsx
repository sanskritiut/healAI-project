import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const records = [
  { id: 'r1', title: 'Blood Test — Nov 2025', summary: 'Cholesterol within normal range.' },
  { id: 'r2', title: 'MRI Scan — Oct 2025', summary: 'No acute findings.' },
];

export default function RecordsPage() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ThemedText type="title">Records</ThemedText>

        <FlatList
          data={records}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
              <ThemedText style={{ marginTop: 6 }}>{item.summary}</ThemedText>
            </View>
          )}
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#eee', marginBottom: 12 },
});
