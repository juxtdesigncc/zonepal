'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';
import { Button } from '@/components/ui/button';
import { Calendar } from "@/components/ui/calendar";
import { Squares2X2Icon, ListBulletIcon, CalendarIcon, ArrowsUpDownIcon, PencilIcon } from '@heroicons/react/24/outline';
import { ZonePalContent } from '@/components/zonepal-content';
import TimezoneGrid from '@/components/timezone-grid';
import { EventCategory, EventAction, trackEvent } from '@/lib/analytics';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TimezoneSearch } from '@/components/timezone-search';
import { cn } from '@/lib/utils';
import { SettingsDialog } from '@/components/settings-dialog';
import { TimeZoneInfo, findTimezoneByIana, getTimeInTimeZone } from '@/lib/timezone';
import { TimelineSettings } from '@/lib/types';

interface ViewControlsProps {
  selectedDate: Date;
  onDateSelect: (date: Date | undefined) => void;
  isCalendarOpen: boolean;
  setIsCalendarOpen: (open: boolean) => void;
  onAddTimeZone: (timezone: TimeZoneInfo) => void;
  selectedTimezones: string[];
  searchTriggerRef: React.RefObject<HTMLButtonElement>;
  onSort: () => void;
  isEditMode: boolean;
  onToggleEditMode: () => void;
  timelineSettings: TimelineSettings;
  onSettingsChange: (settings: TimelineSettings) => void;
  timeZones: TimeZoneInfo[];
  showEditMode?: boolean;
}

function ViewControls({
  selectedDate,
  onDateSelect,
  isCalendarOpen,
  setIsCalendarOpen,
  onAddTimeZone,
  selectedTimezones,
  searchTriggerRef,
  onSort,
  isEditMode,
  onToggleEditMode,
  timelineSettings,
  onSettingsChange,
  timeZones,
  showEditMode = true
}: ViewControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-4 mb-8">
      <div className="flex-1 min-w-0">
        <TimezoneSearch 
          onSelect={onAddTimeZone} 
          selectedTimezones={selectedTimezones}
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
          {showEditMode && (
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
          )}
        </div>
      </div>
    </div>
  );
}

interface BlockedHours {
  [timezone: string]: number[];
}

type ViewType = 'cards' | 'grid';

