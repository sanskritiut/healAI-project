import React, { useState } from 'react';
import { StyleSheet, Switch, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/lib/auth-context';
import { Button } from 'react-native';

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const { signOutUser } = useAuth();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView>
        <ThemedText type="title">Settings</ThemedText>

        <View style={styles.row}>
          <ThemedText>Dark mode</ThemedText>
          <Switch value={darkMode} onValueChange={setDarkMode} />
        </View>

        <View style={styles.row}>
          <ThemedText>Notifications</ThemedText>
          <Switch value={notifications} onValueChange={setNotifications} />
        </View>
        <View style={{ marginTop: 20 }}>
          <Button title="Sign out" onPress={() => signOutUser()} />
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
});
