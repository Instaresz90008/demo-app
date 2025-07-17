
import * as React from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type EnhancedCalendarProps = React.ComponentProps<typeof DayPicker> & {
  minWidth?: string;
  maxWidth?: string;
};

function EnhancedCalendar({
  className,
  classNames,
  showOutsideDays = true,
  minWidth = "320px",
  maxWidth = "400px",
  ...props
}: EnhancedCalendarProps) {
  const [hoveredDay, setHoveredDay] = React.useState<Date | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{ minWidth, maxWidth }}
      className="relative"
    >
      <DayPicker
        showOutsideDays={showOutsideDays}
        className={cn("p-4 pointer-events-auto", className)}
        classNames={{
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4",
          caption: "flex justify-center pt-1 relative items-center mb-4",
          caption_label: "text-base font-semibold tracking-tight",
          nav: "space-x-1 flex items-center",
          nav_button: cn(
            buttonVariants({ variant: "outline" }),
            "h-8 w-8 bg-white border-gray-200 hover:bg-gray-50"
          ),
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse space-y-1",
          head_row: "flex mb-2",
          head_cell: "text-gray-500 rounded-md w-10 font-medium text-xs uppercase tracking-wider",
          row: "flex w-full mt-1",
          cell: "relative h-10 w-10 text-center text-sm p-0 focus-within:relative focus-within:z-20",
          day: cn(
            "h-10 w-10 p-0 font-medium rounded-lg transition-all duration-200",
            "hover:bg-blue-50 focus:bg-blue-50 cursor-pointer",
            "flex items-center justify-center border-0 bg-transparent"
          ),
          day_selected: cn(
            "bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700"
          ),
          day_today: cn(
            "bg-blue-50 text-blue-600 font-bold"
          ),
          day_outside: "text-gray-300 opacity-50",
          day_disabled: "text-gray-200 opacity-30 cursor-not-allowed hover:bg-transparent",
          day_range_middle: "aria-selected:bg-blue-100 aria-selected:text-blue-900",
          day_hidden: "invisible",
          ...classNames,
        }}
        components={{
          IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" {...props} />,
          IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" {...props} />,
        }}
        {...props}
      />
    </motion.div>
  );
}

EnhancedCalendar.displayName = "EnhancedCalendar";

export { EnhancedCalendar };
