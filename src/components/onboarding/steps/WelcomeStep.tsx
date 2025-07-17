
import React from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch } from '@/store/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Clock, ArrowRight } from 'lucide-react';
import { nextStep } from '@/store/slices/onboardingSlice';

const WelcomeStep: React.FC = () => {
  const dispatch = useAppDispatch();

  const handleGetStarted = () => {
    dispatch(nextStep());
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="text-center max-w-2xl mx-auto"
    >
      {/* Main Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5, type: "spring", stiffness: 200 }}
        className="flex justify-center mb-8"
      >
        <div className="relative">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
        </div>
      </motion.div>

      {/* Welcome Text */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="space-y-6 mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-900">
          Welcome to JusBook! 🎉
        </h1>
        <p className="text-xl text-gray-600">
          Ready to set up your first service in under 90 seconds?
        </p>
        
        {/* Time Indicator */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium"
        >
          <Clock className="w-4 h-4" />
          <span>Takes less than 90 seconds</span>
        </motion.div>
      </motion.div>

      {/* Feature Preview Cards */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      >
        {[
          { icon: "🎯", text: "Smart Setup" },
          { icon: "💰", text: "Pricing Made Easy" },
          { icon: "🚀", text: "Go Live Instantly" }
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
            className="flex items-center justify-center space-x-2 bg-gray-50 p-4 rounded-lg border border-gray-200"
          >
            <span className="text-lg">{feature.icon}</span>
            <span className="text-gray-700 font-medium">{feature.text}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Action Button */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="space-y-4"
      >
        <Button
          onClick={handleGetStarted}
          size="lg"
          className="w-full max-w-md h-14 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <span>Let's Get Started</span>
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </motion.div>

      {/* Motivational Quote */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.5 }}
        className="text-sm text-gray-500 mt-6 italic"
      >
        "The best time to start was yesterday. The second best time is now." 🌟
      </motion.p>
    </motion.div>
  );
};

export default WelcomeStep;
