import { Account, EmbeddedSite, User, UserPermission, UserGroup, AuditLogEntry } from './types';

export const APP_TITLE = "EzPlatform";

// ============================================
// Mock Accounts Data (legacy)
// ============================================
export const MOCK_ACCOUNTS: Account[] = [
  {
    id: 1,
    username: "Giám sát",
    fullName: "Giám sát",
    createdAt: "2024-02-10 10:00",
    company: "KCN Linh Truong",
    position: "Giám sát"
  },
  {
    id: 2,
    username: "admin_kcn",
    fullName: "Nguyễn Văn A",
    createdAt: "2024-02-11 08:30",
    company: "KCN Linh Truong",
    position: "Quản trị viên"
  },
  {
    id: 3,
    username: "operator_01",
    fullName: "Trần Thị B",
    createdAt: "2024-02-12 14:15",
    company: "KCN Linh Truong",
    position: "Vận hành"
  }
];

// ============================================
// Embedded Sites Configuration
// ============================================
export const EMBEDDED_SITES: EmbeddedSite[] = [
  {
    id: 'ezwork',
    label: 'Quản lý trực ca',
    url: 'http://160.30.136.226:2209/WebRoot/#/dashboard',
    icon: 'Briefcase',
    color: 'text-sky-600'
  },
  {
    id: 'ezwater',
    label: 'Quản lý chỉ số tiêu thụ',
    url: 'http://160.30.136.226:2210/WebRoot/#/dashboard',
    icon: 'Droplets',
    color: 'text-blue-500'
  },
  {
    id: 'datasite',
    label: 'Quản lý tài sản',
    url: 'http://160.30.136.226:2211/WebRoot/#/dashboard',
    icon: 'Database',
    color: 'text-green-600'
  },
  {
    id: 'mode4',
    label: 'Quản lý luồng công việc',
    url: 'http://160.30.136.226:2212/WebRoot/#/dashboard',
    icon: 'Disc',
    color: 'text-violet-600'
  }
];

// ============================================
// Permission Groups - MOCK API
// ============================================
export const MOCK_USER_GROUPS: UserGroup[] = [
  {
    id: 'grp-admin',
    name: 'Administrators',
    description: 'Full access to all sites and admin settings',
    isAdmin: true,
    siteAccess: { ezwork: true, ezwater: true, datasite: true, mode4: true },
    memberCount: 1
  },
  {
    id: 'grp-managers',
    name: 'Managers',
    description: 'Access to admin settings and most sites',
    isAdmin: true,
    siteAccess: { ezwork: true, ezwater: true, datasite: true, mode4: false },
    memberCount: 1
  },
  {
    id: 'grp-operators',
    name: 'Operators',
    description: 'Access to operational tools only',
    isAdmin: false,
    siteAccess: { ezwork: true, ezwater: true, datasite: false, mode4: false },
    memberCount: 3
  },
  {
    id: 'grp-viewers',
    name: 'Viewers',
    description: 'Read-only access to basic sites',
    isAdmin: false,
    siteAccess: { ezwork: true, ezwater: false, datasite: false, mode4: false },
    memberCount: 5
  }
];

// ============================================
// Mock Users for Authentication - MOCK API
// ============================================
export const MOCK_USERS: User[] = [
  {
    id: '1',
    username: 'admin',
    displayName: 'Giám sát',
    email: 'admin@ezplatform.com',
    groupIds: ['grp-admin'],
    avatar: 'https://picsum.photos/200/200?random=1',
    preferences: {
      language: 'vi',
      notifications: { email: true, push: true, sms: false },
      defaultLandingView: 'ezwork'
    }
  },
  {
    id: '2',
    username: 'manager',
    displayName: 'Nguyễn Văn A',
    email: 'manager@ezplatform.com',
    groupIds: ['grp-managers'],
    avatar: 'https://picsum.photos/200/200?random=2',
    preferences: {
      language: 'vi',
      notifications: { email: true, push: false, sms: false },
      defaultLandingView: 'ezwater'
    }
  },
  {
    id: '3',
    username: 'user',
    displayName: 'Trần Thị B',
    email: 'user@ezplatform.com',
    groupIds: ['grp-operators'],
    avatar: 'https://picsum.photos/200/200?random=3',
    preferences: {
      language: 'vi',
      notifications: { email: false, push: false, sms: false },
      defaultLandingView: 'ezwork'
    }
  }
];

// Mock credentials - MOCK API
export const MOCK_CREDENTIALS: Record<string, string> = {
  'admin': 'admin123',
  'manager': 'manager123',
  'user': 'user123'
};

// ============================================
// Mock User Permissions (derived from groups) - MOCK API
// ============================================
export const MOCK_USER_PERMISSIONS: UserPermission[] = [
  {
    userId: '1',
    username: 'admin',
    displayName: 'Giám sát',
    email: 'admin@ezplatform.com',
    groupIds: ['grp-admin']
  },
  {
    userId: '2',
    username: 'manager',
    displayName: 'Nguyễn Văn A',
    email: 'manager@ezplatform.com',
    groupIds: ['grp-managers']
  },
  {
    userId: '3',
    username: 'user',
    displayName: 'Trần Thị B',
    email: 'user@ezplatform.com',
    groupIds: ['grp-operators']
  }
];

// ============================================
// Mock Audit Log - MOCK API
// ============================================
export const MOCK_AUDIT_LOG: AuditLogEntry[] = [
  {
    id: 'log-1',
    timestamp: '2026-01-03 10:30:00',
    action: 'User Added to Group',
    performedBy: 'admin',
    targetUser: 'user',
    details: 'Added to Operators group'
  },
  {
    id: 'log-2',
    timestamp: '2026-01-02 14:15:00',
    action: 'User Created',
    performedBy: 'admin',
    targetUser: 'operator_01',
    details: 'New user account created'
  },
  {
    id: 'log-3',
    timestamp: '2026-01-01 09:00:00',
    action: 'Group Modified',
    performedBy: 'manager',
    targetUser: 'Operators Group',
    details: 'Updated site access permissions'
  }
];

// ============================================
// Language Options
// ============================================
export const LANGUAGE_OPTIONS = [
  { value: 'vi', label: 'Tiếng Việt' },
  { value: 'en', label: 'English' },
  { value: 'zh', label: '中文' }
];
