import { 
  User, 
  LoginCredentials, 
  UserPreferences, 
  UserPermission, 
  UserGroup, 
  AuditLogEntry 
} from '../types';
import { 
  MOCK_USERS, 
  MOCK_CREDENTIALS, 
  MOCK_USER_PERMISSIONS, 
  MOCK_USER_GROUPS, 
  MOCK_AUDIT_LOG 
} from '../constants';

// ============================================
// MOCK API - Authentication
// All functions tagged for easy replacement with real API
// ============================================

/**
 * MOCK API - Simulate login authentication
 * @param credentials - Username and password
 * @returns Promise with user data or error
 */
export const loginApi = async (credentials: LoginCredentials): Promise<User> => {
  // MOCK API - Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const { username, password } = credentials;
  
  // MOCK API - Check credentials
  if (MOCK_CREDENTIALS[username] === password) {
    const user = MOCK_USERS.find(u => u.username === username);
    if (user) {
      // MOCK API - Store in localStorage if rememberMe
      if (credentials.rememberMe) {
        localStorage.setItem('ez_auth_token', `mock_token_${user.id}`);
        localStorage.setItem('ez_user', JSON.stringify(user));
      }
      return user;
    }
  }
  
  throw new Error('Invalid username or password');
};

/**
 * MOCK API - Logout user
 */
export const logoutApi = async (): Promise<void> => {
  // MOCK API - Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // MOCK API - Clear stored data
  localStorage.removeItem('ez_auth_token');
  localStorage.removeItem('ez_user');
};

/**
 * MOCK API - Get current user from stored session
 */
export const getCurrentUserApi = async (): Promise<User | null> => {
  // MOCK API - Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const storedUser = localStorage.getItem('ez_user');
  if (storedUser) {
    return JSON.parse(storedUser);
  }
  return null;
};

// ============================================
// MOCK API - User Settings
// ============================================

/**
 * MOCK API - Update user preferences
 */
export const updateUserPreferencesApi = async (
  userId: string, 
  preferences: Partial<UserPreferences>
): Promise<UserPreferences> => {
  // MOCK API - Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const user = MOCK_USERS.find(u => u.id === userId);
  if (!user) {
    throw new Error('User not found');
  }
  
  const updatedPreferences = { ...user.preferences, ...preferences };
  
  // MOCK API - Update localStorage
  const storedUser = localStorage.getItem('ez_user');
  if (storedUser) {
    const parsedUser = JSON.parse(storedUser);
    parsedUser.preferences = updatedPreferences;
    localStorage.setItem('ez_user', JSON.stringify(parsedUser));
  }
  
  return updatedPreferences;
};

/**
 * MOCK API - Update user display name
 */
export const updateDisplayNameApi = async (userId: string, displayName: string): Promise<void> => {
  // MOCK API - Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // MOCK API - Update localStorage
  const storedUser = localStorage.getItem('ez_user');
  if (storedUser) {
    const parsedUser = JSON.parse(storedUser);
    parsedUser.displayName = displayName;
    localStorage.setItem('ez_user', JSON.stringify(parsedUser));
  }
};

/**
 * MOCK API - Upload avatar (returns mock URL)
 */
export const uploadAvatarApi = async (_file: File): Promise<string> => {
  // MOCK API - Simulate upload delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // MOCK API - Return random picsum URL
  return `https://picsum.photos/200/200?random=${Date.now()}`;
};

// ============================================
// MOCK API - Permission Management (Admin only)
// ============================================

/**
 * MOCK API - Get all user permissions
 */
export const getUserPermissionsApi = async (): Promise<UserPermission[]> => {
  // MOCK API - Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 400));
  return [...MOCK_USER_PERMISSIONS];
};

/**
 * MOCK API - Update user permission
 */
