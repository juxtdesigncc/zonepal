import * as React from "react"
import { useCallback, useEffect, useState } from "react"
import { toZonedTime, formatInTimeZone } from 'date-fns-tz'
import * as Slider from '@radix-ui/react-slider'
import { BlockedTimeSlot } from "@/lib/types"
import { cn } from "@/lib/utils"

interface TimelineRadixProps {
  ianaName: string;
  onTimeChange?: (newDate: Date) => void;
  selectedDate: Date;
  use24Hour?: boolean;
  blockedTimeSlots?: BlockedTimeSlot[];
  defaultBlockedHours: { start: number; end: number };
  referenceTimezone: string;
}

// Constants for different screen sizes
const MARKERS = {
  mobile: Array.from({ length: 7 }, (_, i) => i * 4), // 0, 4, 8, 12, 16, 20
  desktop: Array.from({ length: 13 }, (_, i) => i * 2), // 0, 2, 4, ..., 22, 24
};

const LABELS = {
  mobile: [0, 6, 12, 18, 24], // Include both 0 and 24 for 12am
  desktop: [0, 4, 8, 12, 16, 20, 24], // Include both 0 and 24 for 12am
};

export function TimelineRadix({ 
  ianaName, 
  onTimeChange, 
  selectedDate, 
  use24Hour = false,
  blockedTimeSlots = [],
  defaultBlockedHours,
  referenceTimezone
}: TimelineRadixProps) {
  const [position, setPosition] = useState(50)
  const [isMobile, setIsMobile] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Convert position to time in the target timezone
  const positionToTime = useCallback((pos: number): Date => {
    try {
      // Calculate hours and minutes from position (0-100% maps to 0-24 hours)
      const totalHours = (pos / 100) * 24
      const hours = Math.floor(totalHours)
      const minutes = Math.round((totalHours % 1) * 60)

      // Get the current date in the target timezone
      const targetDate = toZonedTime(selectedDate, ianaName)
      
      // Get the timezone offset for the target timezone
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: ianaName,
        timeZoneName: 'shortOffset'
      })
      const parts = formatter.formatToParts(targetDate)
      const offsetStr = parts.find(part => part.type === 'timeZoneName')?.value || ''
      const match = offsetStr.match(/GMT([+-])(\d{1,2})(?::?(\d{2})?)?/)
      
      let offsetHours = 0
      let offsetMinutes = 0
      if (match) {
        const [, sign, hours, minutes = '00'] = match
        offsetHours = parseInt(hours) * (sign === '+' ? 1 : -1)
        offsetMinutes = parseInt(minutes) * (sign === '+' ? 1 : -1)
      }

      // Create a new UTC date with the target time adjusted for the timezone
      return new Date(Date.UTC(
        targetDate.getFullYear(),
        targetDate.getMonth(),
        targetDate.getDate(),
        hours - offsetHours,
        minutes - offsetMinutes,
        0,
        0
      ))
    } catch (error) {
      console.error('Error in positionToTime:', error)
      return selectedDate
    }
  }, [selectedDate, ianaName])

  // Convert time to position
  const timeToPosition = useCallback((date: Date): number => {
    try {
      // Convert the date to the target timezone
      const zonedDate = toZonedTime(date, ianaName)
      
      // Get hours and minutes in the target timezone
      const totalHours = zonedDate.getHours() + (zonedDate.getMinutes() / 60)
      
      // Calculate position as percentage of day
      const position = (totalHours / 24) * 100
      
      return Math.max(0, Math.min(100, position))
    } catch (error) {
      console.error('Error in timeToPosition:', error)
      return 0
    }
  }, [ianaName])

  // Initialize position based on selected date
  useEffect(() => {
    const newPosition = timeToPosition(selectedDate)
    setPosition(newPosition)
  }, [selectedDate, timeToPosition])

  const handleValueChange = useCallback((values: number[]) => {
    const newPosition = values[0]
    setPosition(newPosition)
    const newTime = positionToTime(newPosition)
    onTimeChange?.(newTime)
  }, [positionToTime, onTimeChange])

  // Convert hours from reference timezone to current timezone
  const convertBlockedHours = useCallback((hour: number, fromTimezone: string, toTimezone: string): number => {
    try {
      // Create a date object for today at the specified hour in the source timezone
      const date = new Date();
      date.setHours(hour, 0, 0, 0);
      
      // Format the time in the target timezone and extract the hour
      const convertedTime = formatInTimeZone(date, toTimezone, 'HH');
      return parseInt(convertedTime, 10);
    } catch (error) {
      console.error('Error converting timezone hours:', error);
      return hour;
    }
  }, []);

  // Function to check if a given hour is active (not blocked)
  const isHourActive = useCallback((hour: number) => {
    // First check timezone-specific blocks
    const tzSpecificBlocks = blockedTimeSlots.filter(slot => slot.ianaName === ianaName);
    const globalBlocks = blockedTimeSlots.filter(slot => !slot.ianaName);
    
    const isBlockedBySpecific = tzSpecificBlocks.some(slot => {
      const convertedStart = convertBlockedHours(slot.start, referenceTimezone, ianaName);
      const convertedEnd = convertBlockedHours(slot.end, referenceTimezone, ianaName);
      return hour >= convertedStart && hour < convertedEnd;
    });
    
    const isBlockedByGlobal = globalBlocks.some(slot => {
      const convertedStart = convertBlockedHours(slot.start, referenceTimezone, ianaName);
      const convertedEnd = convertBlockedHours(slot.end, referenceTimezone, ianaName);
      return hour >= convertedStart && hour < convertedEnd;
    });
    
    // If no specific blocks are defined, use default blocked hours
    if (tzSpecificBlocks.length === 0 && globalBlocks.length === 0) {
      const convertedStart = convertBlockedHours(defaultBlockedHours.start, referenceTimezone, ianaName);
      const convertedEnd = convertBlockedHours(defaultBlockedHours.end, referenceTimezone, ianaName);
      
      if (convertedStart <= convertedEnd) {
        return !(hour >= convertedStart && hour < convertedEnd);
      } else {
        // Handle overnight blocks (e.g., 22-6)
        return !(hour >= convertedStart || hour < convertedEnd);
      }
    }
    
    return !(isBlockedBySpecific || isBlockedByGlobal);
  }, [blockedTimeSlots, defaultBlockedHours, ianaName, convertBlockedHours, referenceTimezone]);

  return (
    <div className="mt-4 relative select-none">
      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-10 cursor-pointer"
        value={[position]}
        max={100}
        step={100/(24*12)} // 5-minute steps
        onValueChange={handleValueChange}
        onPointerDown={() => setIsDragging(true)}
        onPointerUp={() => setIsDragging(false)}
      >
        <Slider.Track className="relative h-2 grow rounded-full bg-gradient-to-r from-blue-900 via-blue-200 to-blue-900 border border-blue-300">
          {/* Blocked time indicators */}
          <div className="absolute inset-0">
            {Array.from({ length: 24 }, (_, hour) => {
              const isActive = isHourActive(hour);
              const startPercent = (hour / 24) * 100;
              const widthPercent = (1 / 24) * 100;
              
              return !isActive ? (
                <div
                  key={hour}
                  className="absolute h-full bg-white/90"
                  style={{
                    left: `${startPercent}%`,
                    width: `${widthPercent}%`,
                  }}
                >
                  <div className="w-full h-full bg-stripes-gray/10" />
                </div>
              ) : null;
            })}
          </div>
          
          {/* Hour markers */}
          <div className="absolute inset-0 flex items-center">
            {(isMobile ? MARKERS.mobile : MARKERS.desktop).map((hour) => (
              <div
                key={hour}
                className={cn(
                  "absolute h-3 w-px",
                  isHourActive(hour) ? "bg-blue-200" : "bg-gray-200"
                )}
                style={{
                  left: `${(hour / 24) * 100}%`,
                  top: '-4px'
                }}
              />
            ))}
          </div>
        </Slider.Track>

        <Slider.Thumb
          className={cn(
            "block w-16 h-6 -top-2 bg-white rounded-lg border shadow-md",
            "transition-all duration-200 focus:outline-none focus:ring focus:ring-blue-500",
            "hover:shadow-lg group",
            isDragging ? 'scale-105 shadow-lg border-blue-400' : 'border-slate-200 hover:border-slate-300',
            !isHourActive(Math.floor((position / 100) * 24)) && 'border-gray-200'
          )}
        >
          <div className="flex gap-1 h-full items-center justify-center">
            <div className={cn(
              "w-0.5 h-3 rounded-full",
              isHourActive(Math.floor((position / 100) * 24)) 
                ? "bg-blue-300 group-hover:bg-blue-400" 
                : "bg-gray-200 group-hover:bg-gray-300"
            )} />
            <div className={cn(
              "w-0.5 h-3 rounded-full",
              isHourActive(Math.floor((position / 100) * 24)) 
                ? "bg-blue-300 group-hover:bg-blue-400" 
                : "bg-gray-200 group-hover:bg-gray-300"
            )} />
            <div className={cn(
              "w-0.5 h-3 rounded-full",
              isHourActive(Math.floor((position / 100) * 24)) 
                ? "bg-blue-300 group-hover:bg-blue-400" 
                : "bg-gray-200 group-hover:bg-gray-300"
            )} />
          </div>
        </Slider.Thumb>
      </Slider.Root>

      {/* Time labels */}
      <div className="relative mt-4 text-sm text-gray-500">
        {(isMobile ? LABELS.mobile : LABELS.desktop).map(hour => (
          <div
            key={hour}
            className={cn(
              "absolute transform -translate-x-1/2",
              !isHourActive(hour) && "text-gray-300"
            )}
            style={{ left: `${(hour / 24) * 100}%` }}
          >
            {use24Hour 
              ? `${(hour % 24).toString().padStart(2, '0')}:00`
              : hour === 0 || hour === 24 ? '12am' : hour === 12 ? '12pm' : hour > 12 ? `${hour-12}pm` : `${hour}am`
            }
          </div>
        ))}
      </div>
    </div>
  )
} 