
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Copy, LinkIcon, ExternalLink, Clock, DollarSign, Video, Phone, Users, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QrDialog } from "./QrDialog";
import { cn } from "@/lib/utils";

interface BookingLinkCardProps {
  id: string;
  service: string;
  link: string;
  createdAt: string;
  onCopy: () => void;
  copied: boolean;
  onPreview: () => void;
  duration?: number;
  cost?: number;
  meetingTypes?: { id: string; enabled: boolean; price?: string }[];
  style?: React.CSSProperties;
}

const getBookingUrl = (link: string) =>
  `${window.location.origin}/public-booking/${link}`;

const MeetingTypeIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'video': return <Video className="w-3.5 h-3.5" />;
    case 'phone': return <Phone className="w-3.5 h-3.5" />;
    case 'in-person': return <Users className="w-3.5 h-3.5" />;
    default: return null;
  }
};

const getMeetingTypeColor = (type: string) => {
  switch (type) {
    case 'video': return 'text-blue-700 bg-blue-50/80 border-blue-200/60 hover:bg-blue-100/80';
    case 'phone': return 'text-emerald-700 bg-emerald-50/80 border-emerald-200/60 hover:bg-emerald-100/80';
    case 'in-person': return 'text-purple-700 bg-purple-50/80 border-purple-200/60 hover:bg-purple-100/80';
    default: return 'text-slate-700 bg-slate-50/80 border-slate-200/60 hover:bg-slate-100/80';
  }
};

export const BookingLinkCard: React.FC<BookingLinkCardProps> = ({
  id, service, link, createdAt, onCopy, copied, onPreview, duration, cost, meetingTypes, style
}) => {
  const bookingUrl = getBookingUrl(link);
  const enabledTypes = meetingTypes?.filter(type => type.enabled) || [];
  const hasMultiplePrices = enabledTypes.some(type => type.price) && 
    enabledTypes.length > 1 && 
    new Set(enabledTypes.map(type => type.price)).size > 1;

  return (
    <div
      style={style}
      className="group relative bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-lg hover:bg-muted transition-all duration-500 hover:-translate-y-1 hover:scale-[1.02] animate-fade-in flex flex-col"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center group-hover:from-blue-200 group-hover:to-purple-200 transition-all duration-300">
            <LinkIcon className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 leading-tight truncate">
              {service}
            </h3>
            <Badge 
              variant="outline" 
              className="text-xs bg-slate-50/80 text-slate-600 border-slate-200/60 font-medium mt-1.5"
            >
              {new Date(createdAt).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </Badge>
          </div>
        </div>
      </div>
      
      {/* Service Details */}
      <div className="space-y-4 mb-5 flex-grow">
        <div className="flex items-center gap-4 text-sm">
          {duration && (
            <div className="flex items-center gap-2 text-slate-600">
              <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <span className="font-medium">{duration}min</span>
            </div>
          )}
          {cost && cost > 0 && !hasMultiplePrices && (
            <div className="flex items-center gap-2 text-slate-600">
              <div className="w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center">
                <DollarSign className="w-3.5 h-3.5 text-green-600" />
              </div>
              <span className="font-medium">${cost}</span>
            </div>
          )}
        </div>

        {enabledTypes.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Meeting Options
            </span>
            <div className="space-y-2">
              {enabledTypes.map(type => (
                <div
                  key={type.id}
                  className={cn(
                    "flex items-center justify-between p-2.5 rounded-lg border transition-all duration-200",
                    getMeetingTypeColor(type.id)
                  )}
                >
                  <div className="flex items-center gap-2">
                    <MeetingTypeIcon type={type.id} />
                    <span className="text-xs font-medium capitalize">
                      {type.id === 'in-person' ? 'In-Person' : type.id}
                    </span>
                  </div>
                  {type.price && (
                    <span className="text-xs font-bold">
                      ${type.price}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Link Preview */}
      <div className="bg-slate-50/60 rounded-xl p-3 mb-4 border border-slate-200/40">
        <div className="flex items-center gap-2 mb-2">
          <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Booking Link
          </span>
        </div>
        <div className="text-xs text-slate-600 font-mono bg-white/80 p-2 rounded border break-all">
          {bookingUrl}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
        <QrDialog url={bookingUrl} />
        <Button
          onClick={onCopy}
          variant="outline"
          size="sm"
          className="bg-white/80 hover:bg-white border-slate-200/60 text-slate-700 hover:text-slate-900 font-medium"
        >
          {copied ? (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </>
          )}
        </Button>
        <Button
          onClick={onPreview}
          size="sm"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-sm"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Preview
        </Button>
      </div>
    </div>
  );
};
