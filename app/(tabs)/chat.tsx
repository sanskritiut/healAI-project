import { useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type Message = { id: string; text: string; fromUser?: boolean };

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hi — I can help answer health questions.', fromUser: false },
  ]);
  const [text, setText] = useState('');
  const listRef = useRef<FlatList<Message> | null>(null);
  const insets = useSafeAreaInsets();
  const keyboardBehavior = Platform.OS === 'ios' ? 'padding' : 'height';
  const keyboardVerticalOffset = Platform.OS === 'ios' ? insets.bottom ?? 0 : 80;

  function send() {
    if (!text.trim()) return;
    const m: Message = { id: Date.now().toString(), text: text.trim(), fromUser: true };
    setMessages((s) => [...s, m, { id: (Date.now() + 1).toString(), text: 'This is a mock reply.', fromUser: false }]);
    setText('');
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ThemedText type="title">Chat</ThemedText>

        <FlatList
          ref={(r) => { listRef.current = r }}
          data={messages}
          keyExtractor={(i) => i.id}
          style={styles.messages}
          contentContainerStyle={{ paddingBottom: 16 }}
          renderItem={({ item }) => (
            <View style={[styles.bubble, item.fromUser ? styles.userBubble : styles.aiBubble]}>
              <ThemedText>{item.text}</ThemedText>
            </View>
          )}
        />

        <KeyboardAvoidingView behavior={keyboardBehavior} keyboardVerticalOffset={keyboardVerticalOffset}>
          <View style={styles.inputRow}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Type a question..."
              style={styles.input}
            />
            <TouchableOpacity onPress={send} style={styles.sendButton}>
              <ThemedText type="defaultSemiBold">Send</ThemedText>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  messages: { marginTop: 12, marginBottom: 12 },
  bubble: { padding: 10, borderRadius: 8, marginVertical: 6, maxWidth: '80%' },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#D1FCDD' },
  aiBubble: { alignSelf: 'flex-start', backgroundColor: '#F0F4FF' },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1, borderWidth: 1, padding: 8, borderRadius: 8 },
  sendButton: { paddingVertical: 10, paddingHorizontal: 12, marginLeft: 8 },
});
