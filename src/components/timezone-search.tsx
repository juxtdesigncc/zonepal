import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { TimeZoneInfo, timezoneDatabase } from "@/lib/timezone"

interface TimezoneSearchProps {
  onSelect: (timezone: TimeZoneInfo) => void;
  selectedTimezones?: string[]; // Array of selected IANA timezone names
}

export function TimezoneSearch({ onSelect, selectedTimezones = [] }: TimezoneSearchProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  // Filter out already selected timezones
  const availableTimezones = timezoneDatabase.filter(
    tz => !selectedTimezones.includes(tz.ianaName)
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {search
            ? timezoneDatabase.find((timezone) => timezone.value === search)?.label
            : "Add Time Zone, City or Town..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput 
            placeholder="Search timezone..." 
            value={search}
            onValueChange={setSearch}
          />
          <CommandEmpty>No timezone found.</CommandEmpty>
          <CommandGroup>
            {availableTimezones.map((timezone) => (
              <CommandItem
                key={timezone.value}
                value={timezone.value}
                onSelect={() => {
                  setSearch("")
                  setOpen(false)
                  onSelect({
                    ...timezone,
                    time: "",
                    date: ""
                  })
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    search === timezone.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {timezone.label}
                <span className="ml-auto text-xs text-muted-foreground">
                  {timezone.timezone}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 