
import { useState, useEffect } from 'react';
import { storage, STORAGE_KEYS } from '@/lib/storageService';

export const useSidebarCollapse = () => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return storage.get<boolean>(STORAGE_KEYS.SIDEBAR_COLLAPSED) ?? false;
  });

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    storage.set(STORAGE_KEYS.SIDEBAR_COLLAPSED, newState);
  };

  return {
    isCollapsed,
    toggleCollapse,
    setIsCollapsed
  };
};

export default useSidebarCollapse;
