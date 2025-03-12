'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';
import { Button } from '@/components/ui/button';
import { Calendar } from "@/components/ui/calendar";
import { Squares2X2Icon, ListBulletIcon, CalendarIcon, ArrowsUpDownIcon, PencilIcon } from '@heroicons/react/24/outline';
import { TimelineView } from '@/components/timeline-view';
import { TableView } from '@/components/table-view';
import { EventCategory, EventAction, trackEvent } from '@/lib/analytics';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TimezoneSearch } from '@/components/timezone-search';
import { cn } from '@/lib/utils';
import { SettingsDialog } from '@/components/settings-dialog';
import { TimeZoneInfo, findTimezoneByIana, getTimeInTimeZone } from '@/lib/timezone';
import { TimelineSettings } from '@/lib/types';
import { AuthNav } from '@/components/auth-nav';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

interface BlockedHours {
  [timezone: string]: number[];
}

type ViewType = 'cards' | 'grid';

export function Main() {
  const mounted = useRef(true);
  const [view, setView] = useState<ViewType>('cards');
  const posthog = usePostHog();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const searchTriggerRef = useRef<HTMLButtonElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();
  
  // Initialize timezones from URL
  const [timeZones, setTimeZones] = useState<TimeZoneInfo[]>(() => {
    const ianaNames = searchParams.get('z')?.split(',') || [];
    return ianaNames
      .map((name: string) => findTimezoneByIana(name))
      .filter((tz: unknown): tz is TimeZoneInfo => tz !== undefined)
      .map((tz: TimeZoneInfo) => ({
        ...tz,
        ...getTimeInTimeZone(new Date(), tz.ianaName)
      }));
  });

  // Initialize timeline settings from URL or default values
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

  // Get initial user and set up auth listener
  useEffect(() => {
    mounted.current = true;
    
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!mounted.current) return;
        
        console.log('Current user:', user);
        setUser(user);
        
        if (user) {
          // Load last used configuration
          const { data, error } = await supabase
            .from('timezone_configs')
            .select('*')
            .eq('user_id', user.id)
            .eq('name', 'Last Used Configuration')
            .single();
          
          if (!mounted.current) return;
          console.log('Loading last config:', { data, error });
          
          if (data && !error) {
            // Only update if URL doesn't have parameters
            const hasUrlParams = searchParams.has('z') || searchParams.has('b');
            if (!hasUrlParams) {
              // Update timezones
              const loadedTimezones = data.timezones
                .map((name: string) => findTimezoneByIana(name))
                .filter((tz: unknown): tz is TimeZoneInfo => tz !== undefined)
                .map((tz: TimeZoneInfo) => ({
                  ...tz,
                  ...getTimeInTimeZone(new Date(), tz.ianaName)
                }));
              setTimeZones(loadedTimezones);
              
              // Update blocked hours
              if (data.blocked_hours) {
                const blockedTimeSlots = data.blocked_hours
                  .split(',')
                  .map((block: string) => {
                    const [start, end] = block.split('-').map(Number);
                    return { start, end };
                  });
                setTimelineSettings(prev => ({
                  ...prev,
                  blockedTimeSlots,
                  defaultBlockedHours: blockedTimeSlots[0]
                }));
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user or config:', error);
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (mounted.current) {
          setUser(session?.user ?? null);
        }
      }
    );

    return () => {
      mounted.current = false;
      subscription.unsubscribe();
    };
  }, [searchParams]);

  // Auto-save configuration when changes are made
  useEffect(() => {
    if (!mounted.current) return;
    
    const saveConfig = async () => {
      console.log('Auto-save triggered', { user, timeZones: timeZones.length });
      if (!user || timeZones.length === 0) {
        console.log('Skipping save - no user or timezones');
        return;
      }

      try {
        const blockedHoursParam = timelineSettings.blockedTimeSlots
          .map(slot => `${slot.start}-${slot.end}`)
          .join(',');

        // First check if config exists
        const { data: existingConfig } = await supabase
          .from('timezone_configs')
          .select('id')
          .eq('user_id', user.id)
          .eq('name', 'Last Used Configuration')
          .single();

        if (!mounted.current) return;

        let result;
        if (existingConfig) {
          // Update existing config
          result = await supabase
            .from('timezone_configs')
            .update({
              timezones: timeZones.map((tz: TimeZoneInfo) => tz.ianaName),
              blocked_hours: blockedHoursParam,
              is_public: false
            })
            .eq('id', existingConfig.id);
        } else {
          // Insert new config
          result = await supabase
            .from('timezone_configs')
            .insert({
              user_id: user.id,
              name: 'Last Used Configuration',
              timezones: timeZones.map((tz: TimeZoneInfo) => tz.ianaName),
              blocked_hours: blockedHoursParam,
              is_public: false
            });
        }

        if (result.error) {
          console.error('Error saving config:', result.error);
        } else {
          console.log('Config saved successfully:', result.data);
        }
      } catch (error) {
        console.error('Error saving configuration:', error);
      }
    };

    // Debounce save to avoid too many database calls
    const timeoutId = setTimeout(saveConfig, 1000);
    return () => clearTimeout(timeoutId);
  }, [timeZones, timelineSettings.blockedTimeSlots, user]);

  // Update times every minute and when selectedDate changes
  useEffect(() => {
    if (!mounted.current) return;

    const updateTimes = () => {
      if (!mounted.current) return;
      setTimeZones(prevZones => 
        prevZones.map(tz => ({
          ...tz,
          ...getTimeInTimeZone(selectedDate, tz.ianaName)
        }))
      );
    };

    updateTimes();
    const interval = setInterval(updateTimes, 60000);
    return () => {
      mounted.current = false;
      clearInterval(interval);
    };
  }, [selectedDate, timeZones]);

  // Update URL when timezones or blocked hours change
  useEffect(() => {
    const timeZoneString = timeZones.map(tz => tz.ianaName).join(',');
    const blockedHoursString = timelineSettings.blockedTimeSlots
      .map(slot => `${slot.start}-${slot.end}`)
      .join(',');
    
    const url = timeZoneString 
      ? `/?z=${timeZoneString}&b=${blockedHoursString}`
      : `/?b=${blockedHoursString}`;
    
    router.push(url);
  }, [timeZones, timelineSettings.blockedTimeSlots, router]);

  const handleToggleEditMode = useCallback(() => {
    setIsEditMode(prev => !prev);
    trackEvent(posthog, EventCategory.UI, EventAction.TOGGLE, {
      action: isEditMode ? 'edit_mode_off' : 'edit_mode_on'
    });
  }, [posthog, isEditMode]);

  const handleSort = useCallback(() => {
    setTimeZones(prevZones => {
      const sortedZones = [...prevZones].sort((a, b) => {
        const aTime = new Date(`${a.date} ${a.time}`);
        const bTime = new Date(`${b.date} ${b.time}`);
        return aTime.getTime() - bTime.getTime();
      });
      
      trackEvent(posthog, EventCategory.TIMEZONE, EventAction.SORT, {
        count: sortedZones.length,
        view
      });
      return sortedZones;
    });
  }, [posthog, view]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if user is typing in an input field
      if (
        e.target instanceof HTMLInputElement || 
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }
      
      // Handle keyboard shortcuts
      if (e.key.toLowerCase() === 'e' && view === 'cards') {
        handleToggleEditMode();
      } else if (e.key.toLowerCase() === 's') {
        handleSort();
      } else if (e.key.toLowerCase() === 'r') {
        handleDateSelect(new Date());
      } else if (e.key.toLowerCase() === 'k') {
        // Prevent default to avoid typing 'k' in the search box
        e.preventDefault();
        // Focus on the search input
        if (searchTriggerRef.current) {
          searchTriggerRef.current.click();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [view, handleSort, handleToggleEditMode]);

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
  }, [timeZones, timelineSettings.blockedTimeSlots]);

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
      // Update all timezone times when date changes
      setTimeZones(prevZones => 
        prevZones.map(tz => ({
          ...tz,
          ...getTimeInTimeZone(date, tz.ianaName)
        }))
      );
      setIsCalendarOpen(false);
    }
  };

  const handleTimeChange = (newDate: Date) => {
    setSelectedDate(newDate);
    // Update all timezone times when time changes
    setTimeZones(prevZones => 
      prevZones.map(tz => ({
        ...tz,
        ...getTimeInTimeZone(newDate, tz.ianaName)
      }))
    );
  };

  const handleAddTimeZone = (timezone: TimeZoneInfo) => {
    setTimeZones(prev => {
      if (prev.some(tz => tz.ianaName === timezone.ianaName)) return prev;
      const updatedZone = {
        ...timezone,
        ...getTimeInTimeZone(selectedDate, timezone.ianaName)
      };
      const updatedZones = [...prev, updatedZone];
      
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
              className={view === 'cards' ? 'bg-primary text-primary-foreground' : ''}
            >
              <ListBulletIcon className="h-4 w-4 mr-1" />
              Cards
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewChange('grid')}
              className={view === 'grid' ? 'bg-primary text-primary-foreground' : ''}
            >
              <Squares2X2Icon className="h-4 w-4 mr-1" />
              Grid
            </Button>
          </div>
        </div>

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
                onClick={handleSort}
                title="Sort by timezone offset (S)"
                className="shrink-0"
              >
                <ArrowsUpDownIcon className="h-5 w-5" />
                <span className="sr-only">Sort timezones</span>
              </Button>
              <SettingsDialog 
                settings={timelineSettings}
                onSettingsChange={handleSettingsChange}
                timeZones={timeZones.map(tz => ({ name: tz.name, ianaName: tz.ianaName }))}
              />
              {view === 'cards' && (
                <Button 
                  variant={isEditMode ? "default" : "ghost"}
                  size="icon"
                  onClick={handleToggleEditMode}
                  title={isEditMode ? "Exit edit mode (E)" : "Edit time values (E)"}
                  className="shrink-0"
                  aria-pressed={isEditMode}
                >
                  <PencilIcon className="h-5 w-5" />
                  <span className="sr-only">{isEditMode ? "Exit edit mode" : "Edit time values"}</span>
                </Button>
              )}
              <AuthNav />
            </div>
          </div>
        </div>

        {view === 'cards' ? (
          <TimelineView 
            timeZones={timeZones}
            selectedDate={selectedDate}
            onTimeChange={handleTimeChange}
            onRemoveTimeZone={handleRemoveTimeZone}
            timelineSettings={timelineSettings}
            isEditMode={isEditMode}
          />
        ) : (
          <TableView
            timezones={timeZones.length > 0 ? timeZones.map(tz => tz.ianaName) : ['UTC']}
            date={selectedDate}
            blockedHours={blockedHours}
          />
        )}
      </div>
    </main>
  );
} 