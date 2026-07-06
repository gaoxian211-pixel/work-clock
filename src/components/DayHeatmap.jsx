import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import bubbleImage from '../assets/bubble.svg';
import bubbleDarkImage from '../assets/bubble-dark.svg';
import { getDayMeta, getMonthDays, toneClasses } from '../lib/records.js';
import { getTodayKey } from '../lib/time.js';

const weekdays = ['日', '一', '二', '三', '四', '五', '六'];

export function DayWeekdayHeader() {
  return (
    <div className="relative -top-3 mb-0 grid grid-cols-7 gap-1.5 text-center text-label font-normal text-ink">
      {weekdays.map((day) => (
        <span key={day}>{day}</span>
      ))}
    </div>
  );
}

export default function DayHeatmap({ cursor, records, targetHours, editingRecordKey, onEditRecord, showWeekdays = true }) {
  const days = getMonthDays(cursor.getFullYear(), cursor.getMonth());
  const todayKey = getTodayKey();
  const [selectedKey, setSelectedKey] = useState(null);
  const closedPointerCellRef = useRef(null);

  useEffect(() => {
    if (!selectedKey) return undefined;

    const closeOnBlank = (event) => {
      if (editingRecordKey === selectedKey) return;
      if (event.target.closest('[data-heatmap-bubble]')) return;
      closedPointerCellRef.current = event.target.closest('[data-heatmap-cell]')?.dataset.heatmapKey || null;
      setSelectedKey(null);
    };

    window.addEventListener('pointerdown', closeOnBlank);
    return () => window.removeEventListener('pointerdown', closeOnBlank);
  }, [editingRecordKey, selectedKey]);

  return (
    <div onClick={() => setSelectedKey(null)}>
      {showWeekdays && <DayWeekdayHeader />}
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((date, index) => {
          if (!date) return <div key={`empty-${index}`} className="aspect-square w-full" />;

          const meta = getDayMeta(date, records, targetHours);
          const key = getTodayKey(date);
          const isToday = key === todayKey;
          const record = records[key];
          const firstIn = record?.firstIn || '—';
          const lastOut = record?.lastOut || '—';

          return (
            <button
              type="button"
              data-heatmap-cell
              data-heatmap-key={key}
              key={key}
              className={`relative grid aspect-square w-full place-items-center rounded-[8px] text-center ${toneClasses[meta.tone]}`}
              onClick={(event) => {
                event.stopPropagation();
                if (closedPointerCellRef.current === key) {
                  closedPointerCellRef.current = null;
                  return;
                }
                if (meta.isFuture) return;
                setSelectedKey((current) => (current === key ? null : key));
              }}
            >
              <AnimatePresence>
                {selectedKey === key && (
                  <motion.div
                    data-heatmap-bubble
                    className="absolute bottom-[calc(100%+2px)] left-1/2 z-20 h-[53px] w-[88px] -translate-x-1/2 text-left text-micro font-normal leading-[1.45] text-[var(--color-overlay-text)]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    onClick={(event) => {
                      event.stopPropagation();
                      onEditRecord?.(key);
                    }}
                  >
                    <img
                      src={bubbleImage}
                      alt=""
                      className="heatmap-bubble-light absolute inset-0 h-full w-full rotate-180"
                      draggable="false"
                    />
                    <img
                      src={bubbleDarkImage}
                      alt=""
                      className="heatmap-bubble-dark absolute inset-0 h-full w-full rotate-180"
                      draggable="false"
                    />
                    <div className="relative mx-auto flex h-full w-max translate-y-px flex-col items-start justify-center gap-0.5 pb-[6px]">
                      <div className="whitespace-nowrap">最早：{firstIn}</div>
                      <div className="whitespace-nowrap">最晚：{lastOut}</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="flex flex-col items-center justify-center gap-1">
                <div className="text-tileToday font-normal leading-none text-ink">
                  {isToday ? '今' : date.getDate()}
                </div>
                <div className="h-3 text-caption font-normal leading-none">
                  {meta.tone === 'empty' ? '' : meta.label}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
