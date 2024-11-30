import { motion } from 'framer-motion';
import React from 'react';

interface LightSpotProps {
  size: number;         // Size of the light spot
  x: string;            // Position on the X axis (e.g., '50%', '0%')
  y: string;            // Position on the Y axis (e.g., '50%', '0%')
  color: string;        // Color of the light spot
  intensity?: number;   // Intensity (opacity)
  blur?: number
}

const LightSpot: React.FC<LightSpotProps> = ({ size, x, y, color, intensity = 0.3, blur = size / 3 }) => {
  return (
    <motion.div
      initial={{ opacity: intensity, scale: 1 }}
      animate={{
        opacity: [intensity, intensity + 0.1, intensity],
        scale: [1, 1.2, 1],
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
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        zIndex: -1,
        filter: `blur(${blur}px)`,
        opacity: intensity,
      }}
    />
  );
};

export default LightSpot;