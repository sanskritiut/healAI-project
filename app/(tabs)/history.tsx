import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const mockHistory = [
  { id: 'h1', title: 'Headache remedies', date: '2025-11-10' },
  { id: 'h2', title: 'Managing anxiety', date: '2025-11-09' },
  { id: 'h3', title: 'Nutrition advice', date: '2025-11-08' },
];

export default function HistoryPage() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ThemedText type="title">History</ThemedText>

        <FlatList
          data={mockHistory}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.row}>
              <View>
                <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
                <ThemedText style={{ marginTop: 4 }}>{item.date}</ThemedText>
              </View>
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  row: { paddingVertical: 12, borderBottomWidth: 1, borderColor: '#eee' },
});
