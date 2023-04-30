export const NANOSECONDS_PER_MILLISECONDS = 1_000_000
export const MILLISECONDS_PER_SECOND = 1_000
export const SECONDS_PER_MINUTE = 60
export const MINUTES_PER_HOUR = 60
export const HOURS_PER_DAY = 24
export const DAYS_PER_WEEK = 7
export const MONTHS_PER_YEAR = 12

export const SECOND = MILLISECONDS_PER_SECOND
export const MINUTE = SECOND * SECONDS_PER_MINUTE
export const HOUR = MINUTE * MINUTES_PER_HOUR
export const DAY = HOUR * HOURS_PER_DAY
export const WEEK = DAY * DAYS_PER_WEEK
export const YEAR = DAY * 365.24
export const NORMAL_YEAR = DAY * 365
export const LEAP_YEAR = DAY * 366
export const DECADE = 10 * YEAR
export const HALF_YEAR = YEAR / 2
export const AVERAGE_MONTH = YEAR / 12
// ±100,000,000 days, the min and max dates allowed in ECMA Script.
// See: http://ecma-international.org/ecma-262/5.1/#sec-15.9.1.1
export const MIN_DATE = new Date(-8.64e15)
export const MAX_DATE = new Date(8.64e15)
