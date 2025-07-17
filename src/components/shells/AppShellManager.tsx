import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUnifiedAccessControl } from '@/hooks/useUnifiedAccessControl';
import AppPlatformAdminShell from './AppPlatformAdminShell';
import AppAdminShell from './AppAdminShell';
import AppUserShell from './AppUserShell';
import AppPublicShell from './AppPublicShell';
import Loading from '@/components/ui/Loading';

/**
 * Single source of truth for determining which app shell to load
 * Based on authentication state and user roles/permissions
 */
const AppShellManager: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { isPlatformAdmin, checkRole } = useUnifiedAccessControl();

  // Show loading state while determining access
  if (isLoading) {
    return <Loading />;
  }

  // Public shell for unauthenticated users
  if (!isAuthenticated) {
    console.log('AppShellManager: Unauthenticated user');
    return <AppPublicShell />;
  }

  // Platform admin gets the most privileged shell
  if (isPlatformAdmin) {
    return <AppPlatformAdminShell />;
  }

  // Organization/Team admins get admin shell
  if (checkRole(['org_admin', 'team_admin'])) {
    return <AppAdminShell />;
  }

  // Regular authenticated users get standard shell
  return <AppUserShell />;
};

export default AppShellManager;