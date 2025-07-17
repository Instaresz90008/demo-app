
import { useAccessControl } from "@/context/AccessControlContext";
import { useMemo } from "react";
import { CalendarPermission } from "@/types/calendar";

/**
 * Returns a function to check for a given calendar permission for the current user role/context.
 *
 * Usage:
 *   const { can, role } = useCalendarRbac();
 *   if (can("create_events")) { ... }
 */
export function useCalendarRbac(orgId?: string) {
  const { getCurrentUserRole } = useAccessControl();
  const role = getCurrentUserRole ? getCurrentUserRole() : "end_user";

  // Default fallback: end users have full access, org/team users defer to RBAC
  // In a real app, you would fetch these from org/team context or the backend
  // For now, use the logic from CalendarRbacSettings's DEFAULT_PERMISSIONS
  const DEFAULT_PERMISSIONS = {
    platform_admin: [
      "view_events",
      "create_events",
      "edit_events",
      "delete_events",
      "view_slots",
      "create_slots",
      "edit_slots",
      "delete_slots",
      "manage_recurring",
      "edit_others_events",
      "delete_others_events"
    ],
    org_admin: [
      "view_events",
      "create_events",
      "edit_events",
      "delete_events",
      "view_slots",
      "create_slots",
      "edit_slots",
      "delete_slots",
      "manage_recurring",
      "edit_others_events",
      "delete_others_events"
    ],
    team_admin: [
      "view_events",
      "create_events",
      "edit_events",
      "delete_events",
      "view_slots",
      "create_slots",
      "edit_slots",
      "manage_recurring"
    ],
    end_user: [
      "view_events",
      "create_events",
      "edit_events",
      "delete_events",
      "view_slots",
      "create_slots"
    ]
  } as Record<string, CalendarPermission[]>;

  const permissions: CalendarPermission[] = useMemo(() => {
    return DEFAULT_PERMISSIONS[role] || [];
  }, [role]);

  /** Check if user can perform an action (e.g. 'create_events', 'edit_events', etc.) */
  const can = (perm: CalendarPermission) => permissions.includes(perm);

  return {
    can,
    role,
    permissions
  };
}
