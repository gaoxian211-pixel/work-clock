import { motion } from 'framer-motion';
import { formatDuration } from '../lib/time.js';

export default function WorkTimeDisplay({ minutes }) {
  const value = formatDuration(minutes);
  const [hours, mins] = value.split(':');

  return (
    <div className="mt-8 flex h-[104px] w-[330px] items-start justify-center overflow-hidden">
      <motion.div
        className="flex w-full items-center justify-center text-center font-sans text-hero font-bold text-ink [font-variant-numeric:tabular-nums]"
        animate={{ opacity: 1 }}
        initial={{ opacity: 0.96 }}
        transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="leading-none">{hours}</span>
        <span className="mx-4 -translate-y-[6px] leading-none">{':'}</span>
        <span className="leading-none">{mins}</span>
      </motion.div>
    </div>
  );
}
