import type { Course } from '../types/Course';

export interface MeetingTime {
  days: Set<string>;
  startMinutes: number;
  endMinutes: number;
}

const DAY_TOKENS = ['Su', 'Sa', 'Th', 'Tu', 'M', 'W', 'F'];

export const normalizeTerm = (term: string) => term.trim().toLowerCase();

export const parseClockTime = (value: string): number | null => {
  if (!/^\d{1,2}:\d{2}$/.test(value)) {
    return null;
  }

  const [hoursText, minutesText] = value.split(':');
  const hours = Number(hoursText);
  const minutes = Number(minutesText);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }

  return hours * 60 + minutes;
};

export const parseMeetingTime = (meets: string): MeetingTime | null => {
  const trimmedMeeting = meets.trim();

  if (!trimmedMeeting) {
    return null;
  }

  const match = /^([A-Za-z]+)\s+(\d{1,2}:\d{2})-(\d{1,2}:\d{2})$/.exec(
    trimmedMeeting,
  );

  if (!match) {
    return null;
  }

  const [, dayText, startText, endText] = match;
  const days = new Set<string>();
  let remainingText = dayText;

  while (remainingText.length > 0) {
    const nextToken = DAY_TOKENS.find((token) =>
      remainingText.startsWith(token),
    );

    if (!nextToken) {
      return null;
    }

    if (days.has(nextToken)) {
      return null;
    }

    days.add(nextToken);
    remainingText = remainingText.slice(nextToken.length);
  }

  const startMinutes = parseClockTime(startText);
  const endMinutes = parseClockTime(endText);

  if (startMinutes === null || endMinutes === null || startMinutes >= endMinutes) {
    return null;
  }

  return { days, startMinutes, endMinutes };
};

export const timeRangesOverlap = (
  startA: number,
  endA: number,
  startB: number,
  endB: number,
) => startA < endB && startB < endA;

export const coursesConflict = (
  firstCourse: Pick<Course, 'term' | 'meets'>,
  secondCourse: Pick<Course, 'term' | 'meets'>,
) => {
  if (normalizeTerm(firstCourse.term) !== normalizeTerm(secondCourse.term)) {
    return false;
  }

  const firstMeeting = parseMeetingTime(firstCourse.meets);
  const secondMeeting = parseMeetingTime(secondCourse.meets);

  if (!firstMeeting || !secondMeeting) {
    return false;
  }

  const sharedDay = [...firstMeeting.days].some((day) => secondMeeting.days.has(day));

  if (!sharedDay) {
    return false;
  }

  return timeRangesOverlap(
    firstMeeting.startMinutes,
    firstMeeting.endMinutes,
    secondMeeting.startMinutes,
    secondMeeting.endMinutes,
  );
};

export const hasConflictWithAnySelectedCourse = (
  candidateCourse: Pick<Course, 'term' | 'meets'>,
  selectedCourses: ReadonlyArray<Pick<Course, 'term' | 'meets'>>,
) =>
  selectedCourses.some((selectedCourse) => coursesConflict(candidateCourse, selectedCourse));
