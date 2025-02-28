'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, ArrowsUpDownIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { TimeZoneInfo, getTimeInTimeZone, findTimezoneByIana, parseTimezoneParam, getTimezoneParam } from '@/lib/timezone';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TimezoneSearch } from '@/components/timezone-search';
import { cn } from '@/lib/utils';
import { TimelineSettings } from '@/lib/types';
import { SettingsDialog } from '@/components/settings-dialog';
import { usePostHog } from 'posthog-js/react';
import { trackEvent, EventCategory, EventAction } from '@/lib/analytics';
import { TimezoneCard } from '@/components/timezone-card';

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

// Add these utility functions at the top level
const parseBlockedHoursParam = (param: string): { start: number; end: number }[] => {
  try {
    // Split by comma for multiple blocks, then split each block by hyphen
    return param.split(',').map(block => {
      const [start, end] = block.split('-').map(Number);
      if (!isNaN(start) && !isNaN(end) && start >= 0 && start < 24 && end >= 0 && end < 24) {
        return { start, end };
      }
      throw new Error('Invalid block format');
    });
  } catch (error) {
    return [{ start: 22, end: 6 }]; // Default values
  }
};

const getBlockedHoursParam = (blocks: { start: number; end: number }[]): string => {
  return blocks.map(block => `${block.start}-${block.end}`).join(',');
};

// Track if we've already logged initialization
let hasLoggedInitialization = false;
let hasLoggedTimezoneInit = false;
let hasLoggedBlockedHoursInit = false;

