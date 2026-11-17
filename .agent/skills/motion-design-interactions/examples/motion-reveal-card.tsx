import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

interface MotionCardProps {
  image: string;
  title: string;
  subtitle: string;
  index?: number;
  borderRadius?: string;
  onClick?: () => void;
}

export const MotionRevealCard: React.FC<MotionCardProps> = ({
  image,
  title,
  subtitle,
  index = 0,
  borderRadius = '8px',
  onClick,
}) => {
  const shouldReduceMotion = useReducedMotion();

  // Luxury editorial ease configuration
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 24,
      scale: shouldReduceMotion ? 1 : 0.98 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: shouldReduceMotion ? 0 : 0.8, 
        ease: [0.16, 1, 0.3, 1],
        delay: shouldReduceMotion ? 0 : index * 0.08,
      } 
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ y: shouldReduceMotion ? 0 : -4 }}
      onClick={onClick}
      className="group relative cursor-pointer overflow-hidden shadow-[0_8px_24px_rgba(65,51,43,0.12)] hover:shadow-[0_16px_36px_rgba(65,51,43,0.22)] transition-shadow duration-500"
      style={{ borderRadius }}
    >
      {/* Photo with subtle non-linear scale */}
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        style={{ borderRadius }}
      />

      {/* Editorial Bottom Gradient Overlay */}
      <div 
        className="absolute inset-x-0 bottom-0 pt-16 pb-6 px-5 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end text-left pointer-events-none"
        style={{ borderRadius }}
      >
        <h4 className="font-['Playfair_Display'] italic text-2xl text-[#fcf8f4] leading-tight mb-1">
          {title}
        </h4>
        <div className="flex items-center justify-between w-full">
          <span className="font-['Plus_Jakarta_Sans'] text-[10px] uppercase tracking-[0.2em] text-[#ded3c7]/90 font-medium">
            {subtitle}
          </span>
          <ArrowUpRight className="w-4 h-4 text-white/80 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
        </div>
      </div>
    </motion.div>
  );
};
