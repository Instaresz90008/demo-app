
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Link, ChevronRight } from 'lucide-react';
import { Service, Catalogue } from '@/hooks/catalogue';
import { useNavigate } from 'react-router-dom';

interface CatalogueViewProps {
  catalogues: Catalogue[];
  services: Service[];
  onCopyLink: (slug: string) => void;
}

const CatalogueView1: React.FC<CatalogueViewProps> = ({ catalogues, services, onCopyLink }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {catalogues.length > 0 ? (
        catalogues.map((catalogue) => {
          const catalogueServices = services.filter(s => catalogue.serviceIds.includes(s.id));
          return (
            <Card 
              key={catalogue.id} 
              className="border-blue-100/50 hover:border-primary/30 transition-all duration-300 hover:shadow-md group"
            >
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
                <CardTitle>{catalogue.name}</CardTitle>
                <CardDescription>{catalogue.serviceIds.length} services</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-2">
                  {catalogueServices.slice(0, 3).map((service) => (
                    <li key={service.id} className="flex items-center text-sm">
                      <div className="w-2 h-2 rounded-full bg-primary/70 mr-2"></div>
                      {service.name}
                      <span className="ml-auto text-xs text-muted-foreground">{service.duration} min</span>
                    </li>
                  ))}
                  {catalogueServices.length > 3 && (
                    <li className="text-sm italic text-muted-foreground pl-4">
                      + {catalogueServices.length - 3} more services
                    </li>
                  )}
                </ul>
              </CardContent>
              <CardFooter className="flex justify-between pt-2 pb-3 bg-slate-50/50 border-t">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onCopyLink(catalogue.slug)}
                  className="text-xs"
                >
                  <Copy className="h-3.5 w-3.5 mr-1.5" />
                  Copy Link
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate(`/catalogue/${catalogue.slug}`)}
                  className="text-xs group-hover:text-primary group-hover:bg-primary/10 transition-colors"
                >
                  <Link className="h-3.5 w-3.5 mr-1.5" />
                  View
                </Button>
              </CardFooter>
            </Card>
          );
        })
      ) : (
        <div className="col-span-3 text-center p-12 border border-dashed border-gray-200 rounded-lg bg-gray-50 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <Link className="h-6 w-6 text-primary/70" />
          </div>
          <h3 className="text-lg font-medium mb-1">No catalogues yet</h3>
          <p className="text-muted-foreground mb-4">Create your first catalogue to group your services into a shareable link.</p>
          <Button 
            onClick={() => {}} 
            className="group"
            size="sm"
          >
            <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
            Create Your First Catalogue
          </Button>
        </div>
      )}
    </div>
  );
};

export default CatalogueView1;
