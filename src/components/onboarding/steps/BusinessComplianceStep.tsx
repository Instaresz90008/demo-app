
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Building, FileText, Clock, ArrowRight } from 'lucide-react';
import { updateBusinessCompliance, nextStep } from '@/store/slices/onboardingSlice';

const BusinessComplianceStep: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data } = useAppSelector(state => state.onboarding);
  
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    pan: '',
    gstin: '',
    cin: '',
    address: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    dispatch(updateBusinessCompliance(formData));
    dispatch(nextStep());
  };

  const isFormValid = formData.businessName && formData.businessType && formData.pan;

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Business Verification Setup
        </h2>
        <p className="text-lg text-gray-600">
          Help us verify your business to unlock all features and ensure compliance
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Business Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="businessName">Business Name *</Label>
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  placeholder="Enter your registered business name"
                />
              </div>

              <div>
                <Label htmlFor="businessType">Business Type *</Label>
                <Select onValueChange={(value) => handleInputChange('businessType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="proprietorship">Sole Proprietorship</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                    <SelectItem value="llp">Limited Liability Partnership</SelectItem>
                    <SelectItem value="pvt-ltd">Private Limited</SelectItem>
                    <SelectItem value="public-ltd">Public Limited</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pan">PAN Number *</Label>
                  <Input
                    id="pan"
                    value={formData.pan}
                    onChange={(e) => handleInputChange('pan', e.target.value)}
                    placeholder="ABCDE1234F"
                    maxLength={10}
                  />
                </div>

                <div>
                  <Label htmlFor="gstin">GSTIN (Optional)</Label>
                  <Input
                    id="gstin"
                    value={formData.gstin}
                    onChange={(e) => handleInputChange('gstin', e.target.value)}
                    placeholder="22ABCDE1234F1Z5"
                    maxLength={15}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="cin">CIN (For Companies)</Label>
                <Input
                  id="cin"
                  value={formData.cin}
                  onChange={(e) => handleInputChange('cin', e.target.value)}
                  placeholder="U12345KA2020PTC123456"
                />
              </div>

              <div>
                <Label htmlFor="address">Registered Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter your registered business address"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Section */}
        <div>
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Verification Timeline</h3>
              </div>
              
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-blue-900">Document Review</p>
                    <p className="text-blue-700">1-2 business days</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-blue-900">Identity Verification</p>
                    <p className="text-blue-700">Automated checks</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-300 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-blue-900">Final Approval</p>
                    <p className="text-blue-700">Email notification</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-3 bg-green-100 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 text-green-800">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm font-medium">You can continue setup while we verify!</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <Button
          onClick={handleSubmit}
          disabled={!isFormValid}
          size="lg"
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg disabled:opacity-50"
        >
          Submit for Verification
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </motion.div>
  );
};

export default BusinessComplianceStep;
