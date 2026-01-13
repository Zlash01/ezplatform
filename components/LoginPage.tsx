import React, { useState } from 'react';
import { Eye, EyeOff, LogIn, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/authContext';

interface LoginPageProps {
  onLoginSuccess?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const { login, loading, error } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!username.trim()) {
      setLocalError('Please enter your username');
      return;
    }

    if (!password.trim()) {
      setLocalError('Please enter your password');
      return;
    }

    try {
      await login(username, password, rememberMe);
      onLoginSuccess?.();
    } catch (err) {
      // Error is handled by context
    }
  };

  const displayError = localError || error;

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)'
      }}
      role="main"
      aria-label="Login page"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{
            background: 'linear-gradient(to right, #06b6d4, #3b82f6)',
            top: '-10%',
            left: '-5%',
            animation: 'pulse 8s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute w-80 h-80 rounded-full opacity-10 blur-3xl"
          style={{
            background: 'linear-gradient(to right, #8b5cf6, #ec4899)',
            bottom: '-10%',
            right: '-5%',
            animation: 'pulse 10s ease-in-out infinite reverse'
          }}
        />
      </div>

      {/* Login Card */}
      <div 
        className="relative w-full max-w-md"
        style={{
          animation: 'fadeInUp 0.5s ease-out'
        }}
      >
        {/* Glassmorphism container */}
        <div 
          className="backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/10"
          style={{
            background: 'rgba(15, 23, 42, 0.8)'
          }}
        >
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div 
              className="w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #0ea5e9, #3b82f6)'
              }}
            >
              <span className="text-2xl font-bold text-white">Ez</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Welcome to EzPlatform
            </h1>
            <p className="text-slate-400 text-sm">
              Sign in to access your unified workspace
            </p>
          </div>

          {/* Error Alert */}
          {displayError && (
            <div 
              className="mb-6 p-4 rounded-lg flex items-center gap-3 border"
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                borderColor: 'rgba(239, 68, 68, 0.3)'
              }}
              role="alert"
              aria-live="polite"
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <span className="text-red-400 text-sm">{displayError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Field */}
            <div>
              <label 
                htmlFor="username" 
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                disabled={loading}
                className="w-full px-4 py-3 rounded-lg border border-slate-600 bg-slate-800/50 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-50"
                aria-required="true"
                autoComplete="username"
              />
            </div>

            {/* Password Field */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={loading}
                  className="w-full px-4 py-3 pr-12 rounded-lg border border-slate-600 bg-slate-800/50 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-50"
                  aria-required="true"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                  className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                />
                <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                  Remember me
                </span>
              </label>
              <button
                type="button"
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                disabled={loading}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #0ea5e9, #3b82f6)'
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div 
            className="mt-6 p-4 rounded-lg border"
            style={{
              background: 'rgba(59, 130, 246, 0.05)',
              borderColor: 'rgba(59, 130, 246, 0.2)'
            }}
          >
            <p className="text-xs font-medium text-blue-400 mb-2">Demo Credentials:</p>
            <div className="space-y-1 text-xs text-slate-400">
              <p><span className="text-slate-300">Super Admin:</span> admin / admin123</p>
              <p><span className="text-slate-300">Manager:</span> manager / manager123</p>
              <p><span className="text-slate-300">User:</span> user / user123</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-xs mt-6">
          © 2026 EzPlatform. All rights reserved.
        </p>
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.1; }
          50% { transform: scale(1.1); opacity: 0.15; }
        }
        @keyframes fadeInUp {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
      `}</style>
    </div>
  );
};
