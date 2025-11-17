import { useAuth } from '@/lib/auth-context';
import { Redirect, Stack } from 'expo-router';

export default function AuthLayout() {
  const { user, loading } = useAuth();

  if (!loading && user) {
    // If authenticated, redirect to tabs
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
