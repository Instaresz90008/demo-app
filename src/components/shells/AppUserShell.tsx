
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import EndUserLayout from '@/components/layout/EndUserLayout';

// Import pages
import Dashboard from '@/pages/Dashboard';
import Calendar from '@/pages/Calendar';
import EventManagement from '@/pages/EventManagement';
import Reports from '@/pages/Reports';
import SlotBroadcast from '@/pages/SlotBroadcast';
import ManageServices from '@/pages/ManageServices';
import Help from '@/pages/Help';
import BookingLinks from '@/pages/BookingLinksPage';
import Profile from '@/pages/Profile';
import EndUserSettings from '@/pages/EndUserSettings';
import SmartService from '@/pages/SmartService';
import OnboardingPage from '@/pages/OnboardingPage';
import ImportContactsPage from '@/pages/ImportContactsPage';
import SubscriptionManagement from '@/pages/SubscriptionManagement';

// Import all settings pages
import ProfileBrandingPage from '@/pages/settings/ProfileBrandingPage';
import PlatformBillingPage from '@/pages/settings/PlatformBillingPage';
import InvoicesTaxPage from '@/pages/settings/InvoicesTaxPage';
import ClientSubscriptionsPage from '@/pages/settings/ClientSubscriptionsPage';
import ReferralsPage from '@/pages/settings/ReferralsPage';
import LoyaltySystemPage from '@/pages/settings/LoyaltySystemPage';
import ContactManagementPage from '@/pages/settings/ContactManagementPage';
import QuestionsManagementPage from '@/pages/settings/QuestionsManagementPage';
import AnalyticsInsightsPage from '@/pages/settings/AnalyticsInsightsPage';
import AiSettingsPage from '@/pages/settings/AiSettingsPage';
import IntegrationsWebhooksPage from '@/pages/settings/IntegrationsWebhooksPage';
import ApiManagementPage from '@/pages/settings/ApiManagementPage';
import CustomDomainPage from '@/pages/settings/CustomDomainPage';
import BetaFeaturesPage from '@/pages/settings/BetaFeaturesPage';

const AppUserShell: React.FC = () => {
  const { user } = useAuth();
  console.log('User:', user);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <EndUserLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/smart-service" element={<SmartService />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/event-management" element={<EventManagement />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/slot-broadcast" element={<SlotBroadcast />} />
        <Route path="/manage-services" element={<ManageServices />} />
        <Route path="/help" element={<Help />} />
        <Route path="/booking-links" element={<BookingLinks />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<EndUserSettings />} />
        
        {/* Settings sub-pages */}
        <Route path="/settings/profile-branding" element={<ProfileBrandingPage />} />
        <Route path="/settings/platform-billing" element={<PlatformBillingPage />} />
        <Route path="/settings/invoices-tax" element={<InvoicesTaxPage />} />
        <Route path="/settings/client-subscriptions" element={<ClientSubscriptionsPage />} />
        <Route path="/settings/referrals" element={<ReferralsPage />} />
        <Route path="/settings/loyalty-system" element={<LoyaltySystemPage />} />
        <Route path="/settings/contact-management" element={<ContactManagementPage />} />
        <Route path="/settings/questions-management" element={<QuestionsManagementPage />} />
        <Route path="/settings/analytics-insights" element={<AnalyticsInsightsPage />} />
        <Route path="/settings/ai-settings" element={<AiSettingsPage />} />
        <Route path="/settings/integrations-webhooks" element={<IntegrationsWebhooksPage />} />
        <Route path="/settings/api-management" element={<ApiManagementPage />} />
        <Route path="/settings/custom-domain" element={<CustomDomainPage />} />
        <Route path="/settings/beta-features" element={<BetaFeaturesPage />} />
        
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/import-contacts" element={<ImportContactsPage />} />
        <Route path="/subscription-management" element={<SubscriptionManagement />} />
      </Routes>
    </EndUserLayout>
  );
};

export default AppUserShell;
