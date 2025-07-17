
import React from 'react';
import { Service, Catalogue } from '@/hooks/useCatalogues';
import { Button } from '@/components/ui/button';
import { Calendar, Copy, Link, ChevronRight, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface CatalogueViewProps {
  catalogues: Catalogue[];
  services: Service[];
  onCopyLink: (slug: string) => void;
}

const CatalogueView2: React.FC<CatalogueViewProps> = ({ catalogues, services, onCopyLink }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {catalogues.length > 0 ? (
        catalogues.map((catalogue) => {
          const catalogueServices = services.filter(s => catalogue.serviceIds.includes(s.id));
          return (
            <div 
              key={catalogue.id}
              className="bg-white rounded-xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 py-4 px-6 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-white">{catalogue.name}</h3>
                  <p className="text-indigo-100 text-sm">{catalogueServices.length} services available</p>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="secondary"
                    size="sm"
                    onClick={() => onCopyLink(catalogue.slug)}
                    className="bg-white/20 text-white hover:bg-white/30 border-none"
                  >
                    <Copy className="h-3.5 w-3.5 mr-1.5" />
                    Copy Link
                  </Button>
                  <Button 
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate(`/catalogue/${catalogue.slug}`)}
                    className="bg-white text-indigo-600 hover:bg-indigo-50"
                  >
                    <Link className="h-3.5 w-3.5 mr-1.5" />
                    View
                  </Button>
                </div>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {catalogueServices.map((service) => (
                    <div 
                      key={service.id} 
                      className="bg-slate-50 rounded-lg p-3 hover:bg-slate-100 transition-colors border border-slate-100"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm">{service.name}</h4>
                        <Badge variant="outline" className="bg-indigo-50 text-indigo-600 text-[10px] h-5">
                          {service.meetingType}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{service.subtitle}</p>
                      <div className="flex items-center text-xs text-slate-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {service.duration} min
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center p-12 border-2 border-dashed border-indigo-200 rounded-xl bg-indigo-50 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-3">
            <Calendar className="h-7 w-7" />
          </div>
          <h3 className="text-xl font-medium text-indigo-900 mb-2">No catalogues yet</h3>
          <p className="text-indigo-700 mb-4 max-w-md">Create your first catalogue to organize and share your services with clients.</p>
          <Button 
            onClick={() => {}}
            className="bg-indigo-600 hover:bg-indigo-700 text-white group"
          >
            Create Your First Catalogue
            <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default CatalogueView2;
