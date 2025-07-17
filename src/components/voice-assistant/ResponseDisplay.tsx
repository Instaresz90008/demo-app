
import { MessageSquare, Loader, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ResponseDisplayProps {
  response: string;
  processingResponse: boolean;
  responseAnimating: boolean;
  animationEnabled: boolean;
}

const ResponseDisplay = ({ 
  response, 
  processingResponse, 
  responseAnimating, 
  animationEnabled 
}: ResponseDisplayProps) => {
  if (!response && !processingResponse) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="p-6 bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-sm rounded-2xl border border-purple-500/20"
      >
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-start gap-3 mb-4"
        >
          <motion.div
            animate={animationEnabled && processingResponse ? { rotate: 360 } : {}}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            {processingResponse ? (
              <Loader className="h-5 w-5 text-purple-400 mt-0.5" />
            ) : (
              <MessageSquare className="h-5 w-5 text-purple-400 mt-0.5" />
            )}
          </motion.div>
          
          <div className="flex-1">
            <motion.h2 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="font-medium text-sm text-purple-300 mb-3 flex items-center gap-2"
            >
              {processingResponse ? (
                <>
                  <span>Tara thinking</span>
                  <motion.span
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    ...
                  </motion.span>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Sparkles className="h-3 w-3 text-purple-400" />
                  </motion.div>
                </>
              ) : (
                "Tara Response:"
              )}
            </motion.h2>
            
            {processingResponse ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-3"
              >
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                      className="w-2 h-2 bg-purple-400 rounded-full"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm">Processing your request...</p>
              </motion.div>
            ) : (
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-foreground leading-relaxed text-base"
              >
                {response}
              </motion.p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ResponseDisplay;
