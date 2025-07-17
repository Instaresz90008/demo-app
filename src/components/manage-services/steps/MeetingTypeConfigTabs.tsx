
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Video, Phone, MapPin, DollarSign, Users, Key, Hash, Mic, Car } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MeetingTypeConfig } from '../types/meetingTypes';

interface Props {
  enabledTypes: MeetingTypeConfig[];
  collectPayment: boolean;
  serviceType: string;
  handleUpdateTypeConfig: (typeId: string, field: string, value: string | boolean) => void;
}

const renderField = (
  label: string,
  placeholder: string,
  value: string | undefined,
  onChange: (v: string) => void,
  type: string = "text",
  icon?: React.ReactNode,
  helper?: string,
  disabled?: boolean,
  min?: string,
  max?: string
) => (
  <div className="mb-4 group relative">
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">{label}</label>
    <div className={cn("flex items-center relative", disabled && "opacity-60 pointer-events-none")}>
      {icon && <span className="absolute left-3 z-10 text-gray-500 dark:text-gray-400">{icon}</span>}
      <Input
        type={type}
        value={value || ""}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "transition-all duration-200 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600",
          icon ? "pl-10" : "",
          "h-11 text-base border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600"
        )}
        min={min}
        max={max}
        disabled={disabled}
      />
    </div>
    {helper && (
      <span className="text-xs text-gray-500 dark:text-gray-400 px-1 mt-1 block">{helper}</span>
    )}
  </div>
);

const MeetingTypeConfigTabs: React.FC<Props> = ({
  enabledTypes,
  collectPayment,
  serviceType,
  handleUpdateTypeConfig
}) => {
  if (enabledTypes.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
      <Tabs defaultValue={enabledTypes[0]?.id} className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 h-auto p-1 bg-gray-100 dark:bg-gray-700 rounded-t-2xl">
          {enabledTypes.map(type => {
            const getIcon = (id: string) => {
              switch (id) {
                case 'video': return <Video className="w-4 h-4" />;
                case 'phone': return <Phone className="w-4 h-4" />;
                case 'in-person': return <MapPin className="w-4 h-4" />;
                default: return null;
              }
            };

            return (
              <TabsTrigger
                key={type.id}
                value={type.id}
                className="flex items-center gap-2 py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
              >
                {getIcon(type.id)}
                <span className="capitalize font-medium">{type.id.replace('-', ' ')}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {enabledTypes.map(type => (
          <TabsContent key={type.id} value={type.id} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Price Configuration */}
              {collectPayment && (
                  <div>
                    {renderField(
                      "Price",
                      "Enter price (required)",
                      type.price,
                      (value) => handleUpdateTypeConfig(type.id, 'price', value),
                      "number",
                      <DollarSign className="w-4 h-4" />,
                      "Price for this meeting type (required)",
                      false,
                      "0.01",
                      "10000"
                    )}
                  </div>
              )}

              {/* Type-specific fields */}
              {type.id === 'video' && (
                <>
                  <div>
                    {renderField(
                      "Meeting Link",
                      "https://zoom.us/j/...",
                      type.meetingLink,
                      (value) => handleUpdateTypeConfig(type.id, 'meetingLink', value),
                      "url",
                      <Video className="w-4 h-4" />,
                      "Zoom, Teams, or other video platform link"
                    )}
                  </div>
                  {/* Show max participants only for group services */}
                  {serviceType !== 'one-to-one' && (
                    <div>
                      {renderField(
                        "Max Participants",
                        "10",
                        type.maxParticipants,
                        (value) => handleUpdateTypeConfig(type.id, 'maxParticipants', value),
                        "number",
                        <Users className="w-4 h-4" />,
                        "Maximum number of participants",
                        false,
                        "1",
                        "100"
                      )}
                    </div>
                  )}
                  <div>
                    {renderField(
                      "Meeting Passcode",
                      "123456",
                      type.meetingPasscode,
                      (value) => handleUpdateTypeConfig(type.id, 'meetingPasscode', value),
                      "text",
                      <Key className="w-4 h-4" />,
                      "Optional passcode for the meeting"
                    )}
                  </div>
                  <div>
                    {renderField(
                      "Bridge Number",
                      "+1-555-123-4567",
                      type.bridgeNumber,
                      (value) => handleUpdateTypeConfig(type.id, 'bridgeNumber', value),
                      "tel",
                      <Hash className="w-4 h-4" />,
                      "Dial-in number for audio participants"
                    )}
                  </div>
                </>
              )}

              {type.id === 'phone' && (
                <>
                  <div>
                    {renderField(
                      "Phone Number",
                      "+1-555-123-4567",
                      type.phoneNumber,
                      (value) => handleUpdateTypeConfig(type.id, 'phoneNumber', value),
                      "tel",
                      <Phone className="w-4 h-4" />,
                      "Phone number for audio calls"
                    )}
                  </div>
                  <div>
                    {renderField(
                      "Bridge Number",
                      "+1-555-123-4567",
                      type.bridgeNumber,
                      (value) => handleUpdateTypeConfig(type.id, 'bridgeNumber', value),
                      "tel",
                      <Hash className="w-4 h-4" />,
                      "Conference bridge number"
                    )}
                  </div>
                  {/* Show max participants only for group services */}
                  {serviceType !== 'one-to-one' && (
                    <div>
                      {renderField(
                        "Max Participants",
                        "5",
                        type.maxParticipants,
                        (value) => handleUpdateTypeConfig(type.id, 'maxParticipants', value),
                        "number",
                        <Users className="w-4 h-4" />,
                        "Maximum conference participants",
                        false,
                        "1",
                        "50"
                      )}
                    </div>
                  )}
                </>
              )}

              {type.id === 'in-person' && (
                <>
                  <div>
                    {renderField(
                      "Meeting Location",
                      "123 Business Ave, Suite 100, City, State 12345",
                      type.location,
                      (value) => handleUpdateTypeConfig(type.id, 'location', value),
                      "text",
                      <MapPin className="w-4 h-4" />,
                      "Full address for in-person meetings"
                    )}
                  </div>
                  {/* Show max participants only for group services */}
                  {serviceType !== 'one-to-one' && (
                    <div>
                      {renderField(
                        "Max Participants",
                        "8",
                        type.maxParticipants,
                        (value) => handleUpdateTypeConfig(type.id, 'maxParticipants', value),
                        "number",
                        <Users className="w-4 h-4" />,
                        "Room capacity",
                        false,
                        "1",
                        "50"
                      )}
                    </div>
                  )}
                  <div>
                    {renderField(
                      "Refreshments",
                      "Coffee, tea, water",
                      type.refreshments,
                      (value) => handleUpdateTypeConfig(type.id, 'refreshments', value),
                      "text",
                      <Mic className="w-4 h-4" />,
                      "Available refreshments during meeting"
                    )}
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">Parking Available</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Free parking available on-site</p>
                    </div>
                    <Switch
                      checked={type.parkingAvailable}
                      onCheckedChange={(checked) => handleUpdateTypeConfig(type.id, 'parkingAvailable', checked)}
                    />
                  </div>
                </>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default MeetingTypeConfigTabs;
