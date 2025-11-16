import { useState } from "react";
import {
  ActivityIndicator,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Markdown from "react-native-markdown-display";

// Trending topics
const trending = [
  "Healthy eating",
  "Mental health tips",
  "Sleep hygiene",
  "Managing stress",
  "At home fitness"
];

// Types
type ArticleSource = {
  uri: string;
  title: string;
};

type Article = {
  text: string;
  sources: ArticleSource[];
};

// Gemini configuration
// TODO: Move to environment variables
// Use: process.env.EXPO_PUBLIC_GEMINI_API_KEY
const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`;

const SYSTEM_PROMPT = `You are HealAI, a helpful and empathetic assistant.
You are not a doctor and this is not medical advice.
When the user provides a health topic, search using your google search tool and summarise the findings in three to four paragraphs.
Start with a title such as About Healthy Eating.
End with the disclaimer.
**Disclaimer: I am an AI assistant and not a medical professional. Please consult with a doctor or qualified healthcare provider for any medical advice.**`;

// Safe backoff fetch
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
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchWithBackoff(url, options, retries - 1, delay * 2);
      }

      throw new Error(`HTTP error: ${response.status}`);
    }

    return response;
  } catch (err) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithBackoff(url, options, retries - 1, delay * 2);
    }
    throw err;
  }
}

// Gemini request
async function getGeminiArticle(query: string): Promise<Article> {
  if (!API_KEY) {
    return {
      text: "API key not configured. Please check your environment variables.",
      sources: []
    };
  }

  const payload = {
    systemInstruction: {
      role: "system",
      parts: [{ text: SYSTEM_PROMPT }]
    },
    contents: [
      {
        role: "user",
        parts: [{ text: query }]
      }
    ],
    tools: [{ google_search: {} }]
  };

  try {
    const response = await fetchWithBackoff(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    const candidate = result.candidates?.[0];

    const text =
      candidate?.content?.parts
        ?.map((p: any) => p.text)
        .filter(Boolean)
        .join("\n") ||
      "Sorry, I could not find any information.";

    let sources: ArticleSource[] = [];
    const md = candidate?.groundingMetadata;

    if (md?.groundingChunks) {
      sources = md.groundingChunks
        .map((c: any) => ({
          uri: c.web?.uri,
          title: c.web?.title
        }))
        .filter((x: any) => x.uri && x.title);
    }

    return { text, sources };
  } catch (error) {
    console.error("Gemini API error:", error);
    return {
      text: "Connection issue. Please try again later.",
      sources: []
    };
  }
}

// Main component
export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"trending" | "article">("trending");
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("Explore");

  const handleSearch = async (term: string) => {
    if (!term.trim()) return;

    setTitle(term);
    setViewMode("article");
    setLoading(true);

    const data = await getGeminiArticle(term);
    setArticle(data);
    setLoading(false);
  };

  const handleBack = () => {
    setViewMode("trending");
    setArticle(null);
    setSearchQuery("");
    setTitle("Explore");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {viewMode === "trending" ? (
        <View style={styles.content}>
          <View style={styles.searchContainer}>
            <TextInput
              placeholder="Search health topics"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() => handleSearch(searchQuery)}
              returnKeyType="search"
            />
          </View>

          <ScrollView style={styles.trendingList}>
            {trending.map(item => (
              <TouchableOpacity
                key={item}
                onPress={() => handleSearch(item)}
                style={styles.trendingItem}
                activeOpacity={0.7}
              >
                <Text style={styles.trendingText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      ) : (
        <View style={styles.content}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <ScrollView style={styles.articleContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#007AFF" />
            ) : article ? (
              <>
                <Markdown>{article.text}</Markdown>

                {article.sources.length > 0 && (
                  <View style={styles.sourcesContainer}>
                    <Text style={styles.sourcesTitle}>Sources</Text>

                    {article.sources.map((s, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => Linking.openURL(s.uri)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.sourceLink}>
                          {index + 1}. {s.title}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </>
            ) : null}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginLeft: 20,
    marginBottom: 10
  },
  content: {
    flex: 1
  },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    margin: 20,
    padding: 12,
    borderRadius: 12,
    alignItems: "center"
  },
  searchInput: {
    flex: 1,
    fontSize: 16
  },
  trendingList: {
    paddingHorizontal: 20
  },
  trendingItem: {
    padding: 16,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    marginBottom: 12
  },
  trendingText: {
    fontSize: 16
  },
  backButton: {
    padding: 16
  },
  backText: {
    color: "#007AFF",
    fontSize: 16
  },
  articleContainer: {
    padding: 20
  },
  sourcesContainer: {
    marginTop: 24
  },
  sourcesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8
  },
  sourceLink: {
    color: "#007AFF",
    marginTop: 6
  }
});