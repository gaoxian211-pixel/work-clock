import { forwardRef, useRef, useState } from 'react';
import EmptyDash from './EmptyDash.jsx';
import Sheet from './Sheet.jsx';

const normalizeTime = (value) => (/^\d{2}:\d{2}$/.test(value) ? value : '');

export default function TimeEditSheet({ record, onClose, onSave }) {
  const [firstIn, setFirstIn] = useState(normalizeTime(record?.firstIn || ''));
  const [lastOut, setLastOut] = useState(normalizeTime(record?.lastOut || ''));
  const firstInputRef = useRef(null);

  const save = () => {
    if (!firstIn && !lastOut) {
      onSave(null);
      return;
    }

    onSave({
      firstIn: firstIn || lastOut,
      lastOut: lastOut || null,
    });
  };

  return (
    <Sheet title="修改时间" onClose={onClose} height="h-[calc(286px+var(--ios-safe-bottom)+env(safe-area-inset-bottom))]">
      <div className="mt-1">
        <TimeField ref={firstInputRef} label="最早" value={firstIn} onChange={setFirstIn} />
        <div className="my-2 h-px bg-line" />
        <TimeField label="最晚" value={lastOut} onChange={setLastOut} />

        <button
          type="button"
          className="mt-8 h-12 w-full rounded-pill bg-ink text-body font-bold text-white active:scale-[0.985]"
          onClick={save}
        >
          保存
        </button>
      </div>
    </Sheet>
  );
}

const TimeField = forwardRef(function TimeField({ label, value, onChange }, ref) {
  return (
    <div className="flex h-12 items-center justify-between">
      <div className="text-section font-medium tracking-normal text-ink">{label}</div>
      <label className="relative flex h-10 w-[132px] items-center justify-end">
        <TimeValue value={value} />
        <input
          ref={ref}
          type="time"
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0 outline-none"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </label>
    </div>
  );
});

function TimeValue({ value }) {
  if (!value) {
    return (
      <span className="flex h-full items-center justify-end">
        <EmptyDash />
      </span>
    );
  }

  const [hour, minute] = value.split(':');

  return (
    <span className="inline-flex items-center justify-end gap-1 text-section font-bold tabular-nums text-ink">
      <span>{hour}</span>
      <span className="relative -top-[1px]">:</span>
      <span>{minute}</span>
    </span>
  );
}
