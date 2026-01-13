import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  Shield, 
  History, 
  Search, 
  Loader2,
  UserPlus,
  FolderPlus,
  Edit,
  Trash2,
  Mail
} from 'lucide-react';
import { 
  getUsersApi, 
  getGroupsApi, 
  getAuditLogApi,
  createUserApi,
  updateUserApi,
  deleteUserApi,
  createGroupApi,
  updateGroupApi,
  deleteGroupApi,
  ApiUser,
  ApiGroup,
  ApiAuditEntry
} from '../services/api';
import { useAuth } from '../contexts/authContext';
import { EMBEDDED_SITES } from '../constants';
import { UserModal, DeleteConfirmModal } from './UserModal';
import { GroupModal } from './GroupModal';

type TabType = 'users' | 'groups' | 'audit';

// Transform API types
interface UserPermission {
  userId: string;
  username: string;
  displayName: string;
  email?: string;
  groupIds: string[];
  effectiveSiteAccess?: Record<string, boolean>;
  isAdmin?: boolean;
}

interface UserGroup {
  id: string;
  name: string;
  description: string;
  isAdmin: boolean;
  siteAccess: Record<string, boolean>;
  memberCount: number;
}

interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  performedBy: string;
  targetUser: string;
  details: string;
}

const transformApiUser = (user: ApiUser): UserPermission => ({
  userId: user.id,
  username: user.username,
  displayName: user.displayName,
  email: user.email,
  groupIds: user.groups?.map(g => g.id) || [],
});

const transformApiGroup = (group: ApiGroup): UserGroup => ({
  id: group.id,
  name: group.name,
  description: group.description || '',
  isAdmin: group.isAdmin,
  siteAccess: group.siteAccess?.reduce((acc, sa) => ({ ...acc, [sa.siteId]: sa.hasAccess }), {}) || {},
  memberCount: group.memberCount || 0,
});

const transformApiAudit = (entry: ApiAuditEntry): AuditLogEntry => ({
  id: entry.id,
  timestamp: new Date(entry.timestamp).toLocaleString('vi-VN'),
  action: entry.action,
  performedBy: entry.performedBy?.displayName || 'System',
  targetUser: entry.targetType || '',
  details: JSON.stringify(entry.details || {}),
});

// Helper to compute effective permissions from groups
const computeEffectiveAccess = (groupIds: string[], groups: UserGroup[]) => {
  const userGroups = groups.filter(g => groupIds.includes(g.id));
  const siteAccess: Record<string, boolean> = {};
  const isAdmin = userGroups.some(g => g.isAdmin);
  
  EMBEDDED_SITES.forEach(site => {
    siteAccess[site.id] = userGroups.some(g => g.siteAccess[site.id]);
  });
  
  return { siteAccess, isAdmin };
};

