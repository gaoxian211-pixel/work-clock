import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import HomePage from './components/HomePage.jsx';
import RecordSheet from './components/RecordSheet.jsx';
import SettingsSheet from './components/SettingsSheet.jsx';
import TimeEditSheet from './components/TimeEditSheet.jsx';
import { WORKDAY_REMINDER_TIMES, requestReminderPermission, scheduleWorkdayReminders } from './lib/reminders.js';
import { loadState, normalizeWorkRecord, saveState } from './lib/storage.js';
import { getTodayKey, getNowTime, pad, toMinutes } from './lib/time.js';

export default function App() {
  const [state, setState] = useState(loadState);
  const [activeSheet, setActiveSheet] = useState(null);
  const [editKey, setEditKey] = useState(null);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    if (!state.settings.reminderEnabled) return undefined;
    return scheduleWorkdayReminders(state.settings.reminderTimes || WORKDAY_REMINDER_TIMES);
  }, [state.settings.reminderEnabled, state.settings.reminderTimes]);

  useLayoutEffect(() => {
    const hasOverlay = Boolean(activeSheet || editKey);
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    const isDark = state.settings.darkMode;
    const pageColor = isDark ? '#0F0F0F' : '#FBFCFC';
    const nextColor = hasOverlay ? (isDark ? '#080808' : '#9A9B9B') : pageColor;

    document.documentElement.dataset.theme = isDark ? 'dark' : 'light';

    if (themeMeta) {
      themeMeta.setAttribute('content', nextColor);
    }
    document.documentElement.style.background = nextColor;
    document.body.style.background = nextColor;

    return () => {
      if (themeMeta) themeMeta.setAttribute('content', pageColor);
      document.documentElement.style.background = pageColor;
      document.body.style.background = pageColor;
    };
  }, [activeSheet, editKey, state.settings.darkMode]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let midnightTimer;

    const syncNow = () => setNow(new Date());
    const scheduleMidnightSync = () => {
      const current = new Date();
      const nextMidnight = new Date(current);
      nextMidnight.setHours(24, 0, 0, 80);

      midnightTimer = window.setTimeout(() => {
        syncNow();
        scheduleMidnightSync();
      }, nextMidnight.getTime() - current.getTime());
    };

    const syncWhenVisible = () => {
      if (document.visibilityState === 'visible') syncNow();
    };

    scheduleMidnightSync();
    window.addEventListener('focus', syncNow);
    document.addEventListener('visibilitychange', syncWhenVisible);

    return () => {
      window.clearTimeout(midnightTimer);
      window.removeEventListener('focus', syncNow);
      document.removeEventListener('visibilitychange', syncWhenVisible);
    };
  }, []);

  const todayKey = useMemo(() => getTodayKey(now), [now]);
  const todayRecord = state.records[todayKey];

  const handleClock = () => {
    const currentTime = getNowTime();
    setState((current) => {
      const record = current.records[todayKey];
      const records = { ...current.records };

      if (!record?.firstIn) {
        records[todayKey] = { firstIn: currentTime, lastOut: null };
      } else {
        const start = toMinutes(record.firstIn);
        const end = Math.min(1439, Math.max(toMinutes(record.lastOut), toMinutes(currentTime), start + 1));
        const safeNow = `${pad(Math.floor(end / 60))}:${pad(end % 60)}`;
        records[todayKey] = normalizeWorkRecord({ ...record, lastOut: safeNow });
      }

      return { ...current, records };
    });
  };

  const updateSettings = (nextSettings) => {
    if (nextSettings.reminderEnabled) {
      requestReminderPermission();
    }

    setState((current) => ({
      ...current,
      settings: {
        ...current.settings,
        reminderTimes: current.settings.reminderTimes || WORKDAY_REMINDER_TIMES,
        ...nextSettings,
      },
    }));
  };

  const updateRecord = (record) => {
    if (!editKey) return;

    setState((current) => {
      const records = { ...current.records };
      const normalized = normalizeWorkRecord(record);

      if (!normalized) {
        delete records[editKey];
      } else {
        records[editKey] = normalized;
      }

      return { ...current, records };
    });
    setEditKey(null);
  };

  return (
    <div className="app-page">
      <div className="app-stage">
        <div className="device-frame">
          <div className="phone-shell relative h-full w-full overflow-hidden border border-line-light bg-shell shadow-phone">
            <div className="home-environment-glow" aria-hidden="true" />
            <HomePage
              record={todayRecord}
              now={now}
              targetHours={state.settings.targetHours}
              isDark={state.settings.darkMode}
              onClock={handleClock}
              onEditTime={() => setEditKey(todayKey)}
              onOpenRecords={() => setActiveSheet('records')}
              onOpenSettings={() => setActiveSheet('settings')}
            />

            <AnimatePresence mode="wait">
              {activeSheet === 'records' && (
                <RecordSheet
                  records={state.records}
                  targetHours={state.settings.targetHours}
                  editingRecordKey={editKey}
                  onEditRecord={setEditKey}
                  onClose={() => setActiveSheet(null)}
                />
              )}
              {activeSheet === 'settings' && (
                <SettingsSheet
                  settings={state.settings}
                  onChange={updateSettings}
                  onClose={() => setActiveSheet(null)}
                />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {editKey && (
                <TimeEditSheet
                  record={state.records[editKey]}
                  onSave={updateRecord}
                  onClose={() => setEditKey(null)}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
