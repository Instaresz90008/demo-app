
import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchResultsProps {
  searchTerm: string;
  clearSearch: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ searchTerm, clearSearch }) => {
  if (!searchTerm) return null;
  
  return (
    <div className="text-center py-8 bg-slate-50 rounded-lg border border-slate-100 mt-6">
      <Search className="h-10 w-10 mx-auto text-slate-300 mb-3" />
      <p className="text-muted-foreground">No services match your search criteria.</p>
      <Button
        variant="link"
        onClick={clearSearch}
        className="mt-2"
      >
        Clear search
      </Button>
    </div>
  );
};

export default SearchResults;
