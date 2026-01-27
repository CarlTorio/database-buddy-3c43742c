import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, isBefore, startOfDay } from "date-fns";

interface DateTimePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (date: string, time: string) => void;
  selectedDate?: string;
  selectedTime?: string;
}

const timeSlots = [
  "9:00 AM", "9:30 AM",
  "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM",
  "1:00 PM", "1:30 PM",
  "2:00 PM", "2:30 PM",
  "3:00 PM", "3:30 PM",
  "4:00 PM", "4:30 PM",
  "5:00 PM", "5:30 PM",
  "6:00 PM", "6:30 PM",
  "7:00 PM",
];

const DateTimePicker = ({ isOpen, onClose, onConfirm, selectedDate, selectedTime }: DateTimePickerProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tempDate, setTempDate] = useState<Date | null>(selectedDate ? new Date(selectedDate) : null);
  const [tempTime, setTempTime] = useState<string>(selectedTime || "");

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get the day of week for the first day (0 = Sunday)
  const startDayOfWeek = monthStart.getDay();
  
  // Create padding for days before the month starts
  const paddingDays = Array(startDayOfWeek).fill(null);

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  
  const handleReset = () => {
    setTempDate(null);
    setTempTime("");
  };

  const handleConfirm = () => {
    if (tempDate && tempTime) {
      const formattedDate = format(tempDate, "yyyy-MM-dd");
      onConfirm(formattedDate, tempTime);
      onClose();
    }
  };

  const isDateDisabled = (date: Date) => {
    return isBefore(startOfDay(date), startOfDay(new Date()));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-background rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] md:max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-3 md:p-6 text-center border-b border-border flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute right-3 top-3 md:right-4 md:top-4 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <h2 className="text-lg md:text-xl font-semibold text-primary">Select Date & Time</h2>
          <div className="flex justify-center gap-1 mt-1 md:mt-2">
            <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary"></span>
            <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary"></span>
            <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary"></span>
            <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-muted"></span>
            <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-muted"></span>
            <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-muted"></span>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 overflow-y-auto flex-1">
          {/* Calendar */}
          <div>
            <div className="flex items-center justify-between mb-2 md:mb-4">
              <h3 className="text-sm md:text-base font-semibold text-foreground">Select Date</h3>
              <button
                onClick={handleReset}
                className="text-muted-foreground hover:text-foreground"
              >
                <RefreshCw className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </button>
            </div>
              
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-2 md:mb-4">
              <button
                onClick={handlePrevMonth}
                className="p-1 hover:bg-muted rounded"
              >
                <ChevronLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </button>
              <span className="text-sm md:text-base font-medium">{format(currentMonth, "MMMM yyyy")}</span>
              <button
                onClick={handleNextMonth}
                className="p-1 hover:bg-muted rounded"
              >
                <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-0.5 md:gap-1 mb-1 md:mb-2">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div key={day} className="text-center text-[10px] md:text-xs text-muted-foreground font-medium py-0.5 md:py-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-0.5 md:gap-1">
              {paddingDays.map((_, index) => (
                <div key={`padding-${index}`} className="aspect-square" />
              ))}
              {daysInMonth.map((day) => {
                const isSelected = tempDate && isSameDay(day, tempDate);
                const isCurrentDay = isToday(day);
                const disabled = isDateDisabled(day);

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => !disabled && setTempDate(day)}
                    disabled={disabled}
                    className={`
                      aspect-square flex items-center justify-center text-xs md:text-sm rounded-full transition-colors
                      ${isSelected ? "bg-primary text-primary-foreground" : ""}
                      ${isCurrentDay && !isSelected ? "text-primary font-bold" : ""}
                      ${disabled ? "text-muted-foreground/30 cursor-not-allowed" : "hover:bg-muted"}
                      ${!isSelected && !disabled ? "text-foreground" : ""}
                    `}
                  >
                    {format(day, "d")}
                  </button>
                );
              })}
            </div>
            </div>

          {/* Time Slots */}
          <div>
            <h3 className="text-sm md:text-base font-semibold text-foreground mb-2 md:mb-4">Select Time</h3>
            <div className="grid grid-cols-3 gap-1.5 md:gap-2 max-h-40 md:max-h-64 overflow-y-auto pr-1 md:pr-2">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setTempTime(time)}
                  className={`
                    py-1.5 md:py-2 px-2 md:px-3 text-xs md:text-sm rounded-lg border transition-colors
                    ${tempTime === time 
                      ? "bg-primary text-primary-foreground border-primary" 
                      : "bg-background text-foreground border-border hover:border-primary hover:bg-muted"
                    }
                  `}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
          </div>

        {/* Footer */}
        <div className="p-3 md:p-6 border-t border-border flex items-center justify-between flex-shrink-0">
          <Button
            variant="outline"
            onClick={onClose}
            className="gap-1 md:gap-2 h-9 md:h-10 px-3 md:px-4 text-sm"
          >
            <ChevronLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
            Back
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!tempDate || !tempTime}
            className="gap-1 md:gap-2 h-9 md:h-10 px-3 md:px-4 text-sm bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Next
            <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </Button>
        </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DateTimePicker;
