import { motion } from 'framer-motion';

const options = [
  { value: 'day', label: '日' },
  { value: 'week', label: '周' },
  { value: 'month', label: '月' },
];

export default function SegmentedControl({ value, onChange }) {
  return (
    <div className="grid h-segment grid-cols-3 rounded-control bg-control p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className="relative rounded-controlInner text-segment font-medium text-muted"
          onClick={() => onChange(option.value)}
        >
          {value === option.value && (
            <motion.span
              layoutId="segment-pill"
              className="absolute inset-0 rounded-controlInner bg-[var(--color-segment-thumb)] shadow-control"
              transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
            />
          )}
          <span className={`relative ${value === option.value ? 'text-ink' : ''}`}>{option.label}</span>
        </button>
      ))}
    </div>
  );
}
