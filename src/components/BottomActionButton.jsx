import { motion } from 'framer-motion';

export default function BottomActionButton({ label, onComplete }) {
  const backgroundVariants = {
    rest: { scale: 1, y: 0 },
    pressed: { scale: 0.96, y: 0 },
  };

  return (
    <motion.button
      type="button"
      className="relative h-action w-full overflow-hidden rounded-pill text-segment font-semibold text-inverse"
      onClick={onComplete}
      initial="rest"
      animate="rest"
      whileTap="pressed"
    >
      <motion.span
        className="absolute inset-0 rounded-pill bg-ink"
        variants={backgroundVariants}
        transition={{ type: 'spring', stiffness: 620, damping: 22, mass: 0.62 }}
        aria-hidden="true"
      />
      <motion.span
        className="relative z-10 block leading-none"
        variants={backgroundVariants}
        transition={{ type: 'spring', stiffness: 620, damping: 22, mass: 0.62 }}
      >
        {label}
      </motion.span>
    </motion.button>
  );
}
