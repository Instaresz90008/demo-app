
import React from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { User, Users, Building2, ArrowRight } from 'lucide-react';
import { setUserType, nextStep } from '@/store/slices/onboardingSlice';

const UserIntentStep: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data } = useAppSelector(state => state.onboarding);

  const handleUserTypeSelect = (userType: 'solo' | 'team' | 'business') => {
    dispatch(setUserType(userType));
    dispatch(nextStep());
  };

  const userTypes = [
    {
      type: 'solo' as const,
      icon: User,
      title: 'Myself',
      subtitle: 'Personal services & coaching',
      description: 'Perfect for freelancers, coaches, and solo professionals',
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      type: 'team' as const,
      icon: Users,
      title: 'My Team',
      subtitle: 'Small team collaboration',
      description: 'Ideal for small teams and agencies',
      color: 'bg-green-50 border-green-200 hover:bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      type: 'business' as const,
      icon: Building2,
      title: 'My Business',
      subtitle: 'Enterprise & compliance',
      description: 'Full business features with compliance tracking',
      color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
      iconColor: 'text-purple-600'
    }
  ];

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Who are you setting this up for?
        </h2>
        <p className="text-lg text-gray-600">
          This helps us customize your experience and unlock the right features
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {userTypes.map((userType, index) => {
          const IconComponent = userType.icon;
          const isSelected = data.userType === userType.type;
          
          return (
            <motion.div
              key={userType.type}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card 
                className={`cursor-pointer transition-all duration-200 h-full ${userType.color} ${
                  isSelected ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'
                }`}
                onClick={() => handleUserTypeSelect(userType.type)}
              >
                <CardContent className="p-6 text-center">
                  <div className="mb-4">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                      <IconComponent className={`w-8 h-8 ${userType.iconColor}`} />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {userType.title}
                  </h3>
                  
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    {userType.subtitle}
                  </p>
                  
                  <p className="text-xs text-gray-600 mb-4">
                    {userType.description}
                  </p>

                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center justify-center gap-2 text-blue-600 font-medium"
                    >
                      <span>Selected</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {data.userType && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-8"
        >
          <Button
            onClick={() => dispatch(nextStep())}
            size="lg"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
          >
            Continue with {data.userType === 'solo' ? 'Personal' : data.userType === 'team' ? 'Team' : 'Business'} Setup
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default UserIntentStep;
