
import { useState } from 'react';

export const useSidebarState = (initialCollapsed: boolean = false) => {
  const [collapsed, setCollapsed] = useState(initialCollapsed);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return {
    collapsed,
    toggleSidebar,
    setCollapsed
  };
};
