'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, ArrowsUpDownIcon, XMarkIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { TimeZoneInfo, getTimeInTimeZone, findTimezoneByIana, parseTimezoneParam, getTimezoneParam } from '@/lib/timezone';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TimezoneSearch } from '@/components/timezone-search';
// import { Timeline } from '@/components/timezone-timeline';
import { TimelineRadix } from '@/components/timeline-radix';
import { WeatherIcon } from '@/components/weather-icon';
import { cn } from '@/lib/utils';
import { TimelineSettings } from '@/lib/types';
import { SettingsDialog } from '@/components/settings-dialog';

export function ZonePalContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [timeZones, setTimeZones] = useState<TimeZoneInfo[]>([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const searchTriggerRef = useRef<HTMLButtonElement>(null);
  const [timelineSettings, setTimelineSettings] = useState<TimelineSettings>({
    blockedTimeSlots: [],
    defaultBlockedHours: { start: 22, end: 6 }, // Default blocked hours from 10 PM to 6 AM
    referenceTimezone: 'UTC' // Default to UTC if no timezones
  });

  // Add keyboard shortcut handler
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only trigger if not in an input field or textarea
      if (e.key.toLowerCase() === 'k' && 
          !(e.target instanceof HTMLInputElement) && 
          !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        searchTriggerRef.current?.click();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Initialize timezones from URL
  useEffect(() => {
    const zParam = searchParams.get('z');
    if (zParam) {
      const ianaNames = parseTimezoneParam(zParam);
      const zones = ianaNames
        .map(name => findTimezoneByIana(name))
        .filter((tz): tz is TimeZoneInfo => tz !== undefined)
        .map(tz => ({
          ...tz,
          ...getTimeInTimeZone(selectedDate, tz.ianaName)
        }));
      setTimeZones(zones);
    }
  }, [searchParams, selectedDate]);

  // Update times every minute
  useEffect(() => {
    const updateTimes = () => {
      setTimeZones(prevZones => 
        prevZones.map(tz => ({
          ...tz,
          ...getTimeInTimeZone(selectedDate, tz.ianaName)
        }))
      );
    };

    const interval = setInterval(updateTimes, 60000); // Update every minute
    updateTimes(); // Initial update

    return () => clearInterval(interval);
  }, [selectedDate]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setIsCalendarOpen(false);
    }
  };

  const handleTimeChange = (newDate: Date) => {
    setSelectedDate(newDate);
  };

  const handleAddTimeZone = (newTimeZone: TimeZoneInfo) => {
    setTimeZones(prevZones => {
      // Check if timezone already exists
      if (prevZones.some(tz => tz.ianaName === newTimeZone.ianaName)) {
        return prevZones;
      }
      const updatedZones = [...prevZones, {
        ...newTimeZone,
        ...getTimeInTimeZone(selectedDate, newTimeZone.ianaName)
      }];
      
      // Update URL
      const param = getTimezoneParam(updatedZones);
      router.push(`/?z=${param}`);
      
      return updatedZones;
    });
  };

  const handleRemoveTimeZone = (ianaName: string) => {
    setTimeZones(prevZones => {
      const updatedZones = prevZones.filter(tz => tz.ianaName !== ianaName);
      
      // Update URL
      if (updatedZones.length > 0) {
        const param = getTimezoneParam(updatedZones);
        router.push(`/?z=${param}`);
      } else {
        router.push('/');
      }
      
      return updatedZones;
    });
  };

  const handleSortTimeZones = () => {
    setTimeZones(prevZones => {
      const sortedZones = [...prevZones].sort((a, b) => {
        const offsetA = parseInt(a.offset);
        const offsetB = parseInt(b.offset);
        return offsetA - offsetB;
      });
      
      // Update URL with sorted zones
      const param = getTimezoneParam(sortedZones);
      if (sortedZones.length > 0) {
        router.push(`/?z=${param}`);
      }
      
      return sortedZones;
    });
  };

  const handleResetTime = () => {
    setSelectedDate(new Date());
  };

  const handleSettingsChange = (newSettings: TimelineSettings) => {
    // If we have timezones, use the first one as reference
    if (timeZones.length > 0) {
      const referenceTimezone = timeZones[0].ianaName;
      setTimelineSettings({
        ...newSettings,
        referenceTimezone // Add this to the settings
      });
    } else {
      setTimelineSettings({
        ...newSettings,
        referenceTimezone: 'UTC' // Default to UTC if no timezones
      });
    }
  };

  // Update settings when first timezone changes
  useEffect(() => {
    if (timeZones.length > 0 && (!timelineSettings.referenceTimezone || 
        timelineSettings.referenceTimezone !== timeZones[0].ianaName)) {
      setTimelineSettings(prev => ({
        ...prev,
        referenceTimezone: timeZones[0].ianaName
      }));
    }
  }, [timeZones, timelineSettings.referenceTimezone]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-4 mb-8">
        <div className="flex-1 min-w-0">
          <TimezoneSearch 
            onSelect={handleAddTimeZone} 
            selectedTimezones={timeZones.map(tz => tz.ianaName)}
            triggerRef={searchTriggerRef}
          />
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="relative z-40">
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className={cn(
                    "transition-colors shrink-0",
                    "md:w-40", // Only set width on medium screens and up
                    "w-10 px-0 md:px-4", // Adjust padding for mobile
                    selectedDate.toDateString() !== new Date().toDateString() && "bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300" // Active state when not today
                  )}
                >
                  <CalendarIcon className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">{format(selectedDate, 'MMM dd, yyyy')}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                className="w-auto p-0" 
                align="end" 
                sideOffset={4}
                onOpenAutoFocus={(e) => {
                  // Prevent auto-focusing on mobile to avoid keyboard popping up
                  if (window.innerWidth < 640) {
                    e.preventDefault();
                  }
                }}
                // Ensure popover stays within viewport on mobile
                forceMount
                style={{
                  maxWidth: 'calc(100vw - 32px)', // Keep 16px padding on each side
                  maxHeight: 'calc(100vh - 32px)', // Keep 16px padding on top and bottom
                }}
              >
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  initialFocus
                  className="rounded-md border max-w-full overflow-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleSortTimeZones}
              title="Sort by timezone offset"
              className="shrink-0"
            >
              <ArrowsUpDownIcon className="h-5 w-5" />
            </Button>
            <SettingsDialog 
              settings={timelineSettings}
              onSettingsChange={handleSettingsChange}
            />
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleResetTime}
              title="Reset to current time"
              className="shrink-0"
            >
              <ArrowPathIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {timeZones.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Welcome to ZonePal</h2>
            <p className="text-gray-500">Start by adding a timezone from the search box above</p>
          </div>
        ) : (
          timeZones.map((tz) => (
            <div key={tz.ianaName} className="bg-white rounded-lg p-6 pr-12 shadow-sm relative group">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemoveTimeZone(tz.ianaName)}
              >
                <XMarkIcon className="h-5 w-5" />
              </Button>
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-semibold">{tz.name}</h2>
                    <WeatherIcon 
                      city={tz.label}
                      country={tz.country}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex flex-col text-sm">
                    <span className="text-gray-400 text-xs">
                      {tz.ianaName}
                      {tz.dstOffset !== tz.utcOffset && " (observes DST)"}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <h3 className="text-3xl font-bold">{tz.time}</h3>
                  <div className="flex flex-col items-end">
                    <span className="text-gray-500">{tz.timezone}</span>
                    <span className="text-gray-400">{tz.date}</span>
                  </div>
                </div>
              </div>
              {/* Original Timeline (kept for reference) */}
              {/* <Timeline 
                ianaName={tz.ianaName}
                selectedDate={selectedDate}
                onTimeChange={handleTimeChange}
              /> */}
              {/* <div className="mt-8">
                <h3 className="text-sm font-medium text-gray-500 mb-4">Radix Version (POC):</h3> */}
                <TimelineRadix
                  ianaName={tz.ianaName}
                  selectedDate={selectedDate}
                  onTimeChange={handleTimeChange}
                  blockedTimeSlots={timelineSettings.blockedTimeSlots}
                  defaultBlockedHours={timelineSettings.defaultBlockedHours}
                  referenceTimezone={timelineSettings.referenceTimezone}
                />
              {/* </div> */}
            </div>
          ))
        )}
      </div>
    </div>
  );
} 