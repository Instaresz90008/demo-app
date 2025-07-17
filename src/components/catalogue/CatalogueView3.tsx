
import React from 'react';
import { Service, Catalogue } from '@/hooks/useCatalogues';
import { Button } from '@/components/ui/button';
import { Copy, Link, ChevronRight, Clock, Calendar, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

interface CatalogueViewProps {
  catalogues: Catalogue[];
  services: Service[];
  onCopyLink: (slug: string) => void;
}

const CatalogueView3: React.FC<CatalogueViewProps> = ({ catalogues, services, onCopyLink }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-10">
      {catalogues.length > 0 ? (
        catalogues.map((catalogue, index) => {
          const catalogueServices = services.filter(s => catalogue.serviceIds.includes(s.id));
          const isEven = index % 2 === 0;
          
          return (
            <div key={catalogue.id} className="animate-fade-in">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-2xl font-semibold">{catalogue.name}</h3>
                  <p className="text-muted-foreground">
                    Created on {new Date(catalogue.createdAt).toLocaleDateString()}
                    <span className="mx-2">•</span>
                    {catalogueServices.length} services
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    variant="outline"
                    onClick={() => onCopyLink(catalogue.slug)}
                    className="border-slate-200"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Share Link
                  </Button>
                  <Button 
                    onClick={() => navigate(`/catalogue/${catalogue.slug}`)}
                    className={isEven ? "bg-gradient-to-r from-blue-600 to-indigo-600" : "bg-gradient-to-r from-purple-600 to-pink-600"}
                  >
                    <Link className="h-4 w-4 mr-2" />
                    View Catalogue
                  </Button>
                </div>
              </div>
              
              <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className={`px-6 py-5 ${isEven ? "bg-gradient-to-r from-blue-50 to-indigo-50" : "bg-gradient-to-r from-purple-50 to-pink-50"} border-b border-slate-100`}>
                  <div className="flex items-center justify-between">
                    <h4 className={`font-medium ${isEven ? "text-blue-800" : "text-purple-800"}`}>Service List</h4>
                    <span className={`text-sm ${isEven ? "text-blue-600" : "text-purple-600"}`}>
                      {catalogueServices.length} total services
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    {catalogueServices.map((service) => (
                      <div 
                        key={service.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg hover:bg-slate-50 transition-colors border border-slate-100"
                      >
                        <div>
                          <h5 className="font-medium mb-1">{service.name}</h5>
                          <p className="text-sm text-muted-foreground">{service.subtitle}</p>
                          <div className="flex flex-wrap gap-4 mt-2">
                            <div className="flex items-center text-xs text-slate-500">
                              <Clock className="h-3.5 w-3.5 mr-1.5" />
                              {service.duration} minutes
                            </div>
                            <div className="flex items-center text-xs text-slate-500">
                              <Calendar className="h-3.5 w-3.5 mr-1.5" />
                              {service.meetingType}
                            </div>
                            <div className="flex items-center text-xs text-slate-500">
                              <Users className="h-3.5 w-3.5 mr-1.5" />
                              {service.providerName}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          className={isEven ? "text-blue-600 bg-blue-50 hover:bg-blue-100" : "text-purple-600 bg-purple-50 hover:bg-purple-100"}
                          onClick={() => {
                            toast({
                              title: "Service details",
                              description: `${service.name} - ${service.duration} min ${service.meetingType}`,
                            });
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-10 text-center flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center mb-4">
            <Calendar className="h-8 w-8" />
          </div>
          <h3 className="text-2xl font-semibold text-slate-900 mb-2">Create your first catalogue</h3>
          <p className="text-slate-600 max-w-lg mx-auto mb-6">
            Group your services into catalogues to share with your clients. Each catalogue gets a unique link that you can share.
          </p>
          <Button 
            onClick={() => {}}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 group"
            size="lg"
          >
            Get Started
            <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default CatalogueView3;
