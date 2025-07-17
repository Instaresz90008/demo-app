
import React from 'react';
import { Button } from '@/components/ui/button';
import { Users, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// This component is now just a button that navigates to the full page
const ImportContacts = () => {
  const navigate = useNavigate();

  return (
    <Button 
      variant="outline" 
      className="w-full gap-2 justify-start"
      onClick={() => navigate('/import-contacts')}
    >
      <div className="p-1 rounded-md bg-purple-100">
        <Users className="h-4 w-4 text-purple-600" />
      </div>
      <span className="font-medium">Import Contacts</span>
      <Sparkles className="h-3 w-3 text-purple-500 ml-auto" />
    </Button>
  );
};

export default ImportContacts;
