
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="relative flex-1">
      <label htmlFor="search-services" className="sr-only">
        Search services by name or description
      </label>
      <Search 
        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-400" 
        aria-hidden="true"
      />
      <Input
        id="search-services"
        className="pl-9 bg-purple-600/8 border-purple-500/30 text-purple-200 placeholder:text-purple-400 focus:bg-purple-600/15 focus:border-purple-400 focus:shadow-purple-500/20"
        placeholder="Search services by name or description..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-describedby="search-help"
      />
      <div id="search-help" className="sr-only">
        Type to search through available services
      </div>
    </div>
  );
};

export default SearchBar;
