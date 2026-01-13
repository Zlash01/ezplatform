// API Configuration
const API_BASE_URL = 'http://160.30.136.226:3001/api';

// Helper to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('ez_auth_token');
};

// Helper for API requests
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    cache: 'no-store',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  // Handle empty responses (204 No Content)
  const text = await response.text();
  if (!text) return {} as T;
  
  return JSON.parse(text);
};

// ============================================
// API Types
// ============================================

export interface ApiUser {
  id: string;
  username: string;
  displayName: string;
  email?: string;
  avatarUrl?: string;
  groups: ApiGroup[];
  preference?: ApiUserPreference;
}

export interface ApiGroup {
  id: string;
  name: string;
  description?: string;
  isAdmin: boolean;
  siteAccess: ApiSiteAccess[];
  memberCount?: number;
}

export interface ApiSiteAccess {
  siteId: string;
  hasAccess: boolean;
}

export interface ApiUserPreference {
  language: string;
  defaultLandingView?: string;
  notificationEmail: boolean;
  notificationPush: boolean;
  notificationSms: boolean;
}

export interface LoginResponse {
  user: ApiUser;
  accessToken: string;
  expiresIn: number;
}

// ============================================
// Authentication API
// ============================================

export const loginApi = async (credentials: {
  username: string;
  password: string;
  rememberMe?: boolean;
}): Promise<LoginResponse> => {
  const response = await apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

  // Store token
  localStorage.setItem('ez_auth_token', response.accessToken);
  localStorage.setItem('ez_user', JSON.stringify(response.user));

  return response;
};

export const logoutApi = async (): Promise<void> => {
  try {
    await apiRequest('/auth/logout', { method: 'POST' });
  } finally {
    localStorage.removeItem('ez_auth_token');
    localStorage.removeItem('ez_user');
  }
};

export const getCurrentUserApi = async (): Promise<ApiUser | null> => {
  const token = getAuthToken();
  if (!token) return null;

  try {
    return await apiRequest<ApiUser>('/auth/me');
  } catch {
    localStorage.removeItem('ez_auth_token');
    localStorage.removeItem('ez_user');
    return null;
  }
};

// ============================================
// Users API
// ============================================

export const getUsersApi = async (): Promise<ApiUser[]> => {
  return apiRequest<ApiUser[]>('/users');
};

export const createUserApi = async (userData: {
  username: string;
  password: string;
  displayName: string;
  email?: string;
  groupIds?: string[];
}): Promise<ApiUser> => {
  return apiRequest<ApiUser>('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

export const updateUserApi = async (
  userId: string,
  userData: {
    displayName?: string;
    email?: string;
    password?: string;
    groupIds?: string[];
  }
): Promise<ApiUser> => {
  return apiRequest<ApiUser>(`/users/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify(userData),
  });
};

export const deleteUserApi = async (userId: string): Promise<void> => {
  await apiRequest(`/users/${userId}`, { method: 'DELETE' });
};

export const updateUserGroupsApi = async (
  userId: string,
  groupIds: string[]
): Promise<ApiUser> => {
  return apiRequest<ApiUser>(`/users/${userId}/groups`, {
    method: 'PATCH',
    body: JSON.stringify({ groupIds }),
  });
};

// ============================================
// Groups API
// ============================================

export const getGroupsApi = async (): Promise<ApiGroup[]> => {
  return apiRequest<ApiGroup[]>('/groups');
};

export const createGroupApi = async (groupData: {
  name: string;
  description?: string;
  isAdmin?: boolean;
  siteAccess?: Record<string, boolean>;
}): Promise<ApiGroup> => {
  return apiRequest<ApiGroup>('/groups', {
    method: 'POST',
    body: JSON.stringify(groupData),
  });
};

export const updateGroupApi = async (
  groupId: string,
  groupData: {
    name?: string;
    description?: string;
    isAdmin?: boolean;
    siteAccess?: Record<string, boolean>;
  }
): Promise<ApiGroup> => {
  return apiRequest<ApiGroup>(`/groups/${groupId}`, {
    method: 'PATCH',
    body: JSON.stringify(groupData),
  });
};

export const deleteGroupApi = async (groupId: string): Promise<void> => {
  await apiRequest(`/groups/${groupId}`, { method: 'DELETE' });
};

// ============================================
// Sites API
// ============================================

export interface ApiSite {
  id: string;
  siteKey: string;
  label: string;
  url: string;
  icon?: string;
  color?: string;
  displayOrder: number;
  isActive: boolean;
}

export const getSitesApi = async (): Promise<ApiSite[]> => {
  return apiRequest<ApiSite[]>('/sites');
};

export const getAllSitesApi = async (): Promise<ApiSite[]> => {
  return apiRequest<ApiSite[]>('/sites/all');
};

// ============================================
// Audit Log API
// ============================================

export interface ApiAuditEntry {
  id: string;
  timestamp: string;
  action: string;
  performedBy: { id: string; displayName: string };
  targetType?: string;
  targetId?: string;
  details?: Record<string, unknown>;
}

export const getAuditLogApi = async (options?: {
  page?: number;
  limit?: number;
}): Promise<{ entries: ApiAuditEntry[]; total: number }> => {
  const params = new URLSearchParams();
  if (options?.page) params.set('page', String(options.page));
  if (options?.limit) params.set('limit', String(options.limit));
  
  const query = params.toString() ? `?${params.toString()}` : '';
  return apiRequest(`/audit-log${query}`);
};
