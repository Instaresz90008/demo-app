
const ACM_KEY = 'acm_matrix_v1';

/**
 * Gets the access control matrix from localStorage.
 * If none exists, returns the default matrix (hardcoded).
 */
export function getACM(): Record<string, string[]> {
  try {
    const stored = localStorage.getItem(ACM_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    // Ignore; fallback to default
  }
  // Fallback default matrix; should match your featureAccessMatrix
  return {
    dashboard: ["end_user", "team_admin", "org_admin", "platform_admin"],
    calendar: ["end_user", "team_admin", "org_admin", "platform_admin"],
    history: ["end_user", "team_admin", "org_admin", "platform_admin"],
    slot_broadcast: ["end_user", "team_admin", "org_admin", "platform_admin"],
    service_management: ["end_user", "team_admin", "org_admin", "platform_admin"],
    manage_services: ["end_user", "team_admin", "org_admin", "platform_admin"],
    event_management: ["end_user", "team_admin", "org_admin", "platform_admin"],
    personal_settings: ["end_user", "team_admin", "org_admin", "platform_admin"],
    service_analytics: ["end_user", "team_admin", "org_admin", "platform_admin"],
    booking_access: ["external_user", "end_user", "team_admin", "org_admin", "platform_admin"],
    booking_link_access: ["external_user", "end_user", "team_admin", "org_admin", "platform_admin"],
    support_center_access: ["external_user", "end_user", "team_admin", "org_admin", "platform_admin"],
    raise_support_ticket: ["external_user", "end_user", "team_admin", "org_admin", "platform_admin"],
    team_management: ["team_admin", "org_admin", "platform_admin"],
    organization_settings: ["org_admin", "platform_admin"],
    org_admin_access: ["org_admin", "platform_admin"],
    audit_logs: ["org_admin", "platform_admin"],
    usage_billing_reports: ["org_admin", "platform_admin"],
    user_session_monitoring: ["org_admin", "platform_admin"],
    platform_settings: ["platform_admin"],
    platform_admin_access: ["platform_admin"],
    proxy_session_access: ["platform_admin"],
    calendar_access: ["end_user", "team_admin", "org_admin", "platform_admin"],
    history_access: ["end_user", "team_admin", "org_admin", "platform_admin"],
    catalogue_access: ["external_user", "end_user", "team_admin", "org_admin", "platform_admin"],
    voice_assistant: ["end_user", "team_admin", "org_admin", "platform_admin"],
    feature_mapper_access: ["platform_admin"],
    settings_access: ["end_user", "team_admin", "org_admin", "platform_admin"],
  };
}

/**
 * Saves the access control matrix to localStorage.
 */
export function saveACM(matrix: Record<string, string[]>) {
  localStorage.setItem(ACM_KEY, JSON.stringify(matrix));
}
