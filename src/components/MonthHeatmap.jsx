import { getMonthCards, toneClasses } from '../lib/records.js';

export default function MonthHeatmap({ cursor, records, targetHours }) {
  const months = getMonthCards(cursor.getFullYear(), records, targetHours);

  return (
    <div className="relative -top-1.5 grid grid-cols-4 gap-1.5">
      {months.map((month) => (
        <div
          key={month.month}
          className={`grid h-[76px] w-full place-items-center rounded-tile px-3 text-center ${toneClasses[month.tone]}`}
        >
          <div className="flex flex-col items-center justify-center">
            <div className="text-tileToday font-normal leading-none text-ink">{month.isCurrent ? '本月' : month.month}</div>
            <div className="mt-3.5 flex h-5 items-center justify-center text-sheetTitle font-semibold leading-none">
              {month.tone === 'empty' ? '' : month.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
