import { createContext, useContext, useEffect, useState } from "react";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { app } from "./firebase";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signupWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  mockLogin: () => void;
  isMock: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Check if Firebase is configured properly
const isFirebaseConfigured =
  !!app.options.apiKey && app.options.apiKey !== "mock-api-key";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMock, setIsMock] = useState(!isFirebaseConfigured);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      // Check for mock user in local storage
      const mockUser = localStorage.getItem("mock_user");
      if (mockUser) {
        setUser(JSON.parse(mockUser));
      }
      setLoading(false);
      return;
    }

    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    if (!isFirebaseConfigured) {
      mockLogin();
      return;
    }
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success("Signed in successfully!");
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    if (!isFirebaseConfigured) {
      // Simple mock validation for demonstration
      if (email === "test@test.com" && password === "password") {
        mockLogin();
      } else {
        toast.error("Invalid credentials (try test@test.com / password)");
        throw new Error("Invalid credentials");
      }
      return;
    }
    const auth = getAuth(app);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Signed in successfully!");
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const signupWithEmail = async (email: string, password: string) => {
    if (!isFirebaseConfigured) {
      // Mock signup
      const mockUser: any = {
        uid: "mock-user-" + Math.random().toString(36).substr(2, 9),
        displayName: email.split("@")[0],
        email: email,
        photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        emailVerified: false,
      };
      localStorage.setItem("mock_user", JSON.stringify(mockUser));
      setUser(mockUser);
      setIsMock(true);
      toast.success("Account created (Mock Mode)");
      return;
    }
    const auth = getAuth(app);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success("Account created successfully!");
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const mockLogin = () => {
    const mockUser: any = {
      uid: "mock-user-123",
      displayName: "Mock User",
      email: "mock@example.com",
      photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=mock",
      emailVerified: true,
    };
    localStorage.setItem("mock_user", JSON.stringify(mockUser));
    setUser(mockUser);
    setIsMock(true);
    toast.success("Signed in (Mock Mode)");
  };

  const signOut = async () => {
    if (isMock) {
      localStorage.removeItem("mock_user");
      setUser(null);
      toast.success("Signed out");
      return;
    }
    const auth = getAuth(app);
    try {
      await firebaseSignOut(auth);
      toast.success("Signed out");
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        loginWithEmail,
        signupWithEmail,
        signOut,
        mockLogin,
        isMock,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
