export const WORKDAY_REMINDER_TIMES = ['10:00', '10:30', '11:00', '21:30', '22:00', '22:30', '23:00'];

const getNextWorkdayTime = (time) => {
  const [hour, minute] = time.split(':').map(Number);
  const next = new Date();

  next.setHours(hour, minute, 0, 0);

  while (next <= new Date() || next.getDay() === 0 || next.getDay() === 6) {
    next.setDate(next.getDate() + 1);
    next.setHours(hour, minute, 0, 0);
  }

  return next;
};

export const requestReminderPermission = () => {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (window.Notification.permission === 'default') {
    window.Notification.requestPermission();
  }
};

export const scheduleWorkdayReminders = (times = WORKDAY_REMINDER_TIMES) => {
  if (typeof window === 'undefined' || !('Notification' in window)) return () => {};

  const timers = [];

  const schedule = (time) => {
    const next = getNextWorkdayTime(time);
    const delay = next.getTime() - Date.now();

    const timer = window.setTimeout(() => {
      if (window.Notification.permission === 'granted') {
        new window.Notification('打卡提醒', {
          body: '记得确认今天的工作时间',
        });
      }

      schedule(time);
    }, delay);

    timers.push(timer);
  };

  times.forEach(schedule);

  return () => {
    timers.forEach((timer) => window.clearTimeout(timer));
  };
};
