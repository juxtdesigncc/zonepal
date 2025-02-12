'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, ArrowsUpDownIcon, LinkIcon, MoonIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { TimeZoneInfo, defaultTimeZones, getTimeInTimeZone } from '@/lib/timezone';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TimezoneSearch } from '@/components/timezone-search';
import { Timeline } from '@/components/timezone-timeline';

export default function ZonePal() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [timeZones, setTimeZones] = useState<TimeZoneInfo[]>(() => 
    defaultTimeZones.map(tz => ({
      ...tz,
      ...getTimeInTimeZone(new Date(), tz.ianaName)
    }))
  );
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

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
      return [...prevZones, {
        ...newTimeZone,
        ...getTimeInTimeZone(selectedDate, newTimeZone.ianaName)
      }];
    });
  };

  const handleRemoveTimeZone = (ianaName: string) => {
    setTimeZones(prevZones => prevZones.filter(tz => tz.ianaName !== ianaName));
  };

  const handleSortTimeZones = () => {
    setTimeZones(prevZones => 
      [...prevZones].sort((a, b) => {
        const offsetA = parseInt(a.offset);
        const offsetB = parseInt(b.offset);
        return offsetA - offsetB;
      })
    );
  };

  return (
    <main className="container mx-auto p-4 max-w-7xl">
      <div className="flex items-center space-x-4 mb-8">
        <div className="flex-1">
          <TimezoneSearch 
            onSelect={handleAddTimeZone} 
            selectedTimezones={timeZones.map(tz => tz.ianaName)}
          />
        </div>
        <div className="relative z-40">
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-40">
                <CalendarIcon className="h-4 w-4 mr-2" />
                {format(selectedDate, 'MMM dd, yyyy')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end" sideOffset={4}>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                initialFocus
                className="rounded-md border"
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon">
            <CalendarIcon className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleSortTimeZones}>
            <ArrowsUpDownIcon className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <LinkIcon className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoonIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {timeZones.map((tz) => (
          <div key={tz.ianaName} className="bg-white rounded-lg p-6 shadow-sm relative group">
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
                <h2 className="text-2xl font-semibold">{tz.name}</h2>
                <p className="text-gray-500">{tz.location}</p>
              </div>
              <div className="text-right">
                <h3 className="text-3xl font-bold">{tz.time}</h3>
                <div className="flex items-center justify-end space-x-2">
                  <span className="text-gray-500">{tz.timezone}</span>
                  <span className="text-gray-400">{tz.date}</span>
                </div>
              </div>
            </div>
            <Timeline 
              ianaName={tz.ianaName}
              selectedDate={selectedDate}
              onTimeChange={handleTimeChange}
            />
          </div>
        ))}
      </div>
    </main>
  );
} 