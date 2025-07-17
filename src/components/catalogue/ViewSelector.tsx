
import React from 'react';
import { LayoutGrid, Columns, List, View, Maximize, ImageIcon, LayoutList, Grid2x2, ChartGantt, Eye } from 'lucide-react';

interface ViewSelectorProps {
  currentView: number;
  onChange: (view: number) => void;
}

const ViewSelector: React.FC<ViewSelectorProps> = ({ currentView, onChange }) => {
  return (
    <div className="flex gap-1 border rounded-md p-0.5 bg-slate-50">
      {/* Original view options */}
      <button
        onClick={() => onChange(1)}
        className={`px-3 py-1 rounded-sm flex items-center gap-1.5 text-sm transition-colors ${
          currentView === 1 ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:bg-slate-100'
        }`}
        aria-label="Card Grid Layout"
      >
        <LayoutGrid className="h-4 w-4" />
        <span className="hidden sm:inline">Grid</span>
      </button>
      <button
        onClick={() => onChange(2)}
        className={`px-3 py-1 rounded-sm flex items-center gap-1.5 text-sm transition-colors ${
          currentView === 2 ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:bg-slate-100'
        }`}
        aria-label="Modern Panel Layout"
      >
        <Columns className="h-4 w-4" />
        <span className="hidden sm:inline">Panels</span>
      </button>
      <button
        onClick={() => onChange(3)}
        className={`px-3 py-1 rounded-sm flex items-center gap-1.5 text-sm transition-colors ${
          currentView === 3 ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:bg-slate-100'
        }`}
        aria-label="Minimalist List Layout"
      >
        <List className="h-4 w-4" />
        <span className="hidden sm:inline">List</span>
      </button>
      
      {/* Original CatLink view options */}
      <button
        onClick={() => onChange(4)}
        className={`px-3 py-1 rounded-sm flex items-center gap-1.5 text-sm transition-colors ${
          currentView === 4 ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:bg-slate-100'
        }`}
        aria-label="CatLink-1"
      >
        <View className="h-4 w-4" />
        <span className="hidden sm:inline">CatLink-1</span>
      </button>
      <button
        onClick={() => onChange(5)}
        className={`px-3 py-1 rounded-sm flex items-center gap-1.5 text-sm transition-colors ${
          currentView === 5 ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:bg-slate-100'
        }`}
        aria-label="CatLink-2"
      >
        <Maximize className="h-4 w-4" />
        <span className="hidden sm:inline">CatLink-2</span>
      </button>
      <button
        onClick={() => onChange(6)}
        className={`px-3 py-1 rounded-sm flex items-center gap-1.5 text-sm transition-colors ${
          currentView === 6 ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:bg-slate-100'
        }`}
        aria-label="CatLink-3"
      >
        <ImageIcon className="h-4 w-4" />
        <span className="hidden sm:inline">CatLink-3</span>
      </button>

      {/* New CatLink view options */}
      <button
        onClick={() => onChange(7)}
        className={`px-3 py-1 rounded-sm flex items-center gap-1.5 text-sm transition-colors ${
          currentView === 7 ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:bg-slate-100'
        }`}
        aria-label="CatLink-7"
      >
        <Eye className="h-4 w-4" />  {/* Changed to Eye icon for CatLink-7 */}
        <span className="hidden sm:inline">CatLink-7</span>
      </button>
      <button
        onClick={() => onChange(8)}
        className={`px-3 py-1 rounded-sm flex items-center gap-1.5 text-sm transition-colors ${
          currentView === 8 ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:bg-slate-100'
        }`}
        aria-label="CatLink-5"
      >
        <LayoutList className="h-4 w-4" />
        <span className="hidden sm:inline">CatLink-5</span>
      </button>
      <button
        onClick={() => onChange(9)}
        className={`px-3 py-1 rounded-sm flex items-center gap-1.5 text-sm transition-colors ${
          currentView === 9 ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:bg-slate-100'
        }`}
        aria-label="CatLink-6"
      >
        <ChartGantt className="h-4 w-4" />
        <span className="hidden sm:inline">CatLink-6</span>
      </button>
    </div>
  );
};

export default ViewSelector;
