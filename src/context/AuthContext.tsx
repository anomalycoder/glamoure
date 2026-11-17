import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, AuthSession, UserRole, SalonMembership } from '../types/auth';
import { AuthService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  salonId?: string;
  currentSalonId?: string;
  memberships: SalonMembership[];
  session: AuthSession | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (params: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    role?: UserRole;
    salonName?: string;
  }) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole, targetSalonId?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const current = AuthService.getCurrentSession();
    if (current) {
      setSession(current);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const newSession = await AuthService.login(email, password);
      setSession(newSession);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (params: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    role?: UserRole;
    salonName?: string;
  }) => {
    setIsLoading(true);
    try {
      const newSession = await AuthService.register(params);
      setSession(newSession);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    AuthService.logout();
    setSession(null);
  };

  const switchRole = (newRole: UserRole, targetSalonId?: string) => {
    const updated = AuthService.switchRole(newRole, targetSalonId);
    setSession(updated);
  };

  const effectiveSalonId = session?.salonId || session?.memberships?.[0]?.salonId;

  return (
    <AuthContext.Provider
      value={{
        user: session?.user || null,
        role: session?.activeRole || 'customer',
        salonId: effectiveSalonId,
        currentSalonId: effectiveSalonId,
        memberships: session?.memberships || [],
        session,
        isLoading,
        login,
        register,
        logout,
        switchRole,
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
