
import React from 'react';

interface TabNavigationProps {
  activeTab: 'services' | 'about' | 'reviews';
  onTabChange: (tab: 'services' | 'about' | 'reviews') => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex border-b">
      <button 
        className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${
          activeTab === 'services' 
            ? 'border-b-2 border-purple-600 text-purple-600' 
            : 'text-gray-500 hover:text-gray-800'
        }`}
        onClick={() => onTabChange('services')}
      >
        Services
      </button>
      <button 
        className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${
          activeTab === 'about' 
            ? 'border-b-2 border-purple-600 text-purple-600' 
            : 'text-gray-500 hover:text-gray-800'
        }`}
        onClick={() => onTabChange('about')}
      >
        About
      </button>
      <button 
        className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${
          activeTab === 'reviews' 
            ? 'border-b-2 border-purple-600 text-purple-600' 
            : 'text-gray-500 hover:text-gray-800'
        }`}
        onClick={() => onTabChange('reviews')}
      >
        Reviews
      </button>
    </div>
  );
};

export default TabNavigation;
