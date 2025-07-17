
import { useState, useEffect } from 'react';

export const useSmartFooter = () => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const checkFooterPosition = () => {
      // More accurate viewport height calculation
      const viewportHeight = window.innerHeight;
      const documentHeight = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      );
      
      // Check if content fits in viewport with 100px buffer for better UX
      const shouldStick = documentHeight <= (viewportHeight + 100);
      
      setIsSticky(shouldStick);
    };

    // Initial check with delay to ensure DOM is fully rendered
    const initialTimer = setTimeout(checkFooterPosition, 200);

    // Debounced resize handler
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(checkFooterPosition, 150);
    };

    // Content change observer
    const observer = new MutationObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(checkFooterPosition, 100);
    });
    
    // Observe the main content area for changes
    const mainContent = document.querySelector('main');
    if (mainContent) {
      observer.observe(mainContent, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
      });
    }

    window.addEventListener('resize', handleResize);
    window.addEventListener('load', checkFooterPosition);
    
    return () => {
      clearTimeout(initialTimer);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('load', checkFooterPosition);
      observer.disconnect();
    };
  }, []);

  return { isSticky };
};
