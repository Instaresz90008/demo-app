
import { useState } from 'react';

export const useBookingLinkGenerator = (service: string, duration: string) => {
  const [selectedLinkFormat, setSelectedLinkFormat] = useState('standard');

  const getBookingLink = () => {
    const baseUrl = window.location.origin;
    const serviceSlug = service.toLowerCase().replace(/\s+/g, '-');
    return `${baseUrl}/booking/${serviceSlug}-${duration.replace(/\s+/g, '-')}`;
  };

  return {
    selectedLinkFormat,
    setSelectedLinkFormat,
    getBookingLink
  };
};
