import { motion } from 'framer-motion';
import React from 'react';

interface DirectionalLightLineProps {
  length?: number;      // Optional: Length of the line (width), if not set, it will be full width
  thickness: number;    // Thickness of the line (height)
  x: string;            // X position (e.g., '50%', '0%')
  y: string;            // Y position (e.g., '50%', '0%')
  color: string;        // Color of the light line
  intensity?: number;   // Intensity (opacity)
  blur?: number;        // Amount of blur
  lightDirection?: 'top' | 'bottom' | 'left' | 'right'; // Direction of light emission
}

const DirectionalLightLine: React.FC<DirectionalLightLineProps> = ({
  length,
  thickness,
  x,
  y,
  color,
  intensity = 0.5,
  blur = thickness * 4,
  lightDirection,
}) => {
  // Determine the box shadow based on the direction of light emission
  const getBoxShadow = () => {
    switch (lightDirection) {
      case 'top':
        return `0 -${blur}px ${blur}px ${color}`;
      case 'bottom':
        return `0 ${blur}px ${blur}px ${color}`;
      case 'left':
        return `-${blur}px 0 ${blur}px ${color}`;
      case 'right':
        return `${blur}px 0 ${blur}px ${color}`;
      default:
        return `0 0 ${blur}px ${color}`; // Default to all sides if none is selected
    }
  };

  return (
    <motion.div
      initial={{ opacity: intensity, scale: 1 }}
      animate={{
        opacity: [intensity, intensity + 0.1, intensity],
        scale: [1, 1.05, 1],
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
        width: length ? `${length}px` : '100%',
        height: `${thickness}px`,
        background: color,
        boxShadow: getBoxShadow(),
        filter: `blur(${blur / 3}px)`,
        zIndex: -1,
        opacity: intensity,
      }}
    />
  );
};

export default DirectionalLightLine;
