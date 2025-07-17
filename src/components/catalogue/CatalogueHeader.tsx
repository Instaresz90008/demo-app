
import React from 'react';
import { Input } from '@/components/ui/input';
import { X, Search, LayoutGrid, Columns, List, View, Maximize, ImageIcon, LayoutList, Grid2x2, ChartGantt, Eye } from 'lucide-react';

interface CatalogueHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  currentView: number;
  onViewChange: (view: number) => void;
}

const CatalogueHeader: React.FC<CatalogueHeaderProps> = ({ 
  searchTerm, 
  setSearchTerm, 
  currentView, 
  onViewChange 
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
      <div className="relative w-full sm:w-64 md:w-72">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 py-2 h-10 border-slate-300"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full hover:bg-slate-200 flex items-center justify-center"
            aria-label="Clear search"
          >
            <X className="h-3 w-3 text-muted-foreground" />
          </button>
        )}
      </div>
      
      <div className="flex gap-1 border rounded-md bg-slate-50 p-0.5 w-full sm:w-auto overflow-x-auto">
        {/* Original view options */}
        <button
          onClick={() => onViewChange(1)}
          className={`px-2.5 py-1.5 rounded flex items-center justify-center text-sm transition-colors ${
            currentView === 1 ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:bg-slate-100'
          }`}
          aria-label="Grid view"
          title="Card Grid Layout"
        >
          <LayoutGrid className="h-4 w-4" />
        </button>
        <button
          onClick={() => onViewChange(2)}
          className={`px-2.5 py-1.5 rounded flex items-center justify-center text-sm transition-colors ${
            currentView === 2 ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:bg-slate-100'
          }`}
          aria-label="Panels view"
          title="Modern Panel Layout"
        >
          <Columns className="h-4 w-4" />
        </button>
        <button
          onClick={() => onViewChange(3)}
          className={`px-2.5 py-1.5 rounded flex items-center justify-center text-sm transition-colors ${
            currentView === 3 ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:bg-slate-100'
          }`}
          aria-label="List view"
          title="Minimalist List Layout"
        >
          <List className="h-4 w-4" />
        </button>
        
        {/* Separator */}
        <div className="border-r mx-1 my-1.5"></div>
        
        {/* Original CatLink view options */}
        <button
          onClick={() => onViewChange(4)}
          className={`px-2.5 py-1.5 rounded flex items-center justify-center text-sm transition-colors ${
            currentView === 4 ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:bg-slate-100'
          }`}
          aria-label="CatLink 1"
          title="CatLink-1"
        >
          <View className="h-4 w-4" />
        </button>
        <button
          onClick={() => onViewChange(5)}
          className={`px-2.5 py-1.5 rounded flex items-center justify-center text-sm transition-colors ${
            currentView === 5 ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:bg-slate-100'
          }`}
          aria-label="CatLink 2"
          title="CatLink-2"
        >
          <Maximize className="h-4 w-4" />
        </button>
        <button
          onClick={() => onViewChange(6)}
          className={`px-2.5 py-1.5 rounded flex items-center justify-center text-sm transition-colors ${
            currentView === 6 ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:bg-slate-100'
          }`}
          aria-label="CatLink 3"
          title="CatLink-3"
        >
          <ImageIcon className="h-4 w-4" />
        </button>

        {/* Separator */}
        <div className="border-r mx-1 my-1.5"></div>
        
        {/* New CatLink view options */}
        <button
          onClick={() => onViewChange(7)}
          className={`px-2.5 py-1.5 rounded flex items-center justify-center text-sm transition-colors ${
            currentView === 7 ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:bg-slate-100'
          }`}
          aria-label="CatLink 7"
          title="CatLink-7"
        >
          <Eye className="h-4 w-4" />  {/* Changed to Eye icon for CatLink-7 */}
        </button>
        <button
          onClick={() => onViewChange(8)}
          className={`px-2.5 py-1.5 rounded flex items-center justify-center text-sm transition-colors ${
            currentView === 8 ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:bg-slate-100'
          }`}
          aria-label="CatLink 5"
          title="CatLink-5"
        >
          <LayoutList className="h-4 w-4" />
        </button>
        <button
          onClick={() => onViewChange(9)}
          className={`px-2.5 py-1.5 rounded flex items-center justify-center text-sm transition-colors ${
            currentView === 9 ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:bg-slate-100'
          }`}
          aria-label="CatLink 6"
          title="CatLink-6"
        >
          <ChartGantt className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default CatalogueHeader;
