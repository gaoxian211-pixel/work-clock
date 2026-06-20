export const pad = (value) => String(value).padStart(2, '0');

export const getTodayKey = (date = new Date()) => {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

export const getNowTime = (date = new Date()) => {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const toMinutes = (time) => {
  if (!time) return 0;
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export const diffMinutes = (start, end) => {
  if (!start || !end) return 0;
  return Math.max(0, toMinutes(end) - toMinutes(start));
};

export const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${pad(hours)}:${pad(mins)}`;
};

export const formatHourLabel = (minutes) => {
  if (!minutes) return '—';
  return `${Math.max(1, Math.round(minutes / 60))}h`;
};

export const getRecordMinutes = (record, now = new Date()) => {
  if (!record?.firstIn) return 0;
  return diffMinutes(record.firstIn, record.lastOut || getNowTime(now));
};

export const addDays = (date, days) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

export const monthName = (date) => `${date.getFullYear()}年${date.getMonth() + 1}月`;

export const isFutureDate = (date) => {
  const today = new Date();
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const cleanToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return target > cleanToday;
};
