import React, { useState, useEffect } from 'react';
import { X, Loader2, AlertTriangle } from 'lucide-react';
import { UserPermission, UserGroup } from '../types';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Omit<UserPermission, 'userId'> & { password?: string }) => Promise<void>;
  user?: UserPermission | null; // null = create mode, UserPermission = edit mode
  availableGroups: UserGroup[];
}

export const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, onSave, user, availableGroups }) => {
  const isEditMode = !!user;
  
  const [formData, setFormData] = useState({
    username: '',
    displayName: '',
    email: '',
    password: '',
    groupIds: [] as string[]
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  // Initialize form with user data in edit mode
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        displayName: user.displayName,
        email: user.email || '',
        password: '',
        groupIds: user.groupIds || []
      });
    } else {
      // Reset for create mode
      setFormData({
        username: '',
        displayName: '',
        email: '',
        password: '',
        groupIds: []
      });
    }
    setError('');
  }, [user, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.username.trim()) {
      setError('Username is required');
      return;
    }
    if (!formData.displayName.trim()) {
      setError('Display name is required');
      return;
    }
    if (!isEditMode && !formData.password.trim()) {
      setError('Password is required for new users');
      return;
    }
    if (formData.groupIds.length === 0) {
      setError('Please assign at least one group');
      return;
    }

    setIsSaving(true);
    try {
      await onSave({
        username: formData.username,
        displayName: formData.displayName,
        email: formData.email,
        groupIds: formData.groupIds,
        ...(formData.password && { password: formData.password })
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save user');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleGroup = (groupId: string) => {
    setFormData(prev => ({
      ...prev,
      groupIds: prev.groupIds.includes(groupId)
        ? prev.groupIds.filter(id => id !== groupId)
        : [...prev.groupIds, groupId]
    }));
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="user-modal-title"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 id="user-modal-title" className="text-lg font-semibold text-slate-800">
            {isEditMode ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-sm">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1.5">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                disabled={isEditMode}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-500"
                placeholder="Enter username"
              />
              {isEditMode && (
                <p className="mt-1 text-xs text-slate-500">Username cannot be changed</p>
              )}
            </div>

            {/* Display Name */}
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-slate-700 mb-1.5">
                Tên hiển thị <span className="text-red-500">*</span>
              </label>
              <input
                id="displayName"
                type="text"
                value={formData.displayName}
                onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter display name"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter email address"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                {isEditMode ? 'Mật khẩu mới' : 'Mật khẩu'} {!isEditMode && <span className="text-red-500">*</span>}
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={isEditMode ? 'Leave blank to keep current password' : 'Enter password'}
              />
            </div>

            {/* Group Assignment */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nhóm quyền <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-slate-500 mb-3">
                Người dùng sẽ được kế thừa tất cả quyền từ các nhóm được chọn
              </p>
              <div className="space-y-2">
                {availableGroups.map(group => (
                  <label
                    key={group.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      formData.groupIds.includes(group.id)
                        ? 'bg-blue-50 border-blue-300'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.groupIds.includes(group.id)}
                      onChange={() => toggleGroup(group.id)}
                      className="w-4 h-4 mt-0.5 rounded border-slate-300 text-blue-500 focus:ring-blue-500"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-700">{group.name}</span>
                        {group.isAdmin && (
                          <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                            Admin
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{group.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEditMode ? 'Cập nhật' : 'Tạo mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Delete Confirmation Modal
interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  message: string;
  itemName: string;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
              <p className="text-sm text-slate-500 mt-1">{message}</p>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg mb-6">
            <p className="text-sm text-slate-600">
              Bạn sắp xóa: <span className="font-semibold text-slate-800">{itemName}</span>
            </p>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleConfirm}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
              Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
