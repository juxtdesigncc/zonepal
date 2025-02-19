import * as React from "react"
import { useCallback, useEffect, useState } from "react"
import { toZonedTime } from 'date-fns-tz'
import * as Slider from '@radix-ui/react-slider'

interface TimelineRadixProps {
  ianaName: string;
  onTimeChange?: (newDate: Date) => void;
  selectedDate: Date;
  use24Hour?: boolean;
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

export function TimelineRadix({ ianaName, onTimeChange, selectedDate, use24Hour = false }: TimelineRadixProps) {
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

  return (
    <div className="mt-4 relative select-none">
      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-10 cursor-pointer"
        value={[position]}
        max={100}
        step={100/(24*12)} // 5-minute steps (24 hours * 12 five-minute intervals per hour)
        onValueChange={handleValueChange}
        onPointerDown={() => setIsDragging(true)}
        onPointerUp={() => setIsDragging(false)}
      >
        <Slider.Track className="relative h-2 grow rounded-full bg-gradient-to-r from-blue-900 via-blue-200 to-blue-900 border border-blue-300">
          {/* Hour markers */}
          <div className="absolute inset-0 flex items-center">
            {(isMobile ? MARKERS.mobile : MARKERS.desktop).map((hour) => (
              <div
                key={hour}
                className="absolute h-3 w-px bg-blue-200"
                style={{
                  left: `${(hour / 24) * 100}%`,
                  top: '-4px'
                }}
              />
            ))}
          </div>
        </Slider.Track>

        <Slider.Thumb
          className={`block w-16 h-6 -top-2 bg-white rounded-lg border border-slate-200 shadow-md 
            transition-all duration-200 focus:outline-none focus:ring focus:ring-blue-500
            hover:shadow-lg hover:border-slate-300 group
            ${isDragging ? 'scale-105 shadow-lg border-blue-400' : ''}`}
        >
          <div className="flex gap-1 h-full items-center justify-center">
            <div className="w-0.5 h-3 bg-blue-300 rounded-full group-hover:bg-blue-400" />
            <div className="w-0.5 h-3 bg-blue-300 rounded-full group-hover:bg-blue-400" />
            <div className="w-0.5 h-3 bg-blue-300 rounded-full group-hover:bg-blue-400" />
          </div>
        </Slider.Thumb>
      </Slider.Root>

      {/* Time labels - responsive */}
      <div className="relative mt-4 text-sm text-gray-500">
        {(isMobile ? LABELS.mobile : LABELS.desktop).map(hour => (
          <div
            key={hour}
            className="absolute transform -translate-x-1/2"
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