import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Sheet from './Sheet.jsx';
import SegmentedControl from './SegmentedControl.jsx';
import DayHeatmap, { DayWeekdayHeader } from './DayHeatmap.jsx';
import WeekHeatmap from './WeekHeatmap.jsx';
import MonthHeatmap from './MonthHeatmap.jsx';
import { isFutureDate, monthName } from '../lib/time.js';

const contentVariants = {
  enter: {
    opacity: 0,
    y: 18,
  },
  center: {
    opacity: 1,
    y: 0,
    transition: {
      y: { duration: 0.8, ease: [0.12, 0.88, 0.18, 1] },
      opacity: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
    },
  },
  exit: {
    opacity: 0,
    y: 0,
    transition: { duration: 0.08, ease: [0.4, 0, 1, 1] },
  },
};

export default function RecordSheet({ records, targetHours, editingRecordKey, onEditRecord, onClose }) {
  const now = useMemo(() => new Date(), []);
  const [view, setView] = useState('day');
  const [cursor, setCursor] = useState(new Date(now.getFullYear(), now.getMonth(), 1));

  const title = view === 'month' ? `${cursor.getFullYear()}年` : monthName(cursor);
  const sheetHeight = 'h-[76%]';
  const canNext = view === 'month'
    ? cursor.getFullYear() < now.getFullYear()
    : !isFutureDate(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1));

  const changeCursor = (direction) => {
    setCursor((current) => {
      const next = view === 'month'
        ? new Date(current.getFullYear() + direction, 0, 1)
        : new Date(current.getFullYear(), current.getMonth() + direction, 1);
      if (direction > 0 && view !== 'month' && isFutureDate(next)) return current;
      if (direction > 0 && view === 'month' && next.getFullYear() > now.getFullYear()) return current;
      return next;
    });
  };

  return (
    <Sheet title="工时记录" onClose={onClose} height={sheetHeight}>
      <SegmentedControl value={view} onChange={setView} />

      <div className="mt-6 flex items-center justify-center gap-8">
        <button type="button" className="grid h-8 w-8 place-items-center text-muted" onClick={() => changeCursor(-1)}>
          <ChevronLeft size={20} strokeWidth={2.2} />
        </button>
        <div className="min-w-[96px] text-center text-monthNav font-medium text-ink">{title}</div>
        <button
          type="button"
          className={`grid h-8 w-8 place-items-center ${canNext ? 'text-disabled' : 'text-control-quiet'}`}
          disabled={!canNext}
          onClick={() => changeCursor(1)}
        >
          <ChevronRight size={20} strokeWidth={2.2} />
        </button>
      </div>

      <div className="relative mt-8 h-[392px] overflow-visible">
        <motion.div
          key={view}
          className="absolute -top-8 bottom-0 left-0 right-0 bg-sheet"
          initial={{ opacity: 0.96 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="absolute inset-x-0 top-8"
            variants={contentVariants}
            initial="enter"
            animate="center"
            style={{ willChange: 'opacity, transform' }}
          >
            {view === 'day' && (
              <>
                <div className="mt-2">
                  <DayWeekdayHeader />
                </div>
                <DayHeatmap
                  cursor={cursor}
                  records={records}
                  targetHours={targetHours}
                  editingRecordKey={editingRecordKey}
                  onEditRecord={onEditRecord}
                  showWeekdays={false}
                />
              </>
            )}
            {view === 'week' && <WeekHeatmap cursor={cursor} records={records} targetHours={targetHours} />}
            {view === 'month' && <MonthHeatmap cursor={cursor} records={records} targetHours={targetHours} />}
          </motion.div>
        </motion.div>
      </div>
    </Sheet>
  );
}
