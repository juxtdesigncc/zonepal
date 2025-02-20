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
import { PlusIcon, CheckIcon } from "@heroicons/react/24/outline"
import { TimeZoneInfo, timezoneDatabase } from "@/lib/timezone"

interface TimezoneSearchProps {
  onSelect: (timezone: TimeZoneInfo) => void;
  selectedTimezones?: string[]; // Array of selected IANA timezone names
  triggerRef?: React.RefObject<HTMLButtonElement>;
}

interface GroupedTimezones {
  [key: string]: TimeZoneInfo[];
}

// Memoized timezone item component
const TimezoneItem = React.memo(({ 
  timezone, 
  onSelect,
  isSelected
}: { 
  timezone: TimeZoneInfo; 
  onSelect: (value: string) => void;
  isSelected: boolean;
}) => (
  <CommandItem
    value={`${timezone.label} ${timezone.country}`}
    onSelect={() => onSelect(timezone.ianaName)}
    disabled={isSelected}
    className={isSelected ? 'opacity-50 cursor-not-allowed' : ''}
  >
    <span className="flex items-center justify-between w-full">
      <span className="flex items-center gap-2">
        {isSelected && (
          <CheckIcon className="h-4 w-4 text-muted-foreground" />
        )}
        <span className="flex flex-col">
          <span>{timezone.label}</span>
          <span className="text-xs text-muted-foreground">
            {timezone.country} {timezone.countryCode ? `(${timezone.countryCode})` : ''}
          </span>
        </span>
      </span>
      <span className="text-xs text-muted-foreground ml-2">
        {timezone.timezone}
      </span>
    </span>
  </CommandItem>
));

TimezoneItem.displayName = 'TimezoneItem';

// Memoized timezone group component
const TimezoneGroup = React.memo(({ 
  region, 
  timezones,
  onSelect,
  selectedTimezones
}: { 
  region: string; 
  timezones: TimeZoneInfo[];
  onSelect: (value: string) => void;
  selectedTimezones: string[];
}) => (
  <CommandGroup heading={region}>
    {timezones.map((timezone) => (
      <TimezoneItem
        key={timezone.ianaName}
        timezone={timezone}
        onSelect={onSelect}
        isSelected={selectedTimezones.includes(timezone.ianaName)}
      />
    ))}
  </CommandGroup>
));

TimezoneGroup.displayName = 'TimezoneGroup';

export function TimezoneSearch({ onSelect, selectedTimezones = [], triggerRef }: TimezoneSearchProps) {
  const [search, setSearch] = React.useState("");
  const [lastSelected, setLastSelected] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState(false);

  const availableTimezones = React.useMemo(() => 
    timezoneDatabase
  , []);

  // Filter timezones based on search
  const filteredTimezones = React.useMemo(() => {
    if (!search) {
      return availableTimezones;
    }
    
    // Clean up search input but keep spaces for matching
    const searchTerms = search.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (searchTerms.length === 0) {
      return availableTimezones;
    }

    // First try to find exact matches
    const exactMatches = availableTimezones.filter(tz => {
      const cityName = tz.label.toLowerCase();
      return cityName === searchTerms.join(' ');
    });

    if (exactMatches.length > 0) {
      return exactMatches;
    }

    // Then try to find partial matches where all terms are included
    const partialMatches = availableTimezones.filter(tz => {
      const searchableText = [
        tz.label.toLowerCase(),
        tz.country.toLowerCase(),
        tz.countryCode.toLowerCase(),
      ].join(' ');

      return searchTerms.every(term => searchableText.includes(term));
    });

    if (partialMatches.length > 0) {
      return partialMatches;
    }

    // Finally, try broader matches where any term matches
    return availableTimezones.filter(tz => {
      const searchableText = [
        tz.label.toLowerCase(),
        tz.region.toLowerCase(),
        tz.country.toLowerCase(),
        tz.countryCode.toLowerCase(),
        tz.timezone.toLowerCase(),
        tz.ianaName.toLowerCase()
      ].join(' ');

      return searchTerms.some(term => searchableText.includes(term));
    });
  }, [availableTimezones, search]);

  // Group timezones by region and sort by country
  const groupedTimezones = React.useMemo(() => {
    const groups: GroupedTimezones = {};
    
    // First group by region
    filteredTimezones.forEach(tz => {
      // For country searches, group by country instead of region
      const isCountrySearch = filteredTimezones.every(t => t.country === filteredTimezones[0].country);
      const groupKey = isCountrySearch ? tz.country : tz.region;
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(tz);
    });
    
    // Sort timezones within each group
    Object.keys(groups).forEach(groupKey => {
      groups[groupKey].sort((a, b) => {
        // If it's a country search, sort by city name only
        if (a.country === b.country) {
          return a.label.localeCompare(b.label);
        }
        // Otherwise, sort by country then city
        const countryCompare = a.country.localeCompare(b.country);
        return countryCompare !== 0 ? countryCompare : a.label.localeCompare(b.label);
      });
    });
    
    return groups;
  }, [filteredTimezones]);

  // Memoize the handleSelect function
  const handleSelect = React.useCallback((value: string) => {
    if (!value || value === lastSelected) return;
    
    try {
      const selectedTimezone = timezoneDatabase.find(tz => tz.ianaName === value);
      if (!selectedTimezone) return;

      // Update state in a more controlled way
      setLastSelected(value);
      setSearch(""); // Reset search first
      setOpen(false); // Close popover after selection
      // Use requestAnimationFrame to ensure state updates are processed before callback
      requestAnimationFrame(() => {
        onSelect(selectedTimezone);
      });
    } catch (error) {
      // Silent error handling
    }
  }, [onSelect, lastSelected]);

  // Memoize the timezone groups rendering
  const timezoneGroups = React.useMemo(() => (
    Object.entries(groupedTimezones || {}).map(([region, timezones]) => (
      <TimezoneGroup
        key={region}
        region={region}
        timezones={timezones}
        onSelect={handleSelect}
        selectedTimezones={selectedTimezones}
      />
    ))
  ), [groupedTimezones, handleSelect, selectedTimezones]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          ref={triggerRef}
          variant="outline" 
          role="combobox" 
          aria-expanded={open}
          className="w-full justify-between"
        >
          <span className="flex items-center gap-2">
            <PlusIcon className="h-4 w-4" />
            Add Time Zone, City or Town...
          </span>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">K</span>
          </kbd>
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