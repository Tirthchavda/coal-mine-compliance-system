import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import {
  LayoutDashboard,
  Mountain,
  MapPin,
  ShieldCheck,
  ClipboardCheck,
  AlertOctagon,
  CheckSquare,
  FileText,
  HeartPulse,
  Leaf,
  Sparkles,
  BarChart3,
  FileSpreadsheet,
  Users,
  History,
  ShieldAlert
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

interface NavItem {
  to: string;
  label: string;
  icon: React.ElementType;
  badge: string | null;
  roles: UserRole[];
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const allNavItems: NavItem[] = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
      roles: ['SUPER_ADMIN', 'HQ_MANAGEMENT', 'MINE_MANAGER', 'SAFETY_INSPECTOR', 'COMPLIANCE_OFFICER', 'CONTRACTOR']
    },
    {
      to: '/mines',
      label: 'Mines Directory',
      icon: Mountain,
      badge: '12',
      roles: ['SUPER_ADMIN', 'HQ_MANAGEMENT', 'MINE_MANAGER', 'SAFETY_INSPECTOR', 'COMPLIANCE_OFFICER']
    },
    {
      to: '/map',
      label: 'Interactive GIS Map',
      icon: MapPin,
      badge: 'GIS',
      roles: ['SUPER_ADMIN', 'HQ_MANAGEMENT', 'MINE_MANAGER', 'SAFETY_INSPECTOR', 'COMPLIANCE_OFFICER']
    },
    {
      to: '/compliance',
      label: 'Statutory Compliance',
      icon: ShieldCheck,
      badge: null,
      roles: ['SUPER_ADMIN', 'HQ_MANAGEMENT', 'MINE_MANAGER', 'SAFETY_INSPECTOR', 'COMPLIANCE_OFFICER']
    },
    {
      to: '/inspections',
      label: 'DGMS Inspections',
      icon: ClipboardCheck,
      badge: null,
      roles: ['SUPER_ADMIN', 'SAFETY_INSPECTOR', 'HQ_MANAGEMENT', 'MINE_MANAGER']
    },
    {
      to: '/violations',
      label: 'Violations Tracker',
      icon: AlertOctagon,
      badge: 'Live',
      roles: ['SUPER_ADMIN', 'SAFETY_INSPECTOR', 'MINE_MANAGER', 'HQ_MANAGEMENT', 'COMPLIANCE_OFFICER']
    },
    {
      to: '/actions',
      label: 'Corrective Actions (CAPA)',
      icon: CheckSquare,
      badge: null,
      roles: ['SUPER_ADMIN', 'MINE_MANAGER', 'CONTRACTOR', 'SAFETY_INSPECTOR', 'COMPLIANCE_OFFICER']
    },
    {
      to: '/documents',
      label: 'Document Vault',
      icon: FileText,
      badge: 'Vault',
      roles: ['SUPER_ADMIN', 'COMPLIANCE_OFFICER', 'MINE_MANAGER', 'HQ_MANAGEMENT', 'SAFETY_INSPECTOR', 'CONTRACTOR']
    },
    {
      to: '/safety',
      label: 'Safety Governance',
      icon: HeartPulse,
      badge: null,
      roles: ['SUPER_ADMIN', 'SAFETY_INSPECTOR', 'MINE_MANAGER', 'CONTRACTOR']
    },
    {
      to: '/environment',
      label: 'Environmental Monitor',
      icon: Leaf,
      badge: null,
      roles: ['SUPER_ADMIN', 'COMPLIANCE_OFFICER', 'MINE_MANAGER', 'HQ_MANAGEMENT']
    },
    {
      to: '/ai-governance',
      label: 'AI Risk & Explainability',
      icon: Sparkles,
      badge: 'AI',
      roles: ['SUPER_ADMIN', 'HQ_MANAGEMENT', 'SAFETY_INSPECTOR', 'MINE_MANAGER']
    },
    {
      to: '/analytics',
      label: 'Executive Analytics',
      icon: BarChart3,
      badge: null,
      roles: ['SUPER_ADMIN', 'HQ_MANAGEMENT', 'MINE_MANAGER']
    },
    {
      to: '/reports',
      label: 'Statutory Reports',
      icon: FileSpreadsheet,
      badge: 'Export',
      roles: ['SUPER_ADMIN', 'HQ_MANAGEMENT', 'MINE_MANAGER', 'COMPLIANCE_OFFICER', 'SAFETY_INSPECTOR']
    },
    {
      to: '/users',
      label: 'User & Role Directory',
      icon: Users,
      badge: null,
      roles: ['SUPER_ADMIN']
    },
    {
      to: '/audit-logs',
      label: 'Immutable Audit Trail',
      icon: History,
      badge: 'Audit',
      roles: ['SUPER_ADMIN', 'HQ_MANAGEMENT']
    }
  ];

  const visibleNavItems = allNavItems.filter(item => user && item.roles.includes(user.role));

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-gov-dark text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="h-16 flex items-center px-6 bg-slate-950 border-b border-slate-800/80 gap-3">
          <div className="w-8 h-8 rounded-lg bg-gov-primary border border-gov-gold/40 flex items-center justify-center font-bold text-gov-gold text-sm shadow">
            ⚖
          </div>
          <div>
            <div className="text-xs font-black tracking-wider text-white uppercase font-sans">
              COAL GOVERNANCE
            </div>
            <div className="text-[10px] text-gov-gold tracking-wider uppercase font-semibold">
              DGMS STATUTORY WING
            </div>
          </div>
        </div>

        {/* Scrollable Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
            {user?.role?.replace(/_/g, ' ')} SCOPE ({visibleNavItems.length} MODULES)
          </div>

          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors group ${
                    isActive
                      ? 'bg-gov-primary text-white font-bold shadow-sm border border-slate-700/80'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                      item.badge === 'AI'
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                        : item.badge === 'Live'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Current Role Widget */}
        <div className="p-3 m-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px]">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="flex items-center gap-1 font-semibold text-slate-300">
              <ShieldAlert className="w-3.5 h-3.5 text-gov-gold" />
              Active Session
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
          <p className="text-[11px] text-white font-bold truncate">
            {user?.name || 'Officer'}
          </p>
          <div className="mt-1">
            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-gov-primary/30 text-gov-gold border border-gov-gold/30">
              {user?.role?.replace(/_/g, ' ')}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
