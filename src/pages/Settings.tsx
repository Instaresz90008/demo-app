
import React, { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import SettingsCard from '@/components/settings/SettingsCard';
import SettingsHeader from '@/components/settings/SettingsHeader';
import SettingsDrawer from '@/components/settings/SettingsDrawer';
import { settingsModulesData } from '@/data/settingsModules';
import { SettingsModule } from '@/types/settings';
import { cn } from '@/lib/utils';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeModule, setActiveModule] = useState<SettingsModule | null>(null);

  // Filter modules based on user plan and search
  const filteredModules = useMemo(() => {
    const userPlan = user?.planType || 'freemium';
    const planHierarchy = { freemium: 0, advanced: 1, professional: 2, enterprise: 3 };
    const userPlanLevel = planHierarchy[userPlan as keyof typeof planHierarchy] || 0;

    return settingsModulesData
      .map(module => ({
        ...module,
        locked: planHierarchy[module.planAccess as keyof typeof planHierarchy] > userPlanLevel,
        onClick: () => handleModuleClick(module)
      }))
      .filter(module => {
        const matchesSearch = module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            module.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !selectedCategory || module.category === selectedCategory;
        return matchesSearch && matchesCategory;
      });
  }, [searchQuery, selectedCategory, user?.planType]);

  const handleModuleClick = (module: any) => {
    if (module.locked) {
      // Show upgrade dialog or toast
      console.log(`Upgrade required for ${module.title}`);
      return;
    }
    setActiveModule(module);
  };

  const closeDrawer = () => {
    setActiveModule(null);
  };

  const renderModuleContent = () => {
    if (!activeModule) return null;

    // This would render specific module content based on the module type
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">{activeModule.icon}</div>
          <h3 className="text-lg font-semibold mb-2">{activeModule.title}</h3>
          <p className="text-muted-foreground mb-4">{activeModule.description}</p>
          <div className="bg-muted/50 rounded-lg p-6">
            <p className="text-sm text-muted-foreground">
              Configuration interface for {activeModule.title} will be implemented here.
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <SettingsHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <div className={cn(
        viewMode === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          : "space-y-4"
      )}>
        {filteredModules.map((module) => (
          <SettingsCard
            key={module.id}
            title={module.title}
            description={module.description}
            icon={module.icon}
            planAccess={module.planAccess as any}
            status={module.status as any}
            locked={module.locked}
            onClick={module.onClick}
            className={viewMode === 'list' ? "max-w-none" : ""}
          />
        ))}
      </div>

      {filteredModules.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold mb-2">No settings found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      <SettingsDrawer
        open={!!activeModule}
        onClose={closeDrawer}
        title={activeModule?.title || ''}
        description={activeModule?.description || ''}
      >
        {renderModuleContent()}
      </SettingsDrawer>
    </div>
  );
};

export default Settings;
