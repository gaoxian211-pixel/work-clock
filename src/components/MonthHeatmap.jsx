import { getMonthCards, toneClasses } from '../lib/records.js';

export default function MonthHeatmap({ cursor, records, targetHours }) {
  const months = getMonthCards(cursor.getFullYear(), records, targetHours);

  return (
    <div className="grid grid-cols-3 gap-1.5">
      {months.map((month) => (
        <div
          key={month.month}
          className={`grid aspect-square w-full place-items-center rounded-tile px-3 text-center ${toneClasses[month.tone]}`}
        >
          <div>
            <div className="text-tileToday font-medium leading-none text-ink">{month.isCurrent ? '本月' : month.month}</div>
            <div className="mt-4 flex h-5 items-center justify-center text-sheetTitle font-bold leading-none">
              {month.tone === 'empty' ? '' : month.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
