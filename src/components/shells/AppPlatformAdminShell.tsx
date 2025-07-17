
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PlatformAdminLayout from '@/components/layout/PlatformAdminLayout';
import RequireRole from '@/components/auth/RequireRole';
import RequireFeature from '@/components/auth/RequireFeature';
import UnauthorizedPage from '@/components/layout/UnauthorizedPage';

// Platform Admin Pages
import SmartService from '@/pages/SmartService';
import SmartTemplates from '@/pages/SmartTemplates';
import PlatformAdminDashboard from '@/pages/admin/PlatformAdminDashboard';
import UserManagement from '@/pages/admin/UserManagement';
import PlatformUserManagement from '@/pages/admin/PlatformUserManagement';
import PlatformOrgManagement from '@/pages/admin/PlatformOrgManagement';
import SystemSettings from '@/pages/admin/SystemSettings';
import SecurityMonitor from '@/pages/admin/SecurityMonitor';
import AuditLogsPage from '@/pages/admin/AuditLogsPage';

// Legacy Pages
import Calendar from '@/pages/Calendar';
import EventManagement from '@/pages/EventManagement';
import History from '@/pages/History';
import PendingRequests from '@/pages/PendingRequests';
import Help from '@/pages/Help';
import FAQ from '@/pages/FAQ';
import Support from '@/pages/Support';
import UniqueClientsReport from '@/pages/UniqueClientsReport';
import Reports from '@/pages/Reports';
import ManageServices from '@/pages/ManageServices';
import SlotBroadcast from '@/pages/SlotBroadcast';
import EnhancedProfile from '@/pages/EnhancedProfile';
import Settings from '@/pages/Settings';
import SubscriptionManagement from '@/pages/SubscriptionManagement';
import BookingLinks from '@/pages/BookingLinksPage';
import CleanupCenter from '@/pages/CleanupCenter';
import ComponentPreview from '@/pages/ComponentPreview';
import DuplicateShowcase from '@/pages/DuplicateShowcase';

/**
 * Shell for platform administrators (highest privilege level)
 * Uses PlatformAdminLayout with platform admin-specific header and sidebar
 */
const AppPlatformAdminShell: React.FC = () => {
  return (
    <PlatformAdminLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Smart Service Route */}
        <Route 
          path="/smart-service" 
          element={
            <RequireFeature feature="smartServiceAccess">
              <SmartService />
            </RequireFeature>
          } 
        />
        
        {/* Smart Templates Route - Platform Admin Only */}
        <Route 
          path="/smart-templates" 
          element={
            <RequireRole role="platform_admin">
              <SmartTemplates />
            </RequireRole>
          } 
        />
        
        {/* Platform Admin Dashboard */}
        <Route 
          path="/dashboard" 
          element={
            <RequireRole role="platform_admin">
              <PlatformAdminDashboard />
            </RequireRole>
          } 
        />
        
        {/* User Management */}
        <Route 
          path="/admin/user-management" 
          element={
            <RequireRole role="platform_admin">
              <UserManagement />
            </RequireRole>
          } 
        />
        <Route 
          path="/admin/users" 
          element={
            <RequireRole role="platform_admin">
              <PlatformUserManagement />
            </RequireRole>
          } 
        />
        
        {/* Organization Management */}
        <Route 
          path="/admin/organizations" 
          element={
            <RequireRole role="platform_admin">
              <PlatformOrgManagement />
            </RequireRole>
          } 
        />
        
        {/* System Management */}
        <Route 
          path="/admin/settings" 
          element={
            <RequireRole role="platform_admin">
              <SystemSettings />
            </RequireRole>
          } 
        />
        <Route 
          path="/admin/security" 
          element={
            <RequireRole role="platform_admin">
              <SecurityMonitor />
            </RequireRole>
          } 
        />
        <Route 
          path="/admin/audit-logs" 
          element={
            <RequireRole role="platform_admin">
              <AuditLogsPage />
            </RequireRole>
          } 
        />
        
        {/* Legacy Platform Admin Routes */}
        <Route 
          path="/cleanup" 
          element={
            <RequireRole role="platform_admin">
              <CleanupCenter />
            </RequireRole>
          } 
        />
        <Route 
          path="/cleanup/preview/:id" 
          element={
            <RequireRole role="platform_admin">
              <ComponentPreview />
            </RequireRole>
          } 
        />
        <Route 
          path="/duplicate-showcase" 
          element={
            <RequireRole role="platform_admin">
              <DuplicateShowcase />
            </RequireRole>
          } 
        />
        <Route 
          path="/subscription-management" 
          element={
            <RequireRole role="platform_admin">
              <SubscriptionManagement />
            </RequireRole>
          } 
        />
        
        {/* General Pages (accessible to platform admin) */}
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/event-management" element={<EventManagement />} />
        <Route path="/booking-links" element={<BookingLinks />} />
        <Route path="/manage-services" element={<ManageServices />} />
        <Route path="/slot-broadcast" element={<SlotBroadcast />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/history" element={<History />} />
        <Route path="/pending-requests" element={<PendingRequests />} />
        <Route path="/unique-clients-report" element={<UniqueClientsReport />} />
        <Route path="/help" element={<Help />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/support" element={<Support />} />
        <Route path="/profile" element={<EnhancedProfile />} />
        <Route path="/settings" element={<Settings />} />
        
        {/* Unauthorized */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </PlatformAdminLayout>
  );
};

export default AppPlatformAdminShell;