export const SettingsPermissions: React.FC = () => {
  const { refreshGroups } = useAuth();
  
  const [activeTab, setActiveTab] = useState<TabType>('users');
  const [userPermissions, setUserPermissions] = useState<UserPermission[]>([]);
  const [userGroups, setUserGroups] = useState<UserGroup[]>([]);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserPermission | null>(null);
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<UserPermission | null>(null);

  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<UserGroup | null>(null);
  const [isDeleteGroupModalOpen, setIsDeleteGroupModalOpen] = useState(false);
  const [deletingGroup, setDeletingGroup] = useState<UserGroup | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [apiUsers, apiGroups, apiAudit] = await Promise.all([
        getUsersApi(),
        getGroupsApi(),
        getAuditLogApi().catch(() => ({ entries: [], total: 0 }))
      ]);
      setUserPermissions(apiUsers.map(transformApiUser));
      setUserGroups(apiGroups.map(transformApiGroup));
      setAuditLog(apiAudit.entries.map(transformApiAudit));
    } catch (error) {
      console.error('Failed to load permission data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Compute user permissions with effective access from groups
  const usersWithEffectiveAccess = useMemo(() => {
    return userPermissions.map(user => {
      const { siteAccess, isAdmin } = computeEffectiveAccess(user.groupIds || [], userGroups);
      return {
        ...user,
        effectiveSiteAccess: siteAccess,
        isAdmin
      };
    });
  }, [userPermissions, userGroups]);

  // User CRUD handlers
  const handleCreateUser = () => {
    setEditingUser(null);
    setIsUserModalOpen(true);
  };

  const handleEditUser = (user: UserPermission) => {
    setEditingUser(user);
    setIsUserModalOpen(true);
  };

  const handleDeleteUserClick = (user: UserPermission) => {
    setDeletingUser(user);
    setIsDeleteUserModalOpen(true);
  };

  const handleSaveUser = async (userData: any) => {
    if (editingUser) {
      await updateUserApi(editingUser.userId, userData);
    } else {
      await createUserApi(userData);
    }
    await loadData(); // Reload data
  };

  const handleConfirmDeleteUser = async () => {
    if (!deletingUser) return;
    await deleteUserApi(deletingUser.userId);
    await loadData();
  };

  // Group CRUD handlers
  const handleCreateGroup = () => {
    setEditingGroup(null);
    setIsGroupModalOpen(true);
  };

  const handleEditGroup = (group: UserGroup) => {
    setEditingGroup(group);
    setIsGroupModalOpen(true);
  };

  const handleDeleteGroupClick = (group: UserGroup) => {
    setDeletingGroup(group);
    setIsDeleteGroupModalOpen(true);
  };

  const handleSaveGroup = async (groupData: any) => {
    if (editingGroup) {
      await updateGroupApi(editingGroup.id, groupData);
    } else {
      await createGroupApi(groupData);
    }
    await loadData();
    await refreshGroups(); // Update sidebar
  };

  const handleConfirmDeleteGroup = async () => {
    if (!deletingGroup) return;
    await deleteGroupApi(deletingGroup.id);
    await loadData();
    await refreshGroups(); // Update sidebar
  };

  // Get group names for a user
  const getGroupNames = (groupIds: string[]) => {
    return userGroups
      .filter(g => groupIds.includes(g.id))
      .map(g => g.name);
  };

  const filteredUsers = usersWithEffectiveAccess.filter(p => 
    p.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.email && p.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredGroups = userGroups.filter(g =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Quản lý người dùng & quyền truy cập</h1>
        <p className="text-slate-500 mt-1">Manage users and permission groups</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-lg w-fit">
        {[
          { id: 'users', label: 'Người dùng', icon: Users },
          { id: 'groups', label: 'Nhóm quyền', icon: Shield },
          { id: 'audit', label: 'Nhật ký', icon: History }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === tab.id 
                ? 'bg-white text-slate-800 shadow-sm' 
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      {activeTab !== 'audit' && (
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={activeTab === 'users' ? 'Tìm kiếm theo tên, username hoặc email...' : 'Tìm kiếm nhóm...'}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      )}

      {/* User Management Tab */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="font-semibold text-slate-800">Danh sách người dùng ({filteredUsers.length})</h2>
            <button 
              onClick={handleCreateUser}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
            >
              <UserPlus className="w-4 h-4" />
              Thêm người dùng
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Người dùng</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Nhóm quyền</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Quyền truy cập (từ nhóm)</th>
                  <th className="text-center px-4 py-3 text-sm font-semibold text-slate-700 w-28">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, idx) => (
                  <tr key={user.userId} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                          {user.displayName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-slate-800">{user.displayName}</p>
                            {user.isAdmin && (
                              <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                                Admin
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <span>@{user.username}</span>
                            {user.email && (
                              <>
                                <span className="text-slate-300">•</span>
                                <span className="flex items-center gap-1">
                                  <Mail className="w-3 h-3" />
                                  {user.email}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {getGroupNames(user.groupIds || []).map(name => (
                          <span key={name} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded">
                            {name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {EMBEDDED_SITES.map(site => (
                          <span
                            key={site.id}
                            className={`px-2 py-0.5 text-xs font-medium rounded ${
                              user.effectiveSiteAccess?.[site.id]
                                ? 'bg-green-100 text-green-700'
                                : 'bg-slate-100 text-slate-400'
                            }`}
                          >
                            {site.label}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleEditUser(user)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"
                          aria-label={`Edit ${user.displayName}`}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteUserClick(user)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                          aria-label={`Delete ${user.displayName}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="p-8 text-center text-slate-400">
              Không tìm thấy người dùng
            </div>
          )}
        </div>
      )}

      {/* User Groups Tab */}
      {activeTab === 'groups' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-800">Nhóm quyền ({filteredGroups.length})</h2>
            <button 
              onClick={handleCreateGroup}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
            >
              <FolderPlus className="w-4 h-4" />
              Tạo nhóm mới
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredGroups.map(group => (
              <div 
                key={group.id} 
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-800">{group.name}</h3>
                      {group.isAdmin && (
                        <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 mt-1">{group.description}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {EMBEDDED_SITES.map(site => (
                    <span
                      key={site.id}
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        group.siteAccess[site.id]
                          ? 'bg-green-100 text-green-700'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {site.label}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm pt-3 border-t border-slate-100">
                  <span className="text-slate-500">
                    {group.memberCount} thành viên
                  </span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleEditGroup(group)}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Sửa
                    </button>
                    <span className="text-slate-300">|</span>
                    <button 
                      onClick={() => handleDeleteGroupClick(group)}
                      className="text-red-500 hover:text-red-600 font-medium"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredGroups.length === 0 && (
            <div className="p-8 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
              Không tìm thấy nhóm quyền
            </div>
          )}
        </div>
      )}

      {/* Audit Log Tab */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <h2 className="font-semibold text-slate-800">Nhật ký thay đổi</h2>
          </div>
          
          <div className="divide-y divide-slate-100">
            {auditLog.length > 0 ? auditLog.map(entry => (
              <div key={entry.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-slate-800">{entry.action}</p>
                    <p className="text-sm text-slate-500 mt-1">
                      <span className="font-medium">{entry.performedBy}</span>
                      {entry.targetUser && (
                        <>
                          {' → '}
                          <span>{entry.targetUser}</span>
                        </>
                      )}
                    </p>
                    {entry.details && (
                      <p className="text-sm text-slate-400 mt-1">{entry.details}</p>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 whitespace-nowrap">
                    {entry.timestamp}
                  </span>
                </div>
              </div>
            )) : (
              <div className="p-8 text-center text-slate-400">
                Chưa có nhật ký hoạt động
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onSave={handleSaveUser}
        user={editingUser as any}
        availableGroups={userGroups as any}
      />

      <DeleteConfirmModal
        isOpen={isDeleteUserModalOpen}
        onClose={() => setIsDeleteUserModalOpen(false)}
        onConfirm={handleConfirmDeleteUser}
        title="Xóa người dùng"
        message="Hành động này không thể hoàn tác."
        itemName={deletingUser?.displayName || ''}
      />

      <GroupModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        onSave={handleSaveGroup}
        group={editingGroup as any}
      />

      <DeleteConfirmModal
        isOpen={isDeleteGroupModalOpen}
        onClose={() => setIsDeleteGroupModalOpen(false)}
        onConfirm={handleConfirmDeleteGroup}
        title="Xóa nhóm quyền"
        message="Các thành viên trong nhóm sẽ mất quyền từ nhóm này."
        itemName={deletingGroup?.name || ''}
      />
    </div>
  );
};
