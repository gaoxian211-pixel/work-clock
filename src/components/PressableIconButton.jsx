import { motion } from 'framer-motion';
import { pressTransition } from '../lib/motion.js';

export default function PressableIconButton({ label, className = '', children, onClick }) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      className={`hairline-white tap-surface grid place-items-center rounded-pill bg-icon-button shadow-softButton ${className}`}
      onClick={onClick}
      whileTap={{ scale: 0.84 }}
      transition={pressTransition}
    >
      {children}
    </motion.button>
  );
}
