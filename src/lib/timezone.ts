import { formatInTimeZone } from 'date-fns-tz'

export interface TimeZoneInfo {
  name: string;
  location: string;
  timezone: string;
  offset: string;
  time: string;
  date: string;
  ianaName: string;
  value: string;
  label: string;
  region: string;
}

export function getTimeInTimeZone(date: Date, timeZone: string): { time: string; date: string } {
  const time = formatInTimeZone(date, timeZone, 'h:mm a')
  const dateStr = formatInTimeZone(date, timeZone, 'EEE, MMM d')
  return { time, date: dateStr }
}

export function getTimezoneOffset(timeZone: string): string {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    timeZoneName: 'shortOffset',
  })
  const parts = formatter.formatToParts(new Date())
  const offsetPart = parts.find(part => part.type === 'timeZoneName')
  return offsetPart?.value || ''
}

// Create a shared timezone database
export const timezoneDatabase = Intl.supportedValuesOf('timeZone').map(timezone => {
  const offset = getTimezoneOffset(timezone);
  const label = timezone.split('/').pop()?.replace(/_/g, ' ') || timezone;
  const region = timezone.split('/')[0];

  return {
    value: timezone,
    label,
    timezone: offset,
    offset: offset.replace('GMT', ''),
    ianaName: timezone,
    region,
    location: label,
    name: label,
    time: '',
    date: ''
  };
});

// Default timezones using the shared database
export const defaultTimeZones: TimeZoneInfo[] = [
  timezoneDatabase.find(tz => tz.ianaName === 'Asia/Hong_Kong'),
  timezoneDatabase.find(tz => tz.ianaName === 'Australia/Melbourne'),
  timezoneDatabase.find(tz => tz.ianaName === 'America/Phoenix'),
  timezoneDatabase.find(tz => tz.ianaName === 'Europe/Sarajevo'),
].filter((tz): tz is TimeZoneInfo => tz !== undefined); 