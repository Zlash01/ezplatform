import React from 'react';

// ============================================
// Account Types (legacy - can be removed)
// ============================================
export interface Account {
  id: number;
  username: string;
  fullName: string;
  createdAt: string;
  company: string;
  position: string;
}

export interface SidebarItem {
  label: string;
  icon?: React.ReactNode;
  hasExternalLink?: boolean;
  isActive?: boolean;
}

export interface SidebarSection {
  title?: string;
  items: SidebarItem[];
}

// ============================================
// User & Authentication Types
// ============================================
export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
}

export interface UserPreferences {
  language: string;
  notifications: NotificationSettings;
  defaultLandingView: string;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  groupIds: string[]; // Groups determine all permissions
  avatar?: string;
  preferences: UserPreferences;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

// ============================================
// Embedded Sites Types
// ============================================
export interface EmbeddedSite {
  id: string;
  label: string;
  url: string;
  icon: string;
  color: string;
}

// ============================================
// Permission Group Types
// ============================================
export interface UserGroup {
  id: string;
  name: string;
  description: string;
  isAdmin: boolean; // Can access admin settings
  siteAccess: Record<string, boolean>; // Which sites this group can access
  memberCount: number;
}

// ============================================
// User Management Types
// ============================================
export interface UserPermission {
  userId: string;
  username: string;
  displayName: string;
  email?: string;
  groupIds: string[]; // Which groups user belongs to
  // Computed from groups (for display):
  effectiveSiteAccess?: Record<string, boolean>;
  isAdmin?: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  performedBy: string;
  targetUser: string;
  details: string;
}

// ============================================
// View Types
// ============================================
export type ViewType = 'overview' | 'embedded' | 'settings-basic' | 'settings-permissions';