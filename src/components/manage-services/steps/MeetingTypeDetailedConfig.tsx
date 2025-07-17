
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Video, Phone, MapPin, DollarSign, Users, Globe } from "lucide-react";
import { MeetingTypeConfig } from "../types/meetingTypes";

interface Props {
  typeId: string;
  config: MeetingTypeConfig;
  collectPayment: boolean;
  serviceType?: string;
  onUpdate: (typeId: string, field: string, value: string | boolean) => void;
  errors: Record<string, string>;
}

const COUNTRY_CODES = [
  { code: '+1', country: 'US/Canada', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+86', country: 'China', flag: '🇨🇳' },
];

const MeetingTypeDetailedConfig: React.FC<Props> = ({
  typeId,
  config,
  collectPayment,
  serviceType = "one-to-one",
  onUpdate,
  errors
}) => {
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [selectedCountryCode, setSelectedCountryCode] = useState('+1');

  useEffect(() => {
    // Auto-fill country code based on timezone (simplified)
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timezone.includes('America')) {
      setSelectedCountryCode('+1');
    } else if (timezone.includes('Europe/London')) {
      setSelectedCountryCode('+44');
    } else if (timezone.includes('Asia/Kolkata')) {
      setSelectedCountryCode('+91');
    }
  }, []);

  const validateField = (field: string, value: string) => {
    const errors: Record<string, string> = {};

    switch (field) {
      case 'price':
        const price = parseFloat(value);
        if (isNaN(price) || price < 0) {
          errors.price = 'Price must be a valid positive number';
        } else if (price > 10000) {
          errors.price = 'Price cannot exceed $10,000';
        }
        break;

      case 'maxParticipants':
        const participants = parseInt(value);
        if (isNaN(participants) || participants < 1) {
          errors.maxParticipants = 'Must have at least 1 participant';
        } else if (participants > 1000) {
          errors.maxParticipants = 'Cannot exceed 1000 participants';
        }
        break;

      case 'phoneNumber':
        if (typeId === 'phone' && value && !/^\+?[\d\s\-\(\)]+$/.test(value)) {
          errors.phoneNumber = 'Please enter a valid phone number';
        }
        break;

      case 'meetingLink':
        if (typeId === 'video' && value && !/^https?:\/\/.+/.test(value)) {
          errors.meetingLink = 'Please enter a valid URL starting with http:// or https://';
        }
        break;

      case 'refreshments':
        if (value.length > 200) {
          errors.refreshments = 'Refreshments description cannot exceed 200 characters';
        }
        break;
    }

    setValidationErrors(prev => ({ ...prev, [field]: errors[field] || '' }));
    return Object.keys(errors).length === 0;
  };

  const handleFieldUpdate = (field: string, value: string | boolean) => {
    if (typeof value === 'string') {
      validateField(field, value);
    }
    onUpdate(typeId, field, value);
  };

  const getTypeIcon = () => {
    switch (typeId) {
      case 'video': return <Video className="h-5 w-5 text-blue-500" />;
      case 'phone': return <Phone className="h-5 w-5 text-green-500" />;
      case 'in-person': return <MapPin className="h-5 w-5 text-purple-500" />;
      default: return <Video className="h-5 w-5" />;
    }
  };

  const getTypeTitle = () => {
    switch (typeId) {
      case 'video': return 'Video Meeting';
      case 'phone': return 'Phone Call';
      case 'in-person': return 'In-Person Meeting';
      default: return 'Meeting';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        {getTypeIcon()}
        <h2 className="text-2xl font-bold">{getTypeTitle()} Configuration</h2>
        <Badge variant="outline" className="ml-auto">
          {config.enabled ? 'Enabled' : 'Disabled'}
        </Badge>
      </div>

      {/* Pricing Section */}
      {collectPayment && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Pricing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="price">Price per session ($)</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0.00"
                  value={config.price}
                  onChange={(e) => handleFieldUpdate('price', e.target.value)}
                  className={validationErrors.price ? 'border-red-500' : ''}
                  step="0.01"
                  min="0"
                  max="10000"
                />
                {validationErrors.price && (
                  <div className="flex items-center gap-1 text-sm text-red-600 mt-1">
                    <AlertCircle className="h-4 w-4" />
                    {validationErrors.price}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Participants Section - Only show for group services */}
      {serviceType !== 'one-to-one' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Participant Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="maxParticipants">Maximum Participants</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  value={config.maxParticipants}
                  onChange={(e) => handleFieldUpdate('maxParticipants', e.target.value)}
                  className={validationErrors.maxParticipants ? 'border-red-500' : ''}
                  min="1"
                  max="1000"
                />
                {validationErrors.maxParticipants && (
                  <div className="flex items-center gap-1 text-sm text-red-600 mt-1">
                    <AlertCircle className="h-4 w-4" />
                    {validationErrors.maxParticipants}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Meeting-Specific Configuration */}
      {typeId === 'video' && (
        <Card>
          <CardHeader>
            <CardTitle>Video Meeting Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="meetingLink">Meeting Link</Label>
              <Input
                id="meetingLink"
                placeholder="https://zoom.us/j/..."
                value={config.meetingLink}
                onChange={(e) => handleFieldUpdate('meetingLink', e.target.value)}
                className={validationErrors.meetingLink ? 'border-red-500' : ''}
              />
              {validationErrors.meetingLink && (
                <div className="flex items-center gap-1 text-sm text-red-600 mt-1">
                  <AlertCircle className="h-4 w-4" />
                  {validationErrors.meetingLink}
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="meetingPasscode">Meeting Passcode (Optional)</Label>
              <Input
                id="meetingPasscode"
                placeholder="Enter passcode"
                value={config.meetingPasscode}
                onChange={(e) => handleFieldUpdate('meetingPasscode', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {typeId === 'phone' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Phone Call Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <div className="w-32">
                <Label>Country Code</Label>
                <Select value={selectedCountryCode} onValueChange={setSelectedCountryCode}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRY_CODES.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        <span className="flex items-center gap-2">
                          <span>{country.flag}</span>
                          <span>{country.code}</span>
                          <span className="text-xs text-muted-foreground">{country.country}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  placeholder="(555) 123-4567"
                  value={config.phoneNumber}
                  onChange={(e) => handleFieldUpdate('phoneNumber', e.target.value)}
                  className={validationErrors.phoneNumber ? 'border-red-500' : ''}
                />
                {validationErrors.phoneNumber && (
                  <div className="flex items-center gap-1 text-sm text-red-600 mt-1">
                    <AlertCircle className="h-4 w-4" />
                    {validationErrors.phoneNumber}
                  </div>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="bridgeNumber">Bridge Number (Optional)</Label>
              <Input
                id="bridgeNumber"
                placeholder="Conference bridge number"
                value={config.bridgeNumber}
                onChange={(e) => handleFieldUpdate('bridgeNumber', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {typeId === 'in-person' && (
        <Card>
          <CardHeader>
            <CardTitle>In-Person Meeting Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  placeholder="123 Main Street"
                  value={config.location?.split(', ')[0] || ''}
                  onChange={(e) => {
                    const parts = config.location?.split(', ') || ['', '', '', ''];
                    parts[0] = e.target.value;
                    handleFieldUpdate('location', parts.join(', '));
                  }}
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="New York"
                  value={config.location?.split(', ')[1] || ''}
                  onChange={(e) => {
                    const parts = config.location?.split(', ') || ['', '', '', ''];
                    parts[1] = e.target.value;
                    handleFieldUpdate('location', parts.join(', '));
                  }}
                />
              </div>
              <div>
                <Label htmlFor="state">State/Province</Label>
                <Input
                  id="state"
                  placeholder="NY"
                  value={config.location?.split(', ')[2] || ''}
                  onChange={(e) => {
                    const parts = config.location?.split(', ') || ['', '', '', ''];
                    parts[2] = e.target.value;
                    handleFieldUpdate('location', parts.join(', '));
                  }}
                />
              </div>
              <div>
                <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                <Input
                  id="zipCode"
                  placeholder="10001"
                  value={config.location?.split(', ')[3] || ''}
                  onChange={(e) => {
                    const parts = config.location?.split(', ') || ['', '', '', ''];
                    parts[3] = e.target.value;
                    handleFieldUpdate('location', parts.join(', '));
                  }}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="parking"
                checked={config.parkingAvailable}
                onCheckedChange={(checked) => handleFieldUpdate('parkingAvailable', checked)}
              />
              <Label htmlFor="parking">Parking Available</Label>
            </div>

            <div>
              <Label htmlFor="refreshments">Refreshments (Optional)</Label>
              <Textarea
                id="refreshments"
                placeholder="Describe any refreshments provided..."
                value={config.refreshments}
                onChange={(e) => handleFieldUpdate('refreshments', e.target.value)}
                className={validationErrors.refreshments ? 'border-red-500' : ''}
                maxLength={200}
              />
              <div className="flex justify-between items-center mt-1">
                {validationErrors.refreshments && (
                  <div className="flex items-center gap-1 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    {validationErrors.refreshments}
                  </div>
                )}
                <span className="text-xs text-muted-foreground ml-auto">
                  {(config.refreshments || '').length}/200
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MeetingTypeDetailedConfig;
