import { motion } from 'framer-motion';

export default function BottomActionButton({ label, onComplete }) {
  return (
    <motion.button
      type="button"
      className="relative h-action w-full overflow-hidden rounded-pill bg-ink text-segment font-semibold text-inverse"
      onClick={onComplete}
      whileTap={{ scale: 0.96, y: 2 }}
      transition={{ type: 'spring', stiffness: 620, damping: 22, mass: 0.62 }}
    >
      <span className="relative">{label}</span>
    </motion.button>
  );
}
