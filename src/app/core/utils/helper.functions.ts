export function normalizeDate(date: Date): string {
  const offset = date.getTimezoneOffset();
  const correctedDate = new Date(date.getTime() - offset * 60 * 1000);
  return correctedDate.toISOString().split('T')[0];
}
