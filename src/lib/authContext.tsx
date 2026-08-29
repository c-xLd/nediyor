import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, SocialAuthProvider } from '../types/index.js';
import { api } from './api.js';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (name: string, email: string, password?: string, role?: UserRole) => Promise<boolean>;
  socialLogin: (provider: SocialAuthProvider, customProfile?: { name?: string; email?: string; avatarUrl?: string }) => Promise<boolean>;
  toggleSocialProvider: (provider: SocialAuthProvider, action: 'connect' | 'disconnect') => Promise<boolean>;
  quickLogin: (role: 'admin' | 'user') => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User> & { password?: string }) => Promise<boolean>;
  // Modal controls
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'register';
  openAuthModal: (tab?: 'login' | 'register') => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'nediyor_auth_token';
const USER_KEY = 'nediyor_auth_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(TOKEN_KEY);
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

  // Verify / synchronize user session on mount
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem(TOKEN_KEY);
      const savedUser = localStorage.getItem(USER_KEY);

      if (savedUser && savedToken) {
        try {
          const parsedUser = JSON.parse(savedUser);
          const res = await api.getCurrentUser(savedToken, parsedUser.id);
          if (res && res.user) {
            setUser(res.user);
            localStorage.setItem(USER_KEY, JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn('[Auth] Session validation error, keeping local user state:', err);
        }
      } else if (!savedUser) {
        // Default to admin account for instant convenience or demo experience
        try {
          const res = await api.login('ahmet.as060@gmail.com', '123456');
          if (res && res.user) {
            setUser(res.user);
            setToken(res.token);
            localStorage.setItem(USER_KEY, JSON.stringify(res.user));
            localStorage.setItem(TOKEN_KEY, res.token);
          }
        } catch {
          // silently ignore
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password?: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const res = await api.login(email, password);
      if (res && res.user) {
        setUser(res.user);
        setToken(res.token);
        localStorage.setItem(USER_KEY, JSON.stringify(res.user));
        localStorage.setItem(TOKEN_KEY, res.token);
        setIsAuthModalOpen(false);
        return true;
      }
      return false;
    } catch (err: any) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password?: string, role?: UserRole): Promise<boolean> => {
    try {
      setIsLoading(true);
      const res = await api.register(name, email, password, role);
      if (res && res.user) {
        setUser(res.user);
        setToken(res.token);
        localStorage.setItem(USER_KEY, JSON.stringify(res.user));
        localStorage.setItem(TOKEN_KEY, res.token);
        setIsAuthModalOpen(false);
        return true;
      }
      return false;
    } catch (err: any) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const socialLogin = async (
    provider: SocialAuthProvider, 
    customProfile?: { name?: string; email?: string; avatarUrl?: string }
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      const res = await api.socialLogin({
        provider,
        ...(customProfile || {})
      });
      if (res && res.user) {
        setUser(res.user);
        setToken(res.token);
        localStorage.setItem(USER_KEY, JSON.stringify(res.user));
        localStorage.setItem(TOKEN_KEY, res.token);
        setIsAuthModalOpen(false);
        return true;
      }
      return false;
    } catch (err: any) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSocialProvider = async (provider: SocialAuthProvider, action: 'connect' | 'disconnect'): Promise<boolean> => {
    if (!user) return false;
    try {
      setIsLoading(true);
      const res = await api.toggleSocialProvider(user.id, provider, action);
      if (res && res.user) {
        setUser(res.user);
        localStorage.setItem(USER_KEY, JSON.stringify(res.user));
        return true;
      }
      return false;
    } catch (err: any) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = async (role: 'admin' | 'user'): Promise<boolean> => {
    if (role === 'admin') {
      return login('ahmet.as060@gmail.com', '123456');
    } else {
      return login('kullanici@nediyor.com', '123456');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  };

  const updateProfile = async (data: Partial<User> & { password?: string }): Promise<boolean> => {
    if (!user) return false;
    try {
      setIsLoading(true);
      const res = await api.updateProfile({ ...data, id: user.id });
      if (res && res.user) {
        setUser(res.user);
        localStorage.setItem(USER_KEY, JSON.stringify(res.user));
        return true;
      }
      return false;
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const openAuthModal = (tab: 'login' | 'register' = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isLoading,
        login,
        register,
        socialLogin,
        toggleSocialProvider,
        quickLogin,
        logout,
        updateProfile,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