export function MainContent() {
  const [view, setView] = useState<ViewType>('cards');
  const posthog = usePostHog();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const searchTriggerRef = useRef<HTMLButtonElement>(null);
  
  // Initialize timezones from URL
  const [timeZones, setTimeZones] = useState<TimeZoneInfo[]>(() => {
    const ianaNames = searchParams.get('z')?.split(',') || [];
    return ianaNames
      .map(name => findTimezoneByIana(name))
      .filter((tz): tz is TimeZoneInfo => tz !== undefined)
      .map(tz => ({
        ...tz,
        ...getTimeInTimeZone(new Date(), tz.ianaName)
      }));
  });

  // Initialize timeline settings from URL
  const [timelineSettings, setTimelineSettings] = useState<TimelineSettings>(() => {
    const blockedParam = searchParams.get('b');
    const blockedTimeSlots = blockedParam 
      ? blockedParam.split(',').map(block => {
          const [start, end] = block.split('-').map(Number);
          return { start, end };
        })
      : [{ start: 22, end: 6 }];
    
    return {
      blockedTimeSlots,
      defaultBlockedHours: blockedTimeSlots[0],
      referenceTimezone: 'UTC'
    };
  });

  // Update URL when timezones or blocked hours change
  useEffect(() => {
    const zParam = timeZones.map(tz => tz.ianaName).join(',');
    const bParam = timelineSettings.blockedTimeSlots
      .map(slot => `${slot.start}-${slot.end}`)
      .join(',');
    
    const url = zParam 
      ? `/?z=${zParam}&b=${bParam}`
      : `/?b=${bParam}`;
    
    router.push(url);
  }, [timeZones, timelineSettings, router]);

  // Get blocked hours for grid view
  const blockedHours = useMemo(() => {
    const blocks: BlockedHours = {};
    
    timeZones.forEach(tz => {
      blocks[tz.ianaName] = [];
      timelineSettings.blockedTimeSlots.forEach(slot => {
        if (slot.start > slot.end) {
          // Handle overnight blocks
          for (let h = slot.start; h < 24; h++) blocks[tz.ianaName].push(h);
          for (let h = 0; h <= slot.end; h++) blocks[tz.ianaName].push(h);
        } else {
          for (let h = slot.start; h <= slot.end; h++) blocks[tz.ianaName].push(h);
        }
      });
    });

    return blocks;
  }, [timeZones, timelineSettings]);

  // Track view changes
  const handleViewChange = (newView: ViewType) => {
    setView(newView);
    trackEvent(posthog, EventCategory.UI, EventAction.CHANGE, {
      view: newView,
      source: 'view_toggle'
    });
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setIsCalendarOpen(false);
    }
  };

  const handleToggleEditMode = () => {
    setIsEditMode(!isEditMode);
    trackEvent(posthog, EventCategory.UI, EventAction.TOGGLE, {
      action: isEditMode ? 'edit_mode_off' : 'edit_mode_on'
    });
  };

  const handleAddTimeZone = (timezone: TimeZoneInfo) => {
    setTimeZones(prev => {
      if (prev.some(tz => tz.ianaName === timezone.ianaName)) return prev;
      const updatedZones = [...prev, timezone];
      
      // Track timezone added
      trackEvent(posthog, EventCategory.TIMEZONE, EventAction.ADD, {
        timezone: timezone.ianaName,
        total_count: updatedZones.length,
        view
      });
      
      return updatedZones;
    });
  };

  const handleRemoveTimeZone = (ianaName: string) => {
    setTimeZones(prev => {
      const updatedZones = prev.filter(tz => tz.ianaName !== ianaName);
      
      // Track timezone removed
      trackEvent(posthog, EventCategory.TIMEZONE, EventAction.REMOVE, {
        timezone: ianaName,
        total_count: updatedZones.length,
        view
      });
      
      return updatedZones;
    });
  };

  const handleSort = () => {
    setTimeZones(prev => {
      const sortedZones = [...prev].sort((a, b) => a.utcOffset - b.utcOffset);
      
      // Track timezone sorting
      trackEvent(posthog, EventCategory.TIMEZONE, EventAction.SORT, {
        count: sortedZones.length,
        view
      });
      
      return sortedZones;
    });
  };

  const handleSettingsChange = (settings: TimelineSettings) => {
    setTimelineSettings(settings);
    
    // Track settings change
    trackEvent(posthog, EventCategory.BLOCKED_HOURS, EventAction.UPDATE, {
      count: settings.blockedTimeSlots.length,
      blocks: settings.blockedTimeSlots.map(slot => `${slot.start}-${slot.end}`),
      view
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-8">
      <div className="w-full max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">ZonePal</h1>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewChange('cards')}
              className={view === ('cards' as ViewType) ? 'bg-primary text-primary-foreground' : ''}
            >
              <ListBulletIcon className="h-4 w-4 mr-1" />
              Cards
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewChange('grid')}
              className={view === ('grid' as ViewType) ? 'bg-primary text-primary-foreground' : ''}
            >
              <Squares2X2Icon className="h-4 w-4 mr-1" />
              Grid
            </Button>
          </div>
        </div>

        {view === ('cards' as ViewType) ? (
          <ZonePalContent 
            initialTimezones={timeZones.map(tz => tz.ianaName)}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            isCalendarOpen={isCalendarOpen}
            setIsCalendarOpen={setIsCalendarOpen}
            isEditMode={isEditMode}
            onToggleEditMode={handleToggleEditMode}
            searchTriggerRef={searchTriggerRef}
            timelineSettings={timelineSettings}
            onSettingsChange={handleSettingsChange}
            onAddTimeZone={handleAddTimeZone}
            onRemoveTimeZone={handleRemoveTimeZone}
            onSort={handleSort}
          />
        ) : (
          <>
            <ViewControls
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              isCalendarOpen={isCalendarOpen}
              setIsCalendarOpen={setIsCalendarOpen}
              onAddTimeZone={handleAddTimeZone}
              selectedTimezones={timeZones.map(tz => tz.ianaName)}
              searchTriggerRef={searchTriggerRef}
              onSort={handleSort}
              isEditMode={view === ('cards' as ViewType) ? isEditMode : false}
              onToggleEditMode={handleToggleEditMode}
              timelineSettings={timelineSettings}
              onSettingsChange={handleSettingsChange}
              timeZones={timeZones}
              showEditMode={view === ('cards' as ViewType)}
            />
            <TimezoneGrid
              timezones={timeZones.length > 0 ? timeZones.map(tz => tz.ianaName) : ['UTC']}
              date={selectedDate}
              blockedHours={blockedHours}
            />
          </>
        )}
      </div>
    </main>
  );
} 