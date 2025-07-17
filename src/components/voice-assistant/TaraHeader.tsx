
import { Sparkles } from "lucide-react";

interface TaraHeaderProps {
  animationEnabled: boolean;
}

const TaraHeader = ({ animationEnabled }: TaraHeaderProps) => {
  return (
    <div className="flex items-center mb-4">
      <h1 className="text-3xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Tara</h1>
      <Sparkles className="h-6 w-6 ml-2 text-primary" />
    </div>
  );
};

export default TaraHeader;
