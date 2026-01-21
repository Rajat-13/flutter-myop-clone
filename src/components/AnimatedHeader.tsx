import { motion, useInView } from "framer-motion";
import { ReactNode, useRef } from "react";

interface AnimatedHeaderProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const AnimatedHeader = ({ children, className = "", delay = 0 }: AnimatedHeaderProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className={`overflow-hidden ${className}`}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <motion.div
        initial={{ 
          clipPath: "inset(0 100% 0 0)",
          opacity: 0,
          x: -30 
        }}
        animate={isInView ? { 
          clipPath: "inset(0 0% 0 0)",
          opacity: 1,
          x: 0 
        } : { 
          clipPath: "inset(0 100% 0 0)",
          opacity: 0,
          x: -30 
        }}
        transition={{
          duration: 0.8,
          delay: delay + 0.1,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default AnimatedHeader;