export const updateUserPermissionApi = async (
  userId: string, 
  siteId: string, 
  hasAccess: boolean
): Promise<UserPermission> => {
  // MOCK API - Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const permission = MOCK_USER_PERMISSIONS.find(p => p.userId === userId);
  if (!permission) {
    throw new Error('User permission not found');
  }
  
  permission.siteAccess[siteId] = hasAccess;
  return { ...permission };
};

/**
 * MOCK API - Get user groups
 */
export const getUserGroupsApi = async (): Promise<UserGroup[]> => {
  // MOCK API - Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...MOCK_USER_GROUPS];
};

/**
 * MOCK API - Create user group
 */
export const createUserGroupApi = async (
  group: Omit<UserGroup, 'id' | 'memberCount'>
): Promise<UserGroup> => {
  // MOCK API - Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newGroup: UserGroup = {
    ...group,
    id: `grp-${Date.now()}`,
    memberCount: 0
  };
  
  MOCK_USER_GROUPS.push(newGroup);
  return newGroup;
};

/**
 * MOCK API - Get audit log
 */
export const getAuditLogApi = async (): Promise<AuditLogEntry[]> => {
  // MOCK API - Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 400));
  return [...MOCK_AUDIT_LOG];
};

// ============================================
// MOCK API - User CRUD Operations
// ============================================

/**
 * MOCK API - Create new user
 */
export const createUserApi = async (
  userData: Omit<UserPermission, 'userId'> & { password?: string }
): Promise<UserPermission> => {
  // MOCK API - Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Check if username already exists
  const exists = MOCK_USER_PERMISSIONS.find(p => p.username === userData.username);
  if (exists) {
    throw new Error('Username already exists');
  }
  
  const newUser: UserPermission = {
    userId: `user-${Date.now()}`,
    username: userData.username,
    displayName: userData.displayName,
    email: userData.email,
    role: userData.role,
    siteAccess: userData.siteAccess
  };
  
  MOCK_USER_PERMISSIONS.push(newUser);
  return newUser;
};

/**
 * MOCK API - Update existing user
 */
export const updateUserApi = async (
  userId: string,
  userData: Partial<Omit<UserPermission, 'userId'>> & { password?: string }
): Promise<UserPermission> => {
  // MOCK API - Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const index = MOCK_USER_PERMISSIONS.findIndex(p => p.userId === userId);
  if (index === -1) {
    throw new Error('User not found');
  }
  
  const updatedUser: UserPermission = {
    ...MOCK_USER_PERMISSIONS[index],
    ...userData,
    userId // Ensure userId is not changed
  };
  
  MOCK_USER_PERMISSIONS[index] = updatedUser;
  return updatedUser;
};

/**
 * MOCK API - Delete user
 */
export const deleteUserApi = async (userId: string): Promise<void> => {
  // MOCK API - Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const index = MOCK_USER_PERMISSIONS.findIndex(p => p.userId === userId);
  if (index === -1) {
    throw new Error('User not found');
  }
  
  MOCK_USER_PERMISSIONS.splice(index, 1);
};

// ============================================
// MOCK API - Group CRUD Operations
// ============================================

/**
 * MOCK API - Update existing group
 */
export const updateUserGroupApi = async (
  groupId: string,
  groupData: Partial<Omit<UserGroup, 'id' | 'memberCount'>>
): Promise<UserGroup> => {
  // MOCK API - Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const index = MOCK_USER_GROUPS.findIndex(g => g.id === groupId);
  if (index === -1) {
    throw new Error('Group not found');
  }
  
  const updatedGroup: UserGroup = {
    ...MOCK_USER_GROUPS[index],
    ...groupData
  };
  
  MOCK_USER_GROUPS[index] = updatedGroup;
  return updatedGroup;
};

/**
 * MOCK API - Delete group
 */
export const deleteUserGroupApi = async (groupId: string): Promise<void> => {
  // MOCK API - Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const index = MOCK_USER_GROUPS.findIndex(g => g.id === groupId);
  if (index === -1) {
    throw new Error('Group not found');
  }
  
  MOCK_USER_GROUPS.splice(index, 1);
};
