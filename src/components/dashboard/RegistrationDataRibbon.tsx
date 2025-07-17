
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Building, Calendar, Clock, Link } from 'lucide-react';

interface RegistrationDataRibbonProps {
  userData?: {
    userType: 'individual' | 'business';
    email: string;
    onboardingData?: any;
    profileData?: any;
    serviceSetupData?: any;
  };
}

export const RegistrationDataRibbon: React.FC<RegistrationDataRibbonProps> = ({ userData }) => {
  if (!userData) return null;

  const { userType, email, onboardingData, profileData, serviceSetupData } = userData;

  return (
    <div className="mb-6 space-y-4">
      {/* Welcome Banner */}
      <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Welcome, {profileData?.displayName || 'New User'}! 🎉
              </h2>
              <p className="text-purple-100">
                Your account is ready! Here's what we've set up for you:
              </p>
            </div>
            <Badge variant="secondary" className="text-purple-800 bg-white">
              {userType === 'individual' ? 'Individual' : 'Business'} Account
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Registration Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Profile Card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Profile Setup</h3>
                <p className="text-sm text-muted-foreground">Complete ✅</p>
              </div>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-3 h-3" />
                <span>{email}</span>
              </div>
              {userType === 'individual' && onboardingData?.industry && (
                <div className="flex items-center gap-2">
                  <Building className="w-3 h-3" />
                  <span className="capitalize">{onboardingData.industry}</span>
                </div>
              )}
              {userType === 'business' && onboardingData?.businessName && (
                <div className="flex items-center gap-2">
                  <Building className="w-3 h-3" />
                  <span>{onboardingData.businessName}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Service Card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Service Created</h3>
                <p className="text-sm text-muted-foreground">Ready to book ✅</p>
              </div>
            </div>
            {serviceSetupData?.serviceData && (
              <div className="space-y-1 text-sm">
                <p className="font-medium">{serviceSetupData.serviceData.title}</p>
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  <span>{serviceSetupData.serviceData.duration} minutes</span>
                </div>
                {serviceSetupData.serviceData.pricing && (
                  <p className="text-green-600 font-medium">
                    ${serviceSetupData.serviceData.pricing}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Booking Link Card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Link className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">Booking Link</h3>
                <p className="text-sm text-muted-foreground">Live & Shareable ✅</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-muted-foreground">Your clients can book at:</p>
              <div className="bg-gray-50 p-2 rounded text-xs font-mono break-all">
                jusbook.com/new-user
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Availability Summary */}
      {serviceSetupData?.slotsData && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold">Availability Set</h3>
                <p className="text-sm text-muted-foreground">
                  {serviceSetupData.slotsData.startTime} - {serviceSetupData.slotsData.endTime}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {serviceSetupData.slotsData.workingDays?.map((day: string) => (
                <Badge key={day} variant="outline" className="text-xs capitalize">
                  {day.slice(0, 3)}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
