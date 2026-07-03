import { WORKDAY_REMINDER_TIMES } from './reminders.js';
import { toMinutes } from './time.js';

const STORAGE_KEY = 'minimal-work-clock';
const TIME_PATTERN = /^\d{2}:\d{2}$/;
const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const sampleRecords = {
  '2026-06-01': { firstIn: '09:31', lastOut: '17:31' },
  '2026-06-02': { firstIn: '10:00', lastOut: '16:00' },
  '2026-06-03': { firstIn: '09:20', lastOut: '16:20' },
  '2026-06-04': { firstIn: '09:45', lastOut: '17:45' },
  '2026-06-05': { firstIn: '09:18', lastOut: '19:18' },
  '2026-06-07': { firstIn: '10:10', lastOut: '16:10' },
  '2026-06-08': { firstIn: '09:38', lastOut: '17:38' },
  '2026-06-09': { firstIn: '09:31', lastOut: '16:31' },
  '2026-06-10': { firstIn: '09:24', lastOut: '19:24' },
  '2026-06-11': { firstIn: '10:20', lastOut: '16:20' },
  '2026-06-12': { firstIn: '09:12', lastOut: '16:12' },
  '2026-06-16': { firstIn: '09:31', lastOut: '12:57' },
};

export const defaultState = {
  records: sampleRecords,
  settings: {
    targetHours: 8,
    reminderEnabled: true,
    reminderTimes: WORKDAY_REMINDER_TIMES,
    darkMode: false,
  },
};

const isValidTime = (value) => {
  if (!TIME_PATTERN.test(value || '')) return false;
  const [hours, minutes] = value.split(':').map(Number);
  return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
};

export const normalizeWorkRecord = (record) => {
  if (!record) return null;

  const firstIn = isValidTime(record.firstIn) ? record.firstIn : null;
  const lastOut = isValidTime(record.lastOut) ? record.lastOut : null;

  if (!firstIn && !lastOut) return null;
  if (!firstIn) return { firstIn: null, lastOut };
  if (!lastOut) return { firstIn, lastOut: null };

  return toMinutes(lastOut) < toMinutes(firstIn)
    ? { firstIn: lastOut, lastOut: firstIn }
    : { firstIn, lastOut };
};

const normalizeRecords = (records) => {
  return Object.entries(records || {}).reduce((result, [key, record]) => {
    if (!DATE_KEY_PATTERN.test(key)) return result;

    const normalized = normalizeWorkRecord(record);
    if (normalized) result[key] = normalized;
    return result;
  }, {});
};

const normalizeSettings = (settings) => {
  const targetHours = Number(settings?.targetHours);
  const cleanTarget = Number.isFinite(targetHours)
    ? Math.min(24, Math.max(0, Math.round(targetHours * 2) / 2))
    : defaultState.settings.targetHours;
  const reminderTimes = Array.isArray(settings?.reminderTimes)
    ? settings.reminderTimes.filter(isValidTime)
    : defaultState.settings.reminderTimes;

  return {
    targetHours: cleanTarget,
    reminderEnabled: typeof settings?.reminderEnabled === 'boolean'
      ? settings.reminderEnabled
      : defaultState.settings.reminderEnabled,
    reminderTimes: reminderTimes.length ? reminderTimes : defaultState.settings.reminderTimes,
    darkMode: typeof settings?.darkMode === 'boolean'
      ? settings.darkMode
      : defaultState.settings.darkMode,
  };
};

export const normalizeState = (state) => ({
  records: normalizeRecords(state?.records || defaultState.records),
  settings: normalizeSettings(state?.settings || defaultState.settings),
});

export const loadState = () => {
  if (typeof window === 'undefined') return defaultState;

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return normalizeState(defaultState);
    const parsed = JSON.parse(saved);

    return normalizeState(parsed);
  } catch {
    return normalizeState(defaultState);
  }
};

export const saveState = (state) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeState(state)));
};
