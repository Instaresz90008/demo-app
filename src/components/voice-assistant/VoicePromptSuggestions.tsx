
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Calendar, Link, Settings } from "lucide-react";

interface VoicePromptSuggestionsProps {
  onPromptClick: (prompt: string) => void;
}

const VoicePromptSuggestions = ({ onPromptClick }: VoicePromptSuggestionsProps) => {
  const [currentSet, setCurrentSet] = useState(0);

  const promptSets = [
    [
      { icon: <Calendar className="h-3 w-3" />, text: "What are my meetings today?", color: "from-blue-500/15 to-cyan-500/15" },
      { icon: <Settings className="h-3 w-3" />, text: "Open slots this Friday", color: "from-purple-500/15 to-violet-500/15" },
      { icon: <Link className="h-3 w-3" />, text: "Send me my booking link", color: "from-green-500/15 to-emerald-500/15" }
    ],
    [
      { icon: <Calendar className="h-3 w-3" />, text: "Show my next week schedule", color: "from-orange-500/15 to-amber-500/15" },
      { icon: <Settings className="h-3 w-3" />, text: "Block my calendar tomorrow", color: "from-pink-500/15 to-rose-500/15" },
      { icon: <Link className="h-3 w-3" />, text: "Create a meeting link", color: "from-indigo-500/15 to-blue-500/15" }
    ],
    [
      { icon: <Calendar className="h-3 w-3" />, text: "Cancel my 3pm meeting", color: "from-red-500/15 to-orange-500/15" },
      { icon: <Settings className="h-3 w-3" />, text: "Set office hours", color: "from-teal-500/15 to-cyan-500/15" },
      { icon: <Link className="h-3 w-3" />, text: "Share my availability", color: "from-violet-500/15 to-purple-500/15" }
    ]
  ];

  // Rotate prompt sets every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSet((prev) => (prev + 1) % promptSets.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [promptSets.length]);

  return (
    <div className="text-center">
      <motion.div 
        className="flex items-center justify-center gap-2 mb-3"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Mic className="h-4 w-4 text-purple-400" />
        </motion.div>
        <span className="text-sm font-medium text-muted-foreground">Try saying:</span>
      </motion.div>
      
      <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {promptSets[currentSet].map((prompt, index) => (
            <motion.button
              key={`${currentSet}-${index}`}
              initial={{ opacity: 0, y: 15, scale: 0.9 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                scale: 1,
                transition: { 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }
              }}
              exit={{ 
                opacity: 0, 
                y: -15, 
                scale: 0.9,
                transition: { duration: 0.2 }
              }}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onPromptClick(prompt.text)}
              className={`group flex items-center gap-2 px-3 py-2 bg-gradient-to-r ${prompt.color} hover:scale-105 rounded-full text-xs text-purple-300 hover:text-purple-200 transition-all duration-300 backdrop-blur-sm hover:shadow-lg`}
            >
              <motion.span 
                className="text-purple-400 group-hover:text-purple-300 transition-colors"
                whileHover={{ rotate: 10 }}
                transition={{ duration: 0.2 }}
              >
                {prompt.icon}
              </motion.span>
              <span className="font-medium">{prompt.text}</span>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default VoicePromptSuggestions;
