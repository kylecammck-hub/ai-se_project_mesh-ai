import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  type User,
  getToken,
  setToken as saveToken,
  clearToken,
  loginUser,
  registerUser,
  getCurrentUser,
} from '../utils/api';

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  // True while the initial token check (on app load) is running.
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    if (!getToken()) {
      setIsLoading(false);
      return;
    }

    getCurrentUser()
      .then((current) => {
        if (isMounted) {
          setUser(current);
        }
      })
      .catch(() => {
        // Token is missing/expired/invalid - drop it and send the user
        // back through the login flow.
        clearToken();
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  async function login(email: string, password: string) {
    const { token, user: loggedInUser } = await loginUser(email, password);
    saveToken(token);
    setUser(loggedInUser);
  }

  async function register(email: string, password: string, name: string) {
    await registerUser(email, password, name);
    // Registration doesn't log the user in automatically - sign them in
    // right after so they land in the app rather than back at the login form.
    await login(email, password);
  }

  function logout() {
    clearToken();
    setUser(null);
  }

  const value: AuthContextValue = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
