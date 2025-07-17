
import React, { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Command, CommandInput, CommandItem, CommandList, CommandEmpty } from '@/components/ui/command';
import { useFeature } from '@/hooks/useFeature';
import { useNavigate } from 'react-router-dom';
import useDebounce from '@/hooks/useDebounce';
import { useAccessControl } from '@/context/AccessControlContext';

interface SearchItem {
  label: string;
  value: string;
  icon?: React.ReactNode;
  category?: string;
  path?: string;
  external?: boolean;
  onSelect?: () => void;
  requiredRoles?: string[];
}

interface GlobalSearchBarProps {
  data: SearchItem[];
  placeholder?: string;
  maxResults?: number;
  debounceDelay?: number;
  minQueryLength?: number;
  onSearchAnalytics?: (query: string, results: SearchItem[]) => void;
  onCategorySearch?: (category: string, query: string) => void;
}

export const GlobalSearchBar: React.FC<GlobalSearchBarProps> = ({
  data,
  placeholder = 'Search anything...',
  maxResults = 10,
  debounceDelay = 250,
  minQueryLength = 2,
  onSearchAnalytics,
  onCategorySearch,
}) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, debounceDelay);
  const navigate = useNavigate();
  const { getCurrentUser } = useAccessControl();
  const { canAccess } = useFeature();
  
  const currentUser = getCurrentUser();
  const userRoles = currentUser?.roles || [];

  const filteredData = useMemo(() => {
    if (debouncedQuery.length < minQueryLength) return [];
    const lower = debouncedQuery.toLowerCase();

    const results = data.filter((item) => {
      const matches = item.label.toLowerCase().includes(lower);
      const hasRole = !item.requiredRoles || item.requiredRoles.some((r) => userRoles.includes(r));
      return matches && hasRole;
    });

    const sorted = results.sort((a, b) => a.label.localeCompare(b.label));
    return sorted.slice(0, maxResults);
  }, [debouncedQuery, data, maxResults, userRoles, minQueryLength]);

  useEffect(() => {
    if (filteredData.length > 0 && onSearchAnalytics) {
      onSearchAnalytics(query, filteredData);
    }
  }, [filteredData, onSearchAnalytics, query]);

  const handleSelect = (item: SearchItem) => {
    if (item.onSelect) return item.onSelect();
    if (item.external && item.path) return window.open(item.path, '_blank');
    if (item.category && onCategorySearch) return onCategorySearch(item.category, item.value);
    if (item.path) return navigate(item.path);
  };

  return (
    <Command className="rounded-lg border bg-background shadow-md w-full max-w-xl">
      <CommandInput 
        value={query}
        onValueChange={setQuery}
        placeholder={placeholder}
      />
      <CommandList className="max-h-80 overflow-y-auto">
        <CommandEmpty>No results found.</CommandEmpty>
        {filteredData.map((item) => (
          <CommandItem key={item.value} onSelect={() => handleSelect(item)} className="flex gap-2">
            {item.icon && <span className="text-muted-foreground">{item.icon}</span>}
            <div className="flex flex-col">
              <span className="font-medium">{item.label}</span>
              {item.category && <span className="text-xs text-muted-foreground">{item.category}</span>}
            </div>
          </CommandItem>
        ))}
      </CommandList>
    </Command>
  );
};

export default GlobalSearchBar;
