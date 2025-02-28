'use client';

import { TimeZoneInfo } from '@/lib/timezone';
import { TimelineRadix } from '@/components/timeline-radix';
import { WeatherIcon } from '@/components/weather-icon';
import { XMarkIcon } from "@heroicons/react/24/outline";
import { TimelineSettings } from '@/lib/types';
import { usePostHog } from 'posthog-js/react';
import { trackEvent, EventCategory, EventAction } from '@/lib/analytics';

interface TimezoneCardProps {
  timezone: TimeZoneInfo;
  selectedDate: Date;
  onTimeChange: (newDate: Date) => void;
  onRemove: (ianaName: string) => void;
  timelineSettings: TimelineSettings;
}

export function TimezoneCard({
  timezone,
  selectedDate,
  onTimeChange,
  onRemove,
  timelineSettings
}: TimezoneCardProps) {
  const posthog = usePostHog();
  
  const handleRemove = () => {
    // Track timezone removal in the card component
    trackEvent(posthog, EventCategory.TIMEZONE, EventAction.REMOVE, {
      timezone: timezone.ianaName,
      source: 'card_remove_button'
    });
    
    onRemove(timezone.ianaName);
  };

  return (
    <div className="bg-white rounded-lg p-6 pr-12 shadow-sm relative group">
      {/* Remove timezone button */}
      <button
        onClick={handleRemove}
        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
        aria-label={`Remove ${timezone.name} timezone`}
      >
        <XMarkIcon className="h-5 w-5" />
      </button>
      
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg md:text-3xl font-semibold">{timezone.name}</h2>
            <WeatherIcon 
              city={timezone.label}
              country={timezone.country}
              className="mt-1"
            />
          </div>
          <div className="flex flex-col text-sm">
            <span className="text-gray-400 text-xs">
              {timezone.ianaName}
              {timezone.dstOffset !== timezone.utcOffset && " (observes DST)"}
            </span>
          </div>
        </div>
        <div className="text-right">
          <h3 className="text-lg md:text-3xl font-bold">{timezone.time}</h3>
          <div className="flex flex-col items-end">
            <span className="text-sm md:text-md text-gray-500">{timezone.timezone}</span>
            <span className="text-sm md:text-md text-gray-400">{timezone.date}</span>
          </div>
        </div>
      </div>
      <TimelineRadix
        ianaName={timezone.ianaName}
        selectedDate={selectedDate}
        onTimeChange={onTimeChange}
        blockedTimeSlots={timelineSettings.blockedTimeSlots}
        defaultBlockedHours={timelineSettings.defaultBlockedHours}
        referenceTimezone={timelineSettings.referenceTimezone}
      />
    </div>
  );
} 