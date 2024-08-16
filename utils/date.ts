import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export function formatUtcToLocaleDate(
  utcDate: string,
  timeZone?: string
): string {
  const localTimeZone =
    timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const zonedDate = toZonedTime(utcDate, localTimeZone);
  return format(zonedDate, "yyyy-MM-dd");
}

export function formatUtcToLocaleTime(
  utcDate: string,
  timeZone?: string
): string {
  const localTimeZone =
    timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const zonedDate = toZonedTime(utcDate, localTimeZone);
  return format(zonedDate, "hh:mm a");
}
