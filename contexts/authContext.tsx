import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { loginApi, logoutApi, getCurrentUserApi, getGroupsApi, ApiUser, ApiGroup } from '../services/api';

// ============================================
// Auth Context Types
// ============================================

// Transform API user to frontend User type
export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  groupIds: string[];
  avatar?: string;
  preferences: {
    language: string;
    notifications: { email: boolean; push: boolean; sms: boolean };
    defaultLandingView: string;
  };
}

export interface UserGroup {
  id: string;
  name: string;
  description: string;
  isAdmin: boolean;
  siteAccess: Record<string, boolean>;
  memberCount: number;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (username: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  refreshGroups: () => Promise<void>;
  userGroups: UserGroup[];
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null
};

// ============================================
// Helper to transform API types
// ============================================

const transformApiUser = (apiUser: ApiUser): User => ({
  id: apiUser.id,
  username: apiUser.username,
  displayName: apiUser.displayName,
  email: apiUser.email || '',
  groupIds: apiUser.groups?.map(g => g.id) || [],
  avatar: apiUser.avatarUrl,
  preferences: {
    language: apiUser.preference?.language || 'vi',
    notifications: {
      email: apiUser.preference?.notificationEmail ?? true,
      push: apiUser.preference?.notificationPush ?? false,
      sms: apiUser.preference?.notificationSms ?? false,
    },
    defaultLandingView: apiUser.preference?.defaultLandingView || 'ezwork',
  },
});

const transformApiGroup = (apiGroup: ApiGroup): UserGroup => ({
  id: apiGroup.id,
  name: apiGroup.name,
  description: apiGroup.description || '',
  isAdmin: apiGroup.isAdmin,
  siteAccess: apiGroup.siteAccess?.reduce((acc, sa) => ({ ...acc, [sa.siteId]: sa.hasAccess }), {}) || {},
  memberCount: apiGroup.memberCount || 0,
});

// ============================================
// Auth Context
// ============================================
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================
// Auth Provider Component
// ============================================
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);
  const [userGroups, setUserGroups] = useState<UserGroup[]>([]);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const apiUser = await getCurrentUserApi();
        
        if (apiUser) {
          const user = transformApiUser(apiUser);
          const apiGroups = await getGroupsApi().catch(() => []);
          setUserGroups(apiGroups.map(transformApiGroup));
          
          setState({
            isAuthenticated: true,
            user,
            loading: false,
            error: null
          });
        } else {
          setState({
            isAuthenticated: false,
            user: null,
            loading: false,
            error: null
          });
        }
      } catch {
        setState({
          isAuthenticated: false,
          user: null,
          loading: false,
          error: null
        });
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (username: string, password: string, rememberMe = false) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await loginApi({ username, password, rememberMe });
      const user = transformApiUser(response.user);
      
      // Fetch groups after login
      const apiGroups = await getGroupsApi().catch(() => []);
      setUserGroups(apiGroups.map(transformApiGroup));
      
      setState({
        isAuthenticated: true,
        user,
        loading: false,
        error: null
      });
    } catch (err) {
      setState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: err instanceof Error ? err.message : 'Login failed'
      });
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      await logoutApi();
      setState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null
      });
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Logout failed'
      }));
    }
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setState(prev => {
      if (!prev.user) return prev;
      const updatedUser = { ...prev.user, ...updates };
      localStorage.setItem('ez_user', JSON.stringify(updatedUser));
      return { ...prev, user: updatedUser };
    });
  }, []);

  // Refresh groups from API (call after CRUD operations)
  const refreshGroups = useCallback(async () => {
    try {
      const apiGroups = await getGroupsApi();
      setUserGroups(apiGroups.map(transformApiGroup));
    } catch (error) {
      console.error('Failed to refresh groups:', error);
    }
  }, []);

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    updateUser,
    refreshGroups,
    userGroups
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ============================================
// useAuth Hook
// ============================================
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// ============================================
// Permission Check Helpers (Group-based)
// ============================================
export const isAdmin = (user: User | null, groups: UserGroup[]): boolean => {
  if (!user || !user.groupIds) return false;
  return groups.some(g => user.groupIds.includes(g.id) && g.isAdmin);
};

export const hasAccess = (user: User | null, groups: UserGroup[], siteId: string): boolean => {
  if (!user || !user.groupIds) return false;
  return groups.some(g => user.groupIds.includes(g.id) && g.siteAccess[siteId]);
};
