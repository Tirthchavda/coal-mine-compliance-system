import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
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
  Menu
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { user, logout, switchRole } = useAuth();
  const navigate = useNavigate();

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [showAlertsDropdown, setShowAlertsDropdown] = useState<boolean>(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState<boolean>(false);
  const [showUserDropdown, setShowUserDropdown] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

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

  const roles: { role: UserRole; label: string; desc: string; color: string }[] = [
    { role: 'SUPER_ADMIN', label: 'Super Admin', desc: 'Ministry of Coal Central IT Cell', color: 'text-purple-700 bg-purple-50' },
    { role: 'HQ_MANAGEMENT', label: 'HQ Management', desc: 'Coal India Strategic Executive', color: 'text-blue-700 bg-blue-50' },
    { role: 'MINE_MANAGER', label: 'Mine Manager', desc: 'Jharia Colliery Project Incharge', color: 'text-emerald-700 bg-emerald-50' },
    { role: 'SAFETY_INSPECTOR', label: 'Safety Inspector', desc: 'DGMS Statutory Inspectorate', color: 'text-rose-700 bg-rose-50' },
    { role: 'COMPLIANCE_OFFICER', label: 'Compliance Officer', desc: 'Raniganj Statutory Environmental Wing', color: 'text-amber-700 bg-amber-50' },
    { role: 'CONTRACTOR', label: 'Mining Contractor', desc: 'Heavy Equipment & Operations Partner', color: 'text-slate-700 bg-slate-100' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      {/* Top Indian Government Tricolor Stripe */}
      <div className="gov-tricolor-stripe"></div>

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Left: Mobile Toggle & Government Portal Branding */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
              {/* Emblem / Logo */}
              <div className="w-10 h-10 rounded-lg bg-gov-dark flex items-center justify-center text-white font-serif font-bold shadow-sm border border-slate-700">
                <span className="text-gov-gold text-lg">⚖</span>
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-2">
                  <h1 className="text-sm font-extrabold text-gov-dark tracking-tight leading-none uppercase">
                    GOVERNMENT OF INDIA • MINISTRY OF COAL
                  </h1>
                  <span className="bg-gov-gold/20 text-gov-gold text-[10px] font-bold px-1.5 py-0.5 rounded border border-gov-gold/30">
                    DGMS PORTAL
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  Coal Mine Statutory Compliance & Governance Monitoring System
                </p>
              </div>
            </div>
          </div>

          {/* Middle: Global Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <input
                type="text"
                placeholder="Search mines, statutory rules, violations, CMR 2017 clauses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-primary focus:bg-white transition-all text-slate-900"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </form>
          </div>

          {/* Right: Quick Role Switcher + Alerts + User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Official Role Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-gov-primary/10 text-gov-primary border border-gov-primary/30 rounded-lg">
              <Shield className="w-3.5 h-3.5 text-gov-gold" />
              <span className="hidden sm:inline text-slate-500 font-medium">Role:</span>
              <span className="font-extrabold text-gov-primary">{user?.role?.replace(/_/g, ' ')}</span>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowAlertsDropdown(!showAlertsDropdown);
                  setShowRoleDropdown(false);
                  setShowUserDropdown(false);
                }}
                className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                title="Statutory Alerts & Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showAlertsDropdown && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">
                  <div className="px-4 py-3 bg-gov-dark text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-gov-gold" />
                      <h3 className="text-xs font-bold uppercase tracking-wider">Statutory Escalations & Alerts</h3>
                    </div>
                    <span className="text-[10px] bg-rose-600 text-white font-bold px-2 py-0.5 rounded-full">
                      {unreadCount} Unread
                    </span>
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {alerts.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-500">
                        <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                        No active statutory alerts at this time.
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
                              {a.severity}
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
            <div className="relative">
              <button
                onClick={() => {
                  setShowUserDropdown(!showUserDropdown);
                  setShowRoleDropdown(false);
                  setShowAlertsDropdown(false);
                }}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gov-secondary text-white font-bold text-xs flex items-center justify-center border border-slate-300">
                  {user?.name ? user.name.charAt(0) : 'U'}
                </div>
                <div className="hidden xl:block text-left">
                  <p className="text-xs font-bold text-slate-800 leading-tight">{user?.name}</p>
                  <p className="text-[10px] text-slate-500 leading-none">{user?.department?.split('-')[0]}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-800">{user?.name}</p>
                    <p className="text-[11px] text-slate-500">{user?.email}</p>
                    <div className="mt-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gov-primary/10 text-gov-primary">
                        {user?.role?.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        navigate('/dashboard');
                      }}
                      className="w-full px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Shield className="w-4 h-4 text-slate-400" />
                      Statutory Dashboard
                    </button>
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        navigate('/users');
                      }}
                      className="w-full px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      User & Access Directory
                    </button>
                  </div>

                  <div className="pt-1 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        logout();
                        navigate('/login');
                      }}
                      className="w-full px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-bold"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
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

