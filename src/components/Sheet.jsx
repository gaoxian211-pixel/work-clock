import { motion } from 'framer-motion';
import PressableIconButton from './PressableIconButton.jsx';

export default function Sheet({ title, onClose, children, height = 'h-[calc(100%-118px)]' }) {
  return (
    <motion.div
      className="absolute inset-0 z-30 bg-scrim"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] } }}
      exit={{ opacity: 0, transition: { duration: 0.18, ease: [0.4, 0, 1, 1] } }}
      onClick={onClose}
    >
      <motion.section
        className={`safe-sheet absolute bottom-0 left-0 right-0 ${height} overflow-hidden rounded-t-sheet border border-line-light bg-sheet px-sheet pt-6`}
        initial={{ y: '104%' }}
        animate={{ y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
        exit={{ y: '104%', transition: { duration: 0.56, ease: [0.4, 0, 0.2, 1] } }}
        style={{ willChange: 'transform' }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative mb-8 flex items-center justify-center">
          <h2 className="text-sheetTitle font-bold text-ink">{title}</h2>
          <PressableIconButton label="关闭" className="absolute right-0 h-10 w-10 text-ink" onClick={onClose}>
            <span className="solid-icon solid-icon-close solid-icon-x" />
          </PressableIconButton>
        </div>
        {children}
      </motion.section>
    </motion.div>
  );
}
