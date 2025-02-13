import * as React from "react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "@heroicons/react/24/outline"
import { TimeZoneInfo, timezoneDatabase } from "@/lib/timezone"
import { formatInTimeZone } from 'date-fns-tz'

interface TimezoneSearchProps {
  onSelect: (timezone: TimeZoneInfo) => void;
  selectedTimezones?: string[]; // Array of selected IANA timezone names
}

interface GroupedTimezones {
  [key: string]: TimeZoneInfo[];
}

// Memoized timezone item component
const TimezoneItem = React.memo(({ 
  timezone, 
  onSelect 
}: { 
  timezone: TimeZoneInfo; 
  onSelect: (value: string) => void;
}) => (
  <CommandItem
    value={timezone.ianaName}
    onSelect={onSelect}
  >
    <span className="flex items-center justify-between w-full">
      <span>{timezone.label}</span>
      <span className="text-xs text-muted-foreground ml-2">
        {timezone.ianaName} ({timezone.timezone})
      </span>
    </span>
  </CommandItem>
));

TimezoneItem.displayName = 'TimezoneItem';

// Memoized timezone group component
const TimezoneGroup = React.memo(({ 
  region, 
  timezones, 
  onSelect 
}: { 
  region: string; 
  timezones: TimeZoneInfo[];
  onSelect: (value: string) => void;
}) => (
  <CommandGroup heading={region}>
    {timezones.map((timezone) => (
      <TimezoneItem
        key={timezone.ianaName}
        timezone={timezone}
        onSelect={onSelect}
      />
    ))}
  </CommandGroup>
));

TimezoneGroup.displayName = 'TimezoneGroup';

export function TimezoneSearch({ onSelect, selectedTimezones = [] }: TimezoneSearchProps) {
  const [search, setSearch] = React.useState("");
  const [lastSelected, setLastSelected] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState(false);

  // Filter out already selected timezones - memoize this computation
  const availableTimezones = React.useMemo(() => 
    timezoneDatabase.filter(tz => !selectedTimezones.includes(tz.ianaName))
  , [selectedTimezones]);

  // Filter timezones based on search
  const filteredTimezones = React.useMemo(() => {
    if (!search) return availableTimezones;
    
    const searchLower = search.toLowerCase();
    return availableTimezones.filter(tz => 
      tz.label.toLowerCase().includes(searchLower) ||
      tz.region.toLowerCase().includes(searchLower) ||
      tz.timezone.toLowerCase().includes(searchLower) ||
      tz.ianaName.toLowerCase().includes(searchLower)
    );
  }, [availableTimezones, search]);

  // Group timezones by region
  const groupedTimezones = React.useMemo(() => {
    return filteredTimezones.reduce((acc: GroupedTimezones, tz) => {
      if (!acc[tz.region]) {
        acc[tz.region] = [];
      }
      acc[tz.region].push(tz);
      return acc;
    }, {});
  }, [filteredTimezones]);

  // Memoize the handleSelect function
  const handleSelect = React.useCallback((value: string) => {
    if (!value || value === lastSelected) return;
    
    try {
      const selectedTimezone = timezoneDatabase.find(tz => tz.ianaName === value);
      if (!selectedTimezone) {
        console.error('Timezone not found:', value);
        return;
      }

      // Log timezone selection
      const now = new Date();
      const localTime = now.toLocaleTimeString();
      const tzTime = formatInTimeZone(now, selectedTimezone.ianaName, 'HH:mm:ss');
      
      console.log('Timezone Added:', {
        name: selectedTimezone.label,
        ianaName: selectedTimezone.ianaName,
        region: selectedTimezone.region,
        offset: selectedTimezone.timezone,
        localTime: localTime,
        selectedTimezoneTime: tzTime,
        searchQuery: search || 'direct selection',
        timestamp: now.toISOString()
      });

      // Update state in a more controlled way
      setLastSelected(value);
      setSearch(""); // Reset search first
      setOpen(false); // Close popover after selection
      // Use requestAnimationFrame to ensure state updates are processed before callback
      requestAnimationFrame(() => {
        onSelect(selectedTimezone);
      });
    } catch (error) {
      console.error('Error adding timezone:', error);
    }
  }, [onSelect, search, lastSelected]);

  // Memoize the timezone groups rendering
  const timezoneGroups = React.useMemo(() => (
    Object.entries(groupedTimezones || {}).map(([region, timezones]) => (
      <TimezoneGroup
        key={region}
        region={region}
        timezones={timezones}
        onSelect={handleSelect}
      />
    ))
  ), [groupedTimezones, handleSelect]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          role="combobox" 
          aria-expanded={open}
          className="w-full justify-between"
        >
          <span className="flex items-center gap-2">
            <PlusIcon className="h-4 w-4" />
            Add Time Zone, City or Town...
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command className="rounded-lg border-0">
          <CommandInput 
            placeholder="Search timezone..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>No timezone found.</CommandEmpty>
            {timezoneGroups}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 