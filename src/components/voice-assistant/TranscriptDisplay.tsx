
import { Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TranscriptDisplayProps {
  transcript: string;
  animationEnabled: boolean;
}

const TranscriptDisplay = ({ transcript, animationEnabled }: TranscriptDisplayProps) => {
  if (!transcript) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="mb-6 p-4 bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-md rounded-2xl border border-purple-500/20"
      >
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2 mb-3"
        >
          <motion.div
            animate={animationEnabled ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Volume2 className="h-4 w-4 text-purple-400" />
          </motion.div>
          <h2 className="font-medium text-sm text-purple-300">You said:</h2>
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-foreground pl-6 font-medium text-base leading-relaxed"
        >
          "{transcript}"
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
};

export default TranscriptDisplay;
