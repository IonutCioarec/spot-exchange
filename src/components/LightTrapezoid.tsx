import { motion } from 'framer-motion';
import React from 'react';

interface LightTrapezoidProps {
  width?: number;        // Width of the trapezoid
  height: number;       // Height of the trapezoid
  x: string;            // Position on the X axis (e.g., '50%', '0%')
  y: string;            // Position on the Y axis (e.g., '50%', '0%')
  color: string;        // Color of the light trapezoid
  intensity?: number;   // Intensity (opacity)
  blur?: number;        // Blur effect
}

const LightTrapezoid: React.FC<LightTrapezoidProps> = ({ width, height, x, y, color, intensity = 0.3, blur = height / 3 }) => {
  return (
    <motion.div
      initial={{ opacity: intensity, scale: 1 }}
      animate={{
        opacity: [intensity, intensity + 0.1, intensity],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      style={{
        position: 'absolute',
        top: y,
        left: x,
        width: `${width ? `${width}px` : '100%'}`,
        height: `${height}px`,
        background: `linear-gradient(transparent, ${color}, transparent)`, // Soft color center
        boxShadow: `0 0 ${blur}px ${blur / 2}px ${color}`, // Soft fading edges
        clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',  // Trapezoid shape
        filter: `blur(${blur}px)`,
        zIndex: -1,
        opacity: intensity,
      }}
    />
  );
};

export default LightTrapezoid;
