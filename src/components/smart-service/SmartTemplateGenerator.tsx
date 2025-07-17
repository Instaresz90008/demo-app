
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Search, Filter, Globe } from 'lucide-react';
import { RootState, AppDispatch } from '@/store';
import { fetchTemplates, setFilters, clearFilters, setSelectedTemplate } from '@/store/slices/smartTemplatesSlice';
import { toast } from '@/hooks/use-toast';

const SmartTemplateGenerator: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { templates, loading, error, filters } = useSelector((state: RootState) => state.smartTemplates);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchTemplates({}));
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error]);

  const handleFilterChange = (key: string, value: string) => {
    if (value === 'all') {
      const newFilters = { ...filters };
      delete newFilters[key as keyof typeof filters];
      dispatch(setFilters(newFilters));
    } else {
      dispatch(setFilters({ [key]: value }));
    }
  };

  const clearAllFilters = () => {
    dispatch(clearFilters());
    setSearchTerm('');
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = !filters.industry || template.industry === filters.industry;
    const matchesSubcategory = !filters.subcategory || template.subcategory === filters.subcategory;
    const matchesBookingType = !filters.bookingType || template.booking_type_key === filters.bookingType;
    
    return matchesSearch && matchesIndustry && matchesSubcategory && matchesBookingType;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={filters.industry || 'all'} onValueChange={(value) => handleFilterChange('industry', value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              <SelectItem value="Fitness">Fitness</SelectItem>
              <SelectItem value="Education">Education</SelectItem>
              <SelectItem value="Healthcare">Healthcare</SelectItem>
              <SelectItem value="Technology">Technology</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.bookingType || 'all'} onValueChange={(value) => handleFilterChange('bookingType', value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Booking Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="1-on-1">1-on-1</SelectItem>
              <SelectItem value="group">Group</SelectItem>
              <SelectItem value="workshop">Workshop</SelectItem>
              <SelectItem value="course">Course</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={clearAllFilters}>
            <Filter className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>

      {/* Templates Grid */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Templates ({filteredTemplates.length})</TabsTrigger>
          <TabsTrigger value="freemium">Freemium</TabsTrigger>
          <TabsTrigger value="premium">Premium</TabsTrigger>
          <TabsTrigger value="default">Default</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Loading templates...</p>
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No templates found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTemplates.map((template) => (
                <Card key={template.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg mb-1">{template.title}</CardTitle>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {template.description}
                        </p>
                      </div>
                      <div className="flex gap-1 ml-2">
                        <Button variant="ghost" size="sm" onClick={() => dispatch(setSelectedTemplate(template))}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="secondary">{template.industry || 'General'}</Badge>
                        <Badge variant="outline">{template.booking_type_name}</Badge>
                        <Badge variant="outline">Digital</Badge>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {template.display_price ? 
                            `${template.display_price.label} ${template.display_price.amount} ${template.display_price.currency}` :
                            `${template.default_config.pricing_config?.price || 'Free'}`
                          }
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {template.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6">
        <Button size="lg" className="rounded-full h-14 w-14 shadow-lg">
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default SmartTemplateGenerator;
