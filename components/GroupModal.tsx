import React, { useState, useEffect } from 'react';
import { X, Loader2, AlertTriangle, Shield } from 'lucide-react';
import { UserGroup } from '../types';
import { EMBEDDED_SITES } from '../constants';

interface GroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (group: Omit<UserGroup, 'id' | 'memberCount'>) => Promise<void>;
  group?: UserGroup | null; // null = create mode, UserGroup = edit mode
}

export const GroupModal: React.FC<GroupModalProps> = ({ isOpen, onClose, onSave, group }) => {
  const isEditMode = !!group;
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isAdmin: false,
    siteAccess: {} as Record<string, boolean>
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  // Initialize form with group data in edit mode
  useEffect(() => {
    if (group) {
      setFormData({
        name: group.name,
        description: group.description,
        isAdmin: group.isAdmin,
        siteAccess: { ...group.siteAccess }
      });
    } else {
      // Reset for create mode
      setFormData({
        name: '',
        description: '',
        isAdmin: false,
        siteAccess: EMBEDDED_SITES.reduce((acc, site) => ({ ...acc, [site.id]: false }), {})
      });
    }
    setError('');
  }, [group, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name.trim()) {
      setError('Group name is required');
      return;
    }

    setIsSaving(true);
    try {
      await onSave({
        name: formData.name,
        description: formData.description,
        isAdmin: formData.isAdmin,
        siteAccess: formData.siteAccess
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save group');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSiteAccess = (siteId: string) => {
    setFormData(prev => ({
      ...prev,
      siteAccess: {
        ...prev.siteAccess,
        [siteId]: !prev.siteAccess[siteId]
      }
    }));
  };

  const selectAllSites = () => {
    setFormData(prev => ({
      ...prev,
      siteAccess: EMBEDDED_SITES.reduce((acc, site) => ({ ...acc, [site.id]: true }), {})
    }));
  };

  const clearAllSites = () => {
    setFormData(prev => ({
      ...prev,
      siteAccess: EMBEDDED_SITES.reduce((acc, site) => ({ ...acc, [site.id]: false }), {})
    }));
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="group-modal-title"
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
          <h2 id="group-modal-title" className="text-lg font-semibold text-slate-800">
            {isEditMode ? 'Chỉnh sửa nhóm quyền' : 'Tạo nhóm quyền mới'}
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
            {/* Group Name */}
            <div>
              <label htmlFor="groupName" className="block text-sm font-medium text-slate-700 mb-1.5">
                Tên nhóm <span className="text-red-500">*</span>
              </label>
              <input
                id="groupName"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Administrators, Operators"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1.5">
                Mô tả
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Describe the purpose of this group..."
              />
            </div>

            {/* Admin Access Toggle */}
            <div>
              <label
                className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                  formData.isAdmin
                    ? 'bg-purple-50 border-purple-300'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.isAdmin}
                  onChange={(e) => setFormData(prev => ({ ...prev, isAdmin: e.target.checked }))}
                  className="w-4 h-4 mt-0.5 rounded border-slate-300 text-purple-500 focus:ring-purple-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-semibold text-slate-700">Quyền quản trị</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Thành viên nhóm này có thể truy cập trang quản lý người dùng và phân quyền
                  </p>
                </div>
              </label>
            </div>

            {/* Site Access */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-700">
                  Quyền truy cập các trang
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={selectAllSites}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Chọn tất cả
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    type="button"
                    onClick={clearAllSites}
                    className="text-xs text-slate-500 hover:text-slate-600 font-medium"
                  >
                    Bỏ chọn tất cả
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                {EMBEDDED_SITES.map(site => (
                  <label
                    key={site.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      formData.siteAccess[site.id]
                        ? 'bg-green-50 border-green-300'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.siteAccess[site.id] || false}
                      onChange={() => toggleSiteAccess(site.id)}
                      className="w-4 h-4 rounded border-slate-300 text-green-500 focus:ring-green-500"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-slate-700">{site.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {isEditMode && group && (
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600">
                  Nhóm này hiện có <span className="font-semibold">{group.memberCount}</span> thành viên
                </p>
              </div>
            )}
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
