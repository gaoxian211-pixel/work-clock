import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, animate, motion, useDragControls, useMotionValue, useMotionValueEvent, useTransform } from 'framer-motion';
import Sheet from './Sheet.jsx';

const normalizeTime = (value) => (/^\d{2}:\d{2}$/.test(value) ? value : '');

export default function TimeEditSheet({ record, onClose, onSave }) {
  const initialFirstIn = normalizeTime(record?.firstIn || '');
  const initialLastOut = normalizeTime(record?.lastOut || '');
  const [firstIn, setFirstIn] = useState(initialFirstIn);
  const [lastOut, setLastOut] = useState(initialLastOut);
  const [showToast, setShowToast] = useState(false);
  const [openSwipeRow, setOpenSwipeRow] = useState(null);
  const toastTimerRef = useRef(null);
  const toastHost = document.querySelector('.phone-shell') || document.body;

  const notifyCleared = () => {
    setShowToast(true);
    window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setShowToast(false), 3000);
  };

  useEffect(() => {
    return () => window.clearTimeout(toastTimerRef.current);
  }, []);

  const save = () => {
    if (!firstIn && !lastOut) {
      onSave(null);
      return;
    }

    onSave({
      firstIn: firstIn || null,
      lastOut: lastOut || null,
    });
  };

  return (
    <Sheet title="修改时间" onClose={onClose} height="h-[calc(342px+var(--ios-safe-bottom)+env(safe-area-inset-bottom))]">
      <div className="relative mt-1">
        <TimeField
          id="firstIn"
          label="最早"
          value={firstIn}
          isOpen={openSwipeRow === 'firstIn'}
          onOpenChange={(open) => setOpenSwipeRow(open ? 'firstIn' : null)}
          onChange={setFirstIn}
          onClear={() => {
            setFirstIn('');
            notifyCleared();
          }}
        />
        <div className="my-2 h-px bg-line" />
        <TimeField
          id="lastOut"
          label="最晚"
          value={lastOut}
          isOpen={openSwipeRow === 'lastOut'}
          onOpenChange={(open) => setOpenSwipeRow(open ? 'lastOut' : null)}
          onChange={setLastOut}
          onClear={() => {
            setLastOut('');
            notifyCleared();
          }}
        />

        <button
          type="button"
          className="mt-8 h-12 w-full rounded-pill bg-ink text-body font-semibold text-inverse active:scale-[0.985]"
          onClick={save}
        >
          保存
        </button>
      </div>
      {createPortal(
        <AnimatePresence>
          {showToast ? (
            <div className="pointer-events-none absolute inset-0 z-[9999] grid place-items-center">
              <motion.div
                className="rounded-[10px] bg-black/80 px-5 py-3 text-body font-normal text-[var(--color-overlay-text)]"
                initial={{ opacity: 0, y: 6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.98 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                已清空
              </motion.div>
            </div>
          ) : null}
        </AnimatePresence>,
        toastHost,
      )}
    </Sheet>
  );
}

function TimeField({ id, label, value, isOpen, onOpenChange, onChange, onClear }) {
  const inputRef = useRef(null);
  const dragControls = useDragControls();
  const revealDistance = 64;
  const canClear = Boolean(value);
  const x = useMotionValue(0);
  const safeX = useTransform(x, (latest) => Math.min(0, Math.max(-revealDistance, latest)));
  const clearOpacity = useTransform(safeX, [-revealDistance, -42, -30, 0], [1, 0.8, 0, 0]);
  const clearScale = useTransform(safeX, [-revealDistance, -24, 0], [1, 0.88, 0.82]);

  useMotionValueEvent(safeX, 'change', (latest) => {
    if (latest !== x.get()) x.set(latest);
  });

  useEffect(() => {
    animate(x, isOpen ? -revealDistance : 0, {
      type: 'spring',
      stiffness: 520,
      damping: 38,
      mass: 0.8,
    });
  }, [isOpen, revealDistance, x]);

  const handleDragEnd = (_, info) => {
    if (!canClear) {
      onOpenChange(false);
      return;
    }

    const shouldOpen = x.get() < -32 || info.velocity.x < -260;
    onOpenChange(shouldOpen);
  };

  const clear = () => {
    if (!canClear) return;
    onClear();
    onOpenChange(false);
  };

  return (
    <div className="relative h-14 overflow-visible rounded-control">
      {canClear ? (
        <motion.button
          type="button"
          className="absolute right-0 top-3 flex h-8 w-[52px] origin-center items-center justify-center rounded-pill bg-[var(--color-clear)] text-label font-semibold leading-none text-ink"
          style={{ opacity: clearOpacity, scale: clearScale }}
          onClick={clear}
        >
          清空
        </motion.button>
      ) : null}
      <motion.div
        className="relative z-10 flex h-14 items-center justify-between bg-transparent"
        drag={canClear ? 'x' : false}
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={{ left: -revealDistance, right: 0 }}
        dragElastic={0.02}
        dragMomentum={false}
        style={{ x: safeX }}
        onDragEnd={handleDragEnd}
        onPointerDownCapture={(event) => {
          if (!canClear) return;
          onOpenChange(false);
          dragControls.start(event);
        }}
        data-swipe-row={id}
      >
        <div className="text-body font-semibold tracking-normal text-ink">{label}</div>
        <label className="relative flex h-12 w-[132px] shrink-0 items-center justify-end">
          <TimeValue value={value} />
          <input
            ref={inputRef}
            type="time"
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0 outline-none"
            value={value}
            onChange={(event) => onChange(event.target.value)}
          />
        </label>
      </motion.div>
    </div>
  );
}

function TimeValue({ value }) {
  if (!value) {
    return <span className="text-body font-normal text-[var(--color-placeholder)]">待打卡</span>;
  }

  const [hour, minute] = value.split(':');

  return (
    <span className="inline-flex w-[64px] items-center justify-end gap-1 text-body font-semibold tabular-nums text-ink">
      <span>{hour}</span>
      <span className="relative -top-[1px]">:</span>
      <span>{minute}</span>
    </span>
  );
}
