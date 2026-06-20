import { useState } from 'react';
import { motion } from 'framer-motion';

export default function BottomActionButton({ label, onComplete }) {
  const [done, setDone] = useState(false);

  const handleClick = () => {
    setDone(false);
    onComplete();
    setDone(true);
    window.setTimeout(() => setDone(false), 360);
  };

  return (
    <motion.button
      type="button"
      className="relative h-action w-full overflow-hidden rounded-pill bg-ink text-segment font-bold text-white"
      onClick={handleClick}
      whileTap={{ y: 1, scale: 0.988 }}
      animate={done ? { y: [0, 1, 0], scale: [1, 0.988, 1] } : { y: 0, scale: 1 }}
      transition={{ duration: 0.24 }}
    >
      <span className="relative">{label}</span>
    </motion.button>
  );
}
