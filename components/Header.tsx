import React, { useState } from 'react';
import { ChevronDown, LogOut, Settings, User } from 'lucide-react';
import { useAuth } from '../contexts/authContext';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    await logout();
    setShowDropdown(false);
  };

  return (
    <header 
      className="h-16 bg-[#1e293b] text-white flex items-center justify-between px-6 shadow-md w-full"
      role="banner"
    >
      {/* Left side - can add breadcrumbs later */}
      <div className="flex-1"></div>

      {/* Right side: User Profile */}
      <div className="relative">
        <button 
          className="flex items-center gap-3 cursor-pointer hover:bg-white/10 p-2 rounded-lg transition-colors"
          onClick={() => setShowDropdown(!showDropdown)}
          aria-expanded={showDropdown}
          aria-haspopup="true"
          aria-label="User menu"
        >
          <div className="flex flex-col items-end">
            <span className="font-semibold text-sm leading-tight">
              {user?.displayName || 'User'}
            </span>
            <div className="flex items-center gap-1 text-xs text-green-400">
              <span 
                className="w-2 h-2 rounded-full bg-green-500 inline-block" 
                aria-hidden="true"
              ></span>
              <span className="text-gray-300">
                {user?.role === 'superadmin' ? 'Super Admin' : user?.role === 'admin' ? 'Admin' : 'User'}
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-400 overflow-hidden border-2 border-white/20">
            <img 
              src={user?.avatar || 'https://picsum.photos/200/200'} 
              alt={`${user?.displayName}'s avatar`}
              className="w-full h-full object-cover" 
            />
          </div>
          <ChevronDown 
            className={`w-4 h-4 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} 
            aria-hidden="true"
          />
        </button>

        {/* Dropdown Menu */}
        {showDropdown && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowDropdown(false)}
              aria-hidden="true"
            />
            
            {/* Menu */}
            <div 
              className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50"
              role="menu"
              aria-orientation="vertical"
            >
              {/* User Info */}
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="font-semibold text-slate-800">{user?.displayName}</p>
                <p className="text-sm text-slate-500">{user?.email}</p>
              </div>

              {/* Menu Items */}
              <div className="py-1">
                <button
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  role="menuitem"
                  onClick={() => setShowDropdown(false)}
                >
                  <User className="w-4 h-4 text-slate-400" />
                  View Profile
                </button>
                <button
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  role="menuitem"
                  onClick={() => setShowDropdown(false)}
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  Settings
                </button>
              </div>

              {/* Logout */}
              <div className="border-t border-slate-100 pt-1">
                <button
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  role="menuitem"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
};