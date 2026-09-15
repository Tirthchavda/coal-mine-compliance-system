import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../api/client';
import { UserRole, Alert } from '../types';
import {
  Bell,
  Search,
  Shield,
  User,
  LogOut,
  ChevronDown,
  Sparkles,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Menu,
  Globe,
  Languages
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { user, logout, switchRole } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [showAlertsDropdown, setShowAlertsDropdown] = useState<boolean>(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState<boolean>(false);
  const [showUserDropdown, setShowUserDropdown] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const alertsRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const fetchAlerts = async () => {
    try {
      const res = await api.get('/alerts?limit=5');
      if (res.data.success) {
        setAlerts(res.data.data);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 15000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (alertsRef.current && !alertsRef.current.contains(event.target as Node)) {
        setShowAlertsDropdown(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleSwitch = async (role: UserRole) => {
    setShowRoleDropdown(false);
    await switchRole(role);
    window.location.reload();
  };

  const handleMarkAlert = async (alertId: string) => {
    try {
      await api.put(`/alerts/${alertId}/read`);
      fetchAlerts();
    } catch (e) {}
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/compliance?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      {/* Top Indian Government Tricolor Stripe */}
      <div className="gov-tricolor-stripe"></div>

      <div className="px-3 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Left: Mobile Toggle & Government Portal Branding */}
          <div className="flex items-center gap-2.5 min-w-0 shrink-0">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer shrink-0"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 cursor-pointer min-w-0" onClick={() => navigate('/dashboard')}>
              {/* Emblem / Logo */}
              <div className="w-9 h-9 rounded-lg bg-gov-dark flex items-center justify-center text-white font-serif font-bold shadow-xs border border-slate-700 shrink-0">
                <span className="text-gov-gold text-base">⚖</span>
              </div>
              <div className="hidden sm:block min-w-0">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-xs sm:text-sm font-extrabold text-gov-dark tracking-tight leading-none uppercase truncate max-w-[200px] md:max-w-[280px] lg:max-w-none">
                    {t('header.portalSubtitle', 'MINISTRY OF COAL • DGMS')}
                  </h1>
                  <span className="hidden xl:inline-block bg-gov-gold/20 text-gov-gold text-[9px] font-bold px-1.5 py-0.5 rounded border border-gov-gold/30 shrink-0">
                    DGMS PORTAL
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium mt-0.5 truncate hidden lg:block max-w-[260px] xl:max-w-none">
                  {t('header.portalTitle', 'Coal Mine Statutory Compliance & Governance Monitoring System')}
                </p>
              </div>
            </div>
          </div>

          {/* Right Action Cluster: Search + Language Switcher + Role + Alerts + Profile */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto">
            
            {/* Global Search (Clean, fixed width - only on wide screens to prevent crowding) */}
            <div className="hidden xl:block w-44 2xl:w-60 shrink-0">
              <form onSubmit={handleSearchSubmit} className="w-full relative">
                <input
                  type="text"
                  placeholder={t('header.searchPlaceholder', 'Search...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-primary focus:bg-white transition-all text-slate-900"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </form>
            </div>

            {/* 🌐 Clean Dual-Pill Language Switcher (English | हिन्दी) */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 shrink-0">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-gov-primary text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
                title="Switch to English"
              >
                English
              </button>

              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  language === 'hi'
                    ? 'bg-gov-primary text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
                title="हिन्दी में बदलें"
              >
                हिन्दी
              </button>
            </div>

            {/* Official Role Badge */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-gov-primary/10 text-gov-primary border border-gov-primary/30 rounded-lg shrink-0">
              <Shield className="w-3.5 h-3.5 text-gov-gold shrink-0" />
              <span className="hidden xl:inline text-slate-500 font-medium">{t('header.activeRole', 'Role')}:</span>
              <span className="font-extrabold text-gov-primary truncate max-w-[110px]">
                {t(`role.${user?.role}` as string, user?.role?.replace(/_/g, ' ') || 'Officer')}
              </span>
            </div>

            {/* Notification Bell */}
            <div className="relative shrink-0" ref={alertsRef}>
              <button
                onClick={() => {
                  setShowAlertsDropdown(!showAlertsDropdown);
                  setShowUserDropdown(false);
                }}
                className="relative p-1.5 sm:p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                title={t('header.notifications', 'Statutory Alerts & Notifications')}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showAlertsDropdown && (
                <div className="absolute right-0 mt-2 w-72 sm:w-88 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in duration-150">
                  <div className="px-4 py-3 bg-gov-dark text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-gov-gold" />
                      <h3 className="text-xs font-bold uppercase tracking-wider">{t('header.notifications', 'Statutory Alerts')}</h3>
                    </div>
                    <span className="text-[10px] bg-rose-600 text-white font-bold px-2 py-0.5 rounded-full">
                      {unreadCount} {t('status.PENDING', 'Unread')}
                    </span>
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {alerts.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-500">
                        <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                        {t('header.noAlerts', 'No active statutory alerts at this time.')}
                      </div>
                    ) : (
                      alerts.map((a) => (
                        <div
                          key={a.id}
                          onClick={() => handleMarkAlert(a.id)}
                          className={`p-3 text-left transition-colors cursor-pointer ${
                            !a.isRead ? 'bg-amber-50/50 hover:bg-amber-50' : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                a.severity === 'CRITICAL'
                                  ? 'bg-rose-100 text-rose-700'
                                  : a.severity === 'HIGH'
                                  ? 'bg-orange-100 text-orange-700'
                                  : 'bg-sky-100 text-sky-700'
                              }`}
                            >
                              {t(`risk.${a.severity}` as string, a.severity)}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(a.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-slate-800 mt-1">{a.title}</p>
                          <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">{a.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Avatar & Menu */}
            <div className="relative shrink-0" ref={userRef}>
              <button
                onClick={() => {
                  setShowUserDropdown(!showUserDropdown);
                  setShowAlertsDropdown(false);
                }}
                className="flex items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gov-secondary text-white font-bold text-xs flex items-center justify-center border border-slate-300 shrink-0">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="hidden 2xl:block text-left">
                  <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[100px]">{user?.name}</p>
                  <p className="text-[10px] text-slate-500 leading-none truncate max-w-[100px]">{user?.department?.split('-')[0]}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block shrink-0" />
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in duration-150">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-800">{user?.name}</p>
                    <p className="text-[11px] text-slate-500">{user?.email}</p>
                    <div className="mt-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gov-primary/10 text-gov-primary">
                        {t(`role.${user?.role}` as string, user?.role?.replace(/_/g, ' ') || 'Officer')}
                      </span>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        navigate('/dashboard');
                      }}
                      className="w-full px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    >
                      <Shield className="w-4 h-4 text-slate-400" />
                      {t('nav.dashboard', 'Statutory Dashboard')}
                    </button>
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        navigate('/users');
                      }}
                      className="w-full px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      {t('nav.users', 'User & Access Directory')}
                    </button>
                  </div>

                  <div className="pt-1 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        logout();
                        navigate('/login');
                      }}
                      className="w-full px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-bold cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      {t('header.logout', 'Sign Out')}
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
