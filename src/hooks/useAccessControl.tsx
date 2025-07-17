
import { useContext } from 'react';
import { AccessControlContext } from '@/context/AccessControlContext';

export const useAccessControl = () => {
  const context = useContext(AccessControlContext);
  if (!context) {
    throw new Error('useAccessControl must be used within AccessControlProvider');
  }
  return context;
};

export default useAccessControl;
