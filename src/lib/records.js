import { addDays, diffMinutes, formatHourLabel, getRecordMinutes, getTodayKey, isFutureDate } from './time.js';

export const getTone = (minutes, targetHours) => {
  if (!minutes) return 'empty';
  return minutes >= targetHours * 60 ? 'success' : 'danger';
};

export const toneClasses = {
  success: 'bg-success-soft text-success-strong',
  danger: 'bg-danger-soft text-danger-strong',
  empty: 'bg-empty-soft text-empty-strong',
};

export const getMonthDays = (year, monthIndex) => {
  const days = [];
  const first = new Date(year, monthIndex, 1);
  const leading = first.getDay();
  const count = new Date(year, monthIndex + 1, 0).getDate();

  for (let i = 0; i < leading; i += 1) {
    days.push(null);
  }

  for (let day = 1; day <= count; day += 1) {
    days.push(new Date(year, monthIndex, day));
  }

  return days;
};

export const getDayMeta = (date, records, targetHours) => {
  if (!date || isFutureDate(date)) {
    return { minutes: 0, tone: 'empty', label: '—', isFuture: true };
  }

  const key = getTodayKey(date);
  const record = records[key];
  const minutes = record ? getRecordMinutes(record) : 0;

  return {
    minutes,
    tone: getTone(minutes, targetHours),
    label: formatHourLabel(minutes),
    isFuture: false,
  };
};

export const getWeekCards = (year, monthIndex, records, targetHours) => {
  const first = new Date(year, monthIndex, 1);
  const start = addDays(first, -first.getDay());
  const today = new Date();
  const cleanToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const currentWeekStart = addDays(cleanToday, -cleanToday.getDay());

  return Array.from({ length: 5 }, (_, index) => {
    const weekStart = addDays(start, index * 7);
    const weekEnd = addDays(weekStart, 6);
    let minutes = 0;
    let daysWithRecords = 0;

    for (let offset = 0; offset < 7; offset += 1) {
      const day = addDays(weekStart, offset);
      if (day.getMonth() === monthIndex && !isFutureDate(day)) {
        const record = records[getTodayKey(day)];
        if (record) {
          minutes += getRecordMinutes(record);
          daysWithRecords += 1;
        }
      }
    }

    const average = daysWithRecords ? Math.round(minutes / daysWithRecords) : 0;

    return {
      id: `${weekStart.toISOString()}-${weekEnd.toISOString()}`,
      range: `${String(weekStart.getMonth() + 1).padStart(2, '0')}.${String(weekStart.getDate()).padStart(2, '0')}-${String(weekEnd.getMonth() + 1).padStart(2, '0')}.${String(weekEnd.getDate()).padStart(2, '0')}`,
      minutes: average,
      label: minutes ? formatHourLabel(average) : '—',
      tone: getTone(average, targetHours),
      start: weekStart,
      isCurrent: weekStart.getTime() === currentWeekStart.getTime(),
    };
  }).filter((week) => week.start <= cleanToday);
};

export const getMonthCards = (year, records, targetHours) => {
  const today = new Date();
  const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  return Array.from({ length: 12 }, (_, monthIndex) => {
    let minutes = 0;
    let daysWithRecords = 0;
    const monthStart = new Date(year, monthIndex, 1);
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(year, monthIndex, day);
      if (isFutureDate(date)) continue;

      const record = records[getTodayKey(date)];
      if (record) {
        minutes += getRecordMinutes(record);
        daysWithRecords += 1;
      }
    }

    const average = daysWithRecords ? Math.round(minutes / daysWithRecords) : 0;

    return {
      month: `${monthIndex + 1}月`,
      minutes: average,
      label: average ? formatHourLabel(average) : '—',
      tone: getTone(average, targetHours),
      start: monthStart,
      isCurrent: monthStart.getTime() === currentMonthStart.getTime(),
    };
  }).filter((month) => month.start <= currentMonthStart);
};
