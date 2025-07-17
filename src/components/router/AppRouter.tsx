
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import UnifiedFeatureGate from '@/components/access-control/UnifiedFeatureGate';
import OnboardingPage from '@/pages/OnboardingPage';
import LandingPage from '@/components/landing/LandingPage';
import Dashboard from '@/components/dashboard/Dashboard';
import ManageServices from '@/pages/ManageServices';
import BookingLinksPage from '@/pages/BookingLinksPage';
import EndUserSettings from '@/pages/EndUserSettings';
import GrowthDashboard from '@/components/growth/GrowthDashboard';
import PublicBookingInterface from '@/components/public-booking/PublicBookingInterface';
import PublicBookingPage from '@/components/public-booking/PublicBookingPage';

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

const AppRouter: React.FC = () => {
  const { showOnboarding } = useAppSelector(state => state.onboarding);

  return (
    <Routes>
      {/* Public booking routes - no authentication required */}
      <Route path="/book/:serviceId" element={<PublicBookingInterface />} />
      <Route path="/booking/:serviceId" element={<PublicBookingPage />} />
      
      {/* Main app routes */}
      <Route 
        path="/" 
        element={
          showOnboarding ? (
            <Navigate to="/onboarding" replace />
          ) : (
            <Navigate to="/dashboard" replace />
          )
        } 
      />
      
      <Route path="/onboarding" element={<OnboardingPage />} />
      
      <Route 
        path="/dashboard" 
        element={
          <UnifiedFeatureGate feature="dashboard">
            <Dashboard />
          </UnifiedFeatureGate>
        } 
      />
      
      <Route 
        path="/manage-services" 
        element={
          <UnifiedFeatureGate feature="manageServices">
            <ManageServices />
          </UnifiedFeatureGate>
        } 
      />
      
      <Route 
        path="/booking-links" 
        element={
          <UnifiedFeatureGate feature="bookingLinks">
            <BookingLinksPage />
          </UnifiedFeatureGate>
        } 
      />

      <Route 
        path="/settings" 
        element={
          <UnifiedFeatureGate feature="settings">
            <EndUserSettings />
          </UnifiedFeatureGate>
        } 
      />

      {/* Settings sub-pages with proper feature gating */}
      <Route 
        path="/settings/profile-branding" 
        element={
          <UnifiedFeatureGate feature="settings">
            <ProfileBrandingPage />
          </UnifiedFeatureGate>
        } 
      />
      <Route 
        path="/settings/platform-billing" 
        element={
          <UnifiedFeatureGate feature="settings">
            <PlatformBillingPage />
          </UnifiedFeatureGate>
        } 
      />
      <Route 
        path="/settings/invoices-tax" 
        element={
          <UnifiedFeatureGate feature="settings">
            <InvoicesTaxPage />
          </UnifiedFeatureGate>
        } 
      />
      <Route 
        path="/settings/client-subscriptions" 
        element={
          <UnifiedFeatureGate feature="settings">
            <ClientSubscriptionsPage />
          </UnifiedFeatureGate>
        } 
      />
      <Route 
        path="/settings/referrals" 
        element={
          <UnifiedFeatureGate feature="settings">
            <ReferralsPage />
          </UnifiedFeatureGate>
        } 
      />
      <Route 
        path="/settings/loyalty-system" 
        element={
          <UnifiedFeatureGate feature="settings">
            <LoyaltySystemPage />
          </UnifiedFeatureGate>
        } 
      />
      <Route 
        path="/settings/contact-management" 
        element={
          <UnifiedFeatureGate feature="settings">
            <ContactManagementPage />
          </UnifiedFeatureGate>
        } 
      />
      <Route 
        path="/settings/questions-management" 
        element={
          <UnifiedFeatureGate feature="settings">
            <QuestionsManagementPage />
          </UnifiedFeatureGate>
        } 
      />
      <Route 
        path="/settings/analytics-insights" 
        element={
          <UnifiedFeatureGate feature="settings">
            <AnalyticsInsightsPage />
          </UnifiedFeatureGate>
        } 
      />
      <Route 
        path="/settings/ai-settings" 
        element={
          <UnifiedFeatureGate feature="aiSettings">
            <AiSettingsPage />
          </UnifiedFeatureGate>
        } 
      />
      <Route 
        path="/settings/integrations-webhooks" 
        element={
          <UnifiedFeatureGate feature="integrationsWebhooks">
            <IntegrationsWebhooksPage />
          </UnifiedFeatureGate>
        } 
      />
      <Route 
        path="/settings/api-management" 
        element={
          <UnifiedFeatureGate feature="apiManagement">
            <ApiManagementPage />
          </UnifiedFeatureGate>
        } 
      />
      <Route 
        path="/settings/custom-domain" 
        element={
          <UnifiedFeatureGate feature="customDomain">
            <CustomDomainPage />
          </UnifiedFeatureGate>
        } 
      />
      <Route 
        path="/settings/beta-features" 
        element={
          <UnifiedFeatureGate feature="betaFeatures">
            <BetaFeaturesPage />
          </UnifiedFeatureGate>
        } 
      />

      <Route 
        path="/growth" 
        element={
          <UnifiedFeatureGate feature="dashboard">
            <GrowthDashboard />
          </UnifiedFeatureGate>
        } 
      />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
