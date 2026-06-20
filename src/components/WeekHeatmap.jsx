import { getWeekCards, toneClasses } from '../lib/records.js';

export default function WeekHeatmap({ cursor, records, targetHours }) {
  const weeks = getWeekCards(cursor.getFullYear(), cursor.getMonth(), records, targetHours);

  return (
    <div className="grid grid-cols-2 gap-1.5">
      {weeks.map((week) => (
        <div
          key={week.id}
          className={`grid aspect-[3/2] w-full place-items-center rounded-tile px-2 text-center ${toneClasses[week.tone]}`}
        >
          <div>
            <div className="text-tileToday font-medium leading-none text-ink">{week.isCurrent ? '本周' : week.range}</div>
            <div className="mt-4 flex h-5 items-center justify-center text-sheetTitle font-bold leading-none">
              {week.tone === 'empty' ? '' : week.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
