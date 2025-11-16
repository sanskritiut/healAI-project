import { useEffect, useState } from 'react';
import { Alert, Button, Platform, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import firebaseConfig from '@/app/firebase/firebaseconf';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/lib/auth-context';

const { isFirebaseConfigured, auth } = firebaseConfig;

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const authContext = useAuth();

  useEffect(() => {
    console.log('=== LOGIN SCREEN DEBUG ===');
    console.log('Platform:', Platform.OS);
    console.log('Firebase configured?', isFirebaseConfigured);
    console.log('Auth object exists?', !!auth);
    console.log('Auth context exists?', !!authContext);
  }, []);

  async function handleSignIn() {
    console.log('=== SIGN IN ATTEMPT ===');
    console.log('Email:', email);
    console.log('Password length:', password.length);
    console.log('Auth exists?', !!auth);
    
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    try {
      setLoading(true);
      console.log('Calling authContext.signIn...');
      await authContext.signIn(email, password);
      console.log('Sign in successful!');
    } catch (e: any) {
      console.error('=== SIGN IN ERROR ===');
      console.error('Error:', e);
      console.error('Error code:', e.code);
      console.error('Error message:', e.message);
      console.error('Full error object:', JSON.stringify(e, null, 2));
      
      Alert.alert('Sign in failed', `${e.code}\n${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleSignUp() {
    console.log('=== SIGN UP ATTEMPT ===');
    console.log('Email:', email);
    console.log('Password length:', password.length);
    
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      console.log('Calling authContext.signUp...');
      await authContext.signUp(email, password);
      console.log('Sign up successful!');
    } catch (e: any) {
      console.error('=== SIGN UP ERROR ===');
      console.error('Error:', e);
      console.error('Error code:', e.code);
      console.error('Error message:', e.message);
      console.error('Full error object:', JSON.stringify(e, null, 2));
      
      Alert.alert('Sign up failed', `${e.code}\n${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ThemedView style={{ flex: 1, padding: 16, justifyContent: 'center' }}>
      <SafeAreaView>
        <ThemedText type="title">Sign in</ThemedText>
        
        {/* Debug info */}
        <View style={{ marginTop: 8, padding: 8, backgroundColor: '#f0f0f0', borderRadius: 4 }}>
          <ThemedText style={{ fontSize: 12 }}>
            Platform: {Platform.OS}
          </ThemedText>
          <ThemedText style={{ fontSize: 12 }}>
            Firebase: {isFirebaseConfigured ? '✓' : '✗'}
          </ThemedText>
          <ThemedText style={{ fontSize: 12 }}>
            Auth: {auth ? '✓' : '✗'}
          </ThemedText>
        </View>

        <View style={{ marginTop: 12 }}>
          <TextInput 
            value={email} 
            onChangeText={setEmail} 
            placeholder="Email" 
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            style={{ borderWidth: 1, padding: 8, borderRadius: 6 }} 
          />
        </View>
        <View style={{ marginTop: 12 }}>
          <TextInput 
            value={password} 
            onChangeText={setPassword} 
            placeholder="Password (min 6 characters)" 
            secureTextEntry 
            style={{ borderWidth: 1, padding: 8, borderRadius: 6 }} 
          />
        </View>
        <View style={{ marginTop: 16 }}>
          <Button 
            title={loading ? 'Please wait...' : 'Sign in'} 
            onPress={handleSignIn} 
            disabled={loading} 
          />
        </View>
        <View style={{ marginTop: 8 }}>
          <Button 
            title="Create account" 
            onPress={handleSignUp} 
            disabled={loading} 
          />
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}