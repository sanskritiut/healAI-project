import 'dotenv/config';

export default {
  expo: {
    name: "HealAI",
    slug: "HealAI",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "healai",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,

    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.anonymous.HealAI",
      googleServicesFile: "./GoogleService-Info.plist"
    },

    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png"
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: "com.anonymous.HealAI",
      googleServicesFile: "./google-services.json"
    },

    web: {
      output: "static",
      favicon: "./assets/images/favicon.png"
    },

    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#000000"
          }
        }
      ]
    ],

    experiments: {
      typedRoutes: true,
      reactCompiler: true
    },

    extra: {
      firebaseApiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
      firebaseMeasurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
      geminiApiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY,
    }
  }
};
