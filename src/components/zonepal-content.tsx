'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, ArrowsUpDownIcon, ArrowPathIcon, PencilIcon, RadioIcon } from "@heroicons/react/24/outline";
import { TimeZoneInfo, getTimeInTimeZone, findTimezoneByIana } from '@/lib/timezone';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TimezoneSearch } from '@/components/timezone-search';
import { cn } from '@/lib/utils';
import { TimelineSettings } from '@/lib/types';
import { SettingsDialog } from '@/components/settings-dialog';
import { TimezoneCard } from '@/components/timezone-card';
import { addMultipleToRecentTimezones } from '@/lib/utils';

// Custom Pin Icon component - kept for future use but currently hidden from UI
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PinIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 2L12 5" />
    <path d="M12 14L12 22" />
    <path d="M5 5H19L17 10H7L5 5Z" />
    <path d="M7 10L8 14H16L17 10" />
  </svg>
);

interface ZonePalContentProps {
  initialTimezones?: string[];
  selectedDate: Date;
  onDateSelect: (date: Date | undefined) => void;
  isCalendarOpen: boolean;
  setIsCalendarOpen: (open: boolean) => void;
  isEditMode: boolean;
  onToggleEditMode: () => void;
  searchTriggerRef: React.RefObject<HTMLButtonElement>;
  timelineSettings: TimelineSettings;
  onSettingsChange: (settings: TimelineSettings) => void;
  onAddTimeZone: (timezone: TimeZoneInfo) => void;
  onRemoveTimeZone: (ianaName: string) => void;
  onSort: () => void;
}

export function ZonePalContent({
  initialTimezones = [],
  selectedDate,
  onDateSelect,
  isCalendarOpen,
  setIsCalendarOpen,
  isEditMode,
  onToggleEditMode,
  searchTriggerRef,
  timelineSettings,
  onSettingsChange,
  onAddTimeZone,
  onRemoveTimeZone,
  onSort
}: ZonePalContentProps) {
  const [timeZones, setTimeZones] = useState<TimeZoneInfo[]>([]);

  // Initialize timezones
  useEffect(() => {
    if (initialTimezones.length > 0) {
      const zones = initialTimezones
        .map(name => findTimezoneByIana(name))
        .filter((tz): tz is TimeZoneInfo => tz !== undefined)
        .map(tz => ({
          ...tz,
          ...getTimeInTimeZone(selectedDate, tz.ianaName)
        }));

      setTimeZones(zones);
      addMultipleToRecentTimezones(zones.map(z => z.ianaName));
    }
  }, [initialTimezones, selectedDate]);

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

    const interval = setInterval(updateTimes, 60000);
    updateTimes();

    return () => clearInterval(interval);
  }, [selectedDate]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-4 mb-8">
        <div className="flex-1 min-w-0">
          <TimezoneSearch 
            onSelect={onAddTimeZone}
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
                    "md:w-40",
                    "w-10 px-0 md:px-4",
                    selectedDate.toDateString() !== new Date().toDateString() && "bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300"
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
                  if (window.innerWidth < 640) {
                    e.preventDefault();
                  }
                }}
                forceMount
                style={{
                  maxWidth: 'calc(100vw - 32px)',
                  maxHeight: 'calc(100vh - 32px)',
                }}
              >
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={onDateSelect}
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
              onClick={onSort}
              title="Sort by timezone offset (S)"
              className="shrink-0"
            >
              <ArrowsUpDownIcon className="h-5 w-5" />
              <span className="sr-only">Sort timezones</span>
            </Button>
            <SettingsDialog 
              settings={timelineSettings}
              onSettingsChange={onSettingsChange}
              timeZones={timeZones.map(tz => ({ name: tz.name, ianaName: tz.ianaName }))}
            />
            <Button 
              variant={isEditMode ? "default" : "ghost"}
              size="icon"
              onClick={onToggleEditMode}
              title={isEditMode ? "Exit edit mode (E)" : "Edit time values (E)"}
              className="shrink-0"
              aria-pressed={isEditMode}
            >
              <PencilIcon className="h-5 w-5" />
              <span className="sr-only">{isEditMode ? "Exit edit mode" : "Edit time values"}</span>
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onDateSelect(new Date())}
              title="Reset to current time (R)"
              className="shrink-0"
            >
              <ArrowPathIcon className="h-5 w-5" />
              <span className="sr-only">Reset to current time</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {timeZones.length === 0 ? (
          <div className="text-center py-12">
            <RadioIcon className="h-16 w-16 mx-auto mb-4 text-slate-500" />
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Welcome to ZonePal</h2>
            <p className="text-gray-500">Start by adding a timezone from the search box</p>
          </div>
        ) : (
          timeZones.map((timezone) => (
            <TimezoneCard
              key={timezone.ianaName}
              timezone={timezone}
              selectedDate={selectedDate}
              onTimeChange={onDateSelect}
              onRemove={onRemoveTimeZone}
              timelineSettings={timelineSettings}
              isEditMode={isEditMode}
            />
          ))
        )}
      </div>
    </div>
  );
} 