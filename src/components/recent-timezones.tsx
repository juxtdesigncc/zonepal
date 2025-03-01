import * as React from "react"
import { Button } from "@/components/ui/button"
import { ClockIcon } from "@heroicons/react/24/outline"
import { getRecentTimezones } from "@/lib/utils"
import { TimeZoneInfo, timezoneDatabase } from "@/lib/timezone"
import { usePostHog } from 'posthog-js/react'
import { trackEvent, EventCategory, EventAction } from '@/lib/analytics'

interface RecentTimezonesProps {
  onSelect: (timezone: TimeZoneInfo) => void;
  selectedTimezones: string[];
}

export function RecentTimezones({ onSelect, selectedTimezones }: RecentTimezonesProps) {
  const [recentTimezones, setRecentTimezones] = React.useState<TimeZoneInfo[]>([]);
  const posthog = usePostHog();

  // Load recent timezones on mount
  React.useEffect(() => {
    const recentIanaNames = getRecentTimezones();
    
    // Convert IANA names to timezone objects
    const timezones = recentIanaNames
      .map(name => timezoneDatabase.find(tz => tz.ianaName === name))
      .filter((tz): tz is TimeZoneInfo => tz !== undefined);
    
    setRecentTimezones(timezones);
  }, []);

  // Handle selecting a recent timezone
  const handleSelect = (timezone: TimeZoneInfo) => {
    trackEvent(posthog, EventCategory.TIMEZONE, EventAction.ADD, {
      timezone: timezone.ianaName,
      source: 'recent',
      timezone_name: timezone.name
    });
    
    onSelect(timezone);
  };

  // Don't render if no recent timezones
  if (recentTimezones.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
        <ClockIcon className="h-4 w-4" />
        <span>Recent</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {recentTimezones.map(timezone => {
          const isSelected = selectedTimezones.includes(timezone.ianaName);
          
          return (
            <Button
              key={timezone.ianaName}
              variant="outline"
              size="sm"
              disabled={isSelected}
              onClick={() => handleSelect(timezone)}
              className={isSelected ? 'opacity-50 cursor-not-allowed' : ''}
            >
              {timezone.label}
              <span className="ml-1 text-xs text-muted-foreground">
                ({timezone.countryCode})
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
} 