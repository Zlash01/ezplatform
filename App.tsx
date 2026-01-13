import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AuthProvider, useAuth } from './contexts/authContext';
import { LoginPage } from './components/LoginPage';
import { OverviewPage } from './components/OverviewPage';
import { Sidebar } from './components/Sidebar';
import { IframeViewer } from './components/IframeViewer';
import { SettingsBasicInfo } from './components/SettingsBasicInfo';
import { SettingsPermissions } from './components/SettingsPermissions';
import { EMBEDDED_SITES } from './constants';
import { ViewType } from './types';

// Storage keys for persistence
const STORAGE_KEYS = {
  SIDEBAR_COLLAPSED: 'ez_sidebar_collapsed',
  CURRENT_VIEW: 'ez_current_view',
  CURRENT_SITE: 'ez_current_site'
};

const MainApp: React.FC = () => {
  const { isAuthenticated, loading, user } = useAuth();
  
  // Load persisted state
  const getInitialSidebarState = () => {
    const stored = localStorage.getItem(STORAGE_KEYS.SIDEBAR_COLLAPSED);
    return stored === 'true';
  };

  const getInitialView = (): ViewType => {
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_VIEW);
    if (stored) return stored as ViewType;
    return 'overview';
  };

  const getInitialSiteId = (): string => {
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_SITE);
    if (stored) return stored;
    // Use user's default landing view or first site
    return user?.preferences.defaultLandingView || EMBEDDED_SITES[0].id;
  };

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(getInitialSidebarState);
  const [currentView, setCurrentView] = useState<ViewType>(getInitialView);
  const [currentSiteId, setCurrentSiteId] = useState<string>(getInitialSiteId);
  
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const AUTO_COLLAPSE_DURATION = 30000; // 30 seconds

  // Get current site data
  const currentSite = EMBEDDED_SITES.find(s => s.id === currentSiteId);

  // Persist sidebar state
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, String(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  // Persist current view
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_VIEW, currentView);
    localStorage.setItem(STORAGE_KEYS.CURRENT_SITE, currentSiteId);
  }, [currentView, currentSiteId]);

  // Reset inactivity timer
  const resetInactivityTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (!isSidebarCollapsed) {
      timerRef.current = setTimeout(() => {
        setIsSidebarCollapsed(true);
      }, AUTO_COLLAPSE_DURATION);
    }
  }, [isSidebarCollapsed]);

  // Setup activity listeners
  useEffect(() => {
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    
    const handleActivity = () => {
      resetInactivityTimer();
    };

    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    resetInactivityTimer();

    return () => {
      if (timerRef.current) {
clearTimeout(timerRef.current);
      }
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [resetInactivityTimer]);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev);
  };

  const handleNavigate = (view: ViewType, siteId?: string) => {
    setCurrentView(view);
    if (siteId) {
      setCurrentSiteId(siteId);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading EzPlatform...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - show login
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Authenticated - show main app
  return (
    <div className="flex h-screen bg-[#f1f5f9] overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={toggleSidebar}
        currentView={currentView}
        currentSiteId={currentSiteId}
        onNavigate={handleNavigate}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        <main className="flex-1 overflow-hidden relative">
          {/* Overview Dashboard */}
          {currentView === 'overview' && (
            <OverviewPage onNavigate={handleNavigate} />
          )}

          {/* All Embedded Site Iframes - kept mounted, visibility toggled */}
          {EMBEDDED_SITES.map(site => (
            <div 
              key={site.id}
              className={`absolute inset-0 transition-opacity duration-200 ${
                currentView === 'embedded' && currentSiteId === site.id 
                  ? 'opacity-100 z-10 pointer-events-auto' 
                  : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <IframeViewer 
                url={site.url}
                title={site.label}
              />
            </div>
          ))}

          {/* Settings: Basic Info */}
          <div className={`absolute inset-0 overflow-y-auto bg-[#f1f5f9] transition-opacity duration-200 ${
            currentView === 'settings-basic' 
              ? 'opacity-100 z-10 pointer-events-auto' 
              : 'opacity-0 z-0 pointer-events-none'
          }`}>
            <SettingsBasicInfo />
          </div>

          {/* Settings: Permissions (Admin Only) - includes user management */}
          <div className={`absolute inset-0 overflow-y-auto bg-[#f1f5f9] transition-opacity duration-200 ${
            currentView === 'settings-permissions' 
              ? 'opacity-100 z-10 pointer-events-auto' 
              : 'opacity-0 z-0 pointer-events-none'
          }`}>
            <SettingsPermissions />
          </div>
        </main>
      </div>
    </div>
  );
};

// Root App with AuthProvider
const App: React.FC = () => {
  return (
    <AuthProvider>
      <MainApp />
</AuthProvider>
  );
};

export default App;