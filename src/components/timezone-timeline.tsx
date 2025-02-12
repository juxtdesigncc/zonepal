import * as React from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import { set } from 'date-fns'
import { formatInTimeZone, toZonedTime } from 'date-fns-tz'

interface TimelineProps {
  ianaName: string;
  onTimeChange?: (newDate: Date) => void;
  selectedDate: Date;
  use24Hour?: boolean;
}

// Every 2 hours we show a marker
const MARKERS = Array.from({ length: 13 }, (_, i) => i * 2)
// Every 4 hours we show a label
const LABELS = Array.from({ length: 7 }, (_, i) => i * 4)

export function Timeline({ ianaName, onTimeChange, selectedDate, use24Hour = false }: TimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const [position, setPosition] = useState(50) // Percentage (0-100)

  // Convert position to time in the target timezone
  const positionToTime = useCallback((pos: number): Date => {
    // Calculate hours and minutes from position (0-100% maps to 0-24 hours)
    const totalHours = (pos / 100) * 24
    const hours = Math.floor(totalHours)
    const minutes = Math.round((totalHours % 1) * 60)

    // Get the date in the target timezone
    const zonedDate = toZonedTime(selectedDate, ianaName)
    
    // Create a new date with the target hours/minutes in the timezone
    const newZonedDate = set(zonedDate, {
      hours,
      minutes,
      seconds: 0,
      milliseconds: 0
    })

    // Get timezone offset in minutes
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: ianaName,
      timeZoneName: 'shortOffset'
    })
    const parts = formatter.formatToParts(newZonedDate)
    const offsetPart = parts.find(part => part.type === 'timeZoneName')?.value || ''
    const offsetMinutes = parseInt(offsetPart.replace('GMT', '').replace(':', '')) * 60

    // Convert to UTC by subtracting the timezone offset
    const utcHours = hours - Math.floor(offsetMinutes / 60)
    const utcMinutes = minutes - (offsetMinutes % 60)
    
    return new Date(Date.UTC(
      newZonedDate.getFullYear(),
      newZonedDate.getMonth(),
      newZonedDate.getDate(),
      utcHours,
      utcMinutes,
      0,
      0
    ))
  }, [selectedDate, ianaName])

  // Convert time to position
  const timeToPosition = useCallback((date: Date): number => {
    // Convert the UTC date to the target timezone
    const zonedDate = toZonedTime(date, ianaName)
    const totalHours = zonedDate.getHours() + (zonedDate.getMinutes() / 60)
    return (totalHours / 24) * 100
  }, [ianaName])

  // Initialize position based on selected date
  useEffect(() => {
    setPosition(timeToPosition(selectedDate))
  }, [selectedDate, timeToPosition])

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    isDragging.current = true
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const calculateNewPosition = useCallback((clientX: number): number => {
    if (!timelineRef.current) return 0
    const rect = timelineRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    return Math.max(0, Math.min(100, (x / rect.width) * 100))
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current) return

    const newPosition = calculateNewPosition(e.clientX)
    setPosition(newPosition)
    onTimeChange?.(positionToTime(newPosition))
  }, [calculateNewPosition, positionToTime, onTimeChange])

  const handleMouseUp = useCallback(() => {
    isDragging.current = false
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }, [handleMouseMove])

  const handleTimelineClick = useCallback((e: React.MouseEvent) => {
    const newPosition = calculateNewPosition(e.clientX)
    setPosition(newPosition)
    onTimeChange?.(positionToTime(newPosition))
  }, [calculateNewPosition, positionToTime, onTimeChange])

  // Cleanup event listeners
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  // For debugging
  const currentTime = positionToTime(position)
  console.log(`Position: ${position.toFixed(2)}%, Time in ${ianaName}: ${formatInTimeZone(currentTime, ianaName, 'HH:mm:ss')}`)

  return (
    <div className="mt-4 relative select-none">
      <div className="relative">
        {/* Timeline bar with border */}
        <div 
          ref={timelineRef}
          className="relative h-2 bg-gradient-to-r from-blue-900 via-blue-200 to-blue-900 rounded-full cursor-pointer border border-blue-300"
          onClick={handleTimelineClick}
        >
          {/* Time markers */}
          <div className="absolute inset-0 flex items-center">
            {MARKERS.map((hour) => (
              <div
                key={hour}
                className="absolute h-3 w-px bg-blue-200"
                style={{
                  left: `calc(${(hour / 24) * 100}% + 2px)`,
                  top: '-4px'
                }}
              />
            ))}
          </div>
        </div>

        {/* Draggable circle */}
        <div 
          className="absolute w-4 h-4 bg-white border-2 border-blue-500 rounded-full top-1/2 transform -translate-x-1/2 cursor-grab active:cursor-grabbing z-10"
          style={{ left: `${position}%` }}
          onMouseDown={handleMouseDown}
        />
      </div>

      {/* Time labels - now only every 4 hours */}
      <div className="relative mt-4 text-sm text-gray-500">
        {LABELS.map(hour => (
          <div
            key={hour}
            className="absolute transform -translate-x-1/2"
            style={{ left: `${(hour / 24) * 100}%` }}
          >
            {use24Hour 
              ? `${hour.toString().padStart(2, '0')}:00`
              : hour === 0 ? '12am' : hour === 12 ? '12pm' : hour > 12 ? `${hour-12}pm` : `${hour}am`
            }
          </div>
        ))}
      </div>
    </div>
  )
} 