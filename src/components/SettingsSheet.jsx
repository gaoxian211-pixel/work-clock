import { useEffect, useRef, useState } from 'react';
import Sheet from './Sheet.jsx';
import { pressTransition } from '../lib/motion.js';
import { AnimatePresence, motion } from 'framer-motion';

export default function SettingsSheet({ settings, onChange, onClose }) {
  const setTarget = (value) => {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return;
    const clean = Math.min(24, Math.max(0, Math.round(numeric * 2) / 2));
    onChange({ targetHours: clean });
  };

  return (
    <Sheet title="设置" onClose={onClose} height="h-[calc(374px+var(--ios-safe-bottom)+env(safe-area-inset-bottom))]">
      <div className="mt-1">
        <div className="flex h-14 items-center justify-between gap-4">
          <div className="shrink-0 whitespace-nowrap text-body font-semibold text-ink">工时目标</div>
          <div className="flex shrink-0 items-center gap-2.5">
            <RoundButton label="减少工时目标" icon="minus" onClick={() => setTarget(settings.targetHours - 0.5)} />
            <TargetValue value={settings.targetHours} onCommit={setTarget} />
            <RoundButton label="增加工时目标" icon="plus" onClick={() => setTarget(settings.targetHours + 0.5)} />
          </div>
        </div>

        <div className="my-2 h-px bg-line" />

        <div className="flex h-14 items-center justify-between">
          <div className="text-body font-semibold text-ink">打卡提醒</div>
          <SettingsSwitch
            checked={settings.reminderEnabled}
            label="打卡提醒"
            onChange={() => onChange({ reminderEnabled: !settings.reminderEnabled })}
          />
        </div>

        <div className="my-2 h-px bg-line" />

        <div className="flex h-14 items-center justify-between">
          <div className="text-body font-semibold text-ink">深色模式</div>
          <SettingsSwitch
            checked={settings.darkMode}
            label="深色模式"
            onChange={() => onChange({ darkMode: !settings.darkMode })}
          />
        </div>
      </div>
    </Sheet>
  );
}

function SettingsSwitch({ checked, label, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-label={label}
      aria-checked={checked}
      className="relative h-[30px] w-[52px] rounded-pill transition-colors duration-200"
      style={{ backgroundColor: checked ? 'var(--color-switch-on)' : 'var(--color-switch-off)' }}
      onClick={onChange}
    >
      <span
        className={`absolute left-0 top-1/2 h-[26px] w-[26px] -translate-y-1/2 rounded-pill bg-switch-thumb shadow-thumb transition-transform duration-200 ${
          checked ? 'translate-x-[24px]' : 'translate-x-[2px]'
        }`}
      />
    </button>
  );
}

function RoundButton({ label, icon, onClick }) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      className="tap-surface grid h-8 w-8 place-items-center rounded-pill border border-line bg-small-button text-ink"
      onClick={onClick}
      whileTap={{ scale: 0.84 }}
      transition={pressTransition}
    >
      <span className={`solid-icon solid-icon-sm ${icon === 'plus' ? 'solid-icon-plus' : 'solid-icon-minus'}`} />
    </motion.button>
  );
}

function TargetValue({ value, onCommit }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));
  const previousValueRef = useRef(value);
  const inputRef = useRef(null);
  const previousValue = previousValueRef.current;

  useEffect(() => {
    if (!editing) setDraft(String(value));
  }, [editing, value]);

  useEffect(() => {
    previousValueRef.current = value;
  }, [value]);

  useEffect(() => {
    if (!editing) return;
    inputRef.current?.focus();
    inputRef.current?.select();
  }, [editing]);

  const commit = () => {
    setEditing(false);
    onCommit(draft);
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        aria-label="工时目标"
        className="h-8 w-12 bg-transparent text-center text-body font-semibold text-ink outline-none"
        inputMode="decimal"
        value={draft}
        min="0"
        max="24"
        step="0.5"
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === 'Enter') commit();
          if (event.key === 'Escape') setEditing(false);
        }}
      />
    );
  }

  return (
    <button
      type="button"
      aria-label="工时目标"
      className="relative h-8 w-12 overflow-hidden text-center text-body font-semibold text-ink"
      onClick={() => setEditing(true)}
    >
      <RollingValue previousValue={previousValue} value={value} />
    </button>
  );
}

function RollingValue({ previousValue, value }) {
  const direction = value === previousValue ? 0 : value > previousValue ? 1 : -1;
  const variants = {
    enter: (movement) => ({
      y: movement === 0 ? 0 : movement > 0 ? 28 : -28,
      opacity: 0,
    }),
    center: {
      y: 0,
      opacity: 1,
    },
    exit: (movement) => ({
      y: movement === 0 ? 0 : movement > 0 ? -28 : 28,
      opacity: 0,
    }),
  };

  return (
    <span className="absolute inset-0 block overflow-hidden tabular-nums">
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.span
          key={value}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: 'spring', stiffness: 260, damping: 24, mass: 0.95 }}
          className="absolute inset-0 grid place-items-center"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
