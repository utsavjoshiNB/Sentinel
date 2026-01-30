import { initializeApp } from "firebase/app";

// TODO: Replace with your actual Firebase project configuration
// you can find these in your Firebase Console -> Project Settings
const firebaseConfig = {
  apiKey: import.meta.env.FIREBASE_API_KEY || "mock-api-key",
  authDomain:
    import.meta.env.FIREBASE_AUTH_DOMAIN || "mock-project.firebaseapp.com",
  projectId: import.meta.env.FIREBASE_PROJECT_ID || "mock-project",
  storageBucket:
    import.meta.env.FIREBASE_STORAGE_BUCKET || "mock-project.appspot.com",
  messagingSenderId:
    import.meta.env.FIREBASE_MESSAGING_SENDER_ID || "000000000000",
  appId:
    import.meta.env.FIREBASE_APP_ID ||
    "1:000000000000:web:0000000000000000000000",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

console.log(
  "🔥 Firebase initialized with config for project:",
  firebaseConfig.projectId,
);

export { app };
