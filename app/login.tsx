import React, { useState } from 'react';
import { Alert, Button, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/lib/auth-context';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = useAuth();

  async function handleSignIn() {
    try {
      setLoading(true);
      await auth.signIn(email, password);
    } catch (e: any) {
      Alert.alert('Sign in failed', e.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

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
    <ThemedView style={{ flex: 1, padding: 16, justifyContent: 'center' }}>
      <SafeAreaView>
        <ThemedText type="title">Sign in</ThemedText>
        <View style={{ marginTop: 12 }}>
          <TextInput value={email} onChangeText={setEmail} placeholder="Email" autoCapitalize="none" style={{ borderWidth: 1, padding: 8, borderRadius: 6 }} />
        </View>
        <View style={{ marginTop: 12 }}>
          <TextInput value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry style={{ borderWidth: 1, padding: 8, borderRadius: 6 }} />
        </View>
        <View style={{ marginTop: 16 }}>
          <Button title={loading ? 'Please wait...' : 'Sign in'} onPress={handleSignIn} disabled={loading} />
        </View>
        <View style={{ marginTop: 8 }}>
          <Button title="Create account" onPress={handleSignUp} disabled={loading} />
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}
