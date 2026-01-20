import { Link } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import Logo from './Logo';

interface AnimatedLogoProps {
  isCollapsed: boolean;
}

export default function AnimatedLogo({ isCollapsed }: AnimatedLogoProps) {
  return (
    <Link className="outline-round-sm flex justify-center" to="/dashboard">
      <AnimatePresence mode="wait">
        <motion.div
          key={isCollapsed ? 'sm' : 'lg'}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <Logo className="h-10" type={isCollapsed ? 'sm' : 'lg'} />
        </motion.div>
      </AnimatePresence>
    </Link>
  );
}
