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
  });
  const parts = formatter.formatToParts(new Date());
  const offsetPart = parts.find(part => part.type === 'timeZoneName')?.value || '';
  
  // Ensure consistent formatting for GMT+0
  if (offsetPart === 'GMT') {
    return 'GMT+00:00';
  }
  
  // Format other offsets consistently
  const match = offsetPart.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
  if (match) {
    const [, sign, hours, minutes = '00'] = match;
    return `GMT${sign}${hours.padStart(2, '0')}:${minutes}`;
  }
  
  return offsetPart;
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

// URL parameter handling
export function getTimezoneParam(timezones: TimeZoneInfo[]): string {
  return timezones.map(tz => tz.ianaName).join('-to-');
}

export function parseTimezoneParam(param: string): string[] {
  return param.split('-to-');
}

export function findTimezoneByIana(ianaName: string): TimeZoneInfo | undefined {
  return timezoneDatabase.find(tz => tz.ianaName === ianaName);
} 