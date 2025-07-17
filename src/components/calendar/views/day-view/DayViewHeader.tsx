
import { format, isToday } from "date-fns";

interface DayViewHeaderProps {
  currentDate: Date;
}

const DayViewHeader = ({ currentDate }: DayViewHeaderProps) => {
  return (
    <div className="sticky top-0 bg-gradient-to-br from-purple-600/15 to-purple-800/10 z-20 border-b border-purple-500/30">
      <div className="flex items-center">
        <div className="w-16 flex-none border-r border-purple-500/30 bg-purple-600/10 h-20"></div>
        <div className="flex-grow">
          <div className="flex flex-col items-center justify-center h-20 p-2">
            <div className="text-sm text-purple-300 font-medium">
              {format(currentDate, 'EEE').toUpperCase()}
            </div>
            <div className={`text-4xl font-bold ${isToday(currentDate) ? 'text-purple-400' : 'text-white'}`}>
              {format(currentDate, 'd')}
            </div>
            <div className="text-xs text-purple-400">
              GMT+05:30
            </div>
          </div>
        </div>
      </div>
      
      {/* All-day events row */}
      <div className="flex w-full">
        <div className="w-16 flex-none border-r border-purple-500/30 bg-purple-600/10 py-2 px-1 text-xs text-right text-purple-400">
          All day
        </div>
        <div className="flex-grow border-b border-purple-500/30 bg-gradient-to-br from-purple-600/10 to-purple-800/5">
          {/* All day events would go here */}
        </div>
      </div>
    </div>
  );
};

export default DayViewHeader;
