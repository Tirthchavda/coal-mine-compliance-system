import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { UserRole } from '../types';

import { Login } from '../pages/Login';
import { Dashboard } from '../pages/Dashboard';
import { Mines } from '../pages/Mines';
import { MineProfile } from '../pages/MineProfile';
import { MineMap } from '../pages/MineMap';
import { Compliance } from '../pages/Compliance';
import { ComplianceDetail } from '../pages/ComplianceDetail';
import { Inspections } from '../pages/Inspections';
import { Violations } from '../pages/Violations';
import { CorrectiveActions } from '../pages/CorrectiveActions';
import { Documents } from '../pages/Documents';
import { Safety } from '../pages/Safety';
import { Environment } from '../pages/Environment';
import { AIGovernance } from '../pages/AIGovernance';
import { Analytics } from '../pages/Analytics';
import { Reports } from '../pages/Reports';
import { Users } from '../pages/Users';
import { AuditLogs } from '../pages/AuditLogs';

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white text-xs font-semibold">
        Validating statutory credentials...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Role-Guarded Route Wrapper
const RoleRoute: React.FC<{ children: React.ReactElement; allowedRoles: UserRole[] }> = ({
  children,
  allowedRoles
}) => {
  const { user, hasRole } = useAuth();

  if (!user || !hasRole(allowedRoles)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Protected App Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />

        <Route
          path="mines"
          element={
            <RoleRoute allowedRoles={['SUPER_ADMIN', 'HQ_MANAGEMENT', 'MINE_MANAGER', 'SAFETY_INSPECTOR', 'COMPLIANCE_OFFICER']}>
              <Mines />
            </RoleRoute>
          }
        />
        <Route
          path="mines/:id"
          element={
            <RoleRoute allowedRoles={['SUPER_ADMIN', 'HQ_MANAGEMENT', 'MINE_MANAGER', 'SAFETY_INSPECTOR', 'COMPLIANCE_OFFICER']}>
              <MineProfile />
            </RoleRoute>
          }
        />
        <Route
          path="map"
          element={
            <RoleRoute allowedRoles={['SUPER_ADMIN', 'HQ_MANAGEMENT', 'MINE_MANAGER', 'SAFETY_INSPECTOR', 'COMPLIANCE_OFFICER']}>
              <MineMap />
            </RoleRoute>
          }
        />
        <Route
          path="compliance"
          element={
            <RoleRoute allowedRoles={['SUPER_ADMIN', 'HQ_MANAGEMENT', 'MINE_MANAGER', 'SAFETY_INSPECTOR', 'COMPLIANCE_OFFICER']}>
              <Compliance />
            </RoleRoute>
          }
        />
        <Route
          path="compliance/:id"
          element={
            <RoleRoute allowedRoles={['SUPER_ADMIN', 'HQ_MANAGEMENT', 'MINE_MANAGER', 'SAFETY_INSPECTOR', 'COMPLIANCE_OFFICER']}>
              <ComplianceDetail />
            </RoleRoute>
          }
        />
        <Route
          path="inspections"
          element={
            <RoleRoute allowedRoles={['SUPER_ADMIN', 'SAFETY_INSPECTOR', 'HQ_MANAGEMENT', 'MINE_MANAGER']}>
              <Inspections />
            </RoleRoute>
          }
        />
        <Route
          path="violations"
          element={
            <RoleRoute allowedRoles={['SUPER_ADMIN', 'SAFETY_INSPECTOR', 'MINE_MANAGER', 'HQ_MANAGEMENT', 'COMPLIANCE_OFFICER']}>
              <Violations />
            </RoleRoute>
          }
        />
        <Route
          path="actions"
          element={
            <RoleRoute allowedRoles={['SUPER_ADMIN', 'MINE_MANAGER', 'CONTRACTOR', 'SAFETY_INSPECTOR', 'COMPLIANCE_OFFICER']}>
              <CorrectiveActions />
            </RoleRoute>
          }
        />
        <Route
          path="documents"
          element={
            <RoleRoute allowedRoles={['SUPER_ADMIN', 'COMPLIANCE_OFFICER', 'MINE_MANAGER', 'HQ_MANAGEMENT', 'SAFETY_INSPECTOR', 'CONTRACTOR']}>
              <Documents />
            </RoleRoute>
          }
        />
        <Route
          path="safety"
          element={
            <RoleRoute allowedRoles={['SUPER_ADMIN', 'SAFETY_INSPECTOR', 'MINE_MANAGER', 'CONTRACTOR']}>
              <Safety />
            </RoleRoute>
          }
        />
        <Route
          path="environment"
          element={
            <RoleRoute allowedRoles={['SUPER_ADMIN', 'COMPLIANCE_OFFICER', 'MINE_MANAGER', 'HQ_MANAGEMENT']}>
              <Environment />
            </RoleRoute>
          }
        />
        <Route
          path="ai-governance"
          element={
            <RoleRoute allowedRoles={['SUPER_ADMIN', 'HQ_MANAGEMENT', 'SAFETY_INSPECTOR', 'MINE_MANAGER']}>
              <AIGovernance />
            </RoleRoute>
          }
        />
        <Route
          path="analytics"
          element={
            <RoleRoute allowedRoles={['SUPER_ADMIN', 'HQ_MANAGEMENT', 'MINE_MANAGER']}>
              <Analytics />
            </RoleRoute>
          }
        />
        <Route
          path="reports"
          element={
            <RoleRoute allowedRoles={['SUPER_ADMIN', 'HQ_MANAGEMENT', 'MINE_MANAGER', 'COMPLIANCE_OFFICER', 'SAFETY_INSPECTOR']}>
              <Reports />
            </RoleRoute>
          }
        />
        <Route
          path="users"
          element={
            <RoleRoute allowedRoles={['SUPER_ADMIN']}>
              <Users />
            </RoleRoute>
          }
        />
        <Route
          path="audit-logs"
          element={
            <RoleRoute allowedRoles={['SUPER_ADMIN', 'HQ_MANAGEMENT']}>
              <AuditLogs />
            </RoleRoute>
          }
        />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRouter;
