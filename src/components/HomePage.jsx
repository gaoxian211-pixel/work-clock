import recordIcon from '../assets/icons/icon-record.svg';
import setupIcon from '../assets/icons/icon-setup.svg';
import BottomActionButton from './BottomActionButton.jsx';
import EmptyDash from './EmptyDash.jsx';
import FakeStatusBar from './FakeStatusBar.jsx';
import PressableIconButton from './PressableIconButton.jsx';
import WorkStatusTag from './WorkStatusTag.jsx';
import WorkTimeDisplay from './WorkTimeDisplay.jsx';
import { getRecordMinutes } from '../lib/time.js';

export default function HomePage({ record, now, targetHours, onClock, onEditTime, onOpenRecords, onOpenSettings }) {
  const minutes = getRecordMinutes(record, now);
  const hasStarted = Boolean(record?.firstIn);
  const reached = minutes >= targetHours * 60;

  return (
    <main className="relative z-10 flex h-full flex-col">
      <FakeStatusBar />

      <header className="safe-header flex items-center justify-between px-screen">
        <h1 className="text-greeting font-semibold text-ink">Hi, Gaoxian</h1>
        <div className="flex items-center gap-4">
          <IconButton label="打开工时记录" icon={recordIcon} onClick={onOpenRecords} />
          <IconButton label="打开设置" icon={setupIcon} onClick={onOpenSettings} />
        </div>
      </header>

      <section className="absolute left-0 right-0 top-[42.5%] flex -translate-y-1/2 flex-col items-center px-screen">
        <div className="translate-y-2 flex items-center gap-2 text-body font-normal text-muted">
          <WorkStatusTag reached={reached} hasStarted={hasStarted} />
          <span>今日工时</span>
        </div>

        <WorkTimeDisplay minutes={minutes} />
      </section>

      <section className="absolute bottom-[calc(128px+var(--ios-safe-bottom)+env(safe-area-inset-bottom))] left-0 right-0 px-screen">
        {hasStarted ? (
          <div className="grid grid-cols-[1fr_auto_1fr] items-end text-center">
            <TimeStat label="最早 · FIRST IN" value={record.firstIn} onClick={onEditTime} />
            <div className="mb-0 h-12 w-px bg-hairline" />
            <TimeStat label="最晚 · LAST OUT" value={record.lastOut || '—'} onClick={onEditTime} />
          </div>
        ) : (
          <p className="text-center text-label font-normal text-subtle">今天还没打卡哦~</p>
        )}
      </section>

      <div className="safe-bottom absolute bottom-0 left-0 right-0 px-screen">
        <BottomActionButton label={hasStarted ? '下班打卡' : '上班打卡'} onComplete={onClock} />
      </div>
    </main>
  );
}

function IconButton({ label, icon, onClick }) {
  return (
    <PressableIconButton label={label} className="h-12 w-12" onClick={onClick}>
      <img src={icon} alt="" className="h-7 w-7" draggable="false" />
    </PressableIconButton>
  );
}

function TimeStat({ label, value, onClick }) {
  const isDash = value === '—';

  return (
    <button type="button" className="w-full appearance-none border-0 bg-transparent p-0 text-center active:scale-[0.985]" onClick={onClick}>
      <div className="text-caption font-medium uppercase tracking-normal text-subtle">{label}</div>
      <div className="mt-3 flex h-[22px] items-center justify-center text-metric font-bold text-ink">
        {isDash ? <EmptyDash /> : <TimeValue value={value} />}
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
