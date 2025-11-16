import { Link, useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol'; // Import IconSymbol
import { useThemeColor } from '@/hooks/use-theme-color';

export default function HomeScreen() {
  const router = useRouter();
  const iconColor = useThemeColor({}, 'icon');

  return (
    <ThemedView style={styles.container}>
      <View style={styles.headerWrap}>
        <View style={styles.headerRow}>
          <ThemedText type="title">Welcome to HealAI</ThemedText>
          <HelloWave />
        </View>

        <ThemedText style={styles.lead}>
          Get fast, clear answers about health topics and keep your records in
          one place.
        </ThemedText>

        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => router.push('/(tabs)/chat')}>
          <ThemedText style={styles.chatButtonText}>Start a Chat</ThemedText>
          <IconSymbol name="paperplane.fill" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View style={styles.listWrapper}>
        <ThemedText type="subtitle" style={styles.quickLinksTitle}>
          Quick Links
        </ThemedText>
        <View style={styles.quickLinks}>
          <Link href="/(tabs)/explore" asChild>
            <TouchableOpacity style={styles.quickLinkButton}>
              <IconSymbol name="magnifyingglass" size={22} color={iconColor} />
              <ThemedText style={styles.quickLinkText}>
                Explore topics
              </ThemedText>
            </TouchableOpacity>
          </Link>
          <Link href="/(tabs)/records" asChild>
            <TouchableOpacity style={styles.quickLinkButton}>
              <IconSymbol name="folder.fill" size={22} color={iconColor} />
              <ThemedText style={styles.quickLinkText}>View records</ThemedText>
            </TouchableOpacity>
          </Link>
          <Link href="/(tabs)/history" asChild>
            <TouchableOpacity style={styles.quickLinkButton}>
              <IconSymbol name="clock.fill" size={22} color={iconColor} />
              <ThemedText style={styles.quickLinkText}>
                Conversation history
              </ThemedText>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center',
  },
  headerWrap: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listWrapper: {
    flex: 0.6,
  },
  lead: {
    marginTop: 16,
    marginBottom: 24,
    fontSize: 17,
    textAlign: 'center',
    color: '#555',
    paddingHorizontal: 20,
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007aff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  chatButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  quickLinksTitle: {
    marginTop: 30,
    marginBottom: 15,
    textAlign: 'center',
  },
  quickLinks: {
    gap: 12,
  },
  quickLinkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 18,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  quickLinkText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
});