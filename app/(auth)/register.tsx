import { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/lib/auth-context';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = useAuth();

  async function handleSignUp() {
    try {
      setLoading(true);
      await auth.signUp(email, password);
    } catch (e: any) {
      Alert.alert('Sign up failed', e.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.card}>
          <ThemedText type="title" style={styles.title}>Create account</ThemedText>

          <TextInput value={email} onChangeText={setEmail} placeholder="Email" style={styles.input} autoCapitalize="none" />
          <TextInput value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry style={styles.input} />

          <TouchableOpacity style={[styles.button, styles.primary]} onPress={handleSignUp} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryText}>Sign up</Text>}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  safe: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  card: { backgroundColor: '#fff', padding: 24, borderRadius: 12 },
  title: { textAlign: 'center', marginBottom: 12 },
  input: { height: 48, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 12, marginBottom: 12 },
  button: { height: 48, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  primary: { backgroundColor: '#007aff' },
  primaryText: { color: '#fff', fontWeight: '600' },
});
