import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const PageTitleManager = () => {
  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname;

    if (pathname === '/') {
      document.title = 'Event Nest - Premium Event Marketplace';
      return;
    }

    // Extract the last segment of the path and format it
    // Example: /customer/shopping-cart -> shopping-cart -> Shopping Cart
    const pathSegments = pathname.split('/').filter(Boolean);
    if (pathSegments.length > 0) {
      const lastSegment = pathSegments[pathSegments.length - 1];
      const formattedTitle = lastSegment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      document.title = `${formattedTitle} | Event Nest`;
    }
  }, [location]);

  return null;
};
