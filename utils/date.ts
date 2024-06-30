import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export function formatUtcToLocaleTimezone(
  utcDate: string,
  timeZone?: string,
): string {
  const localTimeZone = timeZone ||
    Intl.DateTimeFormat().resolvedOptions().timeZone;
  const zonedDate = toZonedTime(utcDate, localTimeZone);
  return format(zonedDate, "yyyy-MM-dd");
}
