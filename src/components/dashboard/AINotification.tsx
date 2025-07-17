
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Bot, X } from 'lucide-react';

interface AINotificationProps {
  show: boolean;
  onHide: () => void;
}

const AINotification: React.FC<AINotificationProps> = ({ show, onHide }) => {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15, delay: 1.5 }}
      className="fixed bottom-6 right-6 flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-full shadow-lg z-40"
    >
      <Bot className="mr-2 h-5 w-5" />
      <span className="text-sm font-medium mr-2">Best time to open slots: Tomorrow 2-5 PM</span>
      <Button size="sm" variant="secondary" className="h-8 bg-white text-purple-700 hover:bg-gray-100 mr-2">
        Add Now
      </Button>
      <Button size="sm" variant="ghost" className="h-6 w-6 p-0 rounded-full hover:bg-white/20" onClick={onHide}>
        <X className="h-3 w-3" />
      </Button>
    </motion.div>
  );
};

export default AINotification;
