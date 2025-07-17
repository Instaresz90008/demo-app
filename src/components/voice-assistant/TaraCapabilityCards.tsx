
import { motion } from "framer-motion";
import { Link, Calendar, Settings, Zap } from "lucide-react";

interface TaraCapabilityCardsProps {
  onCapabilityClick: (action: string) => void;
}

const TaraCapabilityCards = ({ onCapabilityClick }: TaraCapabilityCardsProps) => {
  const capabilities = [
    {
      icon: <Link className="h-4 w-4" />,
      title: "Get booking link",
      action: "Get my booking link",
      color: "text-blue-400",
      gradient: "from-blue-500/10 to-cyan-500/10"
    },
    {
      icon: <Calendar className="h-4 w-4" />,
      title: "Check meetings",
      action: "Check my meetings for today",
      color: "text-green-400",
      gradient: "from-green-500/10 to-emerald-500/10"
    },
    {
      icon: <Settings className="h-4 w-4" />,
      title: "Open Friday slots",
      action: "Open slots for Friday",
      color: "text-purple-400",
      gradient: "from-purple-500/10 to-violet-500/10"
    },
    {
      icon: <Zap className="h-4 w-4" />,
      title: "Upgrade to Pro",
      action: "Tell me about upgrading to Pro",
      color: "text-orange-400",
      gradient: "from-orange-500/10 to-amber-500/10"
    }
  ];

  return (
    <div className="w-full">
      <motion.h3 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-muted-foreground text-sm font-medium text-center mb-3 flex items-center justify-center gap-2"
      >
        <motion.span
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          💡
        </motion.span>
        <span>What Tara Can Do</span>
      </motion.h3>
      
      <div className="grid grid-cols-1 gap-2">
        {capabilities.map((capability, index) => (
          <motion.div
            key={capability.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              duration: 0.4, 
              delay: index * 0.08,
              type: "spring",
              stiffness: 100
            }}
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div 
              className={`bg-gradient-to-r ${capability.gradient} hover:from-${capability.color.split('-')[1]}-500/20 hover:to-${capability.color.split('-')[1]}-400/20 transition-all duration-300 cursor-pointer group backdrop-blur-sm rounded-2xl p-3 hover:shadow-lg hover:shadow-${capability.color.split('-')[1]}-500/20`}
              onClick={() => onCapabilityClick(capability.action)}
            >
              <div className="flex items-center gap-3">
                <motion.div 
                  className={`${capability.color} group-hover:scale-125 transition-all duration-300`}
                  whileHover={{ rotate: 15 }}
                  transition={{ duration: 0.2 }}
                >
                  {capability.icon}
                </motion.div>
                <h4 className="text-foreground font-medium text-sm group-hover:text-foreground/90 transition-colors flex-1">
                  {capability.title}
                </h4>
                <motion.div
                  className="opacity-0 group-hover:opacity-100 transition-all duration-300"
                  initial={{ x: -10 }}
                  whileHover={{ x: 0 }}
                >
                  <motion.div 
                    className={`w-1.5 h-1.5 bg-${capability.color.split('-')[1]}-400 rounded-full`}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TaraCapabilityCards;
