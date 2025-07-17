
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Calendar, Clock, Link, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NextStepPromptProps {
  onAction: (action: string) => void;
  onReset: () => void;
  animationEnabled: boolean;
}

const NextStepPrompt = ({ onAction, onReset, animationEnabled }: NextStepPromptProps) => {
  const nextActions = [
    { icon: <Calendar className="h-3 w-3" />, text: "Check today's meetings", action: "What are my meetings today?" },
    { icon: <Clock className="h-3 w-3" />, text: "Block time tomorrow", action: "Block my calendar tomorrow morning" },
    { icon: <Link className="h-3 w-3" />, text: "Get booking link", action: "Send me my booking link" },
    { icon: <Settings className="h-3 w-3" />, text: "Set office hours", action: "Help me set my office hours" }
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-gradient-to-br from-slate-800/20 to-slate-900/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/10"
      >
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-4"
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mb-2"
          >
            <span className="text-2xl">🤔</span>
          </motion.div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            Want to do something else?
          </h3>
          <p className="text-sm text-muted-foreground">
            Here are some things I can help you with next
          </p>
        </motion.div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {nextActions.map((item, index) => (
            <motion.button
              key={item.text}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: 0.3 + index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onAction(item.action)}
              className="group flex items-center gap-3 p-3 bg-gradient-to-r from-purple-500/10 to-blue-500/10 hover:from-purple-500/20 hover:to-blue-500/20 rounded-xl transition-all duration-300 text-left"
            >
              <motion.div 
                className="text-purple-400 group-hover:text-purple-300 transition-colors"
                whileHover={{ rotate: 10 }}
                transition={{ duration: 0.2 }}
              >
                {item.icon}
              </motion.div>
              <span className="text-sm font-medium text-foreground group-hover:text-foreground/90 transition-colors">
                {item.text}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Reset Button */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Start fresh conversation
          </Button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NextStepPrompt;
