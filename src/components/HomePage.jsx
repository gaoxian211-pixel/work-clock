import BottomActionButton from './BottomActionButton.jsx';
import FakeStatusBar from './FakeStatusBar.jsx';
import PressableIconButton from './PressableIconButton.jsx';
import WorkTimeDisplay from './WorkTimeDisplay.jsx';
import pageBackground from '../assets/page-background.png';
import { getRecordMinutes } from '../lib/time.js';

const darkHomeVars = {
  '--color-ink': '#F5F5F5',
  '--color-inverse': '#111111',
  '--color-muted': '#8E8E93',
  '--color-subtle': '#8E8E93',
  '--color-hairline': 'rgba(245, 245, 245, 0.06)',
  '--color-icon-button': 'rgba(255, 255, 255, 0.04)',
  '--color-progress-track': 'rgba(255, 255, 255, 0.04)',
  '--color-progress-ring': 'rgba(245, 245, 245, 0.9)',
  '--color-button-pressed': 'rgba(245, 245, 245, 0.12)',
};

export default function HomePage({ record, now, targetHours, isDark, onClock, onEditTime, onOpenRecords, onOpenSettings }) {
  const minutes = getRecordMinutes(record, now);
  const hasStarted = Boolean(record?.firstIn);
  const hasRecord = Boolean(record?.firstIn || record?.lastOut);
  const greeting = getGreeting(now);

  return (
    <main
      className={`relative z-10 flex h-full flex-col overflow-hidden ${isDark ? 'bg-[#0F0F0F]' : 'bg-shell'}`}
      style={isDark ? darkHomeVars : undefined}
    >
      {isDark ? (
        <img
          src={pageBackground}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
        />
      ) : null}
      <FakeStatusBar />

      <header className="safe-header relative z-10 flex items-center justify-between px-screen">
        <h1 className="text-greeting font-semibold text-ink">Hi，{greeting}</h1>
        <div className="flex items-center gap-4">
          <IconButton label="打开工时记录" icon="record" onClick={onOpenRecords} />
          <IconButton label="打开设置" icon="settings" onClick={onOpenSettings} />
        </div>
      </header>

      <section className="absolute left-0 right-0 top-[42.5%] z-10 flex -translate-y-1/2 flex-col items-center px-screen">
        <WorkTimeDisplay minutes={minutes} targetHours={targetHours} hasRecord={hasRecord} />
      </section>

      {hasRecord ? (
        <section className="absolute bottom-[calc(128px+var(--ios-safe-bottom)+env(safe-area-inset-bottom))] left-0 right-0 z-10 px-screen">
          <div className="grid grid-cols-[1fr_auto_1fr] items-end text-center">
            <TimeStat label="最早 · FIRST IN" value={record.firstIn || ''} onClick={onEditTime} />
            <div className="mb-0 h-12 w-px bg-hairline" />
            <TimeStat label="最晚 · LAST OUT" value={record.lastOut || ''} onClick={onEditTime} />
          </div>
        </section>
      ) : null}

      <div className="safe-bottom absolute bottom-0 left-0 right-0 z-10 px-screen">
        <BottomActionButton label={hasStarted ? '下班打卡' : '上班打卡'} onComplete={onClock} />
      </div>
    </main>
  );
}

function getGreeting(date) {
  const hour = date.getHours();
  if (hour >= 5 && hour < 11) return '早上好';
  if (hour >= 11 && hour < 14) return '中午好';
  if (hour >= 14 && hour < 18) return '下午好';
  return '晚上好';
}

function IconButton({ label, icon, onClick }) {
  return (
    <PressableIconButton label={label} className="h-12 w-12 text-ink" onClick={onClick}>
      {icon === 'record' ? <RecordIcon /> : <SettingsIcon />}
    </PressableIconButton>
  );
}

function RecordIcon() {
  return (
    <svg className="h-7 w-7" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d="M28 16C28 22.6274 22.6274 28 16 28C9.37258 28 4 22.6274 4 16C4 9.37258 9.37258 4 16 4M20.5 4.5C20.6225 4.54331 20.7442 4.58856 20.8648 4.6357M27.5 11.5C27.5 11.5 27.5 11.5 27.3607 11.2414M25 7.5C24.9191 7.41942 24.837 7.33999 24.7539 7.26173"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.5 10.5V16.5H21.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg className="h-7 w-7" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d="M13 4.73205C14.8564 3.66025 17.1436 3.66025 19 4.73205L24.2583 7.76795C26.1147 8.83975 27.2583 10.8205 27.2583 12.9641V19.0359C27.2583 21.1795 26.1147 23.1603 24.2583 24.2321L19 27.2679C17.1436 28.3397 14.8564 28.3397 13 27.2679L7.74167 24.2321C5.88526 23.1603 4.74167 21.1795 4.74167 19.0359V12.9641C4.74167 10.8205 5.88526 8.83975 7.74167 7.76795L13 4.73205Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="16" r="3.5" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function TimeStat({ label, value, onClick }) {
  const hasValue = Boolean(value);

  return (
    <button type="button" className="w-full appearance-none border-0 bg-transparent p-0 text-center" onClick={onClick}>
      <div className="text-caption font-normal uppercase tracking-normal text-subtle">{label}</div>
      <div className="mt-3 flex h-[22px] items-center justify-center text-metric font-semibold text-ink">
        {hasValue ? <TimeValue value={value} /> : <span className="relative -top-px text-body font-normal text-[var(--color-placeholder)]">待打卡</span>}
      </div>
    </button>
  );
}

function TimeValue({ value }) {
  if (!/^\d{2}:\d{2}$/.test(value)) return value;

  const [hour, minute] = value.split(':');

  return (
    <span className="inline-flex items-center justify-center gap-[2px] tabular-nums">
      <span>{hour}</span>
      <span className="relative -top-[2px]">:</span>
      <span>{minute}</span>
    </span>
  );
}
