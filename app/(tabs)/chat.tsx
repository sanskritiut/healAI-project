import { MaterialIcons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type Message = {
  id: string;
  text: string;
  fromUser?: boolean;
  isLoading?: boolean;
};

// --- Gemini API Call ---

const API_KEY = 'AIzaSyDtH5UVIvRe8vK82emmZ7ccrEEBY2H6t9U'; // Leave as-is, will be populated at runtime
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`;

const SYSTEM_PROMPT = `You are HealAI, a helpful and empathetic AI assistant for health-related questions.
You are not a doctor, and this is not medical advice.
Always provide clear, helpful, and safe information.
ALWAYS end your response with a clear, bold disclaimer:
"**Disclaimer: I am an AI assistant and not a medical professional. Please consult with a doctor or qualified healthcare provider for any medical advice.**"`;

// Utility for exponential backoff retry
async function fetchWithBackoff(
  url: string,
  options: RequestInit,
  retries = 3,
  delay = 1000
): Promise<Response> {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      if (response.status === 429 && retries > 0) {
        // Throttled, wait and retry
        await new Promise((resolve) => setTimeout(resolve, delay));
        return fetchWithBackoff(url, options, retries - 1, delay * 2);
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
  } catch (error) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchWithBackoff(url, options, retries - 1, delay * 2);
    }
    throw error;
  }
}

async function getGeminiResponse(userQuery: string): Promise<string> {
  const payload = {
    contents: [{ parts: [{ text: userQuery }] }],
    systemInstruction: {
      parts: [{ text: SYSTEM_PROMPT }],
    },
  };

  try {
    const response = await fetchWithBackoff(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    const candidate = result.candidates?.[0];

    if (candidate && candidate.content?.parts?.[0]?.text) {
      return candidate.content.parts[0].text;
    } else {
      console.error('Unexpected API response structure:', result);
      return 'Sorry, I received an unexpected response. Please try again.';
    }
  } catch (error) {
    console.error('Gemini API call failed:', error);
    return 'Sorry, I am having trouble connecting. Please try again later.';
  }
}

// --- Chat Component ---

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi! I am HealAI. How can I help you with your health questions today?',
      fromUser: false,
    },
  ]);
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const listRef = useRef<FlatList<Message> | null>(null);
  const insets = useSafeAreaInsets();
  const keyboardBehavior = Platform.OS === 'ios' ? 'padding' : 'height';
  const keyboardVerticalOffset = Platform.OS === 'ios' ? insets.bottom + 80 : 80;

  const send = async () => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      fromUser: true,
    };
    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: 'HealAI is typing...',
      fromUser: false,
      isLoading: true,
    };

    setMessages((s) => [...s, userMessage, loadingMessage]);
    setText('');
    setIsLoading(true);

    // Scroll to bottom
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);

    // Get AI response
    const aiResponse = await getGeminiResponse(userMessage.text);

    // Update messages with AI response
    setMessages((s) =>
      s.map((m) =>
        m.id === loadingMessage.id
          ? { ...m, text: aiResponse, isLoading: false }
          : m
      )
    );
    setIsLoading(false);
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title" style={styles.title}>
          Chat
        </ThemedText>

        <FlatList
          ref={(r) => {
            listRef.current = r;
          }}
          data={messages}
          keyExtractor={(i) => i.id}
          style={styles.messages}
          contentContainerStyle={{ paddingBottom: 16 }}
          renderItem={({ item }) => (
            <View
              style={[
                styles.bubble,
                item.fromUser ? styles.userBubble : styles.aiBubble,
                item.isLoading ? styles.loadingBubble : {},
              ]}>
              {item.isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#666" />
                  <Text style={styles.loadingText}>{item.text}</Text>
                </View>
              ) : (
                <Text style={item.fromUser ? styles.userText : styles.aiText}>
                  {item.text}
                </Text>
              )}
            </View>
          )}
        />

        <KeyboardAvoidingView
          behavior={keyboardBehavior}
          keyboardVerticalOffset={keyboardVerticalOffset}>
          <View style={styles.inputRow}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Type a question..."
              placeholderTextColor="#8e8e93"
              style={styles.input}
              multiline
            />
            <TouchableOpacity
              onPress={send}
              style={[styles.sendButton, isLoading && styles.sendButtonDisabled]}
              disabled={isLoading}>
              <MaterialIcons name="send" size={22} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  safeArea: { flex: 1 },
  title: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  messages: {
    flex: 1,
    paddingHorizontal: 10,
    marginTop: 12,
  },
  bubble: {
    padding: 12,
    borderRadius: 18,
    marginVertical: 5,
    maxWidth: '80%',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#007aff',
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#e5e5ea',
  },
  userText: {
    color: '#ffffff',
    fontSize: 16,
  },
  aiText: {
    color: '#000000',
    fontSize: 16,
  },
  loadingBubble: {
    backgroundColor: '#e5e5ea',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    fontStyle: 'italic',
    color: '#666',
    fontSize: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#ffffff',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'ios' ? 10 : 8,
    paddingBottom: Platform.OS === 'ios' ? 10 : 8,
    fontSize: 16,
    marginRight: 10,
    maxHeight: 120, // Allow for multiple lines
  },
  sendButton: {
    backgroundColor: '#007aff',
    borderRadius: 22,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#a0c7e8',
  },
});