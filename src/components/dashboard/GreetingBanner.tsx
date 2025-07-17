
import { Sun, PlusCircle, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const GreetingBanner = () => {
  const [greeting, setGreeting] = useState("Good day");
  const [userName, setUserName] = useState("User");
  const navigate = useNavigate();
  
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
    
    // In a real app, fetch the user's name from API or context
    setUserName("Anilkumar");
  }, []);
  
  const handleCreateService = () => {
    navigate("/service-creation");
  };
  
  return (
    <div className={cn(
      "enhanced-card p-6 relative overflow-hidden group",
      "bg-gradient-to-br from-primary/10 via-primary/5 to-transparent",
      "border border-primary/20 hover:border-primary/40",
      "animate-gradient transition-all duration-500"
    )}>
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-mesh opacity-20"></div>
      <div className="absolute top-2 right-2 animate-particle-float">
        <Sparkles className="h-4 w-4 text-primary/30" />
      </div>
      <div className="absolute bottom-2 left-2 animate-particle-float" style={{ animationDelay: '2s' }}>
        <Sparkles className="h-3 w-3 text-primary/20" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="animate-wave">
            <Sun className="text-yellow-500 h-8 w-8 glow" />
          </div>
          <div>
            <h2 className="text-xl font-semibold gradient-text">
              {`${greeting}, ${userName}!`}
            </h2>
            <p className="text-sm text-muted-foreground mt-1 animate-typing">
              Ready to create something amazing today?
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center text-sm text-muted-foreground animate-reveal">
            <PlusCircle className="h-4 w-4 mr-2 text-primary animate-bounce" />
            <span>Ready to broadcast your services?</span>
          </div>
          <Button 
            onClick={handleCreateService} 
            className={cn(
              "btn-rich whitespace-nowrap",
              "transform hover:scale-105 transition-all duration-300",
              "animate-morphing"
            )}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Services
          </Button>
        </div>
      </div>
      
      {/* Interactive glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </div>
  );
};

export default GreetingBanner;
