import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import React from 'react';
import { FlatList, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

const trending = [
  'Healthy eating',
  'Mental health tips',
  'Sleep hygiene',
  'Managing stress',
];

export default function ExploreScreen() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.headerWrap}>
        <ThemedText type="title">Explore</ThemedText>

        <View style={styles.searchRow}>
          <IconSymbol name="magnifyingglass" size={20} color="#888" />
          <TextInput placeholder="Search health topics" style={styles.searchInput} />
        </View>
      </View>

      <View style={styles.listWrapper}>
        <ThemedText type="subtitle" style={{ marginTop: 0 }}>
          Trending
        </ThemedText>
        <FlatList
          data={trending}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.trendItem}>
              <ThemedText>{item}</ThemedText>
            </TouchableOpacity>
          )}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1 },
  headerWrap: { flex: 0.4, justifyContent: 'center' },
  listWrapper: { flex: 0.6 },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
  searchInput: { flex: 1, borderWidth: 1, padding: 8, borderRadius: 8 },
  trendItem: { paddingVertical: 12, borderBottomWidth: 1, borderColor: '#eee' },
});
