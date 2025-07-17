// Simplified access control API
export const accessControlApi = {
  checkPermission: (permission: string) => Promise.resolve(true),
  logAccess: (action: string, metadata?: any) => Promise.resolve(),
  getFeatures: () => Promise.resolve([]),
};