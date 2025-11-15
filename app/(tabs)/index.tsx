import { Link, useRouter } from 'expo-router';
import React from 'react';
import { Button, StyleSheet, View } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <View style={styles.headerWrap}>
        <View style={styles.headerRow}>
          <ThemedText type="title">Welcome to HealAI</ThemedText>
          <HelloWave />
        </View>

        <ThemedText style={styles.lead}>
          Get fast, clear answers about health topics and keep your records in one place.
        </ThemedText>

        <View style={styles.actions}>
          <Button title="Start a Chat" onPress={() => router.push('/(tabs)/chat')} />
        </View>
      </View>

      <View style={styles.listWrapper}>
        <View style={styles.quickLinks}>
          <Link href="/(tabs)/explore">
            <ThemedText type="link">Explore topics</ThemedText>
          </Link>
          <Link href="/(tabs)/records">
            <ThemedText type="link">View records</ThemedText>
          </Link>
          <Link href="/(tabs)/history">
            <ThemedText type="link">Conversation history</ThemedText>
          </Link>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerWrap: { flex: 0.4, justifyContent: 'center' },
  listWrapper: { flex: 0.6 },
  lead: { marginTop: 12, marginBottom: 16 },
  actions: { marginBottom: 12 },
  quickLinks: { gap: 8 },
});
