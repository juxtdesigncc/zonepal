import * as React from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import { toZonedTime } from 'date-fns-tz'

interface TimelineProps {
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

export function Timeline({ ianaName, onTimeChange, selectedDate, use24Hour = false }: TimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const [position, setPosition] = useState(50)
  const [isMobile, setIsMobile] = useState(false)
  const [isDraggingClass, setIsDraggingClass] = useState(false)

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is typical tablet/mobile breakpoint
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
      const newDate = new Date(Date.UTC(
        targetDate.getFullYear(),
        targetDate.getMonth(),
        targetDate.getDate(),
        hours - offsetHours,
        minutes - offsetMinutes,
        0,
        0
      ))

      console.log('Position to time:', {
        position: pos,
        targetHours: hours,
        targetMinutes: minutes,
        timezone: ianaName,
        offset: { hours: offsetHours, minutes: offsetMinutes },
        utcResult: newDate.toISOString(),
        localResult: newDate.toString()
      })
      
      return newDate
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
    console.log('Initializing position:', { 
      selectedDate: selectedDate.toISOString(),
      timezone: ianaName,
      position: newPosition 
    })
    setPosition(newPosition)
  }, [selectedDate, timeToPosition])

  const calculateNewPosition = useCallback((clientX: number): number => {
    if (!timelineRef.current) return 0
    const rect = timelineRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
    return Math.max(0, Math.min(100, (x / rect.width) * 100))
  }, [])

  const updateTimeFromPosition = useCallback((newPosition: number) => {
    const newTime = positionToTime(newPosition)
    setPosition(newPosition)
    onTimeChange?.(newTime)
  }, [positionToTime, onTimeChange])

  const startDragging = useCallback((clientX: number) => {
    isDragging.current = true
    setIsDraggingClass(true)
    const newPosition = calculateNewPosition(clientX)
    updateTimeFromPosition(newPosition)
  }, [calculateNewPosition, updateTimeFromPosition])

  const handleTimelineMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    startDragging(e.clientX)
    
    // Add event listeners for drag
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [startDragging])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current) return
    e.preventDefault()
    requestAnimationFrame(() => {
      const newPosition = calculateNewPosition(e.clientX)
      updateTimeFromPosition(newPosition)
    })
  }, [calculateNewPosition, updateTimeFromPosition])

  const handleMouseUp = useCallback(() => {
    isDragging.current = false
    setIsDraggingClass(false)
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }, [handleMouseMove])

  // Touch event handlers
  const handleTimelineTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    const touch = e.touches[0]
    startDragging(touch.clientX)
  }, [startDragging])

  const handleTimelineTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return
    e.preventDefault()
    const touch = e.touches[0]
    requestAnimationFrame(() => {
      const newPosition = calculateNewPosition(touch.clientX)
      updateTimeFromPosition(newPosition)
    })
  }, [calculateNewPosition, updateTimeFromPosition])

  const handleTimelineTouchEnd = useCallback(() => {
    isDragging.current = false
    setIsDraggingClass(false)
  }, [])

  // Cleanup event listeners
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  return (
    <div className="mt-4 relative select-none">
      <div 
        className="relative"
        onMouseDown={handleTimelineMouseDown}
        onTouchStart={handleTimelineTouchStart}
        onTouchMove={handleTimelineTouchMove}
        onTouchEnd={handleTimelineTouchEnd}
      >
        {/* Timeline bar with border */}
        <div 
          ref={timelineRef}
          className="relative h-2 bg-gradient-to-r from-blue-900 via-blue-200 to-blue-900 rounded-full cursor-pointer border border-blue-300"
          role="slider"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={position}
        >
          {/* Time markers */}
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
        </div>

        {/* Draggable marker */}
        <div 
          className={`absolute w-16 h-6 -top-2 transform -translate-x-1/2 cursor-grab z-10 group transition-transform ${isDraggingClass ? 'cursor-grabbing scale-105' : ''}`}
          style={{ 
            left: `${position}%`,
            transition: isDraggingClass ? 'none' : 'transform 0.2s ease-out, left 0.2s ease-out'
          }}
        >
          {/* Draggable handle with shadow and hover effect */}
          <div className={`w-full h-full bg-white rounded-lg border-2 border-blue-500 shadow-md transition-all duration-200 
            ${isDraggingClass 
              ? 'shadow-lg border-blue-600 scale-105' 
              : 'group-hover:shadow-lg group-hover:border-blue-600'}`}
          >
            {/* Grip lines for draggable appearance */}
            <div className="flex gap-1 h-full items-center justify-center">
              <div className="w-0.5 h-3 bg-blue-300 rounded-full group-hover:bg-blue-400" />
              <div className="w-0.5 h-3 bg-blue-300 rounded-full group-hover:bg-blue-400" />
              <div className="w-0.5 h-3 bg-blue-300 rounded-full group-hover:bg-blue-400" />
            </div>
          </div>
        </div>
      </div>

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