export function ZonePalContent() {
  const posthog = usePostHog();
  
  // Only log this once on initial load
  if (!hasLoggedInitialization) {
    console.log('ZONEPAL CONTENT LOADED - THIS SHOULD APPEAR IN CONSOLE');
    hasLoggedInitialization = true;
  }
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [timeZones, setTimeZones] = useState<TimeZoneInfo[]>([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const searchTriggerRef = useRef<HTMLButtonElement>(null);
  const [timelineSettings, setTimelineSettings] = useState<TimelineSettings>(() => {
    const blockedParam = searchParams.get('b');
    
    const blockedTimeSlots = blockedParam 
      ? parseBlockedHoursParam(blockedParam).map(block => ({
          ...block,
          ianaName: undefined // These are global blocks
        }))
      : [{ start: 22, end: 6 }];
    
    return {
      blockedTimeSlots,
      defaultBlockedHours: blockedTimeSlots[0], // Use first block as default
      referenceTimezone: 'UTC' // This is kept for backward compatibility
    };
  });
  
  // Keep pinnedTimezone state but hide it from UI
  const [pinnedTimezone, setPinnedTimezone] = useState<string | null>(null);

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

  // Initialize timezones and blocked hours from URL
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
      
      // Only log timezone initialization once
      if (!hasLoggedTimezoneInit) {
        console.log('Initializing timezones from URL:', zones.map(z => z.ianaName));
        hasLoggedTimezoneInit = true;
        
        // Track initial timezone count
        trackEvent(posthog, EventCategory.TIMEZONE, EventAction.UPDATE, {
          count: zones.length,
          timezones: zones.map(z => z.ianaName),
          source: 'url_init'
        });
      }
      
      setTimeZones(zones);
      
      // If we have a pinned timezone, make sure it's the reference
      if (pinnedTimezone && zones.some(tz => tz.ianaName === pinnedTimezone)) {
        handleReferenceTimezoneChange(pinnedTimezone);
      }
    }

    // Read blocked hours from URL
    const blockedParam = searchParams.get('b');
    if (blockedParam) {
      const blockedTimeSlots = parseBlockedHoursParam(blockedParam).map(block => ({
        ...block,
        ianaName: undefined // These are global blocks
      }));
      
      // Only log blocked hours initialization once
      if (!hasLoggedBlockedHoursInit) {
        console.log('Initializing blocked hours from URL:', blockedTimeSlots);
        hasLoggedBlockedHoursInit = true;
        
        // Track initial blocked hours
        trackEvent(posthog, EventCategory.BLOCKED_HOURS, EventAction.UPDATE, {
          count: blockedTimeSlots.length,
          blocks: blockedTimeSlots.map(slot => `${slot.start}-${slot.end}`),
          source: 'url_init'
        });
      }
      
      setTimelineSettings(prev => ({
        ...prev,
        blockedTimeSlots,
        defaultBlockedHours: blockedTimeSlots[0] // Use first block as default
      }));
    }
  }, [searchParams, selectedDate, pinnedTimezone, posthog]);

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
      if (prevZones.some(tz => tz.ianaName === newTimeZone.ianaName)) {
        return prevZones;
      }
      const updatedZones = [...prevZones, {
        ...newTimeZone,
        ...getTimeInTimeZone(selectedDate, newTimeZone.ianaName)
      }];
      
      // Track timezone added
      trackEvent(posthog, EventCategory.TIMEZONE, EventAction.ADD, {
        timezone: newTimeZone.ianaName,
        timezone_name: newTimeZone.name,
        total_count: updatedZones.length
      });
      
      // Update URL with both timezone and blocked hours
      const zParam = getTimezoneParam(updatedZones);
      const bParam = getBlockedHoursParam(timelineSettings.blockedTimeSlots);
      router.push(`/?z=${zParam}&b=${bParam}`);
      
      return updatedZones;
    });
  };

  const handleRemoveTimeZone = (ianaName: string) => {
    setTimeZones(prevZones => {
      const updatedZones = prevZones.filter(tz => tz.ianaName !== ianaName);
      
      // Track timezone removed - this is now handled in the TimezoneCard component
      // We keep this here for when timezones are removed through other means
      trackEvent(posthog, EventCategory.TIMEZONE, EventAction.REMOVE, {
        timezone: ianaName,
        total_count: updatedZones.length,
        source: 'parent_component'
      });
      
      // Update URL
      if (updatedZones.length > 0) {
        const zParam = getTimezoneParam(updatedZones);
        const bParam = getBlockedHoursParam(timelineSettings.blockedTimeSlots);
        router.push(`/?z=${zParam}&b=${bParam}`);
      } else {
        // If no timezones, keep blocked hours in URL
        const bParam = getBlockedHoursParam(timelineSettings.blockedTimeSlots);
        router.push(`/?b=${bParam}`);
      }
      
      return updatedZones;
    });
  };

  const handleSortTimeZones = () => {
    setTimeZones(prevZones => {
      // Sort by UTC offset
      const sortedZones = [...prevZones].sort((a, b) => a.utcOffset - b.utcOffset);
      
      // Track timezone sorting
      trackEvent(posthog, EventCategory.TIMEZONE, EventAction.SORT, {
        count: sortedZones.length
      });
      
      // Update URL
      const zParam = getTimezoneParam(sortedZones);
      const bParam = getBlockedHoursParam(timelineSettings.blockedTimeSlots);
      router.push(`/?z=${zParam}&b=${bParam}`);
      
      return sortedZones;
    });
  };

  const handleResetTime = () => {
    setSelectedDate(new Date());
    
    // Track time reset
    trackEvent(posthog, EventCategory.UI, EventAction.RESET, {
      action: 'reset_time'
    });
  };

  const handleSettingsChange = (newSettings: TimelineSettings) => {
    // Log only the essential information
    console.log('Settings change: blocked hours updated to', 
      newSettings.blockedTimeSlots.map(slot => `${slot.start}-${slot.end}`).join(', '));
    
    // Track settings change
    trackEvent(posthog, EventCategory.BLOCKED_HOURS, EventAction.UPDATE, {
      count: newSettings.blockedTimeSlots.length,
      blocks: newSettings.blockedTimeSlots.map(slot => `${slot.start}-${slot.end}`)
    });
    
    // Keep the existing reference timezone
    const updatedSettings = {
      ...newSettings,
      referenceTimezone: timelineSettings.referenceTimezone
    };
    
    // Make sure to set the defaultBlockedHours to the first slot
    if (newSettings.blockedTimeSlots.length > 0) {
      updatedSettings.defaultBlockedHours = newSettings.blockedTimeSlots[0];
    }
    
    setTimelineSettings(updatedSettings);

    // Update URL with new blocked hours
    const searchParams = new URLSearchParams(window.location.search);
    const zParam = searchParams.get('z');
    const bParam = getBlockedHoursParam(newSettings.blockedTimeSlots);
    
    if (zParam) {
      router.push(`/?z=${zParam}&b=${bParam}`);
    } else {
      router.push(`/?b=${bParam}`);
    }
  };

  // Keep reference timezone functionality but hide it from UI
  const handleReferenceTimezoneChange = (newReferenceTimezone: string, oldReferenceTimezone?: string) => {
    // Only log when there's an actual change
    if (newReferenceTimezone !== (oldReferenceTimezone || timelineSettings.referenceTimezone)) {
      console.log(`Reference timezone changed: ${oldReferenceTimezone || timelineSettings.referenceTimezone} → ${newReferenceTimezone}`);
    }
    
    // Simply update the reference timezone without converting blocked hours
    // This ensures that blocked hours remain at the same local time in each timezone
    setTimelineSettings(prev => ({
      ...prev,
      referenceTimezone: newReferenceTimezone
    }));
  };

  // Update settings when first timezone is added (but not when sorting)
  useEffect(() => {
    // Check if we need to set the reference timezone
    // We need to update if:
    // 1. We have timezones but the reference is still UTC (initial state)
    // 2. We have a pinned timezone that doesn't match the current reference
    const needsReferenceTimezone = 
      (timeZones.length > 0 && timelineSettings.referenceTimezone === 'UTC') ||
      (pinnedTimezone && pinnedTimezone !== timelineSettings.referenceTimezone && 
       timeZones.some(tz => tz.ianaName === pinnedTimezone));
    
    // Only log when there's a change needed to reduce noise
    if (needsReferenceTimezone) {
      console.log('Reference timezone needs update:', {
        current: timelineSettings.referenceTimezone,
        pinned: pinnedTimezone || 'none',
        willChangeTo: pinnedTimezone || (timeZones.length > 0 ? timeZones[0].ianaName : 'UTC')
      });
    }
    
    if (needsReferenceTimezone) {
      // If we have a pinned timezone, use that as reference
      if (pinnedTimezone && timeZones.some(tz => tz.ianaName === pinnedTimezone)) {
        console.log('Setting reference timezone to pinned timezone:', pinnedTimezone);
        handleReferenceTimezoneChange(pinnedTimezone);
      } 
      // Otherwise use the first timezone in the list
      else if (timeZones.length > 0) {
        console.log('Setting reference timezone to first timezone:', timeZones[0].ianaName);
        handleReferenceTimezoneChange(timeZones[0].ianaName);
      }
    }
  }, [timeZones, timelineSettings.referenceTimezone, pinnedTimezone]);

  // Keep the function but don't expose it in the UI
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleTogglePin = (ianaName: string) => {
    if (pinnedTimezone === ianaName) {
      // Unpin - but keep the reference timezone as is
      console.log(`Unpinning timezone: ${ianaName}`);
      setPinnedTimezone(null);
      
      // Track unpin action
      trackEvent(posthog, EventCategory.TIMEZONE, EventAction.TOGGLE, {
        action: 'unpin',
        timezone: ianaName
      });
    } else {
      console.log(`Pinning timezone: ${ianaName} (previous reference: ${timelineSettings.referenceTimezone})`);
      
      // Track pin action
      trackEvent(posthog, EventCategory.TIMEZONE, EventAction.TOGGLE, {
        action: 'pin',
        timezone: ianaName,
        previous_reference: timelineSettings.referenceTimezone
      });
      
      // Pin this timezone and make it the reference
      setPinnedTimezone(ianaName);
      
      // Instead of converting the blocked hours, we'll keep the same local time blocks
      // but change the reference timezone
      setTimelineSettings(prev => ({
        ...prev,
        referenceTimezone: ianaName
      }));
      
      // Move this timezone to the top - but only do this once
      // We're using a separate function to avoid the useEffect triggering another reordering
      const reorderTimezones = () => {
        setTimeZones(prevZones => {
          const pinnedZone = prevZones.find(tz => tz.ianaName === ianaName);
          if (!pinnedZone) return prevZones;
          
          const otherZones = prevZones.filter(tz => tz.ianaName !== ianaName);
          const newZones = [pinnedZone, ...otherZones];
          
          console.log(`Reordering timezones to put ${ianaName} at the top`);
          
          // Update URL
          const zParam = getTimezoneParam(newZones);
          const bParam = getBlockedHoursParam(timelineSettings.blockedTimeSlots);
          router.push(`/?z=${zParam}&b=${bParam}`);
          
          return newZones;
        });
      };
      
      // Execute the reordering once
      reorderTimezones();
    }
  };

  return (
    <div>
      {/* Debug Panel */}
      {/* <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <h3 className="font-bold text-yellow-800 mb-2">Debug Information</h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-white p-2 rounded">
            <strong>Local Time Blocks:</strong> Enabled
          </div>
          <div className="bg-white p-2 rounded">
            <strong>Reference Timezone:</strong> {timelineSettings.referenceTimezone} (hidden from UI)
          </div>
          <div className="bg-white p-2 rounded">
            <strong>Pinned Timezone:</strong> {pinnedTimezone || 'none'} (hidden from UI)
          </div>
          <div className="bg-white p-2 rounded">
            <strong>Timezones:</strong> {timeZones.map(tz => tz.ianaName).join(', ') || 'none'}
          </div>
          <div className="bg-white p-2 rounded">
            <strong>Blocked Hours:</strong> {timelineSettings.blockedTimeSlots.map(slot => 
              `${slot.start}-${slot.end}`).join(', ')}
          </div>
        </div>
      </div> */}

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
              timeZones={timeZones.map(tz => ({ name: tz.name, ianaName: tz.ianaName }))}
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

      {/* Local time indicator */}
      {/* {timeZones.length > 0 && (
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-md border border-gray-100">
          <ClockIcon className="h-4 w-4 text-blue-500" />
          <span>
            Blocked hours are shown in local time for each timezone
          </span>
          <div className="ml-auto text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
            Debug: Using local time blocks (reference timezone functionality is hidden)
          </div>
        </div>
      )} */}

      <div className="space-y-6">
        {timeZones.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Welcome to ZonePal</h2>
            <p className="text-gray-500">Start by adding a timezone from the search box above</p>
          </div>
        ) : (
          timeZones.map((timezone) => (
            <TimezoneCard
              key={timezone.ianaName}
              timezone={timezone}
              selectedDate={selectedDate}
              onTimeChange={handleTimeChange}
              onRemove={handleRemoveTimeZone}
              timelineSettings={timelineSettings}
            />
          ))
        )}
      </div>
    </div>
  );
} 