import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Save, 
  Loader2,
  Check
} from 'lucide-react';
import { useAuth } from '../contexts/authContext';

export const SettingsBasicInfo: React.FC = () => {
  const { user, updateUser } = useAuth();
  
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      // In production, this would call the API
      updateUser({
        displayName,
        email,
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Cấu hình thông tin cơ bản</h1>
        <p className="text-slate-500 mt-1">Quản lý thông tin cá nhân của bạn</p>
      </div>

      {/* Avatar Section */}
      <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <UserIcon className="w-5 h-5 text-blue-500" />
          Ảnh đại diện
        </h2>
        
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {getInitials(user.displayName)}
          </div>
          
          <div>
            <p className="text-sm text-slate-600">
              Ảnh đại diện được tạo tự động từ tên hiển thị của bạn.
            </p>
          </div>
        </div>
      </section>

      {/* Display Name Section */}
      <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <UserIcon className="w-5 h-5 text-green-500" />
          Tên hiển thị
        </h2>
        
        <div>
          <label htmlFor="displayName" className="block text-sm font-medium text-slate-700 mb-2">
            Tên hiển thị cho người dùng khác
          </label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            placeholder="Nhập tên hiển thị"
          />
        </div>
      </section>

      {/* Email Section */}
      <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <UserIcon className="w-5 h-5 text-purple-500" />
          Địa chỉ Email
        </h2>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
            Email liên hệ của bạn
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            placeholder="Nhập địa chỉ email"
          />
        </div>
      </section>

      {/* Account Info (Read-only) */}
      <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <UserIcon className="w-5 h-5 text-slate-500" />
          Thông tin tài khoản
        </h2>
        
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-sm text-slate-500">Tên đăng nhập</span>
            <span className="text-sm font-medium text-slate-700">@{user.username}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-sm text-slate-500">Mã người dùng</span>
            <span className="text-sm font-mono text-slate-500">{user.id}</span>
          </div>
        </div>
      </section>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-4">
        {saveSuccess && (
          <span className="flex items-center gap-1 text-green-600 text-sm">
            <Check className="w-4 h-4" />
            Đã lưu thành công!
          </span>
        )}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Đang lưu...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Lưu thay đổi
            </>
          )}
        </button>
      </div>
    </div>
  );
};
