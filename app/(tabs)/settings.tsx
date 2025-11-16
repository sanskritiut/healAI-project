import { useState } from 'react';
import { Alert, Button, StyleSheet, Switch, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/lib/auth-context';

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [loading, setLoading] = useState(false);
  const { signOutUser, user } = useAuth();

  async function handleSignOut() {
    try {
      setLoading(true);
      console.log('Signing out user...');
      await signOutUser();
      console.log('Sign out successful!');
    } catch (error: any) {
      console.error('Sign out error:', error);
      Alert.alert('Sign out failed', error.message ?? 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView>
        <ThemedText type="title">Settings</ThemedText>

        {user && (
          <View style={{ marginTop: 12, padding: 8, backgroundColor: '#f0f0f0', borderRadius: 4 }}>
            <ThemedText style={{ fontSize: 12 }}>
              Logged in as: {user.email}
            </ThemedText>
            <ThemedText style={{ fontSize: 12 }}>
              UID: {user.uid}
            </ThemedText>
          </View>
        )}

        <View style={styles.row}>
          <ThemedText>Dark mode</ThemedText>
          <Switch value={darkMode} onValueChange={setDarkMode} />
        </View>

        <View style={styles.row}>
          <ThemedText>Notifications</ThemedText>
          <Switch value={notifications} onValueChange={setNotifications} />
        </View>
        
        <View style={{ marginTop: 20 }}>
          <Button 
            title={loading ? "Signing out..." : "Sign out"} 
            onPress={handleSignOut}
            disabled={loading}
          />
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
});