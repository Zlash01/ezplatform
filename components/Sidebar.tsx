import React, { useMemo } from 'react';
import { 
  LayoutDashboard, 
  ExternalLink, 
  Settings, 
  Users, 
  Droplets, 
  Briefcase, 
  Database, 
  Disc,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Home
} from 'lucide-react';
import { EmbeddedSite, ViewType } from '../types';
import { EMBEDDED_SITES } from '../constants';
import { useAuth, isAdmin, hasAccess } from '../contexts/authContext';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  currentView: ViewType;
  currentSiteId: string | null;
  onNavigate: (view: ViewType, siteId?: string) => void;
}

// Icon mapping
const iconMap: Record<string, React.ReactNode> = {
  'Briefcase': <Briefcase className="w-5 h-5" />,
  'Droplets': <Droplets className="w-5 h-5" />,
  'Database': <Database className="w-5 h-5" />,
  'Disc': <Disc className="w-5 h-5" />
};

export const Sidebar: React.FC<SidebarProps> = ({ 
  isCollapsed, 
  onToggle,
  currentView,
  currentSiteId,
  onNavigate
}) => {
  const { user, logout, userGroups } = useAuth();
  const showAdminSettings = isAdmin(user, userGroups);

  // Filter sites based on user's group permissions
  const accessibleSites = useMemo(() => {
    return EMBEDDED_SITES.filter(site => hasAccess(user, userGroups, site.id));
  }, [user, userGroups]);

  const handleSiteClick = (site: EmbeddedSite) => {
    EMBEDDED_SITES.forEach((embedSite) => {
    const iframe = Array.from(document.querySelectorAll("iframe"))
      .find(f => f.src === embedSite.url);

    if (!iframe || !iframe.contentWindow) return;

    const status = embedSite.id === site.id ? "active" : "no";

    iframe.onload = () => {
      iframe.contentWindow!.postMessage(
        {
          type: embedSite.id,
          status: status
        },
        embedSite.url
      );
    };
  });

    onNavigate('embedded', site.id);
  };

  const handleSettingsClick = (view: ViewType) => {
    onNavigate(view);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav 
      className={`
        bg-slate-50 h-screen flex flex-col border-r border-gray-200 flex-shrink-0 font-medium text-sm text-slate-600
        transition-all duration-300 ease-in-out relative
        ${isCollapsed ? 'w-20' : 'w-64'}
      `}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Logo Area */}
      <div 
        className={`h-16 flex items-center border-b border-gray-100 bg-white overflow-hidden whitespace-nowrap ${isCollapsed ? 'justify-center px-0' : 'px-6'}`}
      >
        <span className="text-xl font-bold text-slate-800 flex items-center gap-2">
           {isCollapsed ? (
             <LayoutDashboard className="w-6 h-6 text-slate-800" aria-hidden="true" />
           ) : (
             <>
               EzPlatform <LayoutDashboard className="w-5 h-5 text-slate-400" aria-hidden="true" />
             </>
           )}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 scrollbar-hide">
        {/* Section 1: Embedded Sites */}
        <div className={`mb-2 transition-all duration-300 ${isCollapsed ? 'px-2' : 'px-6'}`}>
          <h3 
            className={`text-xs font-bold text-slate-900 mb-3 uppercase tracking-wider transition-opacity duration-200 ${isCollapsed ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}
            id="embedded-sites-heading"
          >
            Trang chủ & Hệ thống
          </h3>
          <ul className="space-y-1" role="menubar" aria-labelledby="embedded-sites-heading">
            {/* Home / Overview */}
            <SidebarItem 
              icon={<Home className="w-5 h-5 text-slate-600" />}
              label="Trang chủ" 
              isCollapsed={isCollapsed} 
              isActive={currentView === 'overview'}
              onClick={() => onNavigate('overview')}
            />
            {accessibleSites.map((site) => (
              <SidebarItem 
                key={site.id}
                icon={
                  <span className={site.color}>
                    {iconMap[site.icon]}
                  </span>
                }
                label={site.label} 
                isCollapsed={isCollapsed} 
                hasExternalLink 
                isActive={currentView === 'embedded' && currentSiteId === site.id}
                onClick={() => handleSiteClick(site)}
              />
            ))}
          </ul>
        </div>

        <div className="border-t border-slate-200 my-4 mx-4" role="separator"></div>

        {/* Section 2: Settings */}
        <div className={`transition-all duration-300 ${isCollapsed ? 'px-2' : 'px-6'}`}>
          <h3 
            className={`text-xs font-bold text-slate-900 mb-3 uppercase tracking-wider transition-opacity duration-200 ${isCollapsed ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}
            id="settings-heading"
          >
            Quản lý
          </h3>
          <ul className="space-y-1" role="menubar" aria-labelledby="settings-heading">
            <SidebarItem 
              icon={<Settings className="w-5 h-5 text-slate-500" />} 
              label="Cấu hình thông tin cơ bản" 
              isCollapsed={isCollapsed} 
              isActive={currentView === 'settings-basic'}
              onClick={() => handleSettingsClick('settings-basic')}
            />
            {showAdminSettings && (
              <SidebarItem 
                icon={<Users className="w-5 h-5 text-slate-500" />} 
                label="Cấu hình quyền người dùng" 
                isCollapsed={isCollapsed} 
                isActive={currentView === 'settings-permissions'}
                onClick={() => handleSettingsClick('settings-permissions')}
              />
            )}
          </ul>
        </div>
      </div>

      {/* User Info & Logout */}
      {user && (
        <div 
          className={`border-t border-gray-200 bg-white ${isCollapsed ? 'p-2' : 'p-4'}`}
        >
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
            <img 
              src={user.avatar || 'https://picsum.photos/40/40'} 
              alt={user.displayName}
              className="w-9 h-9 rounded-full object-cover border-2 border-slate-200"
            />
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">
                  {user.displayName}
                </p>
                <p className="text-xs text-slate-500">
                  {showAdminSettings ? 'Admin' : 'User'}
                </p>
              </div>
            )}
            {!isCollapsed && (
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                aria-label="Logout"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
          {isCollapsed && (
            <button
              onClick={handleLogout}
              className="mt-2 w-full p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors flex justify-center"
              aria-label="Logout"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={onToggle}
        className="h-12 border-t border-gray-200 flex items-center justify-center hover:bg-slate-100 text-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        aria-expanded={!isCollapsed}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
      </button>
    </nav>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  hasExternalLink?: boolean;
  isActive?: boolean;
  isCollapsed: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon, 
  label, 
  hasExternalLink, 
  isActive, 
  isCollapsed,
  onClick 
}) => {
  return (
    <li 
      className={`
        flex items-center group cursor-pointer py-2 rounded-md transition-colors h-10
        ${isActive ? 'bg-slate-200 text-slate-900 font-semibold' : 'hover:bg-slate-200'}
        ${isCollapsed ? 'justify-center px-0' : 'justify-between px-2'}
      `}
      title={isCollapsed ? label : undefined}
      onClick={onClick}
      role="menuitem"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      aria-current={isActive ? 'page' : undefined}
    >
      <div className={`flex items-center transition-all duration-300 ${isCollapsed ? 'justify-center w-full gap-0' : 'gap-3'}`}>
        <span aria-hidden="true">{icon}</span>
        <span className={`whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'}`}>
          {label}
        </span>
      </div>
      
      {hasExternalLink && !isCollapsed && (
        <ExternalLink className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
      )}
    </li>
  );
};