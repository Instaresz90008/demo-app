import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import RequireRole from '@/components/auth/RequireRole';
import RequireFeature from '@/components/auth/RequireFeature';
import UnauthorizedPage from '@/components/layout/UnauthorizedPage';
import Dashboard from '@/pages/Dashboard';
import SmartService from '@/pages/SmartService';
import Calendar from '@/pages/Calendar';
import EventManagement from '@/pages/EventManagement';
import History from '@/pages/History';
import PendingRequests from '@/pages/PendingRequests';
import Help from '@/pages/Help';
import FAQ from '@/pages/FAQ';
import Support from '@/pages/Support';
import Reports from '@/pages/Reports';
import ManageServices from '@/pages/ManageServices';
import SlotBroadcast from '@/pages/SlotBroadcast';
import EnhancedProfile from '@/pages/EnhancedProfile';
import Settings from '@/pages/Settings';
import BookingLinks from '@/pages/BookingLinksPage';

/**
 * Shell for organization and team admins
 * Uses AdminLayout with admin-specific header and sidebar
 */
const AppAdminShell: React.FC = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Smart Service Route */}
        <Route 
          path="/smart-service" 
          element={
            <RequireFeature feature="smartServiceAccess">
              <SmartService />
            </RequireFeature>
          } 
        />
        
        {/* Calendar & Events */}
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/event-management" element={<EventManagement />} />
        
        {/* Booking & Services */}
        <Route path="/booking-links" element={<BookingLinks />} />
        <Route 
          path="/manage-services" 
          element={
            <RequireRole role={['org_admin', 'team_admin']}>
              <ManageServices />
            </RequireRole>
          } 
        />
        <Route 
          path="/slot-broadcast" 
          element={
            <RequireRole role={['org_admin', 'team_admin']}>
              <SlotBroadcast />
            </RequireRole>
          } 
        />
        
        {/* Reports & Analytics */}
        <Route 
          path="/reports" 
          element={
            <RequireRole role={['org_admin', 'team_admin']}>
              <Reports />
            </RequireRole>
          } 
        />
        <Route path="/history" element={<History />} />
        <Route path="/pending-requests" element={<PendingRequests />} />
        
        {/* Support & Help */}
        <Route path="/help" element={<Help />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/support" element={<Support />} />
        
        {/* Profile & Settings */}
        <Route path="/profile" element={<EnhancedProfile />} />
        <Route path="/settings" element={<Settings />} />
        
        {/* Unauthorized */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AdminLayout>
  );
};

export default AppAdminShell;
