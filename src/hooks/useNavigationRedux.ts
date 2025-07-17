import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setActiveRoute, toggleSidebar, setSidebarCollapsed } from '@/store/slices/navigationSlice';

/**
 * Hook to integrate React Router navigation with Redux state
 * Provides navigation state management and route tracking
 */
export const useNavigationRedux = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const {
    activeRoute,
    sidebarCollapsed,
    navigationHistory,
    lastVisited
  } = useAppSelector((state) => state.navigation);

  // Update Redux when route changes
  useEffect(() => {
    if (location.pathname !== activeRoute) {
      dispatch(setActiveRoute(location.pathname));
    }
  }, [location.pathname, activeRoute, dispatch]);

  // Navigation helpers
  const navigateWithTracking = (route: string) => {
    navigate(route);
    dispatch(setActiveRoute(route));
  };

  const goToLastVisited = (category: keyof typeof lastVisited) => {
    const route = lastVisited[category];
    if (route) {
      navigateWithTracking(route);
    }
  };

  const toggleSidebarState = () => {
    dispatch(toggleSidebar());
  };

  const setSidebarState = (collapsed: boolean) => {
    dispatch(setSidebarCollapsed(collapsed));
  };

  const isActiveRoute = (route: string) => {
    if (route === "/dashboard" && (activeRoute === "/" || activeRoute === "/dashboard")) {
      return true;
    }
    if (route !== "/dashboard" && activeRoute.startsWith(route)) {
      return true;
    }
    return false;
  };

  // Get breadcrumb from current route
  const getBreadcrumb = () => {
    const pathSegments = activeRoute.split('/').filter(Boolean);
    return pathSegments.map((segment, index) => ({
      label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
      path: '/' + pathSegments.slice(0, index + 1).join('/'),
      isLast: index === pathSegments.length - 1
    }));
  };

  // Check if any of the main features are accessible
  const getAccessibleFeatures = () => {
    return {
      reports: true, // Now accessible to all users
      manageServices: true, // Now accessible to all users
      slotBroadcast: true, // Now accessible to all users
      importContacts: true, // Now accessible to all users
      subscription: true // Now accessible to all users
    };
  };

  return {
    // State
    activeRoute,
    sidebarCollapsed,
    navigationHistory,
    lastVisited,
    
    // Actions
    navigateWithTracking,
    goToLastVisited,
    toggleSidebarState,
    setSidebarState,
    
    // Helpers
    isActiveRoute,
    getBreadcrumb,
    getAccessibleFeatures,
    
    // React Router integration
    location,
    navigate
  };
